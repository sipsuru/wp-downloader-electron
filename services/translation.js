const fs = require("fs");
const path = require("path");  // Import path module

class Translation {

	static langData = {};
	static langs = [];

	static loadLanguages() {

		// Use path.join to create an absolute path
		let langs = fs.readdirSync(path.join(__dirname, "../lang"));

		for (let lang of langs) {

			let langName = lang.split(".")[0];

			// Use path.join for each language file
			Translation.langData[langName] = JSON.parse(
				fs.readFileSync(path.join(__dirname, "../lang", lang)).toString()
			);

			Translation.langs.push(langName);
		}
	}

	static getLangData(lang) {
		return Translation.langData[lang];
	}

	static getTranslation(availableLangs) {

		let langName = Array.isArray(availableLangs) ? availableLangs[0] : availableLangs;
		let lang;

		if (availableLangs) {
			lang = Translation.getLangData(langName);
		} else {
			lang = Translation.getLangData("de");
		}

		return { lang, langName };
	}
}

module.exports = Translation;