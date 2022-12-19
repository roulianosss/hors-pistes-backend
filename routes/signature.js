const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth-google.js");
const { google } = require("googleapis");
const uniqid = require('uniqid');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

//Route pour intégrer la signature sur un google docs
router.post('/', async (req, res) => {
    let imageID
    const photoPath = `./tmp/${uniqid()}.png`;
    const resultMove = await req.files.photoFromFront.mv(photoPath);
  
    const resultCloudinary = await cloudinary.uploader.upload(photoPath)
  
    fs.unlinkSync(photoPath);
  
    const imageUrl = resultCloudinary.secure_url
    const ID = resultCloudinary.public_id

    const docs = google.docs({ version: "v1", auth})
    const docJSON = await docs.documents.get({documentId: req.body.documentID})
    const images = docJSON.data.inlineObjects

    for (const image in images) {
        if (images[image].inlineObjectProperties.embeddedObject.imageProperties.sourceUri === 'https://res.cloudinary.com/dknl3yl7c/image/upload/v1671015428/xi8olmwzjosdkfd0ewsn.png') {
            imageID = images[image].objectId
        }
    }

    await docs.documents.batchUpdate({
        auth,
        documentId: req.body.documentID,
        requestBody: {
          requests: [
            {
              replaceImage: {
                imageObjectId: imageID,
                uri: imageUrl
              },
            },
            {
              replaceAllText : {
                replaceText: req.body.date,
                containsText: {
                  text: `{volunteerSignatureDate}`, 
                  matchCase: true,
                },
              },  
            },  
            {
              replaceAllText: {
                replaceText: req.body.location,
                containsText: {
                text: '{volunteerSignatureLocation}',
                matchCase: true
                },
              },
            }  
           ]
        }
      })

     cloudinary.uploader.destroy(ID)
      
    
  })

  module.exports = router;