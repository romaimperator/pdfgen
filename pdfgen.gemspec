# frozen_string_literal: true

version = File.read(File.expand_path("VERSION", __dir__)).strip

Gem::Specification.new do |s|
  s.name        = 'pdfgen'
  s.version     = version
  s.summary     = "Generate PDFs using Puppeteer and headless Chrome"
  s.description = "Using Puppeteer and headless Chrome, generate PDFs from HTML without needing to install wkhtmltopdf."
  s.authors     = ["Daniel Fox"]
  s.email       = 'romaimperator@gmail.com'
  s.files       = Dir["{bin,lib}/**/*", "CHANGELOG.md", "LICENSE", "Rakefile", "README.md", "VERSION"]
  s.homepage    = 'https://github.com/romaimperator/pdfgen'
  s.license     = 'MIT'

  s.add_development_dependency 'minitest', '~> 5.11'
end
