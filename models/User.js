const mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1/book_project',{
//   useNewUrlParser:true,
//   useUnifiedTopology:true
// });
mongoose.connect('mongodb+srv://argargargtbn01:argargargtbn1@test.js6fg.mongodb.net/book_project');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: String,
  username:String,  
  password:String,
  email:String,
  name:String,
  identification_number:String,
  address:String,
  phone_number:String
},{
    collection:"user"
});

const UserModel = mongoose.model("user",UserSchema)

module.exports = UserModel;