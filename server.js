var fs = require('fs')
var parseRange = require('range-parser')

module.exports = function (req, res) {
  if (req.url === '/custom://page/') {
    res.writeHead(200, 'OK', {'Content-Type': 'text/html', 'Content-Length': '<h1>Hello!</h1>'.length})
    res.write('<h1>Hello!</h1>')
    setTimeout(() => res.end(), 1e3)
    return
  }

  // get size
  var st = fs.statSync('./video.mp4')

  // handle range
  var statusCode = 200
  res.setHeader('Accept-Ranges', 'bytes')
  var range = req.headers.range && parseRange(st.size, req.headers.range)
  if (range && range.type === 'bytes') {
    range = range[0] // only handle first range given
    // range.end = range.start + (1024*1024)
    statusCode = 206
    res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + st.size)
    res.setHeader('Content-Length', range.end - range.start + 1)
  }

  // respond
  res.writeHead(statusCode, 'OK', {
    'Content-Type': 'video/mp4',
    'Cache-Control': 'public, max-age: 60'
  })
  fileReadStream = fs.createReadStream('./video.mp4', range)
  fileReadStream.pipe(res)

  fileReadStream.once('error', err => {
    console.log('Error reading file', err)
  })

  req.once('aborted', () => {
    if (fileReadStream) {
      fileReadStream.destroy()
    }
  })
}