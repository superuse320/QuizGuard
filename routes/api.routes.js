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
 *                 example: "Arquitectura de Microservicios y Node.js"
 *     responses:
 *       200:
 *         description: Cuestionario generado exitosamente
 *       400:
 *         description: Falta el title
 *       401:
 *         description: No autorizado
 */
router.post('/quiz/generate',auth,  asyncHandler(quizCtrl.generateNewQuiz))   
/**
 * @swagger
 * /api/quiz/evaluate:
 *   post:
 *     summary: Evaluar respuestas de un cuestionario
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
 *               - quiz_results
 *             properties:
 *               tema:
 *                 type: string
 *                 example: "Arquitectura de Microservicios y Node.js"
 *               quiz_results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - type
 *                     - userAnswer
 *                     - correctAnswers
 *                   properties:
 *                     title:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [short, long, choice, checks, scale, date, grid_single]
 *                     userAnswer:
 *                       description: Varía según el tipo de pregunta
 *                     correctAnswers:
 *                       type: array
 *                     scaleMin:
 *                       type: integer
 *                     scaleMax:
 *                       type: integer
 *                 example:
 *                   - title: "¿Qué es el desacoplamiento en microservicios?"
 *                     type: "short"
 *                     userAnswer: "Es un patrón para separar responsabilidades entre servicios."
 *                     correctAnswers: ["Desacoplamiento", "Separación de intereses"]
 *
 *                   - title: "¿Cuál es el protocolo más usado para comunicación entre microservicios?"
 *                     type: "choice"
 *                     userAnswer: ["GraphQL"]
 *                     correctAnswers: ["REST/HTTP"]
 *
 *                   - title: "¿Cuáles son ventajas de usar microservicios?"
 *                     type: "checks"
 *                     userAnswer: ["Escalabilidad independiente", "Despliegue continuo"]
 *                     correctAnswers: ["Escalabilidad independiente", "Despliegue continuo", "Tolerancia a fallos"]
 *
 *                   - title: "Del 1 al 10, ¿qué tan complejo consideras implementar un API Gateway?"
 *                     type: "scale"
 *                     userAnswer: 7
 *                     correctAnswers: [8]
 *                     scaleMin: 1
 *                     scaleMax: 10
 *
 *                   - title: "Explica cómo funciona el patrón Circuit Breaker en microservicios."
 *                     type: "long"
 *                     userAnswer: "El Circuit Breaker detecta fallos repetidos en un servicio y corta las llamadas temporalmente para evitar una cascada de errores en el sistema."
 *                     correctAnswers: ["Tolerancia a fallos", "Corte de circuito", "Prevención de cascada"]
 *
 *                   - title: "¿En qué fecha se lanzó la versión 18 de Node.js LTS?"
 *                     type: "date"
 *                     userAnswer: "2022-10-25"
 *                     correctAnswers: ["2022-10-25"]
 *
 *                   - title: "Relaciona cada herramienta con su categoría"
 *                     type: "grid_single"
 *                     userAnswer:
 *                       - row: "Docker"
 *                         column: "Orquestación"
 *                       - row: "RabbitMQ"
 *                         column: "Base de datos"
 *                     correctAnswers:
 *                       - row: "Docker"
 *                         column: "Contenedores"
 *                       - row: "RabbitMQ"
 *                         column: "Message Broker"
 *     responses:
 *       200:
 *         description: Evaluación completada exitosamente
 *       400:
 *         description: Datos incompletos o formato inválido
 *       401:
 *         description: No autorizado
 */
router.post('/quiz/evaluate',auth,  asyncHandler(quizCtrl.submitQuizForEvaluation));
/**
 * @swagger
 * /api/quiz/regenerate-question:
 *   post:
 *     summary: Regenerar una pregunta específica del cuestionario
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
 *               - currentQuiz
 *               - questionIndex
 *             properties:
 *               currentQuiz:
 *                 type: object
 *                 required:
 *                   - tema
 *                   - questions
 *                 properties:
 *                   tema:
 *                     type: string
 *                     example: "Arquitectura de Microservicios y Node.js"
 *                   questions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         type:
 *                           type: string
 *                           enum: [short, long, choice, checks, scale, date, grid_single]
 *                         options:
 *                           type: array
 *                           items:
 *                             type: string
 *                         correctAnswers:
 *                           type: array
 *               questionIndex:
 *                 type: integer
 *                 example: 1
 *               instruction:
 *                 type: string
 *                 description: Instrucción opcional para guiar la regeneración (tema, tipo, enfoque)
 *                 example: "Cambia la pregunta a tipo checks sobre el uso práctico de microservicios"
 *             example:
 *               currentQuiz:
 *                 tema: "Arquitectura de Microservicios y Node.js"
 *                 questions:
 *                   - title: "¿Qué es el desacoplamiento en microservicios?"
 *                     type: "short"
 *                     correctAnswers: ["Desacoplamiento", "Separación de intereses"]
 *                   - title: "¿Cuál es el protocolo más usado entre microservicios?"
 *                     type: "choice"
 *                     options: ["REST/HTTP", "GraphQL", "SOAP", "FTP"]
 *                     correctAnswers: ["REST/HTTP"]
 *                   - title: "¿Cuáles son ventajas de los microservicios?"
 *                     type: "checks"
 *                     options: ["Escalabilidad independiente", "Despliegue continuo", "Tolerancia a fallos", "Mayor acoplamiento"]
 *                     correctAnswers: ["Escalabilidad independiente", "Despliegue continuo", "Tolerancia a fallos"]
 *               questionIndex: 1
 *               instruction: "Cambia la pregunta a tipo checks sobre el uso práctico de microservicios"
 *     responses:
 *       200:
 *         description: Pregunta regenerada y quiz actualizado
 *       400:
 *         description: Datos incompletos o índice inválido
 *       401:
 *         description: No autorizado
 */
router.post('/quiz/regenerate-question', auth,asyncHandler(quizCtrl.regenerateQuestion));
module.exports = router