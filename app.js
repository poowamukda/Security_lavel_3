//jshint esversion:6

/////////////////////////////////////////////////////CODE ENcryption Level 3//////////////////////////////// 
require('dotenv').config() /*  1.require --> dotenv 2 touch .env*/
// console.log(process.env) // remove this after you've confirmed it is working

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.API_KEY);/*การเข้าถึง API_KEY ใน .env*/


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(`mongodb://127.0.0.1:27017/userDB`);

// const userSchema = {  /*แบบดั่งเดิม */
//   email: String,
//   pass: String,
// };
/************************************ การเข้ารหัส  **********************************************/
const userSchema = new mongoose.Schema({ /*1.การเข้ารหัส เปลี่ยนเป็น object mongoose  */
  email: String,
  pass: String,
});
SECRET = process.env.SECRET;
userSchema.plugin(encrypt,{secret:SECRET, encryptedFields: ['pass']});        /* หากต้องการเพิ่มหลายฟิลล์ encryptedFields: ['pass' ,['pass']*/

/** (__^__) เพิ่มแพ็คเก็จลงใน userSchema  , ฟิลด์ ที่ต้องการเข้ารหัส  */
/********************************************************************************************/




const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) => {
  res.render(`home`);
});

app.route("/login")
  .get((req, res) => {
    res.render(`login`);
})
.post(async (req, res) => {
        const email= req.body.username;
        const pass = req.body.password;
        
        
        await User.findOne({email : email })
        .then((foundUser)=> {
            if(foundUser.pass === pass){
                res.render("secrets");
            }
            else{
              console.log("ข้อมูลไม่ถูกต้อง");
              res.render("login");
            }
        })
        .catch((err)=> console.log(err));
});







app.route(`/register`)
.get((req, res) => {
  res.render(`register`);
})
.post(async (req, res) => {
  const newUser = new User({
    email: req.body.username,
    pass: req.body.password,
  });
  console.log(`Email:${newUser.email}  pass:${newUser.pass}`);
  try {
    await newUser.save();
    res.render("secrets");
    console.log("บันทึกข้อมูลสำเร็จ");
  } catch (err) {
    console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล", error);
  }
});




app.route(`/logout`).
get((req,res)=>{
res.render("home.ejs");
});



app.listen(3000, () => {
  console.log("Server started on port 3000.");
});