
const pageTitle = 'Payment successful'

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    return h.view('form-layout.njk', {
      showTitle: true,
      pageTitle
    })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    return h.continue
  }
}]
