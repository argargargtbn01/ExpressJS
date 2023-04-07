require('dotenv').config()
const express = require("express");
const userRouter = require("./routes/User");
var bodyParser = require('body-parser')
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {google} = require("googleapis")
const UserModel = require("./models/User");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/static', express.static('image'))
const upload = multer({ dest: "uploads/" });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL);
oauth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const drive = google.drive({
    version:'v3',
    auth:oauth2Client
})
// Upload file to Google Drive
const uploadFile = async (filePath, mimeType) => {
  const fileMetadata = {
    name: path.basename(filePath),
    mimeType: mimeType
  };
  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
  });
  console.log(res);
  return res.data.id;
};

// Create user API
app.post("/users", upload.single("avatar"), async (req, res) => {
  try {
    const { username, password } = req.body;

    // Upload avatar file to Google Drive
    const avatarPath = req.file.path;
    const avatarLink1 = await uploadFile(avatarPath, "image/jpg");
    const response = await drive.files.get({
      fileId: avatarLink1,
      fields: 'webViewLink'
    });
    const avatarLink = response.data.webViewLink;
    const user = new UserModel({
      username: username,
      password: password,
      avatar: avatarLink,
    });
    console.log(user)
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/",(req,res)=>{
    res.send("Hello world!!");
})

app.use("/users",userRouter)

app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})