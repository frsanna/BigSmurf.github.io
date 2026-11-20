# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers and prospective clients read the same page. They need to understand who Francesco Sanna is, then download the CV or write to him.

## Product Purpose

A single public page and a PDF curriculum for Francesco Sanna, Engineering Manager and Technical Lead in Cagliari. Success is a CV download or a message.

## Positioning

He leads and he still builds: the technical voice with the client, from the first estimate through architecture and delivery. A neighboring profile that only manages, or only codes, could not make that claim.

## Operating Context

One English page. The PDF is generated from the same source as the page. Readers arrive from search, a direct link, or LinkedIn, often on a laptop, and decide quickly.

## Capabilities and Constraints

Static site built from `src/content/profile.json` (Node, no framework), served as HTML. Sections may change shape and rhythm. Facts, the portrait, and the PDF content stay. Do not add engagements, metrics, client names, or team-size claims that are not in the source. Copy stays English. Primary actions: download the CV, get in touch.

## Brand Commitments

The name is Francesco Sanna. The voice is first person, plain, and specific. The portrait is a real photograph. Contact is job@francescosanna.eu and the existing LinkedIn profile. Location is Cagliari, Italy. He is open to remote work, relocation, or regular travel.

## Evidence on Hand

- `src/content/profile.json` is the only source of biography, roles, projects, skills, and education.
- Portrait and `resources/curriculum.pdf` ship with the site.
- There are no named client case studies and no figures beyond the three facts already in the hero. Do not invent them.

## Product Principles

- One page serves a hiring reader and a client.
- Every claim comes from the profile source, and the PDF stays aligned with it.
- The photograph and the work history are the proof.
- The page ends in a way to write or to take the CV.
