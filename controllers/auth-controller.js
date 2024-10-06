const authService = require('../service/auth-service')

class AuthController{
    async register(req, res, next){
        try {
            const {email, password} = req.body
            const data = await authService.register(email, password)
            res.cookie('refreshToken', data.refreshToken, {httpOnly:true, maxAge:30*24*60*60*1000})
            return res.json(data)

        } catch (error) {
            console.log(error)
        }
    }

    async activation(req, res, next){
        try {
            const {id} = req.params
            await authService.activation(id)
            res.json("User activated")
        } catch (error) {
            console.log(error)
        }
    }

};

module.exports = new AuthController()
