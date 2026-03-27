module.exports = {
  tema: "Arquitectura de Microservicios y Node.js",
  quiz_results: [
    {
      title: "Pregunta corta",
      type: "short",
      userAnswer: "Es un patrón para separar responsabilidades.",
      correctAnswers: ["Desacoplamiento", "Separación de intereses"]
    },
    {
      title: "Pregunta de opción única",
      type: "choice",
      userAnswer: ["Opción 2"],
      correctAnswers: ["Opción 1"]
    },
    {
      title: "Pregunta de selección múltiple",
      type: "checks",
      userAnswer: ["A", "B"],
      correctAnswers: ["A", "C"]
    },
    {
      title: "Pregunta de escala",
      type: "scale",
      userAnswer: 7,
      correctAnswers: [10],
      scaleMin: 1,
      scaleMax: 10
    },
    {
      title: "Pregunta larga (Ensayo)",
      type: "long",
      userAnswer: "Los microservicios permiten que cada equipo trabaje de forma independiente, mejorando la velocidad de despliegue y permitiendo escalar solo las partes necesarias del sistema.",
      correctAnswers: ["Independencia", "Escalabilidad", "Despliegue continuo"]
    },
    {
      title: "Pregunta de fecha",
      type: "date",
      userAnswer: "2024-03-26",
      correctAnswers: ["2024-03-20"]
    },
    {
      title: "Pregunta de cuadrícula",
      type: "grid_single",
      userAnswer: [
        { "row": "Fila 1", "column": "Columna 2" },
        { "row": "Fila 2", "column": "Columna 1" }
      ],
      correctAnswers: [
        { "row": "Fila 1", "column": "Columna 1" },
        { "row": "Fila 2", "column": "Columna 1" }
      ]
    }
  ]
}
