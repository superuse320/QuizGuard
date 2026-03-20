const supabase           = require('../config/supabase')
const ApiResponseService = require('../utils/response')

const roles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', req.user.id)
        .single()

      if (error || !data) {
        return ApiResponseService.notFound(res, 'Perfil no encontrado')
      }

      if (!allowedRoles.includes(data.role)) {
        return ApiResponseService.forbidden(res, `Acceso denegado. Roles permitidos: ${allowedRoles.join(', ')}`)
      }

      req.profile = data
      next()

    } catch (err) {
      return ApiResponseService.internalServerError(res, err.message)
    }
  }
}

module.exports = roles