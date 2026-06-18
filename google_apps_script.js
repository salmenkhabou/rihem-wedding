/**
 * Google Apps Script to upload photos directly to Google Drive folder.
 * 
 * INSTRUCTIONS:
 * 1. Open https://script.google.com/ while logged in as salmen.khabou@ieee.org.
 * 2. Create a "New Project".
 * 3. Copy-paste this code into the script editor, replacing any default code.
 * 4. Click the "Save" icon.
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set:
 *    - Description: Wedding Photo Upload
 *    - Execute as: Me (salmen.khabou@ieee.org)
 *    - Who has access: Anyone
 * 8. Click "Deploy", click "Authorize access", choose your account, click "Advanced", and click "Go to Untitled project (unsafe)" (or your project name) to grant permissions.
 * 9. Copy the "Web app URL" (it will end in /exec) and paste it into c:\mall virtuall\digital_invitation\app.js as the value for APPS_SCRIPT_URL.
 */

function doPost(e) {
  try {
    // Check if request body exists
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Empty request payload."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const folderId = "1dYQe1Vo01fportTPb9oIzq0Ye17qmopy";
    const folder = DriveApp.getFolderById(folderId);

    // Decode base64 file data
    const contentType = data.mimeType || "image/jpeg";
    const decoded = Utilities.base64Decode(data.base64);
    const blob = Utilities.newBlob(decoded, contentType, data.fileName || "wedding-photo.jpg");

    // Save to Google Drive
    const file = folder.createFile(blob);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      url: file.getUrl()
    }))
    .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

