const { openRouter } = require('../../../config/iaConfig');

const callOpenRouter = async (payload) => {
  console.log("[OpenRouter] Iniciando petición...");
  try {
    const completion = await openRouter.chat.completions.create({
      ...payload,
      model: "meta-llama/llama-3.3-70b-instruct",
      stream: false,
    });
    console.log("[OpenRouter] Respuesta recibida con éxito.");
    console.log("Message", completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`[OpenRouter] Error: ${error.message}`);
    throw error;
  }
};

module.exports = { callOpenRouter };