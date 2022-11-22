var express = require('express');
var router = express.Router();


const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/documents','https://www.googleapis.com/auth/drive',];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}





// CREATE FOLDER WITH req.body.name: 'nom du dossier'; req.body.inFolder: 'nom du dossier parent'
router.post('/createFolder', function(req, res, next) {
    async function createFolder(auth) {
        const drive = google.drive({ version: "v3", auth }); 
        const fileMetadata = {
          name: `${req.body.name} ${req.body.surname}`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [req.body.inFolder]
        };
        try {
          const file = await drive.files.create({
            resource: fileMetadata,
            fields: 'id',
          });
          
          console.log('Folder Id:', file.data.id);
          res.json(file)
        } catch (err) {
          throw err;
        }
    }
    authorize().then(createFolder).catch(console.error);
});


// COPY MODEL WITH req.body.documentId: 'id du document a copier' / req.body.name: 'nouveau nom du fichier' / req.body.inFolder: 'dossier parent'
router.post('/copyModel', (req, res) => {
    async function copyModel(auth) {
        const drive = google.drive({ version: "v3", auth }); // Please use `auth` of your script.
      
        drive.files.copy(
          {
            fileId: req.body.documentId,
            requestBody: {  
              name: `Volunteer Certificate of ${req.body.name} ${req.body.surname}`,
              mimeType: "application/msword",
              parents: [req.body.inFolder] 
            }
          },
          (err, response) => {
            if (err) return console.log("The API returned an error: " + err);
            console.log(response.data)
            res.json(response.data)
          }
        )
    }
    authorize().then(copyModel).catch(console.error)
})


//Replace words req.body.documentId : id du doc; 
router.post('/replaceWords', (req, res) => {
    async function replaceWord(auth) {
        const docs = google.docs({ version: "v1", auth }); // Please use `auth` of your script.
        const documentId = req.body.documentId; // Please set your Google Document ID.
    
        const requests = req.body.requests
        docs.documents.batchUpdate(
        {
            auth,
            documentId: documentId,
            resource: {
            requests,
            },
        },
        );
        docs.documents.get({
            auth,
            documentId: documentId,
        }).then(data => res.json(data))
    }
    authorize().then(replaceWord).catch(console.error)
})

module.exports = router;
