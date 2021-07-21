const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshTOken=new Schema({
      token:{type:String,unique:true}
})
module.exports=mongoose.model('token',refreshTOken);