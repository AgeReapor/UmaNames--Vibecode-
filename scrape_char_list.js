const axios = require("axios");
const cheerio = require("cheerio");
const { createObjectCsvWriter } = require("csv-writer");
const path = require("path");
const fs = require("fs");

const BASE_URL = "https://umamusu.wiki";
const LIST_PAGE_URL = `${BASE_URL}/List_of_Characters`;
const OUTPUT_DIR = "./data";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "char_list.csv");

async function scrapeCharacterList() {
  console.log(`Scraping character list from: ${LIST_PAGE_URL}`);
  try {
    const response = await axios.get(LIST_PAGE_URL);
    const $ = cheerio.load(response.data);

    const characters = [];
    const uniqueTitles = new Set(); // To track unique titles

    // The character links are typically within a div with class 'mw-parser-output'
    // and then in unordered lists (ul) or directly as links (a)
    // We need to inspect the actual page structure to get the correct selector.
    // For now, let's assume they are direct links within the main content area.
    // A more robust solution would involve inspecting the page.
    // Let's try to find links within the main content that point to character pages.

    // This selector is a guess, based on common wiki structures.
    // It might need adjustment after inspecting the actual page.
    $("div.mw-parser-output a").each((i, element) => {
      const link = $(element).attr("href");
      const title = $(element).attr("title");

      if (link && title && link.startsWith("/")) {
        // Filter out non-character links, e.g., categories, special pages
        // A simple heuristic: character pages usually have titles that are not too short
        // and don't contain special wiki prefixes like 'Category:', 'File:', etc.
        if (
          !title.includes(":") &&
          title.length > 2 &&
          !link.includes("redlink=1")
        ) {
          const formattedTitle = title.replace(/ /g, "_");
          if (!uniqueTitles.has(formattedTitle)) {
            uniqueTitles.add(formattedTitle);
            const fullLink = `${BASE_URL}${link}`;
            const srcLink = `${BASE_URL}${link}/edit`;
            characters.push({
              title: formattedTitle,
              link: fullLink,
              src: srcLink,
            });
          }
        }
      }
    });

    // Ensure the output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: OUTPUT_FILE,
      header: [
        { id: "title", title: "title" },
        { id: "link", title: "link" },
        { id: "src", title: "src" },
      ],
    });

    await csvWriter.writeRecords(characters);
    console.log(`Character list saved to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Error scraping character list: ${error.message}`);
  }
}

if (require.main === module) {
  scrapeCharacterList();
}

module.exports = scrapeCharacterList;
