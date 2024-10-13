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

    async login(email, password){
        const user = await userModel.findOne({email:email})
        if (!user) {
            throw new Error('User nor defind')
        }

        const isPassword = await bcrypt.compare(password, user.password)
        if(!isPassword){
            throw Error('Password is incorrect')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto })
        await tokenService.savedToken(userDto.id, tokens.refreshToken)

        return { user: userDto, ...tokens}
    }

    async logout(refreshToken){
    
        const token = await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw new Error("Bad authorization")
        }

        const userPayload = tokenService.validateRefreshToken(refreshToken)
        const tokenDB = await tokenService.findToken(refreshToken)
        

        if (!tokenDB || !userPayload){
            throw new Error('Bad authorization')
        }

        const user = await userModel.findById(userPayload.id)
        
        const userdto = new UserDto(user)
        const tokens = tokenService.generateToken({...userdto })
        await tokenService.savedToken(userdto.id, tokens.refreshToken)

        return { user: userdto, ...tokens}

    }
};

module.exports = new AuthService()
