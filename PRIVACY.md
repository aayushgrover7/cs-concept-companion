# Privacy Policy

**Last updated:** July 24, 2026

## Overview

CS Concept Companion is a Chrome extension that explains computer science concepts you highlight on webpages. This privacy policy explains what data we collect, how we use it, and your rights.

**Bottom line:** We collect no analytics, no tracking, and no personal data. Your settings and saved concepts live only on your device.

## What data we collect

**We collect nothing automatically.** The extension does not:
- Track your browsing history
- Send analytics or telemetry
- Collect your IP address, device ID, or location
- Monitor your reading habits or saved concepts

## How the extension uses data

### Demo Mode (offline)
Everything happens on your device. No data leaves your computer.

### Live Mode (Wikipedia lookups)
When you click "Explain" on a highlighted term:
1. Only the term itself is sent to Wikipedia
2. The surrounding page content is never sent
3. Wikipedia returns the article summary
4. The explanation is shown in the card
5. Nothing is logged or stored by us

### AI Mode (your own API)
When you provide an API key and click "Explain":
1. Your API key is stored locally in the extension's storage on your device
2. When you request an explanation, the extension sends:
   - The selected text
   - Up to 600 characters of surrounding context
   - The nearest heading
   - The page title
3. This data goes only to the API host you configured (e.g., OpenAI)
4. We do not see, log, or store your requests

## Local data on your device

Your device stores:
- Your settings (explanation mode, theme, reading level)
- Saved concepts (the explanations you click "Save" on)
- Recent history (terms you've looked up, without timestamps or page URLs beyond source attribution)
- Your AI API key (if configured)

This data lives in Chrome's `storage.local` on your device only. It is never sent to us, any server, or any analytics platform.

## Permissions we request

| Permission | Why |
|---|---|
| `storage` | To save your settings, concepts, and history locally |
| `host_permissions: https://*.wikipedia.org/*` | To fetch article summaries in Live Mode |
| Content script on `http(s)://*/*` | To detect your text selections and show the card on any webpage |
| Optional host permission (your API URL) | To call the AI API you configure — only requested when you save AI settings |

## Data we don't collect

- We do NOT collect or store your browsing history
- We do NOT track which websites you visit
- We do NOT record which concepts you look up (except in your own local history)
- We do NOT build profiles of your learning or interests
- We do NOT sell or share any data with third parties

## Children's privacy

This extension is not intended for children under 13. We do not knowingly collect data from children.

## Third-party services

- **Wikipedia** (Live Mode): When you request an explanation, we fetch data from Wikipedia's REST API. See [Wikipedia's privacy policy](https://foundation.wikimedia.org/wiki/Privacy_policy).
- **Your configured AI API** (AI Mode): You control which API provider to use. That provider's privacy policy applies to requests you send. We recommend reviewing their policy before configuring an API key.

## Changes to this policy

We may update this privacy policy as the extension evolves. We will post the updated policy here with a new "Last updated" date.

## Questions or concerns

For questions about this extension or its privacy practices, contact us via the GitHub repository: https://github.com/aayushgrover7/cs-concept-companion

---

_This extension is built as a portfolio project and open-source learning tool._
