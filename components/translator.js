const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");
class Translator {
  checkCase(word) {
    if (word[0] === word[0].toUpperCase()) {
      return true;
    } else {
      return false;
    }
  }
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
    // const timeRegex = /\d{1,2}:\d{1,2}.?/;
    // const lowerSource = sourceText.toLowerCase();
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
    // translated = translated || lowerSource;
    /// Titles

    Object.keys(allWords).forEach((key) => {
      if (
        new RegExp(`${key} `, "gi").test(translated.toLowerCase()) ||
        new RegExp(` ${key}[^A-Za-z]`, "gi").test(translated.toLowerCase()) ||
        new RegExp(`${key}$`, "gi").test(translated.toLowerCase())
      ) {
        const wordIndex = translated.toLowerCase().indexOf(key.toLowerCase());
        // if (wordIndex > -1) {
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
        // translated = translated.replace(
        //   title,
        //   this.highlightTranslation(this.replaceWCase(titles[title]))
        // );
        // }
      }
      /// Look for the word in the original text but in lower cases both
      // from there get the index.
      // With the index, check if the char is capital.
      ///If capital, replace with uppercase new word

      // const wordIndex = lowerSource.indexOf(title);
      // if (wordIndex > -1) {
      //   translated = translated.replace(
      //     title,
      //     this.highlightTranslation(this.replaceWCase(titles[title]))
      //   );
      // }
    });

    /// Words
    // Object.keys(words).forEach((key) => {
    //   if (
    //     new RegExp(`${key} `, "gi").test(lowerSource) ||
    //     new RegExp(`${key}[^A-Za-z]`, "gi").test(lowerSource) ||
    //     new RegExp(`${key}$`, "gi").test(lowerSource)
    //   ) {
    //     let replacement = words[key];
    //     if (sourceText.indexOf(key) > -1) {
    //       //source was lower case

    //       translated = translated.replace(
    //         new RegExp(key, "gi"),
    //         this.highlightTranslation(words[key])
    //       );
    //     } else {
    //       translated = translated.replace(
    //         new RegExp(key, "gi"),
    //         this.highlightTranslation(this.capitalize(words[key]))
    //       );
    //     }
    //   }
    // });
    // return this.capitalize(translated) || sourceText;
    // console.log({ translated });
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

  // translateAtoB(sourceText) {
  //   const splitText = sourceText.split(" ");
  //   let counter = 0;
  //   for (let i = 0; i < splitText.length; i++) {
  //     const word = splitText[i];
  //     let translated = americanOnly[word.toLowerCase()];
  //     if (/\d{1,2}:\d{1,2}:?/.test(word)) translated = word.replace(":", ".");
  //     if (!translated)
  //       translated = americanToBritishSpelling[word.toLowerCase()];
  //     if (!translated) translated = americanToBritishTitles[word.toLowerCase()];
  //     if (translated) {
  //       counter++;
  //       if (this.checkCase(word)) {
  //         translated = translated.charAt(0).toUpperCase() + translated.slice(1);
  //       }
  //       sourceText = sourceText.replace(
  //         word,
  //         this.highlightTranslation(translated)
  //       );
  //     }
  //   }
  //   if (counter > 0) {
  //     return sourceText;
  //   } else {
  //     return "Everything looks good to me!";
  //   }
  // }

  // Translate British to American
  // translateBtoA(sourceText) {
  //   const splitText = sourceText.split(" ");
  //   let counter = 0;
  //   function getKeyByValue(object, value) {
  //     return Object.keys(object).find((key) => object[key] === value);
  //   }

  //   for (let i = 0; i < splitText.length; i++) {
  //     const word = splitText[i];
  //     const lowerWord = word.toLowerCase();
  //     console.log(lowerWord);
  //     let translated = britishOnly[lowerWord];
  //     if (/\d{1,2}.\d{1,2}.?/.test(word)) {
  //       console.log("match");
  //       translated = word.replace(".", ":");
  //     }
  //     ///Must be inverse
  //     if (!translated)
  //       translated = getKeyByValue(americanToBritishSpelling, lowerWord);
  //     if (!translated)
  //       translated = getKeyByValue(americanToBritishTitles, lowerWord);
  //     if (translated) {
  //       counter++;
  //       if (this.checkCase(word)) {
  //         translated = translated.charAt(0).toUpperCase() + translated.slice(1);
  //       }
  //       sourceText = sourceText.replace(
  //         word,
  //         this.highlightTranslation(translated)
  //       );
  //     }
  //   }
  //   if (counter > 0) {
  //     return sourceText;
  //   } else {
  //     return "Everything looks good to me!";
  //   }
  // }
}

module.exports = Translator;
