const User=require('../models/userModel')
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path= require('path')
const {v4:uuid}= require('uuid')
const {avtar} = require('../models/userModel')

// ========= Register a new user=========
const HttpError=require('../models/errorModel')
//POST : api/users/register   UNPROTECTED
const registerUser = async (req, res, next)=>{
    try{
        const{name, email, pass, cPass}=req.body;
        if(!name || !email || !pass || !cPass){
            return next(new HttpError("Fill the all fields", 422))
        } 
        const newEmail=email.toLowerCase()
        const emailExists= await User.findOne({email: newEmail})
        if(emailExists){
            return next(new HttpError("Email already exists", 422))
        }
        if((pass.trim()).length < 6){
            return next(new HttpError("Password should be at least 6 charecters", 422))
        }
        if(pass != cPass){
            return next(new HttpError("Password do not match", 422))
        }
        const salt= await bcrypt.genSalt(10)
        const hashedPass= await bcrypt.hash(pass, salt);
        const newUser = await User.create({name, email:newEmail, pass:hashedPass})
        res.status(201).json(`New User ${newUser.email} registered`)
          } catch(error){
        return next(new HttpError("User registratin failed", 422))
      }
}
  





// ========= Login a registered user=========
//POST : api/users/login   UNPROTECTED
const loginUser =async (req, res, next)=>{
    try{
        const{email, pass}= req.body;
        if(!email || !pass){
            return next(new HttpError("Filled the details",422))
        }
        const newEmail =email.toLowerCase();
        const user =await User.findOne({email:newEmail})
        if(!user){
            return next(new HttpError("Invalid Credentials",422))
        }
        const comparePass=await bcrypt.compare(pass,user.pass)
        if(!comparePass){
            return next(new HttpError("Invalid Credentials",422))
        }
        const{_id:id, name}=user;
        const token= jwt.sign({id, name}, process.env.JWT_SECRET,{expiresIn:"1d"})
        res.status(200).json({token, id, name})
    } catch(error){
        return next(new HttpError("Login failed. Please check your credentials.", 422))
    }
}





// ========= User profile=========
//POST : api/users/:id   PROTECTED
const getUser =async (req, res, next)=>{
    try{
        const{id} =req.params;
        const user= await User.findById(id).select('-pass');
        if(!user){
            return next(new HttpError("User not Found",404))
        }
        res.status(200).json(user);
    }catch(error){
        return next(new HttpError(error))
    }
}






// ========= Change user avtar =========
//POST : api/users/:change-avtar   PROTECTED
const changeAvtar = async (req, res, next)=>{
    try{
        if(!req.files.avtar){
            return next(new HttpError("Please choose an image", 422))
        }

        // Find user from database
        const user = await User.findById(req.user.id)

        // delete old avtar if exists
        if(user.avtar){
            fs.unlink(path.join(__dirname, '..','uploads', user.avtar), (err)=>{
                if(err){
                    return next(new HttpError(err))
                }
            })
        }

        const {avtar} =req.files;
        // Check files size
        if(avtar.size > 500000){
            return next(new HttpError("Profile picture too big. should be less than 500kb"), 422)
        }
        let fileName;
        fileName = avtar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length-1]
        avtar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err)=>{
            if(err){
                return next(new HttpError(err))
            }
            const updatedAvtar = await User.findByIdAndUpdate(req.user.id, {avtar: newFilename}, {new: true})
            if(!updatedAvtar){
                return next(new HttpError("User couldn't be change", 422))

            }
            res.status(200).json(updatedAvtar)
        })
    } catch(error){
        return next(new HttpError(error))   
    }
}





// ========= Edit user avtar =========
//POST : api/users/:edit-avtar   PROTECTED
const editUser =async (req, res, next)=>{
   try{
    const {name , email, currentPass, newPass, confirmNewPass} = req.body;
    if(!name || !email|| !currentPass|| !newPass){
        return next (new HttpError("Fill all the fields", 422))
    }
    // get user from database
    const user =await User.findById(req.user.id);
    if(!user){
        return next(new HttpError("User not found", 403))
    }
    // make sure new email dosen't already exists.
    const emailExists = await User.findOne({email});
    // We want update other details without changing the emails because it is unique id
    if(emailExists && (emailExists._id != req.user.id)){
        return next(new HttpError("Email already exists", 422))
    }

    // Comapare current pass to db pass
    const validateUserPass = await bcrypt.compare(currentPass, user.pass);
    if(!validateUserPass){
        return next(new HttpError("Invalid current password", 422))
    }

    // Compare new pass
    if(newPass != confirmNewPass){
        return next(new HttpError("New password does not match", 422))
    }

    // Hash new pass
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(newPass, salt);

    // Update User info in db
    const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, pass:hash,}, {new:true})
    res.status(200).json(newInfo)

   } catch(err){
    return next(new HttpError(err))
   }
}





// ========= Get Avtar =========
//POST : api/users/:edit-avtar   UNPROTECTED
const getAuthors = async (req, res, next)=>{
    try{
        const authors = await User.find().select('-pass');
        res.json(authors);
    }catch(error){
        return next(new HttpError(error))
    }
}





module.exports = {registerUser, loginUser, getUser, getAuthors, changeAvtar, editUser}