const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeCharacterData(srcUrl) {
  try {
    const response = await axios.get(srcUrl);
    const $ = cheerio.load(response.data);

    const rawText = $("#wpTextbox1").text(); // Get the raw text from the edit box

    const characterData = {};
    const characterTemplateRegex = /\{\{Character\s*\|([\s\S]*?)\}\}/;
    const match = rawText.match(characterTemplateRegex);

    if (match && match[1]) {
      const templateContent = match[1];
      const lines = templateContent.split("\n");

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("|")) {
          const parts = trimmedLine.substring(1).split("=", 2);
          if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim();
            characterData[key] = value;
          }
        }
      });
    }
    return characterData;
  } catch (error) {
    console.error(`Error scraping data from ${srcUrl}: ${error.message}`);
    return null;
  }
}

if (require.main === module) {
  // Example usage if run directly (for testing)
  const testUrl = "https://umamusu.wiki/Admire_Groove/edit"; // Replace with a valid test URL
  scrapeCharacterData(testUrl)
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}

module.exports = scrapeCharacterData;
