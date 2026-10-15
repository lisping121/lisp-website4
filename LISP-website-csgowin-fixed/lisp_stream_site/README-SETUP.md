# LISP website — setup guide

## Run it locally
1. Download and extract the ZIP.
2. Keep every file and the `assets` folder together.
3. Double-click `index.html` to open the home page in a browser.
4. Internet is needed for Google Fonts; all core navigation and demo interactions work without them.

## Publish for free
1. Go to https://app.netlify.com/drop
2. Sign in or make a free account.
3. Drag the extracted `lisp_stream_site` folder (the one containing `index.html`) into Netlify Drop.
4. Use the public URL Netlify gives you. You can set a custom domain later.

## Pages and features
- `index.html`: home page styled to match your reference screenshot.
- `stream.html`: links to your Kick channel, https://kick.com/lisping.
- `leaderboard.html`: leaderboard page with Weekly / Monthly / All Time tabs; API settings are not shown publicly.
- `bonuses.html`: rewards status page (currently nothing available).\n- `shop.html`: shop placeholder (work in progress).
- `about.html`: basic editable streamer intro.
- `styles.css`: shared visual styling.
- `script.js`, `page-common.js`, `leaderboard.js`: interactions and API handling.
- `assets/`: artwork crops from your reference screenshot.

## What still needs a backend for production
This project is a working static site, but it is not yet a complete account/rewards platform. Real registration/login, real-time stream status, verified watch-time tracking, cross-device balances and cash payouts require a backend and provider credentials. The current login modal on the home page is explicitly demo-only.

## Community link
The home page's Join Now button and About page Discord button link to https://discord.gg/lispy.

\n## Secure leaderboard API setup\nThe public site does not expose an API-key entry box or put the API key in browser JavaScript. The leaderboard uses `/.netlify/functions/leaderboard`, which reads the secret from the `LISP_API_KEY` environment variable. In Netlify, open **Site configuration → Environment variables** and set `LISP_API_KEY` to your API key, then redeploy. The function calls the CSGOWIN API at `https://api.csgowin.com/leaderboard/lisp`. Confirm that `lisp` is the correct leaderboard code for your affiliate setup and that the endpoint accepts the `period` query parameter. If CSGOWIN provides a different exact endpoint in your Affiliates Dashboard, update the `upstream` URL in `netlify/functions/leaderboard.js`. Never commit the actual key to this ZIP or public repository.\n