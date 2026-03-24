const Groq = require("groq-sdk");
const quizTemplate = require("../utils/template/quizStructure");
const groq = new Groq();
const QUIZ_AGENT_PROMPT = {
  role: "system",
  content: `Eres un experto en pedagogía y diseño de interfaces de formularios.
  
  Tu misión es generar cuestionarios técnicos en formato JSON.
  DEBES seguir esta estructura EXACTA para el objeto de respuesta:
  ${JSON.stringify(quizTemplate, null, 2)}

  DIRECTRICES CRÍTICAS:
  1. No inventes campos nuevos. Usa solo los que aparecen en la plantilla.
  2. El campo 'type' define cómo se verá la pregunta. Usa 'choice' o 'checks' para preguntas con respuestas correctas.
  3. Si el tema es Química Orgánica, asegúrate de que 'title' y 'options' usen terminología técnica correcta.
  4. Genera un total de 10 preguntas.
  5. Responde ÚNICAMENTE el JSON, sin texto explicativo.`
};

const generateQuiz = async (topic) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        QUIZ_AGENT_PROMPT,
        { role: "user", content: `Genera un cuestionario avanzado de Química Orgánica sobre: ${topic}` }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2 
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error en Groq Service:", error);
    throw error;
  }
};

module.exports = { generateQuiz };