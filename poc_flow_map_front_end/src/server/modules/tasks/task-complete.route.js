const { getQueryData } = require('hapi-govuk-journey-map')
const Tasks = require('../../dao/tasks')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    const { task } = getQueryData(request)
    await Tasks.update(request, { [task]: true })
    return h.continue
  }
}
