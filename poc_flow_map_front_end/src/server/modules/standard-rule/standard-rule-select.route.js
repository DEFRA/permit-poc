const { setQueryData } = require('hapi-govuk-journey-map')
const Application = require('../../dao/application')
const Joi = require('@hapi/joi')
const failWith = require('../../utils/validation')
const view = 'standard-rule/standard-rule-select.view.njk'

const { load } = require('../../utils/reference')

async function getPageHeading (request) {
  const { permitCategory } = await Application.get(request)
  const { label = '' } = load('permit-category').find(({ id }) => id === permitCategory) || {}
  return `Select a ${label.toLowerCase()} permit`
}

async function getReference (request) {
  const { permitType, permitCategory } = await Application.get(request)
  return load(`${permitType}/${permitCategory}`)
}

async function getValue (request) {
  const { standardRule } = await Application.get(request)
  const reference = await getReference(request)

  const items = reference.map(({ id, ref, label, hint }) => {
    return {
      value: id,
      html: `<b>${ref}</b> ${label}`,
      hint: hint ? { text: hint } : undefined,
      checked: standardRule !== undefined && standardRule === id
    }
  })
  return {
    standardRule,
    items
  }
}

module.exports = [
  {
    method: 'GET',
    handler: async function (request, h) {
      const viewData = {
        pageHeading: await getPageHeading(request),
        value: await getValue(request)
      }

      return h.view(view, viewData)
    }
  }, {
    method: 'POST',
    handler: async function (request, h) {
      const { standardRule } = request.payload
      const reference = await getReference(request)
      const isOnline = reference.find(({ id, online }) => id === standardRule && online) ? 'yes' : 'no'
      setQueryData(request, { isOnline })
      await Application.update(request, { standardRule })

      return h.continue
    },
    options: {
      validate: {
        payload: Joi.object({
          standardRule: Joi.string().trim().required()
        }),
        failAction: failWith(view,
          { pageHeading: getPageHeading, value: getValue }, {
            standardRule: {
              'any.required': 'Select a permit'
            }
          })
      }
    }
  }]
