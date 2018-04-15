#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {
    var input_data = JSON.parse(inputChunks.join());
    var pdf_options = input_data['opts'];
    var html = input_data['html'];

    (async() => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html);
        await page.emulateMedia('screen');
        const pdf_output = await page.pdf(pdf_options);
        stdout.write(pdf_output);
        await browser.close();
    })();
});
