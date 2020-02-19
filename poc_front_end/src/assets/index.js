module.exports = [{
  method: 'GET',
  path: '/assets/govuk-frontend.js',
  handler: {
    file: 'node_modules/govuk-frontend/govuk/all.js'
  }
}, {
  method: 'GET',
  path: '/assets/govuk-frontend.css',
  handler: {
    file: 'src/assets/govuk-frontend-3.5.0.min.css'
  }
}, {
  method: 'GET',
  path: '/assets/govuk-frontend-ie8.css',
  handler: {
    file: 'src/assets/govuk-frontend-ie8-3.5.0.min.css'
  }
}, {
  method: 'GET',
  path: '/assets/{path*}',
  handler: {
    directory: {
      path: ['node_modules/govuk-frontend/govuk/assets']
    }
  }
}]
