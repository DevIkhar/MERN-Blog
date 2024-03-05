const {Schema, model}=require('mongoose')
const userSchema = new Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    pass:{type: String, required: true},
    avtar:{type: String},
    posts:{type: Number, default: 0}
})
module.exports= model('User', userSchema)