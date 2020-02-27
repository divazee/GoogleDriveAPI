const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis'),
express = require('express'),
cors = require('cors'),
app = express();

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

app.use(cors());

  
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client); // list files and upload
      // callback(oAuth2Client, '1ATRMVlLDBais0nigGb3ShzXffmhFE8szI2yuchyh2BA'); // get specific file
    });
}



app.post('/upload', (req, res) => {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
    
        // authorize(JSON.parse(content), listFiles); // all
        // authorize(JSON.parse(content), getFile); // get specific file
          authorize(JSON.parse(content), uploadFile); // upload specific file
    });
  
//   function authorize(credentials, callback) {
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
//   }
  
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
  
  function listFiles(auth) {
    const drive = google.drive({version: 'v3', auth});
    getList(drive, '');
  }
  
  function getList(drive, pageToken) {
    drive.files.list({
       //  q: "mimeType = 'application/vnd.google-apps.folder'", 
        q: "'1vmQdt869d8vNwlh59Aghp_APBhDc_Dab' in parents", 
        corpora: 'user',
        pageSize: 10,
        pageToken: pageToken ? pageToken : '',
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        processList(files);
        if (res.data.nextPageToken) {
            getList(drive, res.data.nextPageToken)
        }
      //   files.map((file) => {
      //     console.log(`${file.name} (${file.id})`);
      //   });
      } else {
        console.log('No files found.');
      }
    });
  }
  
  processList = files => {
      console.log('Processing...');
      // files.forEach(file => {
      //     console.log("object", file)
      // })
        files.map((file) => {
          console.log(`${file.name} (${file.id})`);
        //   res.send(`${file.name} (${file.id})`);
        });
        res.send({files})
  }
  
  function getFile(auth, fileId) {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.get({ fileId: fileId, fields: '*' }, (err, res) => {
      if (err) return console.log('API returned an error::::: ', err)
      console.log(res.data);
    })
  }
  
  function uploadFile(auth) {
    const drive = google.drive({ version: 'v3', auth });
    // var fileMetadata = {
    //   'name': 'download.jpg'
    // };
    var media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream(req.body)
    //   body: fs.createReadStream('../../mov/download2.jpg')
    };
    drive.files.create({ 
      // resource: fileMetadata,
      resource: {
        name: 'download.jpg',
        parents: ['1vmQdt869d8vNwlh59Aghp_APBhDc_Dab']
      },
      media: media,
      fields: 'id'
    }, function (err, result) {
      if (err) {
        console.log("error:::::::", err)
      } else {
          console.log("file", req.body)
        console.log("File Id:::", result.data)
        res.send(result.data)
      }
    })
  } 
})


// app.post('/upload', authorize, (req, res) => {

//     // let fileObject = req.file;
//     // let bufferStream = new stream.PassThrough();
//     // bufferStream.end(fileObject.buffer);

//     // google.drive({ version: 'v3'})
//     //     .files.create({
//     //         auth: oauth2Client/jWTClient,
//     //         media: {
//     //             mimeType: 'application/pdf',
//     //             body: bufferStream
//     //         },
//     //         resource: {
//     //             name: 'test.pdf',
//     //             parents: ['folder id in which he file needs to be stored.']
//     //         },
//     //         fields: 'id',
//     //     }).then(function (resp) {
//     //         console.log(resp,'resp');
//     //     }).catch(function (error) {
//     //         console.log(error);
//     //     })
   
// })

app.listen(5000, () => console.log("server started on port 5000"))