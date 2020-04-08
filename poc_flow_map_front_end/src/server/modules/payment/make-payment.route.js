const Application = require('../../dao/application')
const { utils, Payment: PaymentAPI } = require('defra-hapi-utils')
const { setQueryData, getNextRoute } = require('hapi-govuk-journey-map')
const { PAYMENT_KEY, PAYMENT_URL, SERVICE_NAME, SERVICE_URL } = process.env

const amount = 1

const pageTitle = 'Make Payment'

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    const paymentEnabled = Boolean(PAYMENT_KEY && PAYMENT_URL)
    setQueryData(request, { paymentEnabled })

    if (paymentEnabled) {
      return h.view('form-layout.njk', {
        showTitle: true,
        pageTitle
      })
    }

    return h.continue
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    const { payment = {} } = await Application.get(request)
    const { reference = utils.uuid() } = payment
    const serviceName = SERVICE_NAME
    const serviceUrl = SERVICE_URL || request.headers.origin
    const nextRoute = getNextRoute(request)
    const paymentApi = new PaymentAPI({
      paymentsUrl: PAYMENT_URL,
      apiKey: PAYMENT_KEY,
      amount, // in pence
      reference,
      description: serviceName,
      returnUrl: `${serviceUrl}${nextRoute.path.replace('{reference}', reference)}`
    })

    const result = await paymentApi.requestPayment()
    const status = utils.getNestedVal(result, 'state.status')
    if (status === 'created') {
      const { amount, description, reference, payment_id: paymentId, payment_provider: paymentProvider, created_date: createdDate } = result
      const payment = {
        amount,
        description,
        reference,
        paymentId,
        paymentProvider,
        status,
        createdDate
      }
      await Application.update(request, { payment })
      return h.redirect(result._links.next_url.href)
    }
    return h.continue
  }
}]
