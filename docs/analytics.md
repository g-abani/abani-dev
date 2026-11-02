# Google Analytics Setup

## Create the GA4 property

1. Sign in at [Google Analytics](https://analytics.google.com/) and select **Start measuring**, or use **Admin > Create > Account** if another account already exists.
2. Name the account, review data-sharing settings, and create a property for this website. Choose the reporting time zone and currency deliberately.
3. Complete the business details and objectives, then accept the applicable terms.
4. Under **Admin > Data collection and modification > Data streams**, add a **Web** stream using the public production URL and a descriptive stream name.
5. Copy the stream's **Measurement ID**, beginning with `G-`. This is a public identifier, not a password. Do not use the numeric property or stream ID.
6. Choose manual installation if prompted. Do not also paste Google's head snippet or install a second GA4 tag through GTM: this code owns initialization and the initial page view.

## Enable the site integration

In [scripts/lazy.js](../scripts/lazy.js), replace the empty analytics configuration with your actual values:

```js
const analytics = {
  measurementId: 'G-YOUR_REAL_ID',
  hostnames: ['your-production-hostname.com'],
};
```

The values above are examples, not working configuration. Use hostnames without `https://`, paths, or trailing slashes. Include both apex and `www` only if both genuinely serve the site; prefer a canonical redirect. Do not add localhost, branch previews, or DA hosts to the production allowlist. To test on an AEM branch, temporarily allow that exact hostname with a separate test property, then remove it before release.

Commit and deploy through the normal site workflow after supplying the real configuration. The integration does not require Google Tag Manager or a GA API credential.

## Consent and collection

- The module loads after page sections, from the existing lazy phase. No engine or head changes, Google preconnects, or blocking imports are added.
- With the configuration empty, or on a hostname outside the allowlist, neither the consent controls nor the analytics module loads.
- Tracking is also disabled inside frames and with `?martech=off`, `dapreview`, or `quick-edit` query parameters.
- Before acceptance and after a saved rejection, no Google script loads and no GA measurement is sent. This is basic, consent-gated collection, not advanced consent mode with pre-consent pings.
- **Accept analytics** records consent in local storage and loads Google's `gtag.js`. GA4 configuration sends the initial page view once. Short visits before acceptance are intentionally not measured.
- **Reject analytics** saves the choice without loading Google. **Cookie settings** reopens the controls. Withdrawing consent sets Google's measurement-disable flag, updates consent to denied, and removes accessible `_ga` cookies at the site's root path and hostname suffixes. Already sent data cannot be recalled, and already loaded Google code cannot be unloaded; subsequent pages do not load it after rejection.
- When browser storage is blocked, the controls still work, but the choice only lasts for the current page.
- Advertising storage, advertising user data, and advertising personalization remain denied. Google signals and ad-personalization signals are disabled in tag configuration.
- The configured initial page URL and referrer omit query strings and fragments. This does not sanitize every event produced by Google's enhanced measurement. Do not put personal information in page titles, paths, or event parameters.

The privacy/cookie notice is provided in [authoring/privacy.html](../authoring/privacy.html). Create `/privacy` in DA from that snapshot, preview it, and publish it before deploying the enabled integration. Also publish the updated `/fragments/nav/footer` from [the footer snapshot](../authoring/fragments/nav/footer.html). The consent panel links to `/privacy` in code, but code deployment does not publish DA content.

Before publishing the notice, verify the actual GA4 event-retention period, enhanced-measurement settings, hosting/logging arrangements, enquiry retention, and contact route. The notice describes retention through the configured settings without inventing a fixed duration; add confirmed durations when available. It currently uses the site's existing LinkedIn contact route rather than an unprovided email address. The notice and controls alone do not establish legal compliance; review the setup against your visitors' jurisdictions and obtain legal advice where needed.

## Review GA4 settings

1. Review **Enhanced measurement** on the web stream. Standard GA4 events can cover page views, scrolls, outbound clicks, downloads, and other enabled interactions without custom site event code.
2. Disable **Form interactions** for the speaking enquiry form unless you have explicitly assessed it. Do not send enquiry text, names, email addresses, or other personal information to GA4.
3. Disable **Site search** unless needed and review its query-parameter configuration. If URLs may contain sensitive values, configure GA4 data redaction and disable unnecessary automatic/history-based page measurements. The initial URL override is not a blanket privacy guarantee.
4. Review event data retention, internal/developer traffic filters, and data-sharing settings. Keep Google signals and advertising integrations off unless separately justified and consented to.
5. Standard events are included; custom enquiry-success or other business events are not added by this implementation. Configure key events only for actions you actually measure.

## Verify after configuration and deployment

1. On the allowlisted site, use a fresh browser session. Before choosing, check DevTools Network: there should be no `googletagmanager.com/gtag/js` request or GA `g/collect` request.
2. Reject analytics and navigate to another page. No Google script or GA collection should appear.
3. Open **Cookie settings** and accept. Confirm a single `gtag/js?id=G-...` load and collection requests to Google's Analytics endpoints. Use [Google Tag Assistant](https://tagassistant.google.com/) to inspect tag configuration and events, then check **Reports > Realtime** in the correct GA4 property.
4. Navigate to another page and verify saved acceptance, one page view per normal navigation, and no duplicate GA installation. Use DebugView with Tag Assistant's debug session where available.
5. Reopen settings and reject. Confirm the saved value is `denied`, accessible GA cookies are cleared, and a fresh page no longer loads GA. Withdrawal does not delete historical Analytics data.
6. Check a branch preview and `?martech=off`: no analytics controls or Google tags should load. Browser extensions and tracking protection may block GA even after acceptance; do not bypass visitor protections.

Run the focused automated checks:

```sh
npm run test:file -- 'test/scripts/analytics.test.js'
npx eslint scripts/lazy.js scripts/utils/analytics.js test/scripts/analytics.test.js
npx stylelint styles/analytics.css
```

The browser tests intercept the Google tag request, so they do not send real analytics. They cover default denial, acceptance, saved choices, withdrawal, cookie removal, blocked storage, duplicate initialization prevention during consent changes, and mobile layout. Realtime ingestion still requires a real property and a deployed, allowlisted hostname.

## Why not the Adobe GTM plugin?

The [AEM integration guide](https://www.aem.live/developer/gtm-martech-integration) describes phased GA4/GTM loading and site-level consent. Its linked [plugin](https://github.com/adobe-rnd/aem-gtm-martech) is early-access, requires collaboration with AEM Engineering, and expects lifecycle hooks this Author Kit site does not expose. For GA4 alone, the small direct integration follows the consent and performance principles without vendoring that stack or changing the shared engine. Unlike the plugin's eager GA4 phase, this implementation intentionally starts after rendering and consent, trading some short-visit measurement for privacy and lower initial-page cost.

Google's account/property/stream instructions: [Set up Analytics for a website and/or app](https://support.google.com/analytics/answer/9304153).
