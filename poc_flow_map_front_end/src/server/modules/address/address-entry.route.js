const { getCurrent } = require('../../plugins/flow')

module.exports = [
  {
    method: 'GET',
    handler: function (request, h) {
      const { title } = getCurrent(request)
      return `
        <h1>${title}</h1>
        <form method="post">
            <input type="submit" value="Submit">
        </form>`
    }
  }, {
    method: 'POST',
    handler: function (request, h) {
      return h.continue
    }
  }]
