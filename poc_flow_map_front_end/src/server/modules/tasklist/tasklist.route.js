const { setQueryData } = require('hapi-govuk-journey-map')
const Joi = require('@hapi/joi')
const failAction = require('../../utils/validation')
const Application = require('../../dao/application')
const Tasks = require('../../dao/tasks')

const { load } = require('../../utils/reference')
const view = 'tasklist/tasklist.view.njk'
const pageHeading = 'Apply for a standard rules environmental permit'
const tasklistReference = load('tasklist')

async function permitReference (request) {
  const { permitType, permitCategory, standardRule } = await Application.get(request)
  return require(`../../reference/${permitType}/${permitCategory}/${standardRule}`)
}

function getState (state) {
  switch (state) {
    case true: return { id: 'completed', label: 'Completed' }
    case false: return { id: 'incomplete', label: 'Incomplete' }
    default: return { id: 'not-started', label: 'Not started' }
  }
}

async function buildTaskList (request) {
  const { tasks: permitTasks } = await permitReference(request)
  const taskStatus = await Tasks.get(request)
  return tasklistReference
    .map(({ heading, tasks, submit }) => {
      return {
        heading,
        tasks: tasks
          .filter(({ id, required }) => required || permitTasks.includes(id))
          .map((task) => {
            return { ...task, submit, state: getState(taskStatus[task.id]), link: `/task/${task.id}` }
          })
      }
    })
    // Only include sections containing tasks
    .filter(({ tasks }) => tasks.length)
}

async function tasksComplete (request) {
  const { tasks: permitTasks } = await permitReference(request)
  const taskStatus = await Tasks.get(request)
  const remainingTasks = tasklistReference
    .map(({ tasks, submit }) => submit ? [] : tasks.filter(({ id, required }) => !taskStatus[id] && (required || permitTasks.includes(id))))
    .flat()
  return !remainingTasks.length
}

async function getErrors (request) {
  const schema = Joi.object({ tasksComplete: Joi.string().valid('yes') })
  const { error } = schema.validate({ tasksComplete: await tasksComplete(request) ? 'yes' : 'no' })
  return error
}

async function getViewData (request) {
  const tasklist = await buildTaskList(request)
  return {
    pageHeading: pageHeading,
    value: { tasklist }
  }
}

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    return h.view(view, await getViewData(request))
  },
  options: {
    tags: ['hide-back-link']
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    const errors = await getErrors(request)
    if (errors) {
      await setQueryData(request, { task: undefined })
      const displayErrors = failAction(view, await getViewData(request), { tasksComplete: { 'any.only': 'You must complete all the tasks before continuing' } })
      return displayErrors(request, h, errors)
    }
    return h.continue
  }
}]
