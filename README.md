# Ask the Poster

A small chat app grounded entirely in the content of the poster
**"India Built the World's Back Office. Now It's Building Its Brain."**
Every answer follows a Claim → Explanation → Source format, using only the
data and links compiled into `lib/knowledge-base.ts`.

## How it works

- `lib/knowledge-base.ts` — the poster's content and verified sources,
  wrapped in a system prompt that instructs the model to answer only from
  this data.
- `app/api/chat/route.ts` — a server-side API route that calls the Claude
  API with your key (never exposed to the browser).
- `app/page.tsx` — the chat UI the visitor sees after scanning the QR code
  on the poster.

## 1. Run it locally (optional, to test before deploying)

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste in your real Anthropic API key
npm run dev
```

Open http://localhost:3000 and ask it a question.

## 2. Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com, click "Add New Project", and import that repo.
3. Vercel will auto-detect Next.js — no build settings need changing.
4. Before deploying, add an environment variable:
   - Key: `ANTHROPIC_API_KEY`
   - Value: your key from https://console.anthropic.com
   - Apply it to Production (and Preview, if you want to test branches).
5. Click Deploy. You'll get a URL like `https://your-project.vercel.app`.

## 3. Link it from the poster

Generate a QR code for your Vercel URL (any free QR generator works, e.g.
https://www.qr-code-generator.com) and place it in the poster's top-left
corner as planned.

## 4. Updating the poster content later

If you revise the poster, just edit the `KNOWLEDGE_BASE` string in
`lib/knowledge-base.ts` and redeploy (Vercel redeploys automatically on
every push to your connected branch).

## Notes

- Model used: `claude-sonnet-4-6` via the Anthropic Messages API. You can
  swap the model string in `app/api/chat/route.ts` if you'd like to use a
  different one.
- The app refuses to answer questions unrelated to the poster, and will
  say "not independently verified" rather than invent a source — this
  matches the honesty standard already used when the poster's sources were
  compiled.
