const { google } = require('googleapis');


const client_email = process.env.CLIENT_EMAIL
const private_key = process.env.PRIVATE_KEY

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents"
];

const auth = new google.auth.JWT(
  client_email, null,
  private_key, scopes
);

module.exports = { auth };
