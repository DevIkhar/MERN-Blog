const {Router} = require('express');
const {registerUser, loginUser, getUser, getAuthors, changeAvtar, editUser} =require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware')

const router = Router()
router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/:id',getUser)
router.get('/',getAuthors)
router.post('/change-avtar', authMiddleware,  changeAvtar)
router.patch('/edit-user', authMiddleware, editUser)

router.get('/',(req, res, next)=>{
    res.json("This is user routes");
})

module.exports= router