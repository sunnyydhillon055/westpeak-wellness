import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildXlsx, safeSheetName } from '../lib/xlsx.ts';

/* The paid-sessions workbook is hand-written OOXML — a zip container built byte
 * by byte. Nothing else in the repository can tell you it opens: every gate
 * reads built HTML, and this file never reaches the build. It is also the one
 * artefact that goes to an accountant. */

const zipEntries = (buf: Buffer) => {
  const names: string[] = [];
  /* Walk the central directory rather than trusting local headers. A zip whose
     central directory is wrong is a zip Excel refuses, however valid each entry
     looks on its own. */
  const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.notEqual(eocd, -1, 'no end-of-central-directory record — not a zip');
  const count = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  for (let i = 0; i < count; i++) {
    assert.equal(buf.readUInt32LE(off), 0x02014b50, `central directory entry ${i} has a bad signature`);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const cmtLen = buf.readUInt16LE(off + 32);
    names.push(buf.subarray(off + 46, off + 46 + nameLen).toString('utf8'));
    off += 46 + nameLen + extraLen + cmtLen;
  }
  return names;
};

/* Built rather than written as a literal: a backslash inside a shell heredoc is
   how the first version of this file arrived broken. */
const ILLEGAL_IN_SHEET_NAME = ['[', ']', ':', '*', '?', '/', String.fromCharCode(92)];

test('a workbook is a valid zip carrying the parts Excel requires', () => {
  const buf = buildXlsx([{ name: 'One', rows: [['Header'], ['value']] }]);
  assert.equal(buf.subarray(0, 2).toString(), 'PK', 'does not start with the zip magic');
  const names = zipEntries(buf);
  for (const required of ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/worksheets/sheet1.xml']) {
    assert.ok(names.includes(required), `missing ${required} — Excel will refuse the file`);
  }
});

test('one worksheet part per sheet', () => {
  const buf = buildXlsx([
    { name: 'A', rows: [['x']] },
    { name: 'B', rows: [['y']] },
    { name: 'C', rows: [['z']] },
  ]);
  const sheets = zipEntries(buf).filter((n) => /^xl\/worksheets\/sheet\d+\.xml$/.test(n));
  assert.equal(sheets.length, 3);
});

test('text that would break the XML is escaped rather than dropped', () => {
  const buf = buildXlsx([{ name: 'S', rows: [['Jones & Sons <"quoted">']] }]);
  const s = buf.toString('latin1');
  assert.ok(!/Jones & Sons </.test(s), 'a raw ampersand and angle bracket reached the XML');
});

test('sheet names are made legal without becoming empty', () => {
  assert.equal(safeSheetName('Camille Granda'), 'Camille Granda');
  assert.ok(safeSheetName('a'.repeat(60)).length <= 31, 'over the 31-character sheet-name limit');
  for (const ch of ILLEGAL_IN_SHEET_NAME) {
    assert.ok(!safeSheetName(`x${ch}y`).includes(ch), `${ch} is illegal in a sheet name and survived`);
  }
  assert.ok(safeSheetName('').length > 0, 'an empty name must fall back, not produce an unnamed sheet');
  assert.ok(safeSheetName('///').length > 0, 'a name of only illegal characters must still fall back');
});

test('an empty sheet still produces a readable file', () => {
  const buf = buildXlsx([{ name: 'Empty', rows: [] }]);
  assert.ok(zipEntries(buf).includes('xl/worksheets/sheet1.xml'));
});
