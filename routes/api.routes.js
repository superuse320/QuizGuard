const router       = require('express').Router()
const ctrl         = require('../controllers/auth.controller')
const quizCtrl     = require('../controllers/quiz.controller')   // 👈
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

/**
 * @swagger
 * /api/quiz/generate:
 *   post:
 *     summary: Generar un nuevo cuestionario
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tema
 *             properties:
 *               tema:
 *                 type: string
 *                 example: "Historia de Bolivia"
 *     responses:
 *       200:
 *         description: Cuestionario generado exitosamente
 *       400:
 *         description: Falta el tema
 *       401:
 *         description: No autorizado
 */
router.post('/quiz/generate', auth, asyncHandler(quizCtrl.generateNewQuiz))   // 👈

module.exports = router