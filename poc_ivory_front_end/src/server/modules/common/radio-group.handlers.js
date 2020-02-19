const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')

class RadioGroupHandlers extends require('defra-hapi-handlers') {
  get Model () {
    return Boom.badImplementation('Model')
  }

  get fieldname () {
    return this.reference.id
  }

  get propName () {
    return Boom.badImplementation('propName')
  }

  get schema () {
    const { fieldname } = this
    return Joi.object({
      [fieldname]: Joi.string().required()
    })
  }

  get selectError () {
    return 'An option must be selected'
  }

  get errorMessages () {
    const { fieldname, selectError } = this
    return {
      [fieldname]: {
        'any.required': selectError
      }
    }
  }

  buildViewItem ({ id, label, hint, value }) {
    return {
      value: id,
      text: label,
      hint: hint && { text: hint },
      checked: value !== undefined && id === value
    }
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { Model, reference, propName } = this

    const model = await Model.get(request)
    const value = model[propName]

    // Note reference could be a getter or an async function
    const { items = [], hint } = typeof reference === 'function' ? (await reference(request)) : reference

    // Merge view data
    this.viewData = {
      hint: hint,
      items: items.map((item) => this.buildViewItem({ ...item, value }))
    }

    return super.handleGet(request, h, errors)
  }

  // Overrides parent class handlePost
  async handlePost (request, h) {
    const { Model, fieldname, propName } = this
    await Model.update(request, { [propName]: request.payload[fieldname] })
    return super.handlePost(request, h)
  }

  async selectedValue (request) {
    const { Model, propName } = this
    const model = await Model.get(request)
    return model[propName]
  }
}

module.exports = RadioGroupHandlers
