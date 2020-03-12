# MOJ Frontend

- [Overview](#overview)
- [Installation](#installation)
- [Using components](#using-components)

## Overview

The MOJ Design System [(homepage)](https://moj-design-system.herokuapp.com/get-started)
[(Github)](https://github.com/ministryofjustice/moj-frontend/)
contains a number of components which could be reused. Specifically, we wish to
use the [multi file upload](https://moj-design-system.herokuapp.com/components/multi-file-upload)
component.

## Installation

The installation procedure is broadly similar to the one on the [Github](https://github.com/ministryofjustice/moj-frontend/blob/master/docs/installation/installing-with-npm.md)
page. An additional step was needed to work around Hapi limitations. The exact steps are as follows:

Install the frontend package:
```bash
npm install @ministryofjustice/frontend
```

Import the styles by adding a line to `src/cline/sass/application.scss`:
```scss
@import "node_modules/@ministryofjustice/frontend/moj/all";
```

Add the module directory to `includePaths` in `src/server/plugins/frontend.js`:
```js
includePaths: [
  'node_modules/hapi-govuk-frontend/node_modules/govuk-frontend',
  'node_modules/@ministryofjustice/frontend'
]
```

The final step is to import the assets. This cannot be done by adding the module
directory to `assetDirectories` in `src/server/plugins/frontend.js` as Hapi
does not allow these directories to contain special characters such as `@`.
Instead, a line needs to be added to `bin/build.sh` to copy the assets:
```bash
cp -r ./node_modules/@ministryofjustice/frontend/moj/assets public/static
```

## Using components

Components can be used by adding the required Nunjucks macro to a page. To use
the example of a [banner component](https://moj-design-system.herokuapp.com/components/banner):

```Django
{%- from "moj/components/banner/macro.njk" import mojBanner -%}

{% set bannerHtml %}
<h2 class="govuk-heading-m">This service will be unavailable from 1 June 2019</h2>
{% endset %}

{{ mojBanner({
type: 'information',
html: bannerHtml
}) }} 
```

Components can be used with the [Hapi GOV.UK Question Page plugin](https://github.com/DEFRA/hapi-govuk-question-page/) if the appropriate support is added. While
testing the MOJ Design System I created [a fork of this plugin](https://github.com/StuAA78/hapi-govuk-question-page/) in order to quickly add
support myself.

I made a separate branch of the plugin to test it out before merging to master,
and installed it as follows:
```bash
npm install github:StuAA78/hapi-govuk-question-page#moj-banner
```

Once the forked plugin in installed, the component can be used like any other
question page component type:

```js
{
  type: 'MojBanner',
  bannerType: 'information',
  content: '<h2 class="govuk-heading-m">This is an MOJ Frontend component</h2>'
}
```

(Note that the `type` property in the Nunjucks macro was renamed `bannerType` to
avoid clashing with the existing `type`)

For refrence, the following steps were required to add support for the
component to the question page plugin.

Create a component class `components/mojbanner.js`:
```js
const { Component } = require('.')

class MojBanner extends Component {
  getViewModel () {
    return {
      content: this.content,
      type: this.bannerType
    }
  }
}

module.exports = MojBanner
```

Create the Nunjucks macro template `hapi-govuk-question-page/components/mojbanner.njk`:
```django
{%- from "moj/components/banner/macro.njk" import mojBanner -%}

{% macro MojBanner(component) %}
  {{ mojBanner({
    html: component.model.content,
    type: component.model.type
  }) }}
{% endmacro %}
```

Add the new component to the component list in `page.js`:
```javascript
const componentTypesList = [
  'TextField',
  'MultilineTextField',
  'CharacterCountField',
  'YesNoField',
  'DatePartsField',
  'SelectField',
  'RadiosField',
  'CheckboxesField',
  'CheckboxesWithTextField',
  'NumberField',
  'NamesField',
  'TelephoneNumberField',
  'EmailAddressField',
  'Para',
  'Html',
  'DynamicHtml',
  'InsetText',
  'Details',
  'WarningText',
  'MojBanner'
]
```
