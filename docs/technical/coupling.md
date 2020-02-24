# Coupling

Part of this POC is to "decouple" the nodeJS services from the
Dynamics services. The two sets of services will still need to be
in communication. A better description is to move to a less tightly
coupled and more loosely integrated architecture.

Currently there is a tight coupling, meaning that the front end
does not control any of its required data and relies on the
back-end to feed it configuration (what to display, which order to
present information etc...) and store the resulting data. This is
cumbersome as there is no formal specification of the data being
exchanged and no warning if the two become out of sync. Also there
is no way to send a complete application between the systems, only
build one up piecemeal.

This poc aims to reduce the number if transfers to one per
application. The exchange format and compatibility defined in a
common format: [JSON Schema](https://json-schema.org/)

This way APIs and validation can be formally described, agreed and
tested.

As an illustration, a "hello world" message is defined as a
[JSON-Schema Draft 7](../../data_transfer/src/hello.schema.json)

We can use this to run validation and as a contract between this
and down-stream services. See (app.js)[data_transfer/src/app.js]
