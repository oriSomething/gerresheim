import { fix } from "./fix.js";

const textElement = /** @type {HTMLTextAreaElement} */ (
  document.querySelector("#text")
);
const resultElement = /** @type {HTMLTextAreaElement} */ (
  document.querySelector("#result")
);
const copyElement = /** @type {HTMLButtonElement} */ (
  document.querySelector("#copy")
);

resultElement.value = fix(textElement.value);

textElement.addEventListener(
  "input",
  () => {
    resultElement.value = fix(textElement.value);
  },
  { passive: true },
);

copyElement.addEventListener("click", () => {
  navigator.clipboard.writeText(resultElement.value);
});
