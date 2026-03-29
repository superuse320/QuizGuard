const { callAIWithRotation } = require('./ia/iaRotation.service');
const { 
  QUIZ_GENERATOR_PROMPT, 
  QUIZ_EVALUATOR_PROMPT, 
  QUIZ_REGENERATOR_PROMPT 
} = require("./quiz.agents");

const generateQuiz = async (topic) => {
  try {
    const result = await callAIWithRotation({
      messages: [
        QUIZ_GENERATOR_PROMPT,
        { role: "user", content: `Genera un cuestionario avanzado sobre: ${topic}` }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    return result;
  } catch (error) {
    console.error("Error al generar quiz:", error);
    throw error;
  }
};

const evaluateQuiz = async (resultsData) => {
  try {
    const result = await callAIWithRotation({
      messages: [
        QUIZ_EVALUATOR_PROMPT,
        { 
          role: "user", 
          content: `Analiza estos resultados: ${JSON.stringify(resultsData)}` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    return result;
  } catch (error) {
    console.error("Error al evaluar quiz:", error);
    throw error;
  }
};

const regenerateQuestion = async ({ currentQuiz, questionIndex, instruction }) => {
  try {
    const preguntaActual = currentQuiz.questions[questionIndex];

    const result = await callAIWithRotation({
      messages: [
        QUIZ_REGENERATOR_PROMPT,
        {
          role: "user",
          content: `Cuestionario actual: ${JSON.stringify(currentQuiz, null, 2)}
          
Pregunta a reemplazar (índice ${questionIndex}):
${JSON.stringify(preguntaActual, null, 2)}

Instrucción del usuario: "${instruction}"

Devuelve SOLO el JSON de la nueva pregunta con la misma estructura.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    return result;
  } catch (error) {
    console.error("Error al regenerar pregunta:", error);
    throw error;
  }
};

module.exports = { generateQuiz, evaluateQuiz, regenerateQuestion };