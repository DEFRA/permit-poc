# Journey Flow

- [Overview](#overview)
- [Journey Map configuration](#journey-map-configuration)
    - [Mapping](#mapping)
    - [File structure](#file-structure)
    - [Branching](#branching)

## Overview

Part of this POC is to make it easier to visualise, create and maintain journeys through the 
pages within the client facing front end.

This can be achieved by placing reusable journeys into modules each containing a set of pages or
routes that when combined make a self contained reusable journey.
Examples of such modules would be an address module, a contact module and a file upload module.

A way of configuring the journey within the module and connections between modules is with mapping files.
Within the POC, [YAML](https://yaml.org/start.html) was used to describe the journey configuration within
each mapping file.

## Journey Map configuration

The best way to describe this is with an example:

### Mapping
Please note that each of the entries within the following files ultimately generate routes within a hapi service.

Example mapping files for a simple journey:
- Root map:
```yaml
--- # Root map 

home:
  path: "/"
  route: home.route
  next: applicant

applicant:
  path: "/applicant"
  module: contact
  next: complete

complete:
  path: "/complete"
  route: complete.route
```
- Contact map:
```yaml
--- # Contact map

name:
  path: "/name"
  route: contact-name.route
  next: address

address:
  path: "/address"
  module: address
  next: email

email:
  path: "/email"
  route: contact-email.route
  next: return
``` 
- Address map:
```yaml
--- # Address map

search:
  path: "/search"
  route: address-search.route
  next: select
  
select:
  path: "/select"
  route: address-select.route
  next: entry

entry:
  path: "/entry"
  route: address-entry.route
  next: return
```

The idea is that the navigation through the routes (pages) starts in the root map and flows
between the routes via the next property.  When the module property is set, the flow moves
to the start of that modules map and flows through that map.  When a next property within that map is set
to return, the flow returns to the previous map and continues.

As I have included no [branching](#branching) in the above map, I would expect the paths (pages) to be traversed in the following order:
```text
- /
- /applicant/name
- /applicant/address/search
- /applicant/address/select
- /applicant/address/select
- /applicant/email
- /complete
```
Note that the paths are generated with the parent module path prefixing the current path in each module's map

### File structure
The file structure in the project for these modules would be as follows:
```text
.
+-- modules
|   +-- complete.route.js
|   +-- home.route.js
|   +-- map.yml
|   +-- address
|   |   +--address.map.yaml
|   |   +--address-entry.view.njk
|   |   +--address-entry.route.js
|   |   +--address-search.view.njk
|   |   +--address-search.route.js
|   |   +--address-select.view.njk
|   |   +--address-select.route.js
|   +-- contact
|   |   +--contact.map.yaml
|   |   +--contact-email.view.njk
|   |   +--contact-email.route.js
|   |   +--contact-name.view.njk
|   |   +--contact-name.route.js

```

The following is an example of a route file.  I have chosen "contact-name.route.js" for this purpose.
Please note that in the following example "Application" is used to persist the contact name:

```js
const Application = require('../../dao/application')
const view = 'contact/contact-name.view.njk'
const pageHeading = 'Please enter your name'

module.exports = [{
  method: 'GET',
  handler: async function (request, h) {
    const { contact = {} } = await Application.get(request)
    return h.view(view, {
      pageHeading,
      value: contact.name
    })
  }
}, {
  method: 'POST',
  handler: async function (request, h) {
    const { contact = {} } = await Application.get(request)
    const { name = '' }  = request.payload
    contact.name = name
    await Application.update(request, { contact })
    return h.continue
  }
}]
```

###Branching
In order to allow branching, it's necessary to allow a query to be asked
with a set of alternative routes to go to based on the result of that query.

```yaml
--- # Address map

manual-check:
  path: "/manual-check"
  route: address-manual-check
  next:
    query: postcodeLookUpEnabled
    when:
      yes: search
      no: entry

search:
  path: "/search"
  route: address-search.route
  next: select
  
select:
  path: "/select"
  route: address-select.route
  next: entry

entry:
  path: "/entry"
  route: address-entry.route
  next: return
```
In the above map, the value of "postcodeLookUpEnabled" (please notes that you can call this 
query whatever you like) is used to determine the branching.

In the above case a value of "yes" would branch to "search" where as "no" would skip both
"search" and "select" and jump straight to "entry"

In order to make this work the "postcodeLookUpEnabled" value needs to be set to "yes" or "no" within the route file.
This can be done using the "setQueryData" method.

Please see the extract of a route file below as an example:

```js
.
.
const { setQueryData } = require('hapi-govuk-journey-flow')
.
.
}, {
  method: 'POST',
  handler: async function (request, h) {
    if (process.env.POSTCODE_LOOKUP_ENABLED) {
      setQueryData(request, { postcodeLookUPEnabled: 'yes'})    
    } else {
      setQueryData(request, { postcodeLookUPEnabled: 'no'})    
    } 
    return h.continue
  }
}
.
.
.
```




