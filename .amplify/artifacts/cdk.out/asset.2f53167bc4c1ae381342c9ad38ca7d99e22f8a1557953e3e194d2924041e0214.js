export function request(ctx) {
    const { topic = "general" } = ctx.args;

    // Construct the prompt for generating a dad joke
    const prompt = `Tell me a dad joke about ${topic}. Keep it family-friendly and groan-worthy.`;

    // Return the request configuration
    return {
        resourcePath: `/model/anthropic.claude-sonnet-4-5-20250929-v1:0/invoke`,
        method: "POST",
        params: {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        },
    };
}


export function response(ctx) {
    // Parse the response from the Bedrock service
    const parsedBody = JSON.parse(ctx.result.body);

    // Check for errors
    if (parsedBody.error || !parsedBody.content) {
        return {
            body: null,
            error: JSON.stringify(parsedBody),
        };
    }

    // Extract the text content from the response
    const res = {
        body: parsedBody.content[0].text,
    };
    // Return the extracted response
    return res;
}