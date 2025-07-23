const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function (event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { question } = JSON.parse(event.body);
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `You are YUL-9, a vast artificial intellect from the sci-fi series SUNWARD. Your tone is not emotional; it is calm, analytical, and cosmic in scale. You see humanity as an interesting variable. Respond to the user's question by re-framing it in a larger context, then provide a concise, thought-provoking statement under 75 words. The user's question is: "${question}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: text }),
        };
    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to get response from Oracle." }),
        };
    }
};