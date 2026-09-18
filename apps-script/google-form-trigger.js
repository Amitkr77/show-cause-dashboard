/**
 * Google Apps Script - Show Cause Form Submission Trigger
 *
 * SETUP INSTRUCTIONS:
 * 1. Open the Google Sheet linked to your Google Form
 * 2. Go to Extensions > Apps Script
 * 3. Paste this entire file into the script editor
 * 4. Update API_ENDPOINT with your deployed dashboard URL
 * 5. Update API_KEY to match INTEGRATION_API_KEY in your .env.local
 * 6. Run createTrigger() once to set up the form submit trigger
 * 7. Authorize the script when prompted
 *
 * COLUMN MAPPING (adjust indices if your form columns differ):
 * Column A (0): Timestamp
 * Column B (1): Hospital Name
 * Column C (2): Hospital ID
 * Column D (3): District
 * Column E (4): Block/Taluka
 * Column F (5): Remarks
 * Column G (6): Required Documents (optional, comma-separated)
 * Column H (7): Action Taken
 */

const API_ENDPOINT =
  "https://your-deployed-domain.com/api/integrations/google-form/submissions";
const API_KEY = "your-integration-api-key";

function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = e.range.getRow();
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  var payload = {
    submittedAt: new Date(data[0]).toISOString(),
    hospitalName: String(data[1] || "").trim(),
    hospitalId: String(data[2] || "").trim(),
    district: String(data[3] || "").trim(),
    blockTaluka: String(data[4] || "").trim(),
    remarks: String(data[5] || "").trim(),
    requiredDocuments: data[6]
      ? String(data[6])
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      : [],
    actionTaken: String(data[7] || "").trim(),
    sourceId: sheet.getName() + "!A" + row,
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": API_KEY,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(API_ENDPOINT, options);
    var code = response.getResponseCode();

    if (code === 201) {
      Logger.log("Successfully submitted row " + row);
    } else if (code === 409) {
      Logger.log("Duplicate detected for row " + row);
    } else {
      Logger.log(
        "Error submitting row " + row + ": " + response.getContentText()
      );
    }
  } catch (error) {
    Logger.log("Exception submitting row " + row + ": " + error.toString());
  }
}

/** Run this function ONCE to create the form submission trigger */
function createTrigger() {
  ScriptApp.newTrigger("onFormSubmit")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();

  Logger.log("Trigger created successfully!");
}
