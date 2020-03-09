# Coupling

- [Overview](#overview)
- [JSON Schema Specifics](#json-schema-specifics)

## Overview

Part of this POC is to "decouple" the nodeJS services from the
Dynamics services. The two sets of services will still need to be
in communication. A better description is to move to a less tightly
coupled and more loosely integrated architecture.

Currently there is a tight coupling, meaning that the "front-end"
does not control any of its required data and relies on the
"back-end" to feed it configuration (what to display, which order to
present information etc...) and store the resulting data. This is
cumbersome as there is no formal specification of the data being
exchanged and no warning if the two become out of sync. Also there
is no way to send a complete application between the systems, only
build one up piecemeal.

This POC aims to reduce the number of transfers to one per
application. The exchange format and compatibility defined in a
common format: [JSON Schema](https://json-schema.org/)

This way APIs and validation can be formally described, agreed and
tested.

As an illustration, a "hello world" message is defined as a
[JSON-Schema Draft 7](../../data_transfer/src/hello.schema.json)

We can use this to run validation and as a contract between this
and down-stream services. See [app.js](../../data_transfer/src/app.js)

For a temporary medium for data exchange we're using
[Azure's Blob Stroage](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction)

To demonstrate run the following from this repository's root
directory:

```sh
# move data_transfer/example-env.txt to data_transfer/.env
# replace values with creds from Azure
make run_date_transfer_container
```

## JSON Schema Specifics

So far we have succesfully sent a basic "hello world" message that
can be exchaged and validated between NodeJS and MS Dynamics:

Schema:
```json
{
  "$id": "https://apply-for-environmental-permit.service.gov.uk/hello.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Hello World",
  "description": "A simple hello-world message from node to dynamics",
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "description": "A mgreeting."
    }
  }
}
```

Message:
```json
{
  "message": "hello"
}
```

The message was exchanged using an Azure Storage Blob and was sent
from a docker-container running a NodeJS application. The Node app
used the AJV Library[](https://github.com/epoberezkin/ajv), on the
Dynamics side this is picked up by a
[Logic App](https://docs.microsoft.com/en-us/azure/logic-apps/logic-apps-perform-data-operations)


Using an
[example schema from HMRC](https://github.com/hmrc/addresses/blob/master/docs/address-lookup/v2/uk-address-object.json)
we attempted to use some of the built in validation.

Schema
```json
{
  "$id": "https://apply-for-environmental-permit.service.gov.uk/hello.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Partial Application Schema",
  "description": "A simple schema describing a secion of an application",
  "type": "object",
  "properties": {
    "permitType": {
      "type": "string",
      "description": "The type of permit (standard rules or bespoke, for example"
    },
    "permitCategory": {
      "type": "string",
      "description": "The category of permit, i.e. which activity/activities the permit relates to (vehicle dismantling, for example"
    },
    "standardRule": {
      "type": "string",
      "description": "A unique identifier/code used for specific standard-rule application permits"
    },
    "address": {
      "type": "object",
      "description": "The location of a property, or business in the UK",
      "properties": {
        "addressLine1": {
          "type": "string",
          "description": "The first line of the address (number and street, for example)",
          "minLength": 1,
          "maxLength": 35
        },
        "addressLine2": {
          "type": "string",
          "description": "The second line of the address (area or district, for example)",
          "minLength": 1,
          "maxLength": 35
        },
        "town": {
          "type": "string",
          "minLength": 1,
          "maxLength": 35
        },
        "county": {
          "type": "string",
          "description": "The county (optional)",
          "minLength": 1,
          "maxLength": 35
        },
        "postcode": {
          "description": "the outcode, incode combination specified for the UK by Royal Mail",
          "type": "string",
          "pattern": "^[A-Z]{1,2}[0-9][0-9A-Z]? [0-9][A-Z]{2}$"
        }
      }
    }
  }
}
```

However the Logic App doesn't provide support for pattern matching
and rules.

For now, a reduced schema is being used, this would not be
appropriate as a final contract. Ideally we will use the
[Open API](https://swagger.io) compatible sub-set of
[Open API JSON Schema Compatible KeyWords](https://swagger.io/docs/specification/data-models/keywords/)

For now (09/03/2020) we are using the simplest option (but would
need to go further to make it compatible with Open API standards.

```json
{
  "$id": "https://apply-for-environmental-permit.service.gov.uk/hello.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Partial Application Schema",
  "description": "A simple schema describing a secion of an application",
  "type": "object",
  "properties": {
    "permitType": {
      "type": "string",
      "description": "The type of permit (standard rules or bespoke, for example"
    },
    "permitCategory": {
      "type": "string",
      "description": "The category of permit, i.e. which activity/activities the permit relates to (vehicle dismantling, for example"
    },
    "standardRule": {
      "type": "string",
      "description": "A unique identifier/code used for specific standard-rule application permits"
    },
    "address": {
      "type": "object",
      "description": "The location of a property, or business in the UK",
      "properties": {
        "addressLine1": {
          "type": "string",
          "description": "The first line of the address (number and street, for example)"
        },
        "addressLine2": {
          "type": "string",
          "description": "The second line of the address (area or district, for example)"
        },
        "town": {
          "type": "string",
          "description": "Name of UK town/city"
        },
        "county": {
          "type": "string",
          "description": "The county (optional)"
        },
        "postcode": {
          "description": "the outcode, incode combination specified for the UK by Royal Mail",
          "type": "string"
        }
      }
    }
  }
}
```

The data:
```json
{
  "permitType": "standard-rules",
  "permitCategory": "vehicle-dismantling",
  "standardRule": "sr2015-no-13",
  "address": {
    "addressLine1": "Site Rd",
    "addressLine2": "",
    "town": "Bristol",
    "county": "",
    "postcode": "BS1 5AH"
  }
}
```
