const { callCerebras } = require('./providers/cerebras.service');
const { callGroq } = require('./providers/groq.service');
const { callOpenRouter } = require('./providers/openrouter.service');

const aiInventory = [
  { name: 'Cerebras', execute: (p) => callCerebras(p) },
  { name: 'Groq', execute: (p) => callGroq(p) },
  { name: 'Open iA', execute: (p) => callOpenRouter(p) },
  
];

const cleanJSON = (text) => {
  try {
    const raw = text.replace(/```json|```/g, "").trim();
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : JSON.parse(raw);
  } catch (e) {
    throw new SyntaxError("Error al generar preguntas");
  }
};

async function callAIWithRotation(payload, options = {}) {
  const { validate } = options;
  let lastError = null;

  for (const ai of aiInventory) {
    try {
     // console.log(`📡 Intentando con: ${ai.name}...`);
      
      const rawResponse = await ai.execute(payload);
      const parsed = cleanJSON(rawResponse);
      const validated = typeof validate === 'function' ? validate(parsed) : parsed;
      return validated;

    } catch (error) {
      lastError = new Error(`${ai.name}: ${error.message}`);
      //console.warn(`${ai.name} falló: ${error.message}. Probando siguiente...`);
    }
  }
  
  throw new Error(`Se alcanzo el limite. ${lastError ? `Ultimo error: ${lastError.message}` : ''}`.trim());
}

module.exports = { callAIWithRotation };