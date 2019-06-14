## Pdfgen 0.7.0 (June 14, 2019)

* Revert to using setContent but require Puppeteer >= 1.11.0.

  This version of Puppeteer added support to setContent for waiting until browser
  events fire. The original reason for transitioning away from setContent was lack
  of that feature and navigating to a data URL is limited to a maximum of 2 megabytes
  of HTML as that is Chromium's URL length limit.

## Pdfgen 0.6.0 (June 14, 2019)

* Use capture3 to also capture stderror which is where Node error messages are output.

  This allows Pdfgen to include the error from Node in the exception that is raised.

## Pdfgen 0.5.0 (September 3, 2018)

* Changes how the wait for timeout works slightly.

  This new way starts the wait prior to putting the HTML in the page. Now that we can
  utilize the waitUntil navigation feature in Puppeteer, we might as well start the
  clock before waiting for that amount of time. This way, the maximum wait time should
  be roughly the timeout instead of the timeout + how long the page takes to load.

* Changes how static HTML is put into the page.

  This new method allows us to use the navigation wait helpers so there should be
  almost no need for timeout waiting if passing Pdfgen HTML instead of a URL.

  Sadly, this still does not load assets on the page so inlining your assets is still
  required.

* Moves emulateMedia and setViewport steps to be before setting content or navigation
  so that the browser won't need to rerender the content and hopefully we improve
  performance some.

## Pdfgen 0.4.2 (June 8, 2018)

* Adds checking of minimum Node version required.

  Need to soon add testing for different versions of Node to discover what the
  compatible versions are.

* Adds handling of any unhandled rejection by logging the error and then exiting.

  This change provides better error messaged from Node and also prevents the process
  from hanging and not exiting when there was an error.

* Fixes bug where launch options were no longer being passed to the Javascript.

## Pdfgen 0.4.1 (May 15, 2018)

* Fixes bug with regex that checks if a URL was passed.

## Pdfgen 0.4.0 (May 12, 2018)

* Can now provide a URL to the initializer.

  Providing a URL to the initializer will now nagivate to the URL and then render the
  page to a PDF.

* Adds a debug mode.

  Calling debug_mode and passing in a time in milliseconds to wait with the browser
  not headless. This may change to be forever in the future but that would cause weird
  issues since the Ruby code expects the Javascript to return the PDF on stdout and
  there isn't yet a good way to indicate that you are done debugging and the rendering
  can continue.

## Pdfgen 0.3.1 (April 23, 2018)

* Fixes bug by passing the wait_for_timeout to the Javascript script.

## Pdfgen 0.3.0 (April 23, 2018)

* Allows optional period in milliseconds to wait for the page to finish rendering.

  A new optional wait timeout that will occur after the content has been set,
  the media emulation set, and the viewport has been set to allow for javascript
  and rendering to run before printing to a pdf
