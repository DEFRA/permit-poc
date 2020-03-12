
const cookieOptions = {
  isSecure: false,
  password: 'cookie password cookie password cookie password cookie password cookie password ',
  isHttpOnly: true,
  clearInvalid: true,
  strictHeader: true
}

module.exports = {
  plugin: require('@hapi/crumb'),
  options: {
    cookieOptions,
    key: 'DefraCsrfToken',
    autoGenerate: true,
    logUnauthorized: true
  }
}
