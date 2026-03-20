const ProfileModel       = require('../models/profile.model')
const ApiResponseService = require('../utils/response')

const AuthController = {

  async registerProfile(req, res, next) {
    const { name, role } = req.body

    if (!name) {
      return ApiResponseService.badRequest(res, 'El nombre es requerido')
    }

    const validRoles = ['student', 'teacher']
    if (role && !validRoles.includes(role)) {
      return ApiResponseService.badRequest(res, 'Rol inválido')
    }

    const exists = await ProfileModel.existsById(req.user.id)
    if (exists) {
      return ApiResponseService.conflict(res, 'El perfil ya existe')
    }

    const profile = await ProfileModel.create({
      id:   req.user.id,
      name,
      role: role || 'student'
    })

    return ApiResponseService.created(res, 'Perfil registrado', profile)
  },

  async me(req, res, next) {
    const profile = await ProfileModel.findById(req.user.id)

    if (!profile) {
      return ApiResponseService.notFound(res, 'Perfil no encontrado')
    }

    return ApiResponseService.success(res, 'Usuario autenticado', {
      id:    req.user.id,
      email: req.user.email,
      ...profile
    })
  }

}

module.exports = AuthController