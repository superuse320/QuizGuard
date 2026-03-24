module.exports = {
  version: "1.0",
  title: "Título del Cuestionario",
  description: "Descripción breve",
  questions: [
    {
      title: "Pregunta corta",
      description: "Detalle opcional",
      type: "short",
      required: true
    },
    {
      title: "Pregunta de opción única",
      description: "",
      type: "choice",
      required: true,
      options: ["Opción 1", "Opción 2"],
      correctAnswers: ["Opción 1"]
    },
    {
      title: "Pregunta de selección múltiple",
      description: "",
      type: "checks",
      required: false,
      options: ["A", "B", "C"],
      correctAnswers: ["A", "B"]
    },
    {
      title: "Pregunta de escala",
      description: "",
      type: "scale",
      required: true,
      scaleMin: 1,
      scaleMax: 10,
      scaleMinLabel: "Bajo",
      scaleMaxLabel: "Alto"
    },
    {
      title: "Pregunta larga",
      description: "",
      type: "long",
      required: false
    },
    {
      title: "Pregunta de fecha",
      description: "",
      type: "date",
      required: false
    },
    {
      title: "Pregunta de cuadrícula",
      description: "",
      type: "grid_single",
      required: false,
      rows: ["Fila 1", "Fila 2"],
      columns: ["Columna 1", "Columna 2"]
    }
  ]
};