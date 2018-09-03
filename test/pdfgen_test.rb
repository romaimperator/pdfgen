# frozen_string_literal: true

require 'minitest/autorun'
require 'pdfgen'
require 'open-uri'

class PdfgenTest < Minitest::Test
  def test_pdf_creation
    assert_kind_of String, Pdfgen.new("<html><body><h1>howdy</h1></body></html>").to_pdf
  end

  def test_options_can_be_passed
    assert_kind_of String, Pdfgen.new('<html><body><h1>howdy whats upÃupÃ</h1></body></html>').to_pdf(path: 'page.pdf', printBackground: true)
  end

  def test_navigation
    assert_kind_of String, Pdfgen.new('https://www.google.com').to_pdf(path: 'page_navigation.pdf')
  end

  def test_debug_mode
    assert_kind_of String, Pdfgen.new('https://www.google.com').debug_mode(500).to_pdf
  end

  def test_html_that_contains_link_at_beginning_of_a_line
    assert_kind_of String, Pdfgen.new("<html><body><h1>howdy</h1><p>\nhttp://this-is-a-link.example.com</p></body></html>").to_pdf
  end

  def test_passing_google_as_html
    open("https://www.google.com") do |f|
      assert_kind_of String, Pdfgen.new(f.read).to_pdf(path: 'google.pdf')
    end
  end
end
