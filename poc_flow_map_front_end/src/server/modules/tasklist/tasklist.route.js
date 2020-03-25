const { getQueryData, setQueryData } = require('hapi-govuk-journey-map')
const Joi = require('@hapi/joi')
const Hoek = require('@hapi/hoek')
const { formatErrors } = require('../../utils/validation')
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

async function getErrors (request) {
  const { tasksComplete = 'yes' } = await getQueryData(request)
  const schema = Joi.object({ tasksComplete: Joi.string().valid('yes') })
  const { error } = schema.validate({ tasksComplete })
  return error
}

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    const tasklist = await buildTaskList(request)
    const viewData = {
      pageHeading: pageHeading,
      value: { tasklist }
    }

    const errors = await getErrors(request)
    if (errors) {
      // Merge the viewData with the formatted error messages
      Hoek.merge(viewData, await formatErrors(errors, { tasksComplete: { 'any.only': 'You must complete all the tasks before continuing' } }))
    } else {
      const { task } = await getQueryData(request)
      if (task === 'check-your-answers') {
        await setQueryData(request, { task: undefined, tasksComplete: undefined })
        return h.continue // Will redirect to next route
      }
    }

    return h.view(view, viewData)
  },
  options: {
    tags: ['hide-back-link']
  }
}]
