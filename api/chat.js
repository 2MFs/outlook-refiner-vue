// api/chat.js
export default async function handler(req, res) {
  const { message } = req.body;
  const { provider } = req.provider;

  provider.url = provider.url || process.env[provider.name.toUpperCase() + `_API_URL`];
  provider.key = provider.key || process.env[provider.name.toUpperCase() + `_API_KEY`];
  provider.model = provider.model || process.env[provider.name.toUpperCase() + `_API_MODEL`];

  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${provider.key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [{ role: 'user', content: message }],
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}

export const config = {
  api: {
    bodyParser: true,
  },
};
