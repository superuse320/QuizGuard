const router       = require('express').Router()
const ctrl         = require('../controllers/profile.controller')
const auth         = require('../middlewares/auth.middleware')
const roles        = require('../middlewares/roles.middleware')
const asyncHandler = require('../utils/asyncHandler')

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Gestión de perfiles de usuario
 */

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Ver mi perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Perfil no encontrado
 */
router.get('/me', auth, asyncHandler(ctrl.getMyProfile))

/**
 * @swagger
 * /api/profiles/me:
 *   put:
 *     summary: Actualizar mi propio perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan García
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/me', auth, asyncHandler(ctrl.update))

/**
 * @swagger
 * /api/profiles/students:
 *   get:
 *     summary: Listar estudiantes
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/students', auth, roles('teacher', 'admin'), asyncHandler(ctrl.getStudents))

/**
 * @swagger
 * /api/profiles/teachers:
 *   get:
 *     summary: Listar profesores
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profesores
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/teachers', auth, roles('teacher', 'admin'), asyncHandler(ctrl.getTeachers))

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Listar todos los perfiles
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los perfiles
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin
 */
router.get('/', auth, roles('admin'), asyncHandler(ctrl.getAll))

/**
 * @swagger
 * /api/profiles/{id}:
 *   put:
 *     summary: Admin actualiza cualquier perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del perfil
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan García
 *               role:
 *                 type: string
 *                 enum: [student, teacher, admin]
 *                 example: teacher
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin
 *       404:
 *         description: Perfil no encontrado
 */
router.put('/:id', auth, roles('admin'), asyncHandler(ctrl.updateById))

/**
 * @swagger
 * /api/profiles/{id}:
 *   delete:
 *     summary: Eliminar perfil
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del perfil
 *     responses:
 *       200:
 *         description: Perfil eliminado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo admin
 *       404:
 *         description: Perfil no encontrado
 */
router.delete('/:id', auth, roles('admin'), asyncHandler(ctrl.remove))

module.exports = router