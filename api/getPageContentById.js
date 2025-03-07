require('dotenv').config();

export default async function handler(req, res) {
  const { REACT_APP_NOTION_API_KEY } = process.env;
  const { pageId } = req.query;

  if (!pageId) {
    return res.status(400).json({ error: "ID de página requerido" });
  }

  try {
    // Obtener el contenido de la página por ID
    const pageResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`, {
      headers: {
        "Authorization": `Bearer ${REACT_APP_NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
      },
    });

    if (!pageResponse.ok) {
      throw new Error("Error al obtener el contenido de la página");
    }

    const pageData = await pageResponse.json();
    res.status(200).json(pageData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "No se pudo obtener el contenido de la página" });
  }
}
