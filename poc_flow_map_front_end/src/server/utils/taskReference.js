const { getCurrent } = require('hapi-govuk-journey-map')
const Application = require('../dao/application')
const Tasks = require('../dao/tasks')

const { load } = require('./reference')
const tasklistReference = load('tasklist')

function getState (state) {
  switch (state) {
    case true: return { id: 'completed', label: 'Completed' }
    case false: return { id: 'incomplete', label: 'Incomplete' }
    default: return { id: 'not-started', label: 'Not started' }
  }
}

async function permitReference (request) {
  const { permitType, permitCategory, standardRule } = await Application.get(request)
  return require(`../reference/${permitType}/${permitCategory}/${standardRule}`)
}

async function buildTaskList (request) {
  const { parent = {} } = await getCurrent(request)
  const { path = '' } = parent
  const { tasks: permitTasks } = await permitReference(request)
  const taskStatus = await Tasks.get(request)
  return tasklistReference
    .map(({ heading, tasks, submit }) => {
      return {
        heading,
        submit,
        tasks: tasks
          .filter(({ id, required }) => required || permitTasks.includes(id))
          .map((task) => {
            return { ...task, submit, state: getState(taskStatus[task.id]), link: `${path}/task/${task.id}` }
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

module.exports = {
  tasksComplete,
  buildTaskList
}
