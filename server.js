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

fs.readFile(TOKEN_PATH, (err, token) => {
  if (err) return getAccessToken(oAuth2Client, callback);
  oAuth2Client.setCredentials(JSON.parse(token));
});

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
        parents: ['1vmQdt869d8vNwlh59Aghp_APBhDc_Dab']
      },
      fields: "id"
    })
    .then(function(resp) {
      console.log(resp.data, "resp");
    //   res.send(resp.data);
      res.json({data: resp.data, name: req.file.originalname});
    })
    .catch(function(error) {
      console.log("Error:::::::", error);
    });
});

app.listen(5000, () => console.log("server started on port 5000"));
