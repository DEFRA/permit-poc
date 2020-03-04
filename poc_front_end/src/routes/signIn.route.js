module.exports = {
  method: 'GET',
  path: '/sign-in',
  handler: (request, h) => {
    return `<H1 id="hello-world">Hello World from ${process.env.HOST_NAME}!</H1>
    <p>Fake a sign in via IDM <a href="${process.env.IDM_HOST}?redirect_path=${request.url.origin}/redirect_path">here...</a></p>
    `
  }
}
