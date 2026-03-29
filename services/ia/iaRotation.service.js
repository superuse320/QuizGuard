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
    throw new SyntaxError("Error al parsear JSON de la IA");
  }
};

async function callAIWithRotation(payload) {
  let lastError = null;

  for (const ai of aiInventory) {
    try {
      console.log(`📡 Intentando con: ${ai.name}...`);
      
      const rawResponse = await ai.execute(payload);
      return cleanJSON(rawResponse);

    } catch (error) {
      lastError = error;
      console.warn(`${ai.name} falló: ${error.message}. Probando siguiente...`);
    }
  }
  
  throw new Error(`Saturación total. Último error: ${lastError?.message}`);
}

module.exports = { callAIWithRotation };