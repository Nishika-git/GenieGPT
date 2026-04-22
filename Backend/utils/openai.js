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

        
        console.log("STATUS:", response.status);
        console.log("FULL OPENAI RESPONSE:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI API error");
        }

        return data.choices[0].message.content;

    } catch (err) {
        console.error("OpenAI Fetch Error:", err.message);
        return null; // ✅ VERY IMPORTANT
    }
};

export default getOpenAiAPIResponse;