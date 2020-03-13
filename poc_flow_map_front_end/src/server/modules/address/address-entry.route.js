const Application = require('../../dao/application')
const Joi = require('@hapi/joi')
const failWith = require('../../utils/validation')

const schema = Joi.object({
  addressLine1: Joi.string().trim().required(),
  addressLine2: Joi.string().allow('').trim(),
  town: Joi.string().trim().required(),
  county: Joi.string().allow('').trim(),
  postcode: Joi.string().trim().uppercase().max(8).regex(/^[a-z0-9\s]+$/i).required()
})

const errors = {
  addressLine1: { 'string.empty': 'The building and street must be entered' },
  town: { 'string.empty': 'The town or city must be entered' },
  postcode: { 'string.empty': 'The postcode must be entered' }
}

const GET = {
  method: 'GET',
  handler: async function (request, h) {
    const { address = {} } = await Application.get(request)
    return h.view('address/address-entry.njk', { value: address })
  }
}

const POST = {
  method: 'POST',
  handler: async function (request, h) {
    const address = request.payload
    await Application.update(request, { address })
    return h.continue
  },
  options: {
    validate: {
      payload: schema,
      failAction: failWith('address/address-entry.njk', errors)
    }
  }
}

module.exports = [GET, POST]
