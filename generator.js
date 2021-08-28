const puppeteer = require('puppeteer');
const fs = require('fs');
const findRows = async (page) => page.$eval('.jl-table > tbody', e => Object.values(e.querySelectorAll('.jl-row')).map(e => e.outerHTML));
(
    async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const baseUrl = 'https://jlptsensei.com/';
        const [level, category] = process.argv.slice(2);
        if (!level || !category) {
            console.error('generator requires arguments <level> <category>, e.g. node generator.js n5 vocabulary');
            process.exit(1);
        }
        const feature = `jlpt-${level}-${category}-list`
        let deck = [];
        await page.goto(`${baseUrl}/${feature}/`, { waitUntil: 'domcontentloaded' }).catch(() => { process.exit(1); });
        deck = await findRows(page);

        let i = 2;
        while (i < 100) {
            try {
                await page.goto(`${baseUrl}/${feature}/page/${i}/`, { waitUntil: 'domcontentloaded' });
                let rows = await (findRows(page));
                if (!rows) {
                    break;
                }
                deck = deck.concat(rows);
                i++;
            } catch {
                break;
            }
        }
        let a = deck.length;
        let b;
        while (a > 0) {
            b = Math.floor(Math.random() * a);
            [deck[a], deck[b]] = [deck[b], deck[a]];
            a--;
        }
        const regexp = /class=\"[^\"]*\"/sg;
        deck = deck.map((e) => {
            if (e) {
                return e.replace(regexp, '');
            }
            return e;
        });
        let result = {};
        try {
            if (fs.existsSync('./public/content.json')) {
                const data = fs.readFileSync('./public/content.json');
                if (data) {
                    result = JSON.parse(data);
                }
            }
        } catch (err) {
            console.log('could not read content.json', err);
            result = {};
        }
        result[`${level}-${category}`] = deck;
        fs.writeFile(`./public/content.json`, JSON.stringify(result), (err) => {
            if (err) { return console.log('oh no couldnt write', err); }
            console.log('write successful');
            process.exit(1);
        });
        browser.close();
    }
)();