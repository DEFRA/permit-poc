const Application = require('../../dao/application')
const Joi = require('@hapi/joi')

class AddressManualHandlers extends require('defra-hapi-handlers') {
  get maxAddressLineLength () {
    return 100
  }

  get maxPostcodeLength () {
    return 8
  }

  get schema () {
    return Joi.object({
      'business-name': Joi.string().allow('').trim().max(this.maxAddressLineLength),
      'address-line-1': Joi.string().trim().max(this.maxAddressLineLength).required(),
      'address-line-2': Joi.string().allow('').trim().max(this.maxAddressLineLength),
      'address-town': Joi.string().trim().max(this.maxAddressLineLength).required(),
      'address-county': Joi.string().allow('').trim().max(this.maxAddressLineLength),
      'address-postcode': Joi.string().trim().uppercase().max(this.maxPostcodeLength).regex(/^[a-z0-9\s]+$/i).required()
    })
  }

  errorMessagesFor (fieldDescription, maxLength = this.maxAddressLineLength) {
    return {
      'string.empty': `Enter ${fieldDescription.toLowerCase()}`,
      'any.required': `Enter ${fieldDescription.toLowerCase()}`,
      'string.regex.base': `${fieldDescription.toLowerCase()} must be valid`,
      'string.max': `${fieldDescription} must be ${maxLength} characters or fewer`
    }
  }

  get errorMessages () {
    return {
      'business-name': this.errorMessagesFor('Business name'),
      'address-line-1': this.errorMessagesFor('Building and street'),
      'address-line-2': this.errorMessagesFor('Second address line'),
      'address-town': this.errorMessagesFor('Town or city'),
      'address-county': this.errorMessagesFor('County'),
      'address-postcode': this.errorMessagesFor('Postcode', this.maxPostcodeLength)
    }
  }

  // Overrides parent class handleGet
  async handleGet (request, h, errors) {
    const { address = {} } = await Application.get(request)
    // Merge view data

    this.viewData = {
      'business-name': address.businessName,
      'address-line-1': address.addressLine1,
      'address-line-2': address.addressLine2,
      'address-town': address.town,
      'address-county': address.county,
      'address-postcode': address.postcode
    }

    return super.handleGet(request, h, errors)
  }

  // Overrides parent class handlePost
  async handlePost (request, h) {
    const { address = {} } = await Application.get(request)
    const {
      'business-name': businessName,
      'address-line-1': addressLine1,
      'address-line-2': addressLine2,
      'address-town': town,
      'address-county': county,
      'address-postcode': postcode
    } = request.payload

    Object.assign(address, { businessName, addressLine1, addressLine2, town, county, postcode })

    await Application.update(request, { address })

    return super.handlePost(request, h)
  }
}

module.exports = AddressManualHandlers
