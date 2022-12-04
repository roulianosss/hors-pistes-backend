const express = require('express');
const router = express.Router();
const { authorize } = require('../modules/auth-google-api.js')
const { google } = require('googleapis');

//READ FILE LIST
router.get('/list', (req, res) => {
    async function readDrive(auth) {
        const service = google.drive({version: 'v3', auth});
        const files = [];
        try {
            const response = await service.files.list({
            // q: '',
            // fields: 'nextPageToken, files(id, name)',
            parents: ['1wZ9smE3a-J6Ns4-sOFL0FspmaPaa0AVf']
            });
            Array.prototype.push.apply(files, response.files);
            response.data.files.forEach(function(file) {
            console.log('Found file:', file.name, file.id);
            });
            res.json(response.data.files)
            // return response.data.files;
        } catch (err) {
            // TODO(developer) - Handle error
            throw err;
        }   
    }
    authorize().then(readDrive).catch(console.error);
})

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
        const drive = google.drive({ version: "v3", auth });
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