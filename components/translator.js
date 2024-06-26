const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");
class Translator {
  capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  highlightTranslation(word) {
    return `<span class="highlight">${word}</span>`;
  }

  // Translate American to British
  translator(sourceText, allWords, timeFormats) {
    let translated = sourceText;
    let changed = false;

    const timeChanges = translated.match(timeFormats.regex);
    if (timeChanges?.length) {
      changed = true;
      timeChanges.map(
        (timeChange) =>
          (translated = translated.replace(
            timeChange,
            this.highlightTranslation(
              timeChange.replace(timeFormats.begin, timeFormats.end)
            )
          ))
      );
    }

    Object.keys(allWords).forEach((key) => {
      if (
        new RegExp(`${key} `, "gi").test(translated.toLowerCase()) ||
        new RegExp(` ${key}[^A-Za-z]`, "gi").test(translated.toLowerCase()) ||
        new RegExp(`${key}$`, "gi").test(translated.toLowerCase())
      ) {
        const wordIndex = translated.toLowerCase().indexOf(key.toLowerCase());
        if (
          translated.charAt(wordIndex).toUpperCase() ==
          translated.charAt(wordIndex)
        ) {
          translated = translated.replace(
            this.capitalize(key),
            this.highlightTranslation(this.capitalize(allWords[key]))
          );
        } else {
          translated = translated.replace(
            key,
            this.highlightTranslation(allWords[key])
          );
        }
        changed = true;
      }
    });

    if (!changed) return "Everything looks good to me!";
    return translated;
  }

  translateAtoB(sourceText) {
    const timeFormats = { regex: /\d{1,2}:\d{1,2}/, begin: ":", end: "." };
    return this.translator(
      sourceText,

      {
        ...americanToBritishTitles,
        ...americanOnly,
        ...americanToBritishSpelling,
      },
      timeFormats
    );
  }

  translateBtoA(sourceText) {
    const timeFormats = { regex: /\d{1,2}.\d{1,2}/, begin: ".", end: ":" };
    return this.translator(
      sourceText,
      {
        ...this.flipValuesAsKeys(americanToBritishTitles),
        ...britishOnly,
        ...this.flipValuesAsKeys(americanToBritishSpelling),
      },
      timeFormats
    );
  }

  flipValuesAsKeys(obj) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ((acc[value] = key), acc),
      {}
    );
  }
}

module.exports = Translator;
