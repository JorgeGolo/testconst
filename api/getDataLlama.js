// getDataLlama.js
import { obtenerArticuloPorTitulo } from "./firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuración de Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { titulo } = req.query;
      const data = await obtenerArticuloPorTitulo(titulo);

      const contenido = data.contenido || "";
      const seccion = data.seccion || "";
      const contenidoseccion = data.contenidoseccion || "";
      const capitulo = data.numerocapitulo || "";
      const contenidocapitulo = data.contenidocapitulo || "";
      const tituloFinal = data.titulo || "";
      const nombreart = data.nombre || "";
      const contenidotitulo = data.contenidotitulo || "";

      const concatenado = `${tituloFinal} ${contenidotitulo} ${capitulo} ${contenidocapitulo} ${seccion} ${contenidoseccion} ${nombreart} ${contenido}`;

      let respuestaIA;
      try {
        const completion = await genAI.completions.create({
          prompt: `Genera una pregunta sobre el siguiente contenido: ${concatenado}. Debes incluir cuatro opciones de respuesta y solo una debe ser correcta, las otras tres incorrectas.`,
          temperature: 0.7,
        });

        respuestaIA = completion.choices[0].text;
      } catch (error) {
        console.error("Error al generar la pregunta con Gemini API:", error);
        respuestaIA = "Error al generar la pregunta con Gemini API.";
      }

      res.status(200).json({
        articulo: randomArticuloDoc.id,
        contenido,
        seccion,
        contenidoseccion,
        contenidotitulo,
        contenidocapitulo,
        capitulo,
        titulo: tituloFinal,
        respuestaIA,
      });
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      res.status(500).json({ error: "Error al obtener los datos." });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
