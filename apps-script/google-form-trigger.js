/**
 * Google Apps Script - Show Cause Form Submission Trigger
 *
 * SETUP:
 * 1. Update API_ENDPOINT and API_KEY below
 * 2. Run createTrigger() ONCE
 * 3. Run testConnection() to verify it works
 */

const API_ENDPOINT =
  "https://YOUR-APP.vercel.app/api/integrations/google-form/submissions";
const API_KEY = "c8107110-e7ef-4f51-97b2-31a338035a1c";

/**
 * Column mapping (adjust if your form columns differ):
 * A(0)=Timestamp, B(1)=Hospital Name, C(2)=Hospital ID,
 * D(3)=District, E(4)=Block/Taluka, F(5)=Remarks,
 * G(6)=Required Documents, H(7)=Action Taken
 */

function onFormSubmit(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var row = e.range.getRow();
  var data = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Log raw data so we can debug column mapping
  Logger.log("Raw row data: " + JSON.stringify(data));

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

  Logger.log("Sending payload: " + JSON.stringify(payload));
  Logger.log("To endpoint: " + API_ENDPOINT);

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
    var body = response.getContentText();

    Logger.log("Response code: " + code);
    Logger.log("Response body: " + body);
  } catch (error) {
    Logger.log("EXCEPTION: " + error.toString());
  }
}

/** Run this ONCE to create the trigger */
function createTrigger() {
  // Remove any existing triggers first
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  ScriptApp.newTrigger("onFormSubmit")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();

  Logger.log("Trigger created successfully!");
}

/** Run this manually to test the connection without submitting a form */
function testConnection() {
  var testPayload = {
    hospitalName: "Test Hospital",
    hospitalId: "TEST-001",
    district: "Test District",
    blockTaluka: "Test Block",
    remarks: "This is a test submission from Apps Script",
    requiredDocuments: [],
    actionTaken: "Test action",
    submittedAt: new Date().toISOString(),
    sourceId: "test-manual",
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": API_KEY,
    },
    payload: JSON.stringify(testPayload),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(API_ENDPOINT, options);
    Logger.log("Status: " + response.getResponseCode());
    Logger.log("Body: " + response.getContentText());
  } catch (error) {
    Logger.log("ERROR: " + error.toString());
  }
}
