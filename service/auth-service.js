const userModel = require("../models/user-model")
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const UserDto = require("../dtos/user-dto")
const TokenService = require('../service/token-service');
const mailService = require("./mail-service");
const tokenService = new TokenService();



class AuthService {
    async register(email, password){
        const existUser = await userModel.findOne({email})
        if(existUser){
            throw new Error(`User with existing email ${email} already register`)
        }

        const hashPassword = await bcrypt.hash(password.toString(), 10)
        const user = await userModel.create({email:email, password:hashPassword})
        
        const userDto = new UserDto(user)
        await mailService.sendEmail(email, `${process.env.API_URl}/api/auth/${userDto.id}`)


        const tokens = tokenService.generateToken({...userDto })
        await tokenService.savedToken(userDto.id, tokens.refreshToken)

        return { user: userDto, ...tokens}
    }

    async activation(user_id) {
        const user = await userModel.findById(user_id);
        if (!user){
            throw new Error("user not defined")
        }

        user.isActivated = true;
        await user.save()
    } 
};

module.exports = new AuthService()
