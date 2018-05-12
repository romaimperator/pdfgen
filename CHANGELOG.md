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
