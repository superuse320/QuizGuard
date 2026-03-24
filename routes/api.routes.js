const router       = require('express').Router()
const ctrl         = require('../controllers/auth.controller')
const auth         = require('../middlewares/auth.middleware')
const asyncHandler = require('../utils/asyncHandler')


/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Ver Informacion de Usuario Autentificado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario obtenido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/me', auth, asyncHandler(ctrl.get))

module.exports = router