const Cache = require('../utils/cache')
const Boom = require('@hapi/boom')
const Hoek = require('@hapi/hoek')
const { logger } = require('defra-logging-facade')
const yaml = require('js-yaml')
const fs = require('fs')

// Initialised and will be built up later
const routeMap = {}

function getModule (module = '') {
  const map = module ? `${module}/${module}.map.yml` : 'map.yml'
  return yaml.safeLoad(fs.readFileSync(`${__dirname}/../modules/${map}`, 'utf8'))
}

function getCurrent (request) {
  const { id } = request.route.settings.app
  return { ...routeMap[id], id }
}

function setQueryData (request, data) {
  return Cache.update(request, 'QueryData', { ...data })
}

function getQueryData (request) {
  return Cache.get(request, 'QueryData')
}

function registerRoutes (server, map, options = {}) {
  return Object.entries(map).map(([id, { path, route }]) => {
    try {
      // retrieve the app object from options
      const { app = {} } = options
      // add the id of the route to app in route options so that it can be used to identify the route in the function getCurrent defined above
      options = { ...options, app: { ...app, id } }
      // merge the required route definition with the path and options
      const methods = []
      let config = require(`../modules/${route}`)
      if (!Array.isArray(config)) {
        config = [config]
      }
      config
        .flat()
        .map((config) => {
          methods.push(config.method)
          config = { ...config, path }
          Hoek.merge(config, { options })
          return config
        })
        .forEach((config) => {
          try {
            server.route(config)
          } catch (e) {
            logger.error(`Route "${id}" with path "${path}" failed to be registered`)
            logger.error(e)
          }
        })
      // Make a note of the methods on this route
      map[id].method = methods.flat()
    } catch (e) {
      logger.error(e.message)
    }
  })
}

function loadMap (parentModule = '', parentConfig = {}) {
  const {
    id: parentId = '',
    path: parentPath = '',
    moduleId
  } = parentConfig

  return Object.entries(getModule(parentModule)).map(([id, options]) => {
    let {
      path,
      route,
      next,
      module
    } = options

    id = parentId ? `${parentId}-${id}` : id
    route = parentModule ? `${parentModule}/${route}` : route
    path = parentPath + path

    if (next) {
      const buildNext = (next) => {
        if (next.query) {
          Object.entries(next.when).map(([prop, val]) => {
            next.when[prop] = buildNext(val)
          })
          return next
        } else if (next === 'return') {
          /** returns back to calling module **/
          return parentConfig.next
        } else {
          return moduleId ? `${moduleId}-${next}` : next
        }
      }
      next = buildNext(next)
    }

    const config = { ...options, id, path, next, route }
    if (module) {
      return loadMap(module, { ...config, moduleId: id, module })
    }
    return config
  }).flat()
}

async function handlePostHandler (request, h) {
  const route = getCurrent(request)
  const { next = '', id, path } = route

  if (request.response.variety === 'view') {
    return h.continue
  }

  const getPath = (path) => {
    const params = path.match(/(?<=\{)(.*)(?=\})/g)
    if (params) {
      params.forEach((param) => {
        const data = getQueryData(request)[param]
        if (data === undefined) {
          logger.error(`Route "${id}" with path "${path}" failed to set parameter "${param}"`)
        } else {
          path = path.replace(`{${param}}`, data)
        }
      })
    }
    return path
  }

  const navigateNext = (next) => {
    if (next) {
      if (next.query) {
        const result = getQueryData(request)[next.query]
        const nextRoute = next.when[result]
        if (nextRoute) {
          return navigateNext(nextRoute)
        }
        return Boom.badImplementation(`Route "${id}" with path "${path}" set incorrect value "${result}" for query "${next.query}"`)
      }
      return h.redirect(getPath(routeMap[next].path))
    }
    return h.continue
  }

  return navigateNext(next)
}

function fixMapNav (config) {
  Object.entries(config).forEach(([id, item]) => {
    const fixNext = (next) => {
      if (config[next]) {
        return next
      }
      return Object.keys(config).find((id) => id.startsWith(next + '-')) || next
    }
    const { next } = item
    if (next) {
      if (next.query) {
        Object.entries(next.when).map(([prop, val]) => {
          next.when[prop] = fixNext(val)
        })
        config[id].next = next
      } else {
        config[id].next = fixNext(item.next)
      }
    }
  })
  return config
}

// convert an array of routes into an object where the key for each route is the route id
function buildMap () {
  const map = loadMap().reduce((map, route) => {
    return { ...map, [route.id]: route }
  }, {})
  // Now fix any "next" values pointing to a module so that they point to the first route in the module map
  return fixMapNav(map)
}

// Expose plugin
module.exports = {
  plugin: {
    name: 'route-flow',
    register: (server) => {
      Object.assign(routeMap, buildMap())
      registerRoutes(server, routeMap, {})
      server.ext('onPostHandler', handlePostHandler)
    }
  }
}

// Expose useful functions
module.exports.setQueryData = setQueryData
module.exports.getQueryData = getQueryData
module.exports.getCurrent = getCurrent
