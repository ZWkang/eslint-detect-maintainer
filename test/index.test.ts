import { test, assert, it } from 'vitest';
import { name } from '../src';

import { parseBlameResult } from '../src/getEslintReport';

test('simple', () => {
  assert.equal(name, 'pkg-name');
});

const blameText = '^91bf3f3 (kang 2023-07-11 11:16:43 +0800 1) MIT License Copyright (c) 2022 zwkang';

test('parse blame result', async () => {
  // it('test main parse function', () => {
  // parseBlameResult(blameText);
  assert.equal(await parseBlameResult(blameText), null);
  // });
});
