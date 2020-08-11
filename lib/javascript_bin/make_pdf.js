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
        let wait_promise = null;

        if (typeof media_type !== 'undefined' && media_type) {
            if (typeof page.emulateMedia !== 'undefined') {
                await page.emulateMedia(media_type);
            } else {
                await page.emulateMediaType(media_type);
            }
        }

        if (typeof viewport_options !== 'undefined' && viewport_options) {
            await page.setViewport(viewport_options);
        }

        if (typeof wait_for_timeout !== 'undefined' && wait_for_timeout) {
            wait_promise = page.waitFor(wait_for_timeout);
        }

        if (typeof url !== 'undefined' && url) {
            await page.goto(url, url_options);
        } else {
            await page.setContent(html, { waitUntil: ["networkidle0", "load"] });
        }

        // If we were given a wait timeout, we should wait for the rest of the timeout now. That way,
        // the timeout will act as a minimum amount of time to wait for the page. If it's greater than
        // how long the waitUntil idle took, it will wait for the extra time. If it is shorter than how
        // long the page actually needs, then it will not add any time.
        if (typeof wait_promise !== 'undefined' && wait_promise) {
            await wait_promise;
        }

        if (typeof debug_mode === 'undefined') {
            const pdf_output = await page.pdf(pdf_options);
            stdout.write(pdf_output);
        }

        await browser.close();
    })();
});
