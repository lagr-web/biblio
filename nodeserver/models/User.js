import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
   
   email: {
       type: String,
       required: true,
     },
     password: {
       type: String,
       required: true,
     }
})

const User = mongoose.model("users", loginSchema);

export default User;
