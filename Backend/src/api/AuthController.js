const AuthService = require('../services/AuthServices');

const registerUser = async(req, res)=> {
    const{userName, password} = req.body;
    const profile_Img = req.file ? `/uploads/profile/${req.file.filename}` : `/uploads/profile/default_profile/profile.png`;

    try{
        const newUser = await AuthService.registerUser(userName , password, profile_Img);
        res.status(201).json({
            message : '회원가입 성공',
            user : newUser,
        });


    }catch(err) {
        res.status(400).json({message : err.message});
    }
};

module.exports = {
    registerUser
};