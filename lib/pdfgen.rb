# frozen_string_literal: true

require 'open3'
require 'json'

_, status = Open3.capture2('node', '-v')
raise 'This gem requires node be installed and available on the PATH' unless status.success?

MAKE_PDF_COMMAND = File.expand_path('../javascript_bin/make_pdf.js', __FILE__)

class Pdfgen
  def initialize(html_or_url)
    if html_or_url =~ /\Ahttp/
      @url = html_or_url
      @html = nil
    else
      @url = nil
      @html = html_or_url
    end
    @viewport_options = nil
    @emulate_media = nil
    @launch_options = Hash.new
    @wait_for_timeout = nil
    @debug_time = nil
    @url_options = { waitUntil: 'networkidle0' }
  end

  def set_viewport(viewport_options)
    @viewport_options = viewport_options
    self
  end

  def emulate_media(media_type)
    @emulate_media = media_type
    self
  end

  def launch_options(launch_options)
    @launch_options = launch_options
    self
  end

  def wait_for_timeout(wait_for_timeout)
    raise TypeError.new("Timeout must be an integer or respond to #to_i") unless wait_for_timeout.kind_of?(Integer) || (wait_for_timeout.respond_to?(:to_i) && wait_for_timeout.to_i)
    @wait_for_timeout = wait_for_timeout
    self
  end

  def debug_mode(debug_time)
    raise TypeError.new("Timeout must be an integer or respond to #to_i") unless debug_time.kind_of?(Integer) || (debug_time.respond_to?(:to_i) && debug_time.to_i)
    @debug_time = debug_time
    self
  end

  def url_options(url_options)
    @url_options = @url_options.merge(url_options)
    self
  end

  def to_pdf(opts = {})
    stdin_options = { pdf_options: opts, current_path: Dir.pwd }
    stdin_options = stdin_options.merge(viewport_options: @viewport_options) if @viewport_options
    stdin_options = stdin_options.merge(emulate_media: @emulate_media) if @emulate_media
    stdin_options = stdin_options.merge(wait_for_timeout: @wait_for_timeout) if @wait_for_timeout
    if @debug_time
      stdin_options = stdin_options.merge(wait_for_timeout: @debug_time)
      stdin_options = stdin_options.merge(launch_options: @launch_options.merge(headless: false))
      stdin_options = stdin_options.merge(debug_mode: true)
    end

    pdf_output = nil
    status = nil
    if @html
      file = Tempfile.new('input_html')
      file.write(@html)
      file.close
      pdf_output, status = Open3.capture2(MAKE_PDF_COMMAND, file.path, stdin_data: stdin_options.to_json)
      file.unlink
    else
      stdin_options = stdin_options.merge(url: @url)
      stdin_options = stdin_options.merge(url_options: @url_options)
      pdf_output, status = Open3.capture2(MAKE_PDF_COMMAND, stdin_data: stdin_options.to_json)
    end

    unless status.success?
      raise 'There was an unknown error running node to create the pdf. Check your logs for output that might assist in debugging.'
    end
    unless pdf_output
      raise 'There was an error creating the temporary file used to pass the HTML to node.'
    end
    pdf_output
  end
end


# Use a new API that uses method chaining to configure the PDF and that queues up strings to put in a js file to run puppeteer