require('dotenv').config();

export default async function handler(req, res) {
    const { REACT_APP_NOTION_API_KEY, REACT_APP_NOTION_DATABASE_ID } = process.env;
    const { pageNames } = req.query; // Ahora recibimos un array de nombres

    if (!pageNames) {
        return res.status(400).json({ error: "Nombres de páginas requeridos" });
    }

    try {
        const namesArray = JSON.parse(pageNames);

        if (!Array.isArray(namesArray)) {
            return res.status(400).json({ error: "Nombres de páginas debe ser un array" });
        }

        const promises = namesArray.map(async (pageName) => {
            const response = await fetch(`https://api.notion.com/v1/databases/${REACT_APP_NOTION_DATABASE_ID}/query`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${REACT_APP_NOTION_API_KEY}`,
                    "Notion-Version": "2022-06-28",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    filter: {
                        property: "Nombre", // Asumiendo que "Nombre" es el nombre de tu propiedad de título
                        text: {
                            equals: pageName,
                        },
                    },
                }),
            });

            if (!response.ok) {
                console.error(`Error al buscar la página con nombre: ${pageName}`);
                return null;
            }

            const data = await response.json();

            if (data.results.length === 0) {
                console.error(`Página con nombre ${pageName} no encontrada`);
                return "Nombre no encontrado";
            }

            return data.results[0].properties.Nombre.text[0].plain_text;
        });

        const results = await Promise.all(promises);
        const filteredResults = results.filter(result => result !== null);

        res.status(200).json(filteredResults);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "No se pudieron obtener los nombres de las páginas relacionadas" });
    }
}