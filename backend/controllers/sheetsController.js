// Google Sheets Export scaffold (Export-only)
// TODO: Integrate Google OAuth credentials: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
// Optionally: Use a service account and target sheet ID via GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_SHEET_ID

exports.exportIncomeToSheet = async (req, res) => {
  // Scaffold only - no OAuth flow wired yet
  return res.status(501).json({
    message: 'Google Sheets Export not configured',
    todo: 'Add OAuth credentials in .env and implement token exchange + sheets API write.'
  });
};

exports.exportExpenseToSheet = async (req, res) => {
  // Scaffold only - no OAuth flow wired yet
  return res.status(501).json({
    message: 'Google Sheets Export not configured',
    todo: 'Add OAuth credentials in .env and implement token exchange + sheets API write.'
  });
};
