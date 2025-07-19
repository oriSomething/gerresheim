const GERRESH = "׳";
const GERRESHEIM = "״";

const SMART_SINGLE_QUOTE_START = "‘";
const SMART_SINGLE_QUOTE_END = "’";
const SMART_DOUBLE_QUOTE_START = "“";
const SMART_DOUBLE_QUOTE_END = "”";

const LETTER_RE = /^\p{Letter}$/u;
const HEB_LETTER_RE = /^[\u0590-\u05FF]$/u;

const REPLACE_NON_HEB_CHAR = new Map([
  [GERRESH, GERRESH],
  ["'", GERRESH],
  ["‘", GERRESH],
  ["’", GERRESH],

  [GERRESHEIM, GERRESHEIM],
  ['"', GERRESHEIM],
  ["“", GERRESHEIM],
  ["”", GERRESHEIM],
]);

const ANY_QUOTE_SIGN = new Set(REPLACE_NON_HEB_CHAR.keys());

const REPLACE_HEB_CHAR_START = new Map([
  [GERRESH, SMART_SINGLE_QUOTE_START],
  [GERRESHEIM, SMART_DOUBLE_QUOTE_START],
  ["'", SMART_SINGLE_QUOTE_START],
  ['"', SMART_DOUBLE_QUOTE_START],
  [SMART_SINGLE_QUOTE_START, SMART_SINGLE_QUOTE_START],
  [SMART_DOUBLE_QUOTE_START, SMART_DOUBLE_QUOTE_START],
]);

const REPLACE_HEB_CHAR_END = new Map([
  [GERRESH, SMART_SINGLE_QUOTE_END],
  [GERRESHEIM, SMART_DOUBLE_QUOTE_END],
  ["'", SMART_SINGLE_QUOTE_END],
  ['"', SMART_DOUBLE_QUOTE_END],
  [SMART_SINGLE_QUOTE_END, SMART_SINGLE_QUOTE_END],
  [SMART_DOUBLE_QUOTE_END, SMART_DOUBLE_QUOTE_END],
]);

const PARAGRAPH_LANGUAGE_UNKNOWN = 0;
const PARAGRAPH_LANGUAGE_HEB = 1;
const PARAGRAPH_LANGUAGE_OTHER = 2;

/**
 * @param {string} text
 * @returns {string}
 */
export function fix(text) {
  // We convert text to safe Unicode code points
  const chars = Array.from(text);

  let result = "";
  let paragraphLanguage = PARAGRAPH_LANGUAGE_UNKNOWN;
  let pargraphIndex = -1;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    pargraphIndex++;

    // New line
    if (char === "\r" && chars[i + 1] === "\n") {
      i++;
      paragraphLanguage = PARAGRAPH_LANGUAGE_UNKNOWN;
      pargraphIndex = -1;
      result += char;
      result += chars[i + 1];
      continue;
    }
    if (char === "\n") {
      paragraphLanguage = PARAGRAPH_LANGUAGE_UNKNOWN;
      pargraphIndex = -1;
      result += char;
      continue;
    }

    // Getting paragraph language
    if (paragraphLanguage === PARAGRAPH_LANGUAGE_UNKNOWN) {
      for (let j = i; j < chars.length; j++) {
        const char = chars[j];
        if (char === "\n" || char === "\r") {
          paragraphLanguage = PARAGRAPH_LANGUAGE_OTHER;
          break;
        }

        if (LETTER_RE.test(char)) {
          paragraphLanguage = HEB_LETTER_RE.test(char)
            ? PARAGRAPH_LANGUAGE_HEB
            : PARAGRAPH_LANGUAGE_OTHER;
          break;
        }
      }
    }

    // Quotes
    if (ANY_QUOTE_SIGN.has(char)) {
      // Start of the paragraph
      if (pargraphIndex === 0) {
        if (paragraphLanguage === PARAGRAPH_LANGUAGE_HEB) {
          result += REPLACE_NON_HEB_CHAR.get(char);
          continue;
        }

        if (paragraphLanguage === PARAGRAPH_LANGUAGE_OTHER) {
          result += REPLACE_HEB_CHAR_START.get(char);
          continue;
        }
      }

      // Hebrew from both 2 sides
      if (
        HEB_LETTER_RE.test(chars[i - 1]) &&
        HEB_LETTER_RE.test(chars[i + 1])
      ) {
        result += REPLACE_NON_HEB_CHAR.get(char);
        continue;
      }

      // English from both 2 sides
      if (LETTER_RE.test(chars[i - 1]) && LETTER_RE.test(chars[i + 1])) {
        result += REPLACE_HEB_CHAR_END.get(char);
        continue;
      }

      // If Hebrew is only one of the sides
      if (
        (!LETTER_RE.test(chars[i - 1]) && HEB_LETTER_RE.test(chars[i + 1])) ||
        (HEB_LETTER_RE.test(chars[i - 1]) && !LETTER_RE.test(chars[i + 1]))
      ) {
        result += REPLACE_NON_HEB_CHAR.get(char);
        continue;
      }

      // English after no letter
      if (!LETTER_RE.test(chars[i - 1]) && LETTER_RE.test(chars[i + 1])) {
        result +=
          paragraphLanguage === PARAGRAPH_LANGUAGE_HEB
            ? REPLACE_NON_HEB_CHAR.get(char)
            : REPLACE_HEB_CHAR_START.get(char);
        continue;
      }

      // English letter and next character isn't letter
      if (LETTER_RE.test(chars[i - 1]) && !LETTER_RE.test(chars[i + 1])) {
        result +=
          paragraphLanguage === PARAGRAPH_LANGUAGE_HEB
            ? REPLACE_NON_HEB_CHAR.get(char)
            : REPLACE_HEB_CHAR_END.get(char);
        continue;
      }
    }

    result += char;
  }

  return result;
}
