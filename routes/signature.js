const express = require("express");
const router = express.Router();
const { auth } = require("../auth/auth-google.js");
const { google } = require("googleapis");

//Route pour intégrer la signature sur un google docs
router.post('/',async (req, res) => {
    // const photoPath = `./tmp/${uniqid()}.png`;
    // const resultMove = await req.files.photoFromFront.mv(photoPath);
  
    // const resultCloudinary = await cloudinary.uploader.upload(photoPath)
  
    // fs.unlinkSync(photoPath);
  
    // const imageUrl = resultCloudinary.secure_url
    // const ID = resultCloudinary.public_id

    const docs = google.docs({ version: "v1", auth})
    const docJSON = await docs.documents.get({documentId: '1IKad5a1retPIqUyNzVW2a73Xjadn3ZIt8YvzY7Zwo-M'})
    const images = docJSON.data.inlineObjects
    console.log(images)
    for (const image in images) {
        if (images[image].inlineObjectProperties.embeddedObject.imageProperties.sourceUri === 'https://res.cloudinary.com/dknl3yl7c/image/upload/v1671015428/xi8olmwzjosdkfd0ewsn.png') {
            imageID = images[image].objectId
        }
    }
    console.log(imageID)
    await docs.documents.batchUpdate({
        auth,
        documentId: '1Tx5uckq8zEcL35PN7AGPRw0e7uWZM7zLcsdMwqDn9Kw',
        requestBody: {
          requests: [
            {
              replaceImage: {
                imageObjectId: imageID,
                uri: 'https://res.cloudinary.com/dknl3yl7c/image/upload/v1670491475/samples/cloudinary-icon.png'
              },
            }
          ]
        }
      })
    // const response = await changeImage(google, imageUrl)
    // .then(data => changeImage(data, imageUrl)).catch(console.error)
    // //   // console.log(google)
    //  cloudinary.destroy(ID)
      
    // } catch (error) {
    //   console.log(error)
    // }
  
  
  })

  module.exports = router;