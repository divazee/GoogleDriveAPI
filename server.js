const fs        = require("fs"),
  express       = require("express"),
  app           = express(),
  cors          = require("cors"),
  multer        = require("multer"),
  upload        = multer(),
  { google }    = require("googleapis"),
  stream        = require("stream"),
  TOKEN_PATH    = "token.json";

app.use(cors());

const credentials = require("./credentials");
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);
// const drive = google.drive({ version: "v3", auth: oAuth2Client})

fs.readFile(TOKEN_PATH, (err, token) => {
  if (err) return getAccessToken(oAuth2Client, callback);
  oAuth2Client.setCredentials(JSON.parse(token));
});

// function getAccessToken(oAuth2Client, callback) {
// const url = oAuth2Client.generateAuthUrl({
//   // 'online' (default) or 'offline' (gets refresh_token)
//   access_type: 'offline',
//   // If you only need one scope you can pass it as a string
//   scope: scopes
// });
// }



app.post("/uploads", (req, res) => {
  console.log("object", req.file);
  res.send("req.file");
});

app.post("/upload", upload.single("file"), (req, res) => {
  let fileObject = req.file;
  let bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  console.log("object2:::::::", req.file.originalname);
  google
    .drive({ version: "v3" })
    .files.create({
      auth: oAuth2Client,
      media: {
        mimeType: "application/pdf",
        body: bufferStream
      },
      resource: {
        name: req.file.originalname,
        parents: ["1vmQdt869d8vNwlh59Aghp_APBhDc_Dab"]
      },
      fields: "id"
    })
    .then(function(resp) {
      console.log(resp.data, "resp");
      //   res.send(resp.data);
      res.json({ data: resp.data, name: req.file.originalname });
    })
    .catch(function(error) {
      console.log("Error:::::::", error);
      //   CATCH ERRORS: 500, 404
    });
});

app.get("/list", (req, res) => {
  google.drive({ version: "v3", auth: oAuth2Client})
    .files.list(
      {
        // q: "'1vmQdt869d8vNwlh59Aghp_APBhDc_Dab' in parents",
        // corpora: "user",
        // pageSize: 10,
        // pageToken: pageToken ? pageToken : "",
        fields: "nextPageToken, files(id, name)"
      },
      (err, result) => {
        if (err) return console.log("The API returned an error: " + err);
        const files = result.data.files;
        if (files.length) {
          console.log("respo:::::::::", result)
          console.log("Files:");
        // 08032496878 
            files.map((file) => {
              console.log(`${file.name} (${file.id})`);
            });
            res.json(files);
        } else {
          console.log("No files found.");
        }
      }
    );
});

app.get("/download/:id/:name", (req, res) => {
  const {id, name} = req.params
  const path = require('path')
  const filepath = path.resolve(__dirname, `${name}`)

  console.log("objectddddddddd", req.params)
  var dest = fs.createWriteStream(`${filepath}`);
  // var dest = fs.createWriteStream(`tmp/${name}`);
    google.drive({ version: "v3", auth: oAuth2Client })
      .files.get({
      fileId: id,
      alt: "media",
      mimeType: 'application/pdf'
    }, {
      responseType: 'stream'
    }, (err, response) => {
      if(err)return console.log("error::::::::::::::::", err)

        response.data.on('end', () => {
          console.log('Done');
          res.send('done')
        })
        .on('error', err => {
          console.log('Error during download', err);
          res.send(err)
        })
        .pipe(dest)
      })
});

app.listen(5000, () => console.log("server started on port 5000"));
