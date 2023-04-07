const express = require("express");
const userRouter = require("./routes/User");
var bodyParser = require('body-parser')
const multer = require("multer");
const fs = require("fs");
const UserModel = require("./models/User");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/static', express.static('image'))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
 
var upload = multer({ storage: storage })


app.post('/uploadphoto', upload.single('avatar'), (req, res) => {
    const { username, password } = req.body;

    // Đọc file ảnh từ đường dẫn tạm thời
    const img = fs.readFileSync(req.file.path);
    const encode_img = img.toString('base64');
    const avatar = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype,
        fileName: req.file.filename
    };

    // Tạo đối tượng user mới
    const newUser = new UserModel({
        username,
        password,
        avatar: avatar
    });

    // Lưu user vào cơ sở dữ liệu
    newUser.save()
        .then(() => {
            res.send('User created successfully');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error creating user');
        });
});

app.get("/users", (req, res) => {
    UserModel.find({}, { username: "quang1", avatar: 1 }) // thêm trường avatar vào phần projection
      .then((users) => {
        res.send(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      });
  });

app.get("/",(req,res)=>{
    res.send("Hello world!!");
})

app.use("/users",userRouter)

app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})