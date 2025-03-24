# LinkedIn Cookie Extractor Chrome Extension

This Chrome extension extracts LinkedIn cookies and sends them to a backend API in Netscape format.

## Setup Instructions

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select this directory
5. Update the `API_ENDPOINT` in `background.js` to point to your backend server

## Usage

1. Log in to LinkedIn in Chrome
2. Click the extension icon in your Chrome toolbar
3. Click "Extract Cookies" button
4. The extension will:
   - Extract all LinkedIn cookies
   - Convert them to Netscape format
   - Send them to your backend API
   - Display the response in the popup

## Debugging

- Open Chrome DevTools for the extension popup by right-clicking the extension icon and selecting "Inspect popup"
- Check the console for detailed logs from all components (Popup, Background, Content)
- The popup UI includes a debug log section showing recent operations

## Files

- `manifest.json`: Extension configuration
- `popup.html/js`: Extension UI and interaction
- `background.js`: Cookie extraction and API communication
- `content.js`: LinkedIn page interaction (if needed)

## Notes

- Make sure your backend API is running and accessible
- The extension requires permissions to access cookies and LinkedIn domains
- All operations are logged for debugging purposes # linkedin-extention
