const supabase = require('../config/supabase')
const ApiResponseService = require('../utils/response')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return ApiResponseService.unauthorized(res, 'Token no proporcionado')
  }
  const token = authHeader.split(' ')[1]
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user) {
    return ApiResponseService.unauthorized(res, 'Token inválido o expirada')
  }
  req.user = data.user
  next()
}
module.exports = authMiddleware