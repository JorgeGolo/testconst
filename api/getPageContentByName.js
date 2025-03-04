require('dotenv').config();

export default async function handler(req, res) {
    const { REACT_APP_NOTION_API_KEY, REACT_APP_NOTION_DATABASE_ID } = process.env;
    const { pageName } = req.query;

    if (!pageName) {
        return res.status(400).json({ error: "Nombre de página requerido" });
    }

    try {
        // 1. Obtener la página por nombre dentro de la base de datos
        const databaseResponse = await fetch(`https://api.notion.com/v1/databases/${REACT_APP_NOTION_DATABASE_ID}/query`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${REACT_APP_NOTION_API_KEY}`,
                "Notion-Version": "2022-06-28",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: {
                    property: "Nombre", // Asumiendo que "Nombre" es el nombre de tu propiedad de título
                    title: {
                        equals: pageName,
                    },
                },
            }),
        });

        if (!databaseResponse.ok) {
            throw new Error("Error al buscar la página en la base de datos");
        }

        const databaseData = await databaseResponse.json();

        if (databaseData.results.length === 0) {
            return res.status(404).json({ error: "Página no encontrada en la base de datos" });
        }

        const pageId = databaseData.results[0].id;

        // 2. Obtener el contenido de la página
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