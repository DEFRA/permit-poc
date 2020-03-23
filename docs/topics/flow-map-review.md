# Flow Map Review

The following review was written 23-03-2020.

- [Overview](#overview)
- [Documentation and Commenting](#documentation-and-commenting)
- [Comparison to existing system](#comparison-to-existing-system)
- [Plug-in Architecture](#plug-in-architecture)
- [Declarative Flow](declarative-flow)
- [Conclusion](#conclusion)
- [Recomended Actions](recommended-actions)

## Overview

As the POC has progressed the `poc_flow_map_front_end` demo has
become the most fully featured implementation of some of the ideas
discussed as ways to improve development work-flow and improve
collaboration between UI/UX team members and engineers.

Working on the infrastructure and tooling, with little
exposure to the code base (and having a familiarity with the
problem-space and previous system) I trialled working with this
implementation and made the following notes based on the experience.


## Documentation and Commenting

For a POC, there are some well written [documents to describe the
"flow engine"](../technical/journey-flow.md) (the mechanism for
describing how one screen leads to
the next).

For the rest of the system engineers rely on the code itself as
there is very little to describe:

- the overarching concepts and inspiration behind the design;
- the problems that the design aims to address;
- conventions and coding guidelines;
- areas to develop further and other aims.

These would be very useful for anyone unfamiliar with the system or
for potential collaborators or reviewers.

However, this is a POC. These concerns would become relevant should
this code be brought into a production system.

## Comparison to existing system

As the code-base is a lot smaller it is possible to get to grips
with its structure and approach more easily. Many of the concerns
of the existing system are addressed and it appears that the
majority of the work could be achieved using this as a platform.


The design is consistent and I would expect to be more productive
with these tools for the day-to-day tasks.

It is hard to assess how adaptable the code-base would be as the
project ages and grows. As it doesn't use many existing tools or
standards, there would not a community to draw upon or refer to,
so it would be important to factor this in to any future
maintenance and team member turnover.


## Plug-in Architecture

In an effort to make the code-base more modular some of the
components have been broken out into their own plug-ins. This is in
keeping with the [Hapi](https://hapi.dev/) design philosophy.

There are pros and cons to this. It does ensure there is a looser
coupling between components in a well understood style but does
increase the overhead for:

- build tooling;
- mental context switching (moving between repositories);
- maintenance (the team would need to own the life-cycle for the
components too).

However, this is a big step in the direction of making code
reusable across teams and projects. It would be _very_ helpful for
multiple teams to share ownership and contribute. Building a
community around these tools would be a valuable next step.

To move this initiative forward wider code review from other teams
would be recommended. It is unclear how much buy in there will be.
Assessing the appetite and capacity for this is a logical next step.

## Declarative Flow

This specific area is concerned with enabling non engineers to be
able to:

- understand the steps taken by users to complete an application by
  travelling from screen/form to screen;
- make alterations to the flow and know whether it was successful;
- reduce the need for a separate "prototype" application for user
  testing.

This should be reviewed by it's intended audience (product owners
and UX designers). As an engineer I found it easy to follow and
well documented. However, I did think there are other ideas left
unexplored and that we're only really scratching the surface.

While it is modular (plug-in based) I'm not sure how easily it
would be replaced once the number of screens has increased.

## Conclusion

The ideas in the POC are useful and the implementations well
executed given the time available.

It would be an improvement on current tools.

I think it has potential for wider adoption but would need some
activities to drive adoption and form a community around it.
Therefore a wider review would be useful to ascertain the appetite
for this in other teams.

If wider adoption is unlikely then I'd recommend keeping the
modularity within one code-base, for the time being.

## Recomended actions:

- code reviews from wider community, gague appetite for adoption;
- code reviews from UX team members to ascertain suitability for
  their needs;
- gague appetite to adopt within existing team.
