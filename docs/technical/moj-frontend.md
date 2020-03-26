# MOJ Frontend

- [Overview](#overview)
- [Installation](#installation)
- [Using components](#using-components)
- [Multi file upload component](#multi-file-upload-component)

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

The final step is to import the assets and essential Javascript. This cannot be
done by adding the module directory to `assetDirectories` in
`src/server/plugins/frontend.js` as Hapi does not allow these directories to
contain special characters such as `@`. Instead, a couple of lines need to be
added to `bin/build.sh` to copy the assets:
```bash
cp -r ./node_modules/@ministryofjustice/frontend/moj/assets public/static
mkdir -p public/static/moj && cp ./node_modules/@ministryofjustice/frontend/moj/all.js public/static/moj
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
## Multi file upload component

The [multi file upload component](https://moj-design-system.herokuapp.com/components/multi-file-upload)
allows multiple files to be uploaded without leaving the page, either by selecting
them one at a time from a file chooser or dragging and dropping them.

There is currently very little documentation on setting this up. Details of the
steps taken to get it running are as follows:

### Adding required Javascript

The component page provides some Javascript that should be added to the page:

```js
if(typeof MOJFrontend.MultiFileUpload !== 'undefined') {
  new MOJFrontend.MultiFileUpload({
    container: $('.moj-multi-file-upload'),
    uploadUrl: '/ajax-upload-url',
    deleteUrl: '/ajax-delete-url'
  });
}
```

MOJ Java

It is also necessary to include [jQuery](https://jquery.com/) in the page. For
the purposes of the POC I added it from the [official jQuery CDN](https://code.jquery.com/).
In production there is likely to be a better way of including it (eg. installing
the jQuery package and putting the file into the assets folder at buildtime).
```html
<script
  src="https://code.jquery.com/jquery-3.4.1.min.js"
  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  crossorigin="anonymous"></script>
```

### AJAX endpoints

File uploading and deletion are performed using AJAX. `uploadUrl` and `deleteUrl`
in the require Javascript above point to the required endpoints. The exact details of
how the server should respond aren't yet included in the official documentation
so I've included my notes on it.

#### Upload

The upload endpoint should return a response in the following format:

```json
{
  "file":{
    "originalname":"testfile.pdf",
    "filename":"c10a4be009334e6f4cf9d26371d61be9",
  },
  "success":{
    "messageHtml":"<a href=\"public/uploads/c10a4be009334e6f4cf9d26371d61be9\" class=\"govuk-link\"> testfile.pdf</a> has been uploaded",
    "messageText":"testfile.pdf has been uploaded"
  },
  "error":{
    "message":"testfile.pdf is too big"
  }
}
```

`file.originalname`: The name of the uploaded file, which is needed for
accessibility purposes (there is hidden text that makes use of this).

`file.filename`: A reference to the remote file. It is mainly used as a reference
when sending a delete request.

`success.messageHtml`: How the file will be represented in the file list. HTML
formatting can be included; for example, to link to the uploaded file.

`success.messageText`: This is a plaintext representation of the success message.
As far as I can tell, it is needed for accessibility purposes.

`error.message`: A plaintext error message if uploading fails. This will be
displayed in the file list as well as set for accessibility purposes.

Only one of `success` or `error` should be returned, depending on the outcome of
uploading.

#### Delete

The delete endpoint should expect a POST request with `delete` in the payload. This
will be the file reference returned as `file.filename` by the upload path. If
deletion is successful it should return an empty object. If not it should return
an error response:
```json
{
  "error": "File could not be deleted"
}
```
Note that at present, the component does nothing with the actual error message
that is returned; it just checks the response for an `error` key and removes the
file from the file list if `error` isn't present.
