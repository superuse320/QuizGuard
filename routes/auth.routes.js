const router       = require('express').Router()
const ctrl         = require('../controllers/auth.controller')
const auth         = require('../middlewares/auth.middleware')
const asyncHandler = require('../utils/asyncHandler')

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y registro
 */

/**
 * @swagger
 * /api/auth/register-profile:
 *   post:
 *     summary: Crear perfil tras registro
 *     tags: [Auth]
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
 *               role:
 *                 type: string
 *                 enum: [student,teacher]
 *                 example: student
 *     responses:
 *       201:
 *         description: Perfil creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       409:
 *         description: Perfil ya existe
 */
router.post('/register-profile', auth, asyncHandler(ctrl.registerProfile))

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado con su perfil
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Perfil no encontrado
 */
router.get('/me', auth, asyncHandler(ctrl.me))

module.exports = router