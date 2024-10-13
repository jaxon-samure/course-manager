const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model');
const { login } = require('./auth-service');
require('dotenv').config();


class TokenService {
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'})

        return {accessToken, refreshToken}
    }

    async savedToken(user_id,refreshToken){
        const existToken = await tokenModel.findOne({user:user_id})

        if(existToken){
            existToken.refreshToken = refreshToken
            return existToken.save()
        }
        const token = await tokenModel.create({user:user_id, refreshToken})
        return token
    }


    async removeToken(refreshToken){
        const refreshTokenValue = refreshToken;
        const result = await tokenModel.deleteOne({ refreshToken: refreshTokenValue });

    }

    async findToken(refreshToken){
        const token_data = await tokenModel.findOne({refreshToken:refreshToken});
        return token_data
    }
    
    validateRefreshToken(token){
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_KEY)
        } catch (error) {
            return null
        }
    }

    validateAccessToken(token){
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_KEY)
        } catch (error) {
            return null
        }
    }
}

module.exports = TokenService;