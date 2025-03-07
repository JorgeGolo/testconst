//para la API de groq
import Groq from "groq-sdk";

// Configuración de la API de GROQ
const groq = new Groq({ apiKey: process.env.REACT_APP_GROQ_API_KEY });

const selectedOption = "llama3-8b-8192";

export default async function handler(req, res) {
    try {
      const completion = await groq.chat.completions.create({
        messages: [  // corregido "meesages" a "messages"
          {
            role: "user",
            content: "say hi",
          },
        ],
        model: selectedOption,
      });
  
      const respuestaIA = completion.choices[0].message.content;
      res.status(200).json({ respuestaIA });
    } catch (error) {
      console.error("Error al generar la pregunta con GROQ API:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }