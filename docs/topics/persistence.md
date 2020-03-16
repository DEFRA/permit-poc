# Storage and Persistence

- [Overview](#overview)
- [External and shared data](#external-and-shared-data)
- [All in one](#all-in-one)
- [Two stores](#two-stores)
- [Decisions](#decisions)


## Overview

A question for this POC to answer is: how do we store information
while the user is in the process of making an application _before_
they submit the completed result?

There are two types of information being collected:

- answers to the questions presented in each form (structured data)
- supporting documents (binary data: PDF, DOCX, PNG etc...)

The _structured data_ can be treated in a few ways, including:

- internal reference (track the application so far, decide which
  forms are appropriate based on previous answers, allow the user
  to leave and return to an application etc...)
- a representation of the completed application (or other
  information) that conforms to contracts between services (MS
  Dynamics)

Database technologies previously suggested fall into two categories:

- relational (PostgreSQL)
- document oriented (MongoDB)

Each have their strengths and weaknesses, both are well supported
(in fully managed form) by AWS (RDS and DocumentDB, respectively).

The _binary data_ will not be examined by the application process
beyond: security and size scans. This data is for use in the
permitting process and beyond the scope of this service.

Considerations:
- tools must be easily managed in AWS (fully managed)
- tools must be easily replicated in dev and test environments

There are two approaches under consideration so far:

### External and shared data


There will also be data that is relevant to applications pre and
post submission (user IDs from IDM or waste-codes, for example).

As these represent dependencies that would be shared between
services (and would be a point of failure should one service make a
change not reflected in the other) we are thinking of storing these
in git repositories (to make a crude API using json schema and pull
requests to act as a review process), these could later be replaced
with more fully featured services.

Using git repos would allow two teams to share information _and_
ownership, with minimal process and additional infrastructure.

## All in one

Ideally, this service will be composed of as few dependencies as
possible. In this spirit storing all the data using one method
could be useful.

However, while it is possible to store binary/file data in MongoDB
(via [GridFS](https://docs.mongodb.com/manual/core/gridfs/)),
currently AWS's implementations does not include this feature.

There are equivalents for PostgreSQL but again these are not
supported or [recommended](https://wiki.postgresql.org/wiki/BinaryFilesInDB).


In both cases the recommended method for storing binary data for
easy access in AWS is [S3](https://aws.amazon.com/s3/)

As we are using JSON Schema to define our API contracts we could
use S3 to store the application data.

## Two Stores

As these are two distinct classes of data we could use:

- AWS S3 for binary data
- DocumentDB or RDS for structured data

As we are working with JSON documents DocumentDB would be a good fit.

Managing two data stores would add complexity to a few areas:

- application logic
- infrastructure (dev, test, prod)
- maintenance and management (test data, version control etc...)

## Decisions

- 12/03/2020 for this POC, the main aim is to answer questions
  around the internal structure of our service and development
  process. As the data volume requirements are low and we have
  strongly defined interfaces (JSON Schemas) between processes and
  services using AWS S3 seems like a good-enough minimum viable
  dependency.
    - can mock it locally with this [tool from
      Adobe](https://github.com/adobe/S3Mock)
    - all schema definitions can be managed in one place

