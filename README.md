# Pdfgen
A tool for creating PDFs using [Puppeteer](https://github.com/GoogleChrome/puppeteer) and headless Chrome.

# Dependencies
This gem requires that node be installed along with puppeteer.

### OSX (Homebrew)
To install node on OSX you can use Homebrew:
```bash
brew install nodejs
```

And then install puppeteer with npm:
```bash
npm install --save puppeteer
```

# Usage
Currently the only use case that is supported is rendering an HTML string. You can do that by using the
Pdfgen class:
```ruby
pdf_as_string = Pdfgen.new(html_to_turn_into_pdf).to_pdf
```
`to_pdf` returns the pdf as a string. This makes it easy to send to a client from a web server like
Rails or to save to a file if that is desired.

If you need to provide options such as page margins you can pass them as a hash to `to_pdf`. Any 
options that work for [Puppeteer's `pdf` method](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions)
are accepted as they are passed through without modification.
```ruby
pdf_as_string = Pdfgen.new(html_to_turn_into_pdf).to_pdf(margins: { top: '1in', bottom: '1in' })
``` 

# Future Development
In the future, allowing use of more features of Puppeteer is desired. These include taking a URL and 
setting cookies. Instead of using a fixed make_pdf.js script, it will probably make sense to convert
to generating that javascript file on the fly using templates since additional options like allowing
the setting of cookies will require calling more functions than are currently being called.