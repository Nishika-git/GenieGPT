import "dotenv/config";

const getOpenAiAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message,
                }
            ]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);

        const data = await response.json();

        // 🔴 Log full response for debugging
        console.log("OpenAI RAW response:", data);

        // ❌ Handle API error
        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI API error");
        }

        // ❌ Validate structure
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error("Invalid OpenAI response structure");
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("OpenAI Fetch Error:", err.message);
        return null; // ✅ VERY IMPORTANT
    }
};

export default getOpenAiAPIResponse;