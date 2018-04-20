#!/usr/bin/env node

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {
    var options = JSON.parse(inputChunks.join());
    var pdf_options = options['pdf_options'];
    var current_path = options['current_path'];
    var viewport_options = options['viewport_options'];
    var media_type = options['emulate_media'];
    var launch_options = options['launch_options'];

    module.paths.push(current_path + '/node_modules');

    const puppeteer = require('puppeteer');
    const fs = require('fs');
    var html = fs.readFileSync(process.argv[2], 'utf8');

    (async() => {
        const browser = await puppeteer.launch(launch_options);
        const page = await browser.newPage();

        await page.setContent(html);
        if (typeof media_type !== 'undefined' && media_type) {
            await page.emulateMedia(media_type);
        }

        if (typeof viewport_options !== 'undefined' && viewport_options) {
            await page.setViewport(viewport_options);
        }

        const pdf_output = await page.pdf(pdf_options);
        stdout.write(pdf_output);
        await browser.close();
    })();
});
