# PractiSign - Auto PractiScore Registration

A browser userscript that automatically registers you for PractiScore matches when registration opens. Features configurable preferences, smart polling, and a clean UI.

## Features

- **Auto-registration**: Automatically fills forms and submits when registration opens
- **Smart polling**: Adjusts polling frequency based on proximity to opening time
- **Configurable preferences**: Division, member ID, squad preferences, prereg codes
- **Safety features**: Kill switch (Esc key), dry-run mode, stop at Stripe
- **Modern UI**: Clean, responsive interface with status indicators
- **Notifications**: Desktop notifications for important events

## Installation

### Prerequisites

- [Tampermonkey](https://www.tampermonkey.net/) browser extension (Chrome, Firefox, Safari, Edge)

### Setup

1. Install Tampermonkey from your browser's extension store
2. Open the Tampermonkey dashboard
3. Click "Create a new script"
4. Replace the default content with the contents of `practisign.user.js`
5. Save the script (Ctrl+S or Cmd+S)
6. The script will automatically run on PractiScore pages

## Configuration

### Initial Setup

1. **Install the script** in Tampermonkey (see Installation section above)
2. **Navigate to any PractiScore page** (the script will work on any PractiScore domain)
3. **Look for the PractiSign control panel** in the bottom-right corner
4. **Click the gear icon (⚙️)** to open configuration
5. **Fill in your preferences**:
   - **Division**: Your preferred division (e.g., "CO", "LO", "O")
   - **Member ID**: Your USPSA/IDPA member number
   - **Squad Preferences**: Comma-separated list of preferred squads
   - **Prereg Code**: Optional preregistration code
   - **Auto-agree to waivers**: Automatically check waiver boxes
   - **Stop at Stripe**: Pause before payment (recommended)
   - **Dry run**: Test without submitting (recommended for first use)

**Note**: The script works on ALL PractiScore pages, not just registration pages. You can configure it on any PractiScore page and the settings will be saved for when you visit registration pages.

### Configuration Options

| Setting               | Description                         | Example                                      |
| --------------------- | ----------------------------------- | -------------------------------------------- |
| Division              | Your shooting division              | "CO", "LO", "OPN", "LTD", "PROD", "SS", etc. |
| Class                 | Your USPSA classification           | "U", "D", "C", "B", "A", "M", "G", "X"       |
| Categories            | Optional categories you qualify for | "Senior", "Lady", "Military", etc.           |
| Member ID             | Your USPSA member number            | "A12345"                                     |
| Prereg Code           | Optional club preregistration code  | "CLUB2024"                                   |
| Auto-agree to waivers | Automatically check waiver boxes    | ✓ (recommended)                              |
| Stop at Stripe        | Pause before payment confirmation   | ✓ (recommended)                              |
| Dry run               | Test without submitting             | ✓ (for testing)                              |

**Note**: Squad selection is not part of the PractiScore registration form. Squads are typically assigned by the match director or through a separate squadding process after registration.

## Usage

### Basic Workflow

1. **Prepare**: Configure your preferences in the settings panel
2. **Navigate**: Go to the PractiScore match registration page
3. **Arm**: Click the "Arm" button when ready to monitor
4. **Wait**: The script will poll the page and show status updates
5. **Auto-register**: When registration opens, the script will automatically:
   - Click the register button
   - Fill in your information
   - Select your preferred squad
   - Submit the form
   - Stop at Stripe (if enabled) for payment confirmation

### Status Indicators

- **Idle**: Script is ready but not monitoring
- **Watching**: Actively polling for registration to open (pulsing orange)
- **Hot**: Registration detected, filling form (pulsing red)

### Safety Features

- **Kill Switch**: Press `Esc` to immediately disarm the script
- **Dry Run Mode**: Test the form filling without submitting
- **Stop at Stripe**: Pause before payment to review and confirm
- **Configurable Polling**: Respectful polling that ramps up near opening time

## Testing

### Test Page

Use the included `test-page.html` to test the script functionality:

1. Open `test-page.html` in your browser
2. Install the PractiSign userscript in Tampermonkey
3. Configure your preferences
4. Click "Arm" and watch the test page
5. Use the test controls to simulate registration opening

### Testing on Real PractiScore Pages

The script includes debugging tools to help you test on actual PractiScore pages:

1. **Open browser console** (F12 → Console tab)
2. **Navigate to any PractiScore page**
3. **Use debug commands**:

   ```javascript
   // View current configuration
   practisignDebug.config();

   // Test form detection
   practisignDebug.testFormDetection();

   // Test label detection
   practisignDebug.testLabels();
   ```

4. **For registration pages**, you can also:
   - Set `dryRun: true` in configuration
   - Arm the script and watch for form detection
   - Check console logs for detailed information

### Test Scenarios

1. **Basic Registration Flow**:

   - Set up preferences
   - Arm the script
   - Toggle registration open
   - Verify form filling and squad selection

2. **Dry Run Testing**:

   - Enable dry run mode
   - Test the complete flow
   - Verify no submission occurs

3. **Squad Selection**:

   - Test with different squad preferences
   - Verify fallback to available squads
   - Test with full squads

4. **Safety Features**:
   - Test Esc key kill switch
   - Verify disarm functionality
   - Test notification system

## Technical Details

### Polling Strategy

- **Far mode** (>10 min): 30-second intervals
- **Near mode** (2-10 min): 5-second intervals
- **Final mode** (last 10s): 600ms intervals (when tab is active)

### Form Detection

The script uses robust selectors to find form elements:

- Label-based input detection
- Multiple button text variations
- Fallback selectors for different page layouts

### Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

**Script not appearing on PractiScore pages**

- Verify Tampermonkey is installed and enabled
- Check that the script is saved and active
- Refresh the page after installation

**Form not filling correctly**

- Check your configuration settings
- Try dry run mode to see what's being filled
- Verify the page structure matches expected patterns

**Squad selection not working**

- Check your squad preferences spelling
- Verify squads are available (not full)
- Try different squad names

**Notifications not working**

- Grant notification permissions when prompted
- Check browser notification settings
- Verify Tampermonkey notification permissions

### Debug Mode

Enable debug logging by adding this line to the script:

```javascript
const DEBUG = true;
```

## Privacy & Ethics

- **No credential storage**: Uses your existing browser session
- **No payment info**: Stripe handles payment securely
- **Respectful polling**: Minimal impact on PractiScore servers
- **Personal use**: Designed for individual use, not automation

## Roadmap

- [ ] Per-match configuration profiles
- [ ] Friend squad preferences
- [ ] Automatic time detection from page content
- [ ] Enhanced error handling and recovery
- [ ] Mobile browser support

## Contributing

This is a personal project designed for individual use. Please respect PractiScore's terms of service and use responsibly.

## License

This project is provided as-is for personal use. Use at your own discretion and in accordance with PractiScore's terms of service.
