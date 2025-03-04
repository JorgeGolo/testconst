require('dotenv').config();

export default async function handler(req, res) {
    const { REACT_APP_NOTION_API_KEY } = process.env;
    const { pageIds } = req.query;

    if (!pageIds) {
        return res.status(400).json({ error: "Page IDs requeridos" });
    }

    try {
        const idsArray = JSON.parse(pageIds);

        if (!Array.isArray(idsArray)) {
            return res.status(400).json({ error: "Page IDs debe ser un array" });
        }

        const promises = idsArray.map(async (pageId) => {
            const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
                headers: {
                    "Authorization": `Bearer ${REACT_APP_NOTION_API_KEY}`,
                    "Notion-Version": "2022-06-28",
                },
            });

            if (!response.ok) {
                console.error(`Error al obtener la página con ID: ${pageId}`);
                return null;
            }

            return response.json();
        });

        const results = await Promise.all(promises);
        const filteredResults = results.filter(result => result !== null);

        const pageNames = filteredResults.map(page => {
            if (page && page.properties && page.properties.title && page.properties.title.title && page.properties.title.title[0] && page.properties.title.title[0].plain_text) {
                return page.properties.title.title[0].plain_text;
            } else {
                console.error("Estructura de página inesperada:", page);
                return "Nombre no encontrado";
            }
        });

        res.status(200).json(pageNames);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "No se pudieron obtener los nombres de las páginas relacionadas" });
    }
}