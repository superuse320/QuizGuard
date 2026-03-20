const ProfileModel       = require('../models/profile.model')
const ProfileResource    = require('../resources/profile.resource')
const ApiResponseService = require('../utils/response')

const ProfileController = {

  async getMyProfile(req, res, next) {
    const profile = await ProfileModel.findById(req.user.id)
    if (!profile) return ApiResponseService.notFound(res, 'Perfil no encontrado')
    return ApiResponseService.success(res, 'Perfil obtenido', ProfileResource.single(profile))
  },

  async getAll(req, res, next) {
    const profiles = await ProfileModel.findAll()
    return ApiResponseService.success(res, 'Perfiles obtenidos', ProfileResource.collection(profiles))
  },

  async getStudents(req, res, next) {
    const students = await ProfileModel.findByRole('student')
    return ApiResponseService.success(res, 'Estudiantes obtenidos', ProfileResource.collection(students))
  },

  async getTeachers(req, res, next) {
    const teachers = await ProfileModel.findByRole('teacher')
    return ApiResponseService.success(res, 'Profesores obtenidos', ProfileResource.collection(teachers))
  },

  async create(req, res, next) {
    const { name, role } = req.body

    if (!name) {
      return ApiResponseService.badRequest(res, 'El nombre es requerido')
    }

    const validRoles = ['student', 'teacher', 'admin']
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

    return ApiResponseService.created(res, 'Perfil creado', ProfileResource.single(profile))
  },

  async update(req, res, next) {
    const { name } = req.body

    if (!name) {
      return ApiResponseService.badRequest(res, 'El nombre es requerido')
    }

    const exists = await ProfileModel.existsById(req.user.id)
    if (!exists) {
      return ApiResponseService.notFound(res, 'Perfil no encontrado')
    }

    const profile = await ProfileModel.update(req.user.id, { name })
    return ApiResponseService.success(res, 'Perfil actualizado', ProfileResource.single(profile))
  },

  async updateById(req, res, next) {
    const { id }         = req.params
    const { name, role } = req.body

    if (!name && !role) {
      return ApiResponseService.badRequest(res, 'Se requiere al menos name o role')
    }

    const validRoles = ['student', 'teacher', 'admin']
    if (role && !validRoles.includes(role)) {
      return ApiResponseService.badRequest(res, 'Rol inválido')
    }

    const exists = await ProfileModel.existsById(id)
    if (!exists) {
      return ApiResponseService.notFound(res, 'Perfil no encontrado')
    }

    const data = {}
    if (name) data.name = name
    if (role) data.role = role

    const profile = await ProfileModel.update(id, data)
    return ApiResponseService.success(res, 'Perfil actualizado', ProfileResource.single(profile))
  },

  async remove(req, res, next) {
    const { id } = req.params

    const exists = await ProfileModel.existsById(id)
    if (!exists) {
      return ApiResponseService.notFound(res, 'Perfil no encontrado')
    }

    await ProfileModel.delete(id)
    return ApiResponseService.noContent(res, 'Perfil eliminado')
  }

}

module.exports = ProfileController