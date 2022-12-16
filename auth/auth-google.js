const { google } = require('googleapis');

const credentials = process.env['CREDS'];
if (!credentials) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(credentials);

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents"
];

const auth = new google.auth.JWT(
  keys.client_email, null,
  keys.private_key, scopes
);

module.exports = { auth };
