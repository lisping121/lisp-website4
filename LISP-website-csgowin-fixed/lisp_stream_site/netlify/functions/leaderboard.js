exports.handler = async (event) => {
  const apiKey = process.env.LISP_API_KEY;
  const affiliateCode = (process.env.CSGOWIN_AFFILIATE_CODE || "lisp").trim();
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  if (!apiKey) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        error: "Missing LISP_API_KEY Netlify environment variable.",
        help: "In Netlify, set LISP_API_KEY to the API key from the CSGOWIN Affiliates Dashboard, then redeploy."
      })
    };
  }

  const period = ["weekly", "monthly", "all"].includes(
    event.queryStringParameters?.period
  ) ? event.queryStringParameters.period : "weekly";

  // CSGOWIN docs list the API server as https://api.csgowin.com/api
  // and the endpoint as GET /leaderboard/{code}.
  const upstreamUrl = new URL(
    `https://api.csgowin.com/api/leaderboard/${encodeURIComponent(affiliateCode)}`
  );
  upstreamUrl.searchParams.set("period", period);

  try {
    const response = await fetch(upstreamUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "x-apikey": apiKey
      }
    });

    const raw = await response.text();
    const contentType = response.headers.get("content-type") || "";
    let payload;
    let isJson = false;

    try {
      payload = JSON.parse(raw);
      isJson = true;
    } catch {
      payload = null;
    }

    if (!response.ok) {
      const upstreamMessage =
        payload && typeof payload === "object"
          ? (payload.message || payload.error || payload.detail || payload.title)
          : null;
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: upstreamMessage || `CSGOWIN API returned HTTP ${response.status}.`,
          upstreamStatus: response.status,
          upstreamUrl: upstreamUrl.toString(),
          contentType,
          responsePreview: raw.slice(0, 600),
          help: response.status === 403
            ? "CSGOWIN rejected the request. Verify the API key is from the Affiliates Dashboard, that it is active/authorized, and that CSGOWIN_AFFILIATE_CODE matches your affiliate code."
            : "Check the CSGOWIN API response and the Netlify function logs."
        })
      };
    }

    if (!isJson) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: "CSGOWIN returned a successful HTTP status but the response was not JSON.",
          upstreamStatus: response.status,
          upstreamUrl: upstreamUrl.toString(),
          contentType,
          responsePreview: raw.slice(0, 600)
        })
      };
    }

    // Preserve the upstream JSON response for the browser parser.
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(payload)
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: "Netlify could not reach the CSGOWIN API.",
        details: String(error?.message || error)
      })
    };
  }
};
