module.exports = {
  method: 'GET',
  handler: function (request, h) {
    return h.view('form-layout.njk', {
      showTitle: true,
      pageTitle: 'Application complete'
    })
  }
}
