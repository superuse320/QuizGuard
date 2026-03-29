module.exports = {
  version: "1.0",
  title: "Título del Cuestionario",
  description: "Descripción breve",
  questions: [
    // ── Texto ──────────────────────────────────────────────
    {
      title: "Respuesta corta",
      description: "Una sola línea de texto",
      type: "short_answer",
      required: true
    },
    {
      title: "Párrafo",
      description: "Texto largo, varias líneas",
      type: "paragraph",
      required: false
    },

    // ── Selección ──────────────────────────────────────────
    {
      title: "Opción múltiple (varias respuestas)",
      description: "",
      type: "multiple_choice",
      required: true,
      options: ["Opción A", "Opción B", "Opción C"],
      correctAnswers: ["Opción A", "Opción C"]
    },
    {
      title: "Checkboxes",
      description: "",
      type: "checkboxes",
      required: false,
      options: ["A", "B", "C"],
      correctAnswers: ["A", "B"]
    },
    {
      title: "Opción única",
      description: "",
      type: "choice_unique",
      required: true,
      options: ["Sí", "No", "Tal vez"],
      correctAnswers: ["Sí"]
    },
    {
      title: "Dropdown",
      description: "Lista desplegable",
      type: "dropdown",
      required: true,
      options: ["Ecuador", "Bolivia", "Perú", "Colombia"]
    },

    // ── Escalas / Valoración ───────────────────────────────
    {
      title: "Escala lineal",
      description: "",
      type: "linear_scale",
      required: true,
      scaleMin: 1,
      scaleMax: 10,
      scaleMinLabel: "Bajo",
      scaleMaxLabel: "Alto"
    },
    {
      title: "Escala de emojis",
      description: "",
      type: "emoji_scale",
      required: false,
      emojis: ["😡", "😕", "😐", "🙂", "😄"]
    },
    {
      title: "Calificación con estrellas",
      description: "",
      type: "star_rating",
      required: false,
      starsMax: 5
    },

    // ── Orden / Ranking ────────────────────────────────────
    {
      title: "Ranking de preferencias",
      description: "Ordena de mayor a menor",
      type: "ranking",
      required: false,
      options: ["Precio", "Calidad", "Velocidad", "Soporte"]
    },

    // ── Formatos específicos ───────────────────────────────
    {
      title: "Número",
      description: "Solo valores numéricos",
      type: "number",
      required: false,
      min: 0,
      max: 999
    },
    {
      title: "Correo electrónico",
      description: "",
      type: "email",
      required: true
    },
    {
      title: "URL / Sitio web",
      description: "",
      type: "url",
      required: false
    },
    {
      title: "Teléfono",
      description: "",
      type: "phone",
      required: false
    },
    {
      title: "Fecha",
      description: "",
      type: "date",
      required: false
    }
  ]
};