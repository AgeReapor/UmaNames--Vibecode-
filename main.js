const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { createObjectCsvWriter } = require("csv-writer");
const scrapeCharacterData = require("./scrape_char_data");

const CHAR_LIST_FILE = path.join(__dirname, "data", "char_list.csv");
const OUTPUT_DIR = "./data";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "char_data_list.csv");

// Function to introduce a random delay
function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function processCharacterData() {
  console.log("Starting to process character data...");
  const charList = [];

  // Read char_list.csv
  const parser = fs
    .createReadStream(CHAR_LIST_FILE)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    charList.push(record);
  }

  console.log(`Found ${charList.length} characters to process.`);

  const allCharacterData = [];
  const headers = new Set(["title"]); // Start with 'title' as a guaranteed header

  for (const char of charList) {
    console.log(`Scraping data for: ${char.title} from ${char.src}`);
    const data = await scrapeCharacterData(char.src);

    if (data) {
      // Add the title from char_list.csv to the scraped data
      data.title = char.title;
      allCharacterData.push(data);

      // Collect all unique keys to form the CSV header
      Object.keys(data).forEach((key) => headers.add(key));
    }

    // Introduce a random delay between requests
    const delay = getRandomDelay(0, 50); // 1 to 3 seconds delay
    console.log(`Waiting for ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Convert Set of headers to an array of objects for csv-writer
  const csvHeaders = Array.from(headers).map((id) => ({ id, title: id }));

  // Ensure the output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE,
    header: csvHeaders,
  });

  await csvWriter.writeRecords(allCharacterData);
  console.log(`All character data saved to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  processCharacterData().catch(console.error);
}
