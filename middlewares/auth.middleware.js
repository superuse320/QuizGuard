const supabase         = require('../config/supabase')
const ApiResponseService = require('../utils/response')

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponseService.unauthorized(res, 'Token no proporcionado')
    }
    const token = authHeader.split(' ')[1]
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return ApiResponseService.unauthorized(res, 'Token inválido')
    }
    req.user = data.user
    next()

  } catch (err) {
    return ApiResponseService.internalServerError(res, err.message)
  }
}
module.exports = authMiddleware