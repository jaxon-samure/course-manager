const authService = require('../service/auth-service')

class AuthController{
    async register(req, res, next){
        try {
            console.log(req.body)
            const {email, password} = req.body
            const data = await authService.register(email, password)
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

