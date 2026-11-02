# Launch content snapshots

These HTML files are authoring copies for DA, excluded from EDS code delivery. Paste the content inside `<main><div>` into the corresponding DA rich-text editor as formatted HTML. Block names belong in the first table row. Do not paste the document's outer HTML.

Create and preview both navigation fragments before previewing other pages. Preview all linked pages before previewing the homepage. DA saves drafts automatically; Preview updates the preview tier, while Publish is a separate action.

The initial content is also used by `npm run preview:content`. Subsequent DA edits do not automatically update these snapshots.

For the privacy notice, create `/privacy` in DA from [privacy.html](privacy.html), then preview and publish it. Update and publish `/fragments/nav/footer` from [fragments/nav/footer.html](fragments/nav/footer.html) so the notice is linked on every page. These content publications are separate from deploying the consent-panel code. Before publishing, verify that the notice matches the actual GA4 retention and measurement settings, form-handling practices, and hosting services; review privacy requirements for the site's audience.
