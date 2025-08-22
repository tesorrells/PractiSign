# Quick Installation Guide

## 1. Install Tampermonkey

- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Safari**: [App Store](https://apps.apple.com/us/app/tampermonkey/id1482490089)
- **Edge**: [Microsoft Store](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

## 2. Install PractiSign Script

1. Open Tampermonkey dashboard
2. Click "Create a new script"
3. Delete all default content
4. Copy and paste the entire contents of `practisign.user.js`
5. Save (Ctrl+S or Cmd+S)

## 3. Test the Installation

1. Open `test-page.html` in your browser
2. Look for the PractiSign control panel (bottom-right corner)
3. Click the gear icon (⚙️) to configure
4. Set your preferences and test

## 4. Use on PractiScore

1. Go to any PractiScore match page
2. Configure your preferences
3. Click "Arm" when ready
4. Wait for registration to open

## Troubleshooting

- **Script not appearing**: Refresh the page after installation
- **Not working on PractiScore**: Check that the script is enabled in Tampermonkey
- **Need help**: See the full README.md for detailed instructions

## Safety First

- Always test with "Dry Run" mode first
- Use "Stop at Stripe" to review before payment
- Press `Esc` to immediately disarm the script
