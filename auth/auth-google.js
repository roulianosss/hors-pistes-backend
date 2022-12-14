const { google } = require('googleapis');

const keysEnvVar = process.env['CREDS'];
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);


const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/documents"
];

const auth = new google.auth.JWT(
  keys.client_email, null,
  keys.private_key, scopes
);

console.log(auth)

module.exports = { auth };
