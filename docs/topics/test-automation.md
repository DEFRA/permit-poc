# Test Automation


- [Current Issues](#current-issues)
- [Approaches to Try](#approaches-to-try)
- [Demo Proposal](#demo-proposal)

## Current Issues

The bulk of the functional UI testing is performed manually. This
works fine assuming that the number of screens is easily mapped in
test-scripts. However the number of screens we typically have in an
application process make this cumbersome and inappropriate for this
approach.

We have previously used Selenium, however the efficacy of this
system broke down as the rate of change and ratio of tests to
features became unmanageable. Also performance the coupling between
services, test infrastructure and inability to run locally made
maintenance and development unmanageable.

## Approaches to Try

- Containerised testing environments
  Running test drivers inside docker containers, mocking external
  dependencies in further containers should make the maintainance
  and performance issues easier to manage
- Investigate selenium alternatives
  Selenium has various constraints (described in links below) that
  could be alleviated using other tools, however this may have
  undesired negative implications in terms of in-house skills
- By describing the rest of the application in a _configuration
  driven_ manner, we may be able to automate the generation of tests,
  freeing up the test resource to focus on more nuanced
  areas
- tighter control of "test pyramid" (unifying test tooling and
  making the progression of UI tests [the peak] down to data or
  unit-tests [the base] more clearly defined and easier to report upon)

Links:
- Selenium in Docker
  - [Setting up an on-demand Selenium Grid with containers](https://techblog.dotdash.com/setting-up-a-selenium-grid-with-docker-containers-for-running-automation-tests-c43aceccd5d9)
  - [Official Docker Images](https://hub.docker.com/u/selenium/)
  - [Webdriver Containers](https://www.testcontainers.org/modules/webdriver_containers/)
  - [Docker Compose Example](https://github.com/SeleniumHQ/docker-selenium)
  - [Docker Compose Getting Started](https://github.com/SeleniumHQ/docker-selenium/wiki/Getting-Started-with-Docker-Compose)
- Cypress
  - [Cypress](https://www.cypress.io)
  - [Cypress vs Selenium](https://automationrhapsody.com/cypress-vs-selenium-end-era/)
  - [Cypress in Docker](https://docs.cypress.io/examples/examples/docker.html)
  - [Cypress Docker Compose CI Example](https://github.com/cypress-io/cypress-example-docker-compose)
    Could be run from
    - [Circle CI](https://circleci.com/docs/2.0/docker-compose/)
    - [Travis CI](https://docs.travis-ci.com/user/docker/#using-docker-compose)
  - [Cypress UI from Docker Example](https://github.com/bahmutov/cypress-open-from-docker-compose)
- [Server Spec](https://www.cypress.io/how-it-works)

## Demo Proposal

Discussion inside the team and with the wider dev and testing
community have come to the following consensus:

Cypress is worth investigating as it has:
  - tighter integration with current tooling (JS, docker);
  - should take some of the burden off QA and allow developers to
    "own" more of the test flow;
  - gives us an options to run the "test pyramid" using one tool.

We aim to create a containerised demo which can:

- run unit tests
- run a local integration test
- run an automated UI test

This should give us a better idea of the work flow and allow us to
demonstrate its functionality to the rest of the team.
