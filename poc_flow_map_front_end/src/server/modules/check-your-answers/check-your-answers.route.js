const { getCurrent } = require('hapi-govuk-journey-map')
const Application = require('../../dao/application')
const view = 'check-your-answers/check-your-answers.view.njk'
const pageHeading = 'Check your answers before sending your application'

const { buildTaskList } = require('../../utils/taskReference')
const { getDetails } = require('../../utils/permitReference')
const confirmationStatement = require('../../partials/confirmation-statement')

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
  const { address, files } = await Application.get(request)
  let value
  let html
  switch (id) {
    case 'permit-holder-details': {
      value = ''
      html = Object.values(address)
        .filter((addressLine) => addressLine.trim())
        .join('<br>')
      break
    }
    case 'site-plan-upload': {
      value = ''
      html = files
        .map(({ filename }) => filename)
        .join('<br>')
      break
    }
  }
  return { key, id, href, value, html }
}

async function getAsideDetails (request) {
  const { parent = {} } = await getCurrent(request)
  const { path = '' } = parent
  return {
    navLinks: [
      {
        text: 'Print application',
        href: `${path}/print-application`
      }
    ],
    details: await getDetails(request)
  }
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
  return {
    showTitle: true,
    pageTitle: pageHeading,
    value: { answers, confirmationStatement },
    aside: await getAsideDetails(request)
  }
}

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    return h.view(view, await getViewData(request))
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    return h.continue
  }
}]
