const 
fs = require('fs'),
express = require('express'),
app = express(),
cors   = require('cors'),
buffer = require('buffer'),
multer = require('multer'),
upload = multer()


const {google} = require('googleapis');
const stream = require('stream');
const TOKEN_PATH = 'token.json';


app.use(cors());

// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Google Drive API.
//     // authorize(JSON.parse(content), uploadFile); // upload specific file
// });

// function authorize(credentials, callback) {
//     const {client_secret, client_id, redirect_uris} = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(
//         client_id, client_secret, redirect_uris[0]);
  
//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//       if (err) return getAccessToken(oAuth2Client, callback);
//       oAuth2Client.setCredentials(JSON.parse(token));
//       callback(oAuth2Client); // list files and upload
//       // callback(oAuth2Client, '1ATRMVlLDBais0nigGb3ShzXffmhFE8szI2yuchyh2BA'); // get specific file
//     });
// }

// function uploadFile(auth) {
    // const drive = google.drive({ version: 'v3'}, auth);
    // var media = {
    //     mimeType: 'image/jpeg',
    //     body: fs.createReadStream('../../mov/download2.jpg')
    // };
    // drive.files.create({ 
    //     resource: {
    //     name: 'download-file.jpg',
    //     parents: ['1vmQdt869d8vNwlh59Aghp_APBhDc_Dab']
    //     },
    //     media: media,
    //     fields: 'id'
    // }, function (err, res) {
    //     if (err) {
    //     console.log("error:::::::", err)
    //     } else {
    //     console.log("File Id:::", res.data.id)
    //     }
    // })
    // // res.send('File uploaded');
// }
    const credentials = require('./credentials')
    const {client_secret, client_id, redirect_uris} = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );


    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
    })

app.post('/upload', upload.single('file'), (req, res) => {

    let fileObject = req.file;
    let bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
console.log("object2:::::::", req.file.originalname)
    google.drive({ version: 'v3'})
        .files.create({
            auth: oAuth2Client,
            media: {
                mimeType: 'application/pdf',
                body: bufferStream
            },
            resource: {
                name: req.file.originalname,
                // name: 'test.pdf',
                // parents: ['folder id in which he file needs to be stored.']
            },
            fields: 'id',
        }).then(function (resp) {
            console.log(resp.data,'resp');
            res.send(resp.data)
        }).catch(function (error) {
            console.log(error);
        })   
})

app.listen(5000, () => console.log("server started on port 5000"))