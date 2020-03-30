
const Application = require('../../dao/application')
const view = 'check-your-answers/check-your-answers.view.njk'
const pageHeading = 'Check your answers before sending your application'

const { buildTaskList } = require('../../utils/taskReference')

async function buildRows (answers) {
  return answers.map(({ key, value, html, id, href }) => {
    const classes = `permitting-${key.toLowerCase().split(' ').join('-')}`
    const row = {
      key: { text: key }
    }

    if (value) {
      row.value = { classes, text: value }
    } else if (html) {
      row.value = { classes, html }
    }

    row.actions = {
      items: [
        {
          attributes: {
            id: `change-${id}`
          },
          href: href,
          text: 'Change',
          visuallyHiddenText: key.toLowerCase()
        }
      ]
    }

    return row
  })
}

async function getTaskAnswers (request, task) {
  const { id, title, label, link: href } = task
  const key = label || title
  const { address } = await Application.get(request)
  let value
  let html
  switch (id) {
    case 'permit-holder-details': {
      value = ''
      html = Object.values(address)
        .filter((addressLine) => addressLine.trim())
        .join('<br>')
    }
  }
  return { key, id, href, value, html }
}

async function getViewData (request) {
  const tasklist = await buildTaskList(request)
  const answers = await Promise.all(tasklist
    .filter(({ submit }) => !submit)
    .map(async ({ heading, tasks }) => {
      const sectionAnswers = await Promise.all(tasks.map((task) => getTaskAnswers(request, task)))
      const rows = await buildRows(sectionAnswers)
      return { heading, rows }
    })
  )
  console.log(answers)
  return {
    showTitle: true,
    pageTitle: pageHeading,
    value: { answers }
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
    return h.continue
  }
}]
