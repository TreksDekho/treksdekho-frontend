/**
 * TreksDekho — Lead Capture via Google Apps Script
 *
 * SETUP (one-time, 5 minutes):
 * 1. Go to https://sheets.google.com → create a new sheet named "TreksDekho Leads"
 * 2. Open Extensions → Apps Script
 * 3. Paste this entire file into the editor (replace the default code)
 * 4. Click Deploy → New Deployment
 *    - Type: Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Authorize and copy the Web App URL
 * 6. Add it to your .env.local:
 *    NEXT_PUBLIC_LEADS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
 * 7. Restart the dev server: npm run dev
 *
 * Each lead submission will appear as a new row in your Google Sheet.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Add headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'WhatsApp', 'Group Size', 'Difficulty', 'Source']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.whatsapp || '',
      data.groupSize || '',
      data.difficulty || '',
      'Landing Page',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test this by clicking Run → doGet in the Apps Script editor
function doGet() {
  return ContentService
    .createTextOutput('TreksDekho lead capture is live ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}
