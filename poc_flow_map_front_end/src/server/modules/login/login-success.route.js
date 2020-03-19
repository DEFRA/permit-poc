module.exports = [
  {
    method: 'GET',
    handler: function (request, h) {
      return h.view('login/login-success.view.njk', {
        showTitle: true,
        pageTitle: 'Successfully logged in'
      })
    }
  }, {
    method: 'POST',
    handler: function (request, h) {
      return h.continue
    }
  }
]
