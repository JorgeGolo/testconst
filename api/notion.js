export default async function handler(req, res) {
    const { REACT_APP_NOTION_API_KEY, REACT_APP_NOTION_DATABASE_ID } = process.env;
  
    try {
      const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NOTION_API_KEY}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error en la API de Notion");
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "No se pudo obtener datos de Notion" });
    }
  }
  