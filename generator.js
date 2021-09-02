const admin = require('firebase-admin');
const firebase = require('firebase/app');
const fslite = require('firebase/firestore/lite');
const firestore = require('firebase/firestore');
const fauth = require('firebase/auth');
const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const firebaseConfig = {
    apiKey: "AIzaSyCnjrJTMo8Yr0bQ7Z8YXQgbVNX98usrHho",
    authDomain: "saltybread-221fd.firebaseapp.com",
    databaseURL: "https://saltybread-221fd.firebaseio.com",
    projectId: "saltybread-221fd",
    storageBucket: "saltybread-221fd.appspot.com",
    messagingSenderId: "1091174055877",
    appId: "1:1091174055877:web:1037e06fd0c14226ab15ac"
};

admin.initializeApp(firebaseConfig);
const db = admin.firestore();
// const auth = fauth.getAuth();

const findRows = async (page) => page.$eval('.jl-table > tbody', e => Object.values(e.querySelectorAll('.jl-row')).map((e) => {
    e.removeChild(e.firstChild);
    return e.innerHTML;
}));

(async () => {
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
    result[`${level}-${category}`] = deck;
    try {
        db.settings({ ignoreUndefinedProperties: true });
        await db.collection('main').doc('content').set(result, { merge: true });
        process.exit(1);
    } catch (err) { console.log(err); }

    browser.close();
})();