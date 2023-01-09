const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth-google.js");
const { google } = require("googleapis");
const fs = require("fs");
const { requestBody } = require("../modules/requestBody");
const authJwt = require("../auth/auth");

//UPLOAD FILES
router.post("/uploads/:folderId", authJwt, async (req, res) => {
  console.log(req.files.document.name);
  try {
    const path = `/tmp/${req.files.document.name}`;
    await req.files.document.mv(path);
    const service = google.drive({ version: "v3", auth });
    const fileMetadata = {
      name: req.files.document.name,
      parents: [req.params.folderId]
    };
    const media = {
      mimeType: req.files.document.mimetype,
      body: fs.createReadStream(path)
    };
    const file = await service.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id"
    });
    console.log("File Id:", file.data.id);
    res.json({ result: true, message: "Le fichier a bien été uploadé" });
    fs.unlinkSync(path);
    return file.data.id;
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// Créer les dossiers nécessaires sur le drive
router.post("/createFolders", authJwt,  async (req, res) => {
  try {
    const finalFolders = ["A Valider", "A Signer", "Complet"];
    const connectionString = req.body.connectionString.split("/");
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
      const file = await drive.files.create({
        resource: fileMetadata,
        fields: "id"
      });
      activeFolder = file.data.id;
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
      const file2 = await drive.files.create({
        resource: fileMetadata,
        fields: "id"
      });
      activeFolder = file2.data.id;
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
      const file3 = await drive.files.create({
        resource: fileMetadata,
        fields: "id"
      });
      activeFolder = file3.data.id;
    }
    const folderIds = await Promise.all(
      finalFolders.map(async (folder) => {
        const response = await drive.files.list({
          q: `name='${folder}' and parents='${activeFolder}'`
        });
        if (response.data.files.length) {
          return response.data.files[0].id;
        } else {
          const fileMetadata = {
            name: `${folder}`,
            mimeType: "application/vnd.google-apps.folder",
            parents: [activeFolder]
          };

          const file = await drive.files.create({
            resource: fileMetadata,
            fields: "id"
          });
          return file.data.id;
        }
      })
    );
    res.json({
      result: true,
      severity: "success",
      message: "La structure des dossiers a bien été crée",
      data: {
        mainFolderId: activeFolder,
        toValidateFolderId: folderIds[0],
        toSignFolderId: folderIds[1],
        completeFolderId: folderIds[2]
      }
    });
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

//READ FILE LIST
router.get("/listFolder/:folderId", authJwt, async (req, res) => {
  try {
    const service = google.drive({ version: "v3", auth });
    const files = [];
    const response = await service.files.list({
      q: `parents='${req.params.folderId}'`
    });
    Array.prototype.push.apply(files, response.files);
    response.data.files.forEach(function (file) {
      console.log("Found file:", file.name, file.id);
    });
    res.json(response.data.files);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// CREATE FOLDER WITH req.body.name: 'nom du dossier'; req.body.inFolder: 'nom du dossier parent'
router.post("/createFolder", authJwt, async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = {
      name: `${req.body.name} ${req.body.surname}`,
      mimeType: "application/vnd.google-apps.folder",
      parents: [req.body.inFolder]
    };
    const file = await drive.files.create({
      resource: fileMetadata,
      fields: "id"
    });
    res.json(file);
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

// COPY MODEL WITH req.body.documentId: 'id du document a copier' / req.body.name: 'nouveau nom du fichier' / req.body.inFolder: 'dossier parent'
router.post("/copyModel", authJwt, async (req, res) => {
  try {
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
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

//Replace words req.body.documentId : id du doc;
router.post("/replaceWords", authJwt, (req, res) => {
  try {
    const docs = google.docs({ version: "v1", auth });
    const documentId = req.body.documentId;
    a;
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
  } catch (err) {
    const message = "An error has occured, please retry later.";
    res.json({ result: false, message, severity: "error", data: err });
    throw err;
  }
});

//Copy and pre-fill documents in volunteer folder
router.post("/createFiles", authJwt, async (req, res) => {
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });
  const user = req.body;
  const request = requestBody(user);
  const documents = [];

  if (user.mission.missionType.includes("envoi")) {
    documents.push(
      {
        documentId: "1hhCS-kkJvS6Ihpugq9eBoumNDll2PXOaVUfSr5RtgGE",
        documentName: `${user.name}_${user.surname}_Volunteer_Certificate`
      },
      {
        documentId: "1I5IJ_mKIqr6easzLrcexTRzYAsYFs9TOlvBhdLqSYlo",
        documentName: `${user.name}_${user.surname}_Volunteering_Agreement`
      }
    );
  } else if (user.mission.missionType.includes("accueil")) {
    documents.push(
      {
        documentId: "1hhCS-kkJvS6Ihpugq9eBoumNDll2PXOaVUfSr5RtgGE",
        documentName: `${user.name}_${user.surname}_Volunteer_Certificate`
      },
      {
        documentId: "1Tx5uckq8zEcL35PN7AGPRw0e7uWZM7zLcsdMwqDn9Kw",
        documentName: `${user.name}_${user.surname}_Volunteering_Agreement`
      }
    );
  }
  async function createCopy(documentId, documentName) {
    drive.files
      .copy({
        fileId: documentId,
        requestBody: {
          name: documentName,
          mimeType: "application/msword",
          parents: [user.folderIds.toValidateFolderId]
        }
      })
      .then(
        function (response) {
          console.log(response.data.id);
          docs.documents.batchUpdate({
            auth,
            documentId: response.data.id,
            requestBody: {
              requests: request
            }
          });
        },
        function (error) {
          console.log(error);
        }
      );
  }
  documents.forEach((doc) => createCopy(doc.documentId, doc.documentName));
  res.json({ result: true });
});
module.exports = router;
