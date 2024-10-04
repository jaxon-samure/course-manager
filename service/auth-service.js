const userModel = require("../models/user-model")
const bcrypt = require('bcrypt')
const User = require('../models/user-model')
const UserDto = require("../dtos/user-dto")

class AuthService {
    async register(email, password){
        const existUser = await userModel.findOne({email})
        if(existUser){
            throw new Error(`User with existing email ${email} already register`)
        }

        const hashPassword = await bcrypt.hash(password.toString(), 10)
        const user = await userModel.create({email:email, password:hashPassword})
        console.log(user)
        const userDto = new UserDto(user)

        return {userDto} 
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
