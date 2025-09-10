# Uma Musume Wiki Web Scraper

This project provides a set of Node.js scripts to scrape character data from the Uma Musume wiki (`umamusu.wiki`). It extracts character names, links, source page URLs, and detailed character information, storing them in CSV files.

## Project Structure

- `package.json`: Defines project metadata and scripts.
- `scrape_char_list.js`: Scrapes the list of characters from `https://umamusu.wiki/List_of_Characters` and generates `data/char_list.csv`.
- `scrape_char_data.js`: A module to scrape detailed character data from individual character edit pages (e.g., `https://umamusu.wiki/Admire_Groove/edit`).
- `main.js`: Orchestrates the scraping of all character data using `char_list.csv` and `scrape_char_data.js`, generating `data/char_data_list.csv`.
- `extract_names.js`: Extracts only the `name_*` fields and the `title` from `char_data_list.csv` into `data/name_list.csv`.
- `.gitignore`: Specifies files and directories to be ignored by Git.
- `data/`: Directory where all generated CSV files are stored.

## Setup

1.  **Clone the repository (if applicable) or navigate to the project directory.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

The project includes several `npm` scripts to run the scraping process.

### Individual Steps

You can run each step of the scraping process individually:

- **Scrape Character List:**
  This script fetches all character titles and their wiki links from the main character list page and generates the corresponding source edit page URLs. The output is saved to `data/char_list.csv`.

  ```bash
  npm run scrape-list
  ```

- **Scrape Character Data:**
  This script reads `data/char_list.csv`, visits each character's source edit page, extracts detailed character information, and saves it to `data/char_data_list.csv`. A random delay is introduced between requests to avoid overwhelming the server.

  ```bash
  npm run scrape-data
  ```

- **Extract Name Data:**
  This script reads `data/char_data_list.csv` and extracts only the `title` and all `name_*` fields into a new CSV file, `data/name_list.csv`.
  ```bash
  npm run extract-names
  ```

### Full Scraping Workflow

To run the entire scraping and data extraction process from start to finish:

```bash
npm run full-scrape
```

This command will sequentially execute `scrape-list`, `scrape-data`, and `extract-names`.

## Output Files

All generated CSV files are stored in the `data/` directory:

- `char_list.csv`: Contains `title`, `link`, and `src` (source edit page URL) for each character.

  ```csv
  title,link,src
  "Admire_Groove","https://umamusu.wiki/Admire_Groove","https://umamusu.wiki/Admire_Groove/edit"
  "Admire_Vega","https://umamusu.wiki/Admire_Vega","https://umamusu.wiki/Admire_Vega/edit"
  ...
  ```

- `char_data_list.csv`: Contains comprehensive data for each character, extracted from their source edit pages. The columns will vary based on the fields present in the `{{Character ...}}` template.

  ```csv
  title,type,game_id,name_jp,name_kana,name_ro,name_tcn,name_scn,name_hkjc,name_kr,epithet,image_main,image_race,image_proto,image_stage,nicknames,birthday,class,dorm,roommate,height,threesizes,shoesize,weight,calls_self,calls_trainer,seiyuu,icon,color_main,color_sub,irl_page
  "Admire_Groove","horsegirl","1118","アドマイヤグルーヴ",,"愛慕律動",,,,,,,"Admire Groove (Main).png","Admire Groove (Race).png",,,,,,"2021-04-30",,,,,"165","B88 W57 H84",,"A stunning finish",,,,"Admire Groove (Icon).png","344d99","5cbac8","IRL:Admire Groove"
  ...
  ```

- `name_list.csv`: Contains only the `title` and all `name_*` fields for each character.
  ```csv
  title,name_jp,name_kana,name_ro,name_tcn,name_scn,name_hkjc,name_kr
  "Admire_Groove","アドマイヤグルーヴ",,"愛慕律動",,,,,
  "Admire_Vega","アドマイヤベガ",,"愛慕織姬",,,,,
  ...
  ```
