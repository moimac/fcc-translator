"use strict";

const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();
  const localeOptions = ["american-to-british", "british-to-american"];

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;
    if (text === null || text === undefined || !locale)
      return res.send({ error: "Required field(s) missing" });
    if (text.length === 0) return res.send({ error: "No text to translate" });
    if (!localeOptions.includes(locale))
      return res.send({ error: "Invalid value for locale field" });

    let translation;
    if (locale === localeOptions[0]) {
      translation = translator.translateAtoB(text);
    } else if (locale === localeOptions[1]) {
      translation = translator.translateBtoA(text);
    }
    return res.send({ text, translation });
  });
};
