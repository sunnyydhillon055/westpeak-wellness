import test from 'node:test';
import assert from 'node:assert/strict';
import { countSentences, hasEnoughSentences, MIN_SENTENCES } from '../lib/sentences.ts';

test('the floor is two sentences', () => {
  assert.equal(MIN_SENTENCES, 2);
});

test('one-worders and single lines are refused', () => {
  for (const s of ['', 'hi', 'price?', 'Are you taking clients?', 'I want counselling for anxiety']) {
    assert.equal(hasEnoughSentences(s), false, JSON.stringify(s));
  }
});

test('two real sentences pass, with or without punctuation', () => {
  assert.equal(hasEnoughSentences('I have been anxious for months. I would like to talk to someone about it.'), true);
  assert.equal(hasEnoughSentences('I have been anxious for months\nI would like to talk to someone about it'), true);
  assert.equal(hasEnoughSentences('Looking for couples counselling! We argue a lot lately, evenings work best'), true);
});

test('punctuation without words does not count', () => {
  assert.equal(countSentences('... !!! ???'), 0);
  assert.equal(countSentences('ok. ok. ok.'), 0);
});

test('a run-on counts as one sentence', () => {
  assert.equal(countSentences('I am looking for help with stress and burnout and I work shifts'), 1);
});
