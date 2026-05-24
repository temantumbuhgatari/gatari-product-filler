exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return json(500, { error: "ANTHROPIC_API_KEY belum diset di Netlify Environment Variables." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Request body bukan JSON valid." });
  }

  const { system, userContent } = body;
  if (!system || !Array.isArray(userContent)) {
    return json(400, { error: "Payload kurang lengkap: system dan userContent wajib ada." });
  }

  try {
    const anthropicResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userContent }]
      })
    });

    const rawText = await anthropicResp.text();

    if (!anthropicResp.ok) {
      let detail = rawText;
      try {
        const parsed = JSON.parse(rawText);
        detail = parsed.error?.message || parsed.message || rawText;
      } catch (_) {}
      return json(anthropicResp.status, {
  error: detail,
  rawText,
  status: anthropicResp.status
});
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: rawText
    };
  } catch (err) {
    return json(500, { error: err.message || "Gagal menghubungi Anthropic API." });
  }
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
}
