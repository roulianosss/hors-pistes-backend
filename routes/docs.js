const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth-google.js");
const { google } = require("googleapis");

// app.get('/download', function(req, res){
//   const file = `${__dirname}/upload-folder/dramaticpenguin.MOV`;
//   res.download(file); // Set disposition and send it.
// });



router.post("/createFolders", async (req, res) => {
  const finalFolders = ["A Valider", "A Signer", "Complet"];
  const connectionString = req.body.connectionString.split("/");
  console.log(connectionString);
  if (connectionString.filter((el) => el !== "").length !== 3) {
    return res.json({
      result: false,
      severity: "error",
      message: "La structure des dossiers est incorrecte"
    });
  }
  const mainFolder = "1rJ4JcXQqHBOMJzEwIVw2tFoXFWLGiqCa";
  let activeFolder;
  const drive = google.drive({ version: "v3", auth });
  try {
    const response = await drive.files.list({
      q: `name='${connectionString[0]}' and parents='${mainFolder}'`
    });

    if (response.data.files.length) {
      activeFolder = response.data.files[0].id;
    } else {
      const fileMetadata = {
        name: `${connectionString[0]}`,
        mimeType: "application/vnd.google-apps.folder",
        parents: [mainFolder]
      };
      try {
        const file = await drive.files.create({
          resource: fileMetadata,
          fields: "id"
        });
        activeFolder = file.data.id;
        console.log(file.data.id);
      } catch (err) {
        throw err;
      }
    }

    const response2 = await drive.files.list({
      q: `name='${connectionString[1]}' and parents='${activeFolder}'`
    });
    if (response2.data.files.length) {
      activeFolder = response2.data.files[0].id;
    } else {
      const fileMetadata = {
        name: `${connectionString[1]}`,
        mimeType: "application/vnd.google-apps.folder",
        parents: [activeFolder]
      };
      try {
        const file2 = await drive.files.create({
          resource: fileMetadata,
          fields: "id"
        });
        activeFolder = file2.data.id;
      } catch (err) {
        throw err;
      }
    }

    const response3 = await drive.files.list({
      q: `name='${connectionString[2]}' and parents='${activeFolder}'`
    });
    if (response3.data.files.length) {
      activeFolder = response3.data.files[0].id;
    } else {
      const fileMetadata = {
        name: `${connectionString[2]}`,
        mimeType: "application/vnd.google-apps.folder",
        parents: [activeFolder]
      };
      try {
        const file3 = await drive.files.create({
          resource: fileMetadata,
          fields: "id"
        });
        activeFolder = file3.data.id;
      } catch (err) {
        throw err;
      }
    }

    finalFolders.map(async (folder) => {
      const response = await drive.files.list({
        q: `name='${folder}' and parents='${activeFolder}'`
      });
      if (response.data.files.length) {
        return
      } else {
        const fileMetadata = {
          name: `${folder}`,
          mimeType: "application/vnd.google-apps.folder",
          parents: [activeFolder]
        };
        try {
          const file = await drive.files.create({
            resource: fileMetadata,
            fields: "id"
          });
          activeFolder = file.data.id;
          console.log(file.data.id);
        } catch (err) {
          throw err;
        }
      }
    });

    res.json({
      result: true,
      severity: "success",
      message: "La structure des dossiers a bien été crée",
      data: { id: activeFolder }
    });
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
});

//READ FILE LIST
router.get("/list", async (req, res) => {
  const service = google.drive({ version: "v3", auth });
  const files = [];
  try {
    const response = await service.files.list({
      q: `mimeType=\'application/vnd.google-apps.folder\' and parents='1kOlpheuh4RE2WOAw97GVRIisqdYcyI_J'`
    });
    Array.prototype.push.apply(files, response.files);
    response.data.files.forEach(function (file) {
      console.log("Found file:", file.name, file.id);
    });
    res.json(response.data.files);
  } catch (err) {
    throw err;
  }
});

// CREATE FOLDER WITH req.body.name: 'nom du dossier'; req.body.inFolder: 'nom du dossier parent'
router.post("/createFolder", async (req, res) => {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: `${req.body.name} ${req.body.surname}`,
    mimeType: "application/vnd.google-apps.folder",
    parents: [req.body.inFolder]
  };
  try {
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: "id"
    });
    res.json(file);
  } catch (err) {
    throw err;
  }
});

// COPY MODEL WITH req.body.documentId: 'id du document a copier' / req.body.name: 'nouveau nom du fichier' / req.body.inFolder: 'dossier parent'
router.post("/copyModel", async (req, res) => {
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
      console.log(response.data);
      res.json(response.data);
    }
  );
});

//Replace words req.body.documentId : id du doc;
router.post("/replaceWords", (req, res) => {
  const docs = google.docs({ version: "v1", auth }); // Please use `auth` of your script.
  const documentId = req.body.documentId; // Please set your Google Document ID.

  const requests = req.body.requests;
  docs.documents.batchUpdate({
    auth,
    documentId: documentId,
    resource: {
      requests
    }
  });
  docs.documents
    .get({
      auth,
      documentId: documentId
    })
    .then((data) => res.json(data));
});

module.exports = router;
