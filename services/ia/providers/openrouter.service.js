const { openRouter } = require('../../../config/iaConfig');

const callOpenRouter = async (payload) => {
//  console.log("[OpenRouter] Iniciando petición...");
  try {
    const completion = await openRouter.chat.completions.create({
      ...payload,
      model: "meta-llama/llama-3.3-70b-instruct",
      stream: false,
      response_format: { type: "json_object" },
    });
  //  console.log("[OpenRouter] Respuesta recibida con éxito.");
   
    return completion.choices[0].message.content;
  } catch (error) {
    //console.error(`[OpenRouter] Error: ${error.message}`);
    throw error;
  }
};

module.exports = { callOpenRouter };