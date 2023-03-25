const mongoose = require("mongoose");


const BlogSchema = new mongoose.Schema({
    product_name : {type:String},
    description : {type:String},
    price : {type:String},
    image : {type:String, default: "/defaults/upload.jpg"},
    

},{
    timestamps: true
});
const BlogModel = mongoose.model("blog", BlogSchema)
module.exports = {
    BlogModel
}