const { setQueryData } = require('hapi-govuk-journey-map')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    await setQueryData(request, { task: undefined, tasksComplete: undefined })
    return h.continue
  }
}
