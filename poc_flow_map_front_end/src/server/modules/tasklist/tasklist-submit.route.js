const { setQueryData } = require('hapi-govuk-journey-map')
const Application = require('../../dao/application')
const Tasks = require('../../dao/tasks')
const { load } = require('../../utils/reference')
const tasklistReference = load('tasklist')

async function permitReference (request) {
  const { permitType, permitCategory, standardRule } = await Application.get(request)
  return require(`../../reference/${permitType}/${permitCategory}/${standardRule}`)
}
async function tasksComplete (request) {
  const { tasks: permitTasks } = await permitReference(request)
  const taskStatus = await Tasks.get(request)
  const remainingTasks = tasklistReference
    .map(({ tasks, submit }) => submit ? [] : tasks.filter(({ id, required }) => !taskStatus[id] && (required || permitTasks.includes(id))))
    .flat()
  return !remainingTasks.length
}

module.exports = {
  method: 'GET',
  handler: async function (request, h) {
    await setQueryData(request, { tasksComplete: await tasksComplete(request) ? 'yes' : 'no' })
    return h.continue
  }
}
