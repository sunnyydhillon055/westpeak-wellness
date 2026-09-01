import { deflateRawSync, crc32 } from 'node:zlib';

/* ============================================================================
   A MINIMAL .XLSX WRITER — multi-sheet, no dependency
   ----------------------------------------------------------------------------
   WHY THIS EXISTS RATHER THAN `exceljs`

   The one thing this repo needs a spreadsheet for is the paid-sessions export:
   a handful of sheets, a header row, strings, numbers and dates. exceljs is
   ~1 MB of code and a transitive tree for that. This is ~120 lines and reads
   in one sitting.

   It is deliberately NOT a general-purpose library. No styling beyond a bold
   header and a money format, no formulas, no merged cells, no images. If a
   future report needs those, take the dependency then — do not grow this.

   WHAT AN .XLSX ACTUALLY IS

   A ZIP containing XML. The parts below are the minimum Excel, LibreOffice and
   Google Sheets all accept:

     [Content_Types].xml   what MIME type each part is
     _rels/.rels           points at the workbook
     xl/workbook.xml       the sheet list, in tab order
     xl/_rels/workbook…    maps each sheet id to its file
     xl/styles.xml         two formats: bold header, and money
     xl/worksheets/N.xml   the cells

   Strings are written INLINE (`t="inlineStr"`) rather than through a shared
   string table. A shared table is smaller on a spreadsheet with heavy
   repetition and is an extra part to get wrong; these exports are hundreds of
   rows, not hundreds of thousands.

   ZIP is written with no compression for the small parts and raw deflate for
   the sheets. CRC32 comes from node:zlib, so nothing here implements a
   checksum by hand.
   ========================================================================= */

export type Cell = string | number | null | undefined;

export type Sheet = {
  /** Tab name. Excel forbids : \ / ? * [ ] and caps at 31 characters. */
  name: string;
  /** First row is treated as the header and rendered bold. */
  rows: Cell[][];
  /** Column indexes (0-based) to format as currency. */
  moneyColumns?: number[];
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
   /* Control characters are not legal in XML 1.0 and Excel refuses the whole
      file if one appears. Client-entered text reaches this. */
   .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');

/** Excel forbids several characters in a tab name and truncates at 31. */
export function safeSheetName(name: string, fallback = 'Sheet'): string {
  const cleaned = (name || '').replace(/[:\\/?*[\]]/g, ' ').trim().slice(0, 31);
  return cleaned || fallback;
}

const colName = (i: number): string => {
  let s = '';
  let n = i;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
};

function sheetXml(sheet: Sheet): string {
  const money = new Set(sheet.moneyColumns ?? []);
  const rows = sheet.rows.map((row, r) => {
    const cells = row.map((v, c) => {
      const ref = `${colName(c)}${r + 1}`;
      const header = r === 0;
      if (v === null || v === undefined || v === '') {
        return header ? `<c r="${ref}" s="1"/>` : `<c r="${ref}"/>`;
      }
      if (typeof v === 'number' && Number.isFinite(v)) {
        const s = header ? ' s="1"' : money.has(c) ? ' s="2"' : '';
        return `<c r="${ref}"${s}><v>${v}</v></c>`;
      }
      const s = header ? ' s="1"' : '';
      return `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(String(v))}</t></is></c>`;
    }).join('');
    return `<row r="${r + 1}">${cells}</row>`;
  }).join('');

  const widest = sheet.rows.reduce((w, row) => Math.max(w, row.length), 0);
  const cols = widest
    ? `<cols>${Array.from({ length: widest }, (_, i) => `<col min="${i + 1}" max="${i + 1}" width="22" customWidth="1"/>`).join('')}</cols>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${cols}<sheetData>${rows}</sheetData></worksheet>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;$&quot;#,##0.00"/></numFmts>
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="3">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

/* ---- ZIP ----------------------------------------------------------------- */

type Entry = { name: string; data: Buffer };

function zip(entries: Entry[]): Buffer {
  const locals: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const e of entries) {
    const nameBuf = Buffer.from(e.name, 'utf8');
    const deflated = deflateRawSync(e.data, { level: 9 });
    /* Store rather than deflate when deflating did not help — legal, and it
       keeps tiny parts byte-identical to their source. */
    const useDeflate = deflated.length < e.data.length;
    const body = useDeflate ? deflated : e.data;
    const method = useDeflate ? 8 : 0;
    const crc = crc32(e.data) >>> 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);           // version needed
    local.writeUInt16LE(0x0800, 6);       // UTF-8 filename flag
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10);           // time
    local.writeUInt16LE(0x2821, 12);      // date (fixed: 2000-01-01)
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(e.data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, nameBuf, body);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(method, 10);
    cen.writeUInt16LE(0, 12);
    cen.writeUInt16LE(0x2821, 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(body.length, 20);
    cen.writeUInt32LE(e.data.length, 24);
    cen.writeUInt16LE(nameBuf.length, 28);
    cen.writeUInt32LE(0, 38);             // external attrs
    cen.writeUInt32LE(offset, 42);
    central.push(cen, nameBuf);

    offset += local.length + nameBuf.length + body.length;
  }

  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat([...locals, centralBuf, end]);
}

/** Build a workbook. Sheets appear as tabs in the order given. */
export function buildXlsx(sheets: Sheet[]): Buffer {
  if (!sheets.length) sheets = [{ name: 'Empty', rows: [['No data']] }];

  /* Tab names must be unique or Excel reports the file as corrupt rather than
     renaming for you. Two practitioners called "Jo" is a realistic input. */
  const seen = new Set<string>();
  const named = sheets.map((s, i) => {
    let n = safeSheetName(s.name, `Sheet${i + 1}`);
    let k = 2;
    while (seen.has(n.toLowerCase())) n = safeSheetName(`${n.slice(0, 27)} (${k++})`, `Sheet${i + 1}`);
    seen.add(n.toLowerCase());
    return { ...s, name: n };
  });

  const entries: Entry[] = [
    {
      name: '[Content_Types].xml',
      data: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
${named.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('\n')}
</Types>`, 'utf8'),
    },
    {
      name: '_rels/.rels',
      data: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`, 'utf8'),
    },
    {
      name: 'xl/workbook.xml',
      data: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>${named.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>
</workbook>`, 'utf8'),
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: Buffer.from(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
${named.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('\n')}
<Relationship Id="rId${named.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`, 'utf8'),
    },
    { name: 'xl/styles.xml', data: Buffer.from(STYLES, 'utf8') },
    ...named.map((s, i) => ({
      name: `xl/worksheets/sheet${i + 1}.xml`,
      data: Buffer.from(sheetXml(s), 'utf8'),
    })),
  ];

  return zip(entries);
}
