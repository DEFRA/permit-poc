
const yaml = require('js-yaml')
const fs = require('fs')

function load (path = '') {
  const data = yaml.safeLoad(fs.readFileSync(`${__dirname}/../reference/${path}.yaml`, 'utf8'))
  return Object.entries(data).map(([id, item]) => {
    return { ...item, id }
  })
}

function loadAll (path = '') {
  const files = fs.readdirSync(`${__dirname}/../reference/${path}`)
  return files
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => {
      const data = yaml.safeLoad(fs.readFileSync(`${__dirname}/../reference/${path}/${file}`, 'utf8'))
      return Object.entries(data).map(([id, item]) => {
        return { ...item, id, type: file.split('.yaml')[0] }
      })
    }).flat()
}

module.exports.load = load
module.exports.loadAll = loadAll
