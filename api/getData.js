require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido, usa POST.' });
  }

  try {
    const { titulo, contenido } = req.body;

    if (!titulo || !contenido) {
      return res.status(400).json({ error: "Se requieren 'titulo' y 'contenido' en el body." });
    }

    let respuestaIA;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Genera una pregunta sobre el siguiente contenido: ${contenido}.
        Debes incluir cuatro opciones de respuesta y solo una debe ser correcta, las otras tres incorrectas.
        Sigue este formato:
        
        Texto de la pregunta
        Texto de respuesta 
        Texto de respuesta
        Texto de respuesta
        Texto de respuesta
        1
        
        Es importante que no pongas números, letras, ni símbolos delante de las respuestas.
      `;

      console.log("🔍 Enviando prompt a Gemini para:", titulo);

      const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });

      console.log("✅ Respuesta recibida de Gemini:", result);

      if (result.response && result.response.candidates && result.response.candidates.length > 0) {
        respuestaIA = result.response.candidates[0].content.parts[0].text;
      } else {
        console.error("⚠️ Respuesta vacía de Gemini:", result);
        respuestaIA = "Error: La IA no generó una respuesta válida.";
      }

    } catch (error) {
      console.error("❌ Error al generar la pregunta con Gemini API:", error);
      respuestaIA = "Error al generar la pregunta con Gemini API.";
    }

    res.status(200).json({
      titulo: titulo,
      contenido: contenido,
      respuestaIA: respuestaIA,
    });

  } catch (error) {
    console.error('❌ Error en el servidor:', error);
    res.status(500).json({ error: 'Error al obtener los datos.' });
  }
}
