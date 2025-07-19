/*!
 * Texts are copied from other sources and modified only to able to test the
 * auto fixer
 */

/**
 *
 * @type {readonly [before: string, after: string][]}
 */
export const TEXTS = [
  ["פ ‘סטארי’, שמפתח פלט", "פ ׳סטארי׳, שמפתח פלט"],
  [
    `לית' אל-בלזי "אנשי הכבוד" בא-סוא' אומר כי מ ם`,
    `לית׳ אל-בלזי ״אנשי הכבוד״ בא-סוא׳ אומר כי מ ם`,
  ],
  [
    `even after "you're absolutely right"

imagine`,
    `even after “you’re absolutely right”

imagine`,
  ],
  ["הם חוברו לסטארטאפ ‘סטארי’, פלמה", "הם חוברו לסטארטאפ ׳סטארי׳, פלמה"],
  ["הם חוברו לסטארטאפ ׳סטארי’, פלמה", "הם חוברו לסטארטאפ ׳סטארי׳, פלמה"],
  ["הם חוברו לסטארטאפ 'סטארי׳, פלמה", "הם חוברו לסטארטאפ ׳סטארי׳, פלמה"],
  [`הם חוברו לסטארטאפ "סטארי”, פלמה`, "הם חוברו לסטארטאפ ״סטארי״, פלמה"],
  ["answers you׳ll ever see", "answers you’ll ever see"],
  [
    `you hear is "you're absolutely right"`,
    `you hear is “you’re absolutely right”`,
  ],
  [`אמיר פישר ז”ל חלם`, `אמיר פישר ז״ל חלם`],
];
