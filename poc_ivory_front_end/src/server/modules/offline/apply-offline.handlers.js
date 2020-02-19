const Application = require('../../dao/application')

class ApplyOfflineHandlers extends require('defra-hapi-handlers') {
  async getItem (request) {
    const { facilityType, permitCategory, standardRule } = await Application.get(request)

    if (standardRule) {
      const reference = require(`../../reference/standard-rules/${permitCategory}`)
      return reference.items.find(({ id }) => id === standardRule)
    } else if (permitCategory) {
      const reference = require('../../reference/permit-category')
      return reference.items.find(({ id }) => id === permitCategory)
    } else if (facilityType) {
      const reference = require('../../reference/facility-types')
      return reference.items.find(({ id }) => id === facilityType)
    }
  }

  async getPageHeading (request) {
    const { label, ref } = await this.getItem(request)
    return `Apply for ${label.toLowerCase()} permits${ref ? ` - ${ref}` : ''}`
  }

  async getRoutePath (routeId) {
    const route = await this.getFlowNode(routeId)
    return route.path
  }

  async getChangePath (request) {
    const { facilityType, permitCategory, standardRule } = await Application.get(request)
    if (standardRule) {
      return this.getRoutePath('standard-rule')
    } else if (permitCategory) {
      return this.getRoutePath('permit-category')
    } else if (facilityType) {
      return this.getRoutePath('facility-type')
    }
  }

  async getViewData (request) {
    const { label, guidence = '' } = await this.getItem(request)
    return { label, guidence, changeSelectionLink: await this.getChangePath(request) }
  }
}

module.exports = ApplyOfflineHandlers
