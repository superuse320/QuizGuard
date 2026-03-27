const quizService        = require('../services/quiz.service');
const asyncHandler       = require('../utils/asyncHandler');
const ApiResponseService = require('../utils/response'); 


const generateNewQuiz = asyncHandler(async (req, res) => {
    const { tema } = req.body;

    if (!tema) {
        return ApiResponseService.error(res, 400, "Por favor, proporciona un tema para el cuestionario.");
    }

    const quizData = await quizService.generateQuiz(tema);
    return ApiResponseService.success(res, "Cuestionario generado exitosamente", quizData); 
});

const submitQuizForEvaluation = asyncHandler(async (req, res) => {
    const { tema, quiz_results } = req.body;

    if (!tema || !quiz_results || !Array.isArray(quiz_results)) {
        return ApiResponseService.error(res, "Datos del cuestionario incompletos o formato inválido.", 400);
    }

    const feedbackData = await quizService.evaluateQuiz({ tema, quiz_results });
    return ApiResponseService.success(res, "Evaluación completada exitosamente", feedbackData); 
});
const regenerateQuestion = asyncHandler(async (req, res) => {
    const { currentQuiz, questionIndex } = req.body;

    const index = questionIndex - 1;

    if (!currentQuiz || questionIndex === undefined || !Array.isArray(currentQuiz.questions)) {
        return ApiResponseService.error(res, "Datos incompletos para regenerar la pregunta.", 400);
    }

    if (index < 0 || index >= currentQuiz.questions.length) {
        return ApiResponseService.error(res, "Índice de pregunta fuera de rango.", 400);
    }

    const newQuestion = await quizService.regenerateQuestion({ currentQuiz, questionIndex: index });

    const updatedQuiz = {
        ...currentQuiz,
        questions: currentQuiz.questions.map((q, i) => i === index ? newQuestion : q)
    };

    return ApiResponseService.success(res, "Pregunta regenerada exitosamente", updatedQuiz);
});
module.exports = {
    generateNewQuiz,
    submitQuizForEvaluation,
    regenerateQuestion,  
};