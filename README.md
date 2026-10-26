# Abani Behera

Personal website for enterprise architecture, Agentic AI, research, and speaking. Built with AEM Edge Delivery Services and Document Authoring, using Author Kit.

## Content and code

- Author content in `https://da.live/#/g-abani/abani-dev`.
- The homepage is `index`; navigation lives at `/fragments/nav/header` and `/fragments/nav/footer`.
- `authoring/` contains launch content snapshots. They are not automatically synchronized with DA. Edit in DA, preview, and publish when ready. HTML tables represent blocks; horizontal rules separate sections.
- Website code lives in `blocks/`, `styles/`, `scripts/`, and `templates/`.
- Keep `scripts/ak.js` unchanged: it is the Author Kit engine.

## Local preview

Run `npm ci`, then `npm run preview:content` for a self-contained preview of the authored snapshots on http://localhost:3000. It converts authoring tables into EDS-style blocks and section metadata. This is a development fixture server, not the production content pipeline.

Use `aem up` to test actual DA preview content with local code. Preview pages in DA first. AEM Code Sync must be installed on this GitHub repository.

## Authoring

- Pages: `/`, `/writing`, `/projects`, `/research`, `/speaking`, `/about`.
- Writing detail pages use `template: article` metadata.
- `Portfolio Hero` has a copy cell and a visual cell in one row.
- `Editorial List` has one content cell per row; use `Editorial List (cards)` for two-column cards.
- Listings are curated. Add links in DA when you publish a new article; there is no automatic feed yet.
- Use ISO dates in any future indexed article metadata. Existing `helix-query.yaml` describes the template's original blog index, not the curated Writing page.
- Use LinkedIn for enquiries until a public contact email is chosen.

## Validation

Run `npm run lint` and `npm test` using a supported Node LTS and Chrome. Browser checks should cover a narrow viewport, keyboard navigation, one H1 per page, all internal links, article readability, and missing fragments.

Launch writing and the Project Stream case study summarize public IEEE research. Review content before publishing; no headshot, private implementation material, or unprovided presentation recordings are included.
