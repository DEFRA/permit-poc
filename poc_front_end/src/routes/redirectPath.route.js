module.exports = {
  method: 'GET',
  path: '/redirect_path',
  handler: (request, h) => {
    return `
      <h1>You just came back from IDM (mock)</h1>
      <pre>
${JSON.stringify(request.query, ' ', 2)}
      </pre>
    `
  }
}