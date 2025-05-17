export default function handler(req, res) {
  res.status(200).json({
    openai: {
      url: process.env.OPENAI_API_URL || null,
      model: process.env.OPENAI_API_MODEL || null,
    },
    grok: {
      url: process.env.GROK_API_URL || null,
      model: process.env.GROK_API_MODEL || null,
    },
    claude: {
      url: process.env.CLAUDE_API_URL || null,
      model: process.env.CLAUDE_API_MODEL || null,
    },
    gemini: {
      url: process.env.GEMINI_API_URL || null,
      model: process.env.GEMINI_API_MODEL || null,
    },
    customize: {
      url: process.env.CUSTOMIZE_API_URL || null,
      model: process.env.CUSTOMIZE_API_MODEL || null,
    },
    free: {
      url: process.env.FREE_API_URL || null,
      model: process.env.FREE_API_MODEL || null,
    }
  });
}