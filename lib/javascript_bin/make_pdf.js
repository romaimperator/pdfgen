#!/usr/bin/env node

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

// Exit if we have any unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error(err)
    process.exit(1)
})

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
    var wait_for_timeout = options['wait_for_timeout'];
    var url = options['url'];
    var url_options = options['url_options'];
    var debug_mode = options['debug_mode'];

    module.paths.push(current_path + '/node_modules');

    const puppeteer = require('puppeteer');
    const fs = require('fs');

    if (typeof url === 'undefined') {
        var html = fs.readFileSync(process.argv[2], 'utf8');
    }

    (async() => {
        const browser = await puppeteer.launch(launch_options);
        const page = await browser.newPage();

        if (typeof url !== 'undefined' && url) {
            await page.goto(url, url_options);
        } else {
            await page.setContent(html);
        }

        if (typeof media_type !== 'undefined' && media_type) {
            await page.emulateMedia(media_type);
        }

        if (typeof viewport_options !== 'undefined' && viewport_options) {
            await page.setViewport(viewport_options);
        }

        if (typeof wait_for_timeout !== 'undefined' && wait_for_timeout) {
            await page.waitFor(wait_for_timeout);
        }

        if (typeof debug_mode === 'undefined') {
            const pdf_output = await page.pdf(pdf_options);
            stdout.write(pdf_output);
        }

        await browser.close();
    })();
});
