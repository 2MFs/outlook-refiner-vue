// /api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, provider = {} } = req.body;

    //provider name
    const providerName = provider.name?.toUpperCase() || '';

    const url = provider.url && provider.url !== '' ? provider.url : process.env[`${providerName}_API_URL`] || '';
    const key = provider.key && provider.key !== '' ? provider.key : process.env[`${providerName}_API_KEY`] || '';
    const model = provider.model && provider.model !== '' ? provider.model : process.env[`${providerName}_API_MODEL`] || '';

    if (!url || !key || !model) {
      return res.status(400).json({
        error: 'Missing provider configuration (url/key/model)',
        details: { url, key: key, model, providerName },
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'API request failed', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
