require('dotenv').config();
const { google } = require('googleapis');

module.exports = async function saveToSheet(data) {
  try {
    const { username, followers, avgViews, engagementRate, genre, email, phone } = data;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const spreadsheetId = process.env.SHEET_ID;

    const values = [[
      username || '', followers || '', avgViews || '',
      engagementRate || '', genre || '', email || '', phone || ''
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A2', // update sheet name if needed
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return { success: true };
  } catch (err) {
    console.error('saveToSheet error:', err);
    throw new Error(err.message);
  }
};