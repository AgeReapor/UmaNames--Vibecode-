const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const { createObjectCsvWriter } = require("csv-writer");

const CHAR_DATA_LIST_FILE = path.join(__dirname, "data", "char_data_list.csv");
const OUTPUT_DIR = "./data";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "name_list.csv");

async function extractNames() {
  console.log(`Extracting name data from: ${CHAR_DATA_LIST_FILE}`);
  const nameData = [];
  const headers = new Set(["title"]); // 'title' is always included

  // Read char_data_list.csv
  const parser = fs
    .createReadStream(CHAR_DATA_LIST_FILE)
    .pipe(parse({ columns: true, skip_empty_lines: true }));

  for await (const record of parser) {
    const row = { title: record.title };
    for (const key in record) {
      if (key.startsWith("name_") || key === "nicknames") {
        row[key] = record[key];
        headers.add(key); // Add name_* and nicknames headers
      }
    }
    nameData.push(row);
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

  await csvWriter.writeRecords(nameData);
  console.log(`Name data saved to ${OUTPUT_FILE}`);
}

if (require.main === module) {
  extractNames().catch(console.error);
}
