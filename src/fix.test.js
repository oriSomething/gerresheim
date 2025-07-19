import assert from "node:assert/strict";
import { test } from "node:test";
import { TEXTS } from "./__fixtures__/texts.js";
import { fix } from "./fix.js";

TEXTS.forEach(function ([before, after]) {
  test(`\tbefore: ${before}\n\tafter:  ${after}`, function () {
    const result = fix(before);
    assert.equal(result, after, `fix: ${result}`);
  });
});
