const ApiResponseService = require('../utils/response')

const AuthController = {
  async get(req, res) {
    const data = req.user  
    return ApiResponseService.success(res, 'Información del Usuario', data)
  }
}
module.exports = AuthController