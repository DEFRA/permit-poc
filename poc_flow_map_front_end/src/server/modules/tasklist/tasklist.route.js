const { setQueryData } = require('hapi-govuk-journey-map')
const Joi = require('@hapi/joi')
const failAction = require('../../utils/validation')
const view = 'tasklist/tasklist.view.njk'
const pageHeading = 'Apply for a standard rules environmental permit'

const { buildTaskList, tasksComplete } = require('../../utils/taskReference')

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
