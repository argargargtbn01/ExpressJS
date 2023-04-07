const mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1/book_project',{
//   useNewUrlParser:true,
//   useUnifiedTopology:true
// });
mongoose.connect(process.env.MONGO_URL);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  username:String,  
  password:String,
  email:String,
  name:String,
  identification_number:String,
  address:String,
  phone_number:String,
  avatar : String
},{
    collection:"user"
});

const UserModel = mongoose.model("user",UserSchema)

module.exports = UserModel;