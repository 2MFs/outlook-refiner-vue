export async function callGrok(provider, prompt) {

    const response = await fetch(provider.url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.key}`,
        },
        body: JSON.stringify({
            model: provider.model,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || "⚠️ 無回應內容";
}