const { setQueryData } = require('hapi-govuk-journey-map')
const Tasks = require('../../dao/tasks')

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    const { task } = request.params
    await Tasks.update(request, { [task]: false })
    setQueryData(request, { task, tasksComplete: undefined })
    return h.continue
  }
}
