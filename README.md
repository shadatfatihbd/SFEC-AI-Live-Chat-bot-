# SFEC AI Live Chat — Shadat Fatih Education Consultant

**SFEC AI Live Chat** is a production-oriented, Apple-inspired educational live chat application designed specifically for students in Bangladesh seeking guidance on **National University (NU) Honours**, **Degree (Pass)**, **Masters (Regular & Private)**, **College Admissions**, **Subject Choice**, **GPA Eligibility**, and **Release Slip procedures**.

Branded and guided by **SFEC — Shadat Fatih Education Consultant**.

---

## 🌟 Key Features

1. **Bilingual Education Consultation (Bengali & English)**:
   - Primary focus on Bengali (`Hind Siliguri`), with full English support.
   - Clarifies complex National University circulars, eligibility rules, and course progression paths.

2. **Real Backend Integration (Google Apps Script & Google Sheets)**:
   - Connects directly to the live Google Apps Script web app endpoint.
   - Stores visitor sessions and conversations in Google Sheets (`Conversations`, `Messages`, `Settings` tabs).
   - Generates and persists unique `visitorId` in browser `localStorage`.
   - Restores active conversation state across browser reloads.

3. **Sequential AI Workflow**:
   - Step 1: Validates student message.
   - Step 2: Creates conversation if one does not already exist (`createConversation`).
   - Step 3: Sends visitor message (`sendMessage`).
   - Step 4: Confirms receipt from server.
   - Step 5: Requests Gemini AI reply through Apps Script backend (`aiReply`).
   - Step 6: Renders actual server response or provides honest error diagnostic with retry controls.

4. **Human Support Escalation via Facebook Messenger**:
   - Direct integration link to [SFEC Facebook Messenger](https://m.me/ShadatFatih.Page).
   - Available on Homepage, Chat Header, Empty State, and Error Banners with “মানব পরামর্শ নিন”.
   - Clearly informs students that Messenger opens a separate chat window and does not auto-transfer website history.

5. **Apple-Inspired Design Language**:
   - Minimalist, refined, calm, and distraction-free.
   - Zero-pill metadata discipline with subtle typographic separators (`·`).
   - Strict 3-zone Top Bar Contract.
   - Refined translucent glass panels, hairline borders (`#E5E5EA` / `#303036`), and smooth transitions.
   - Dual theme support (Apple light `#F5F5F7` and dark `#09090B`) with system preference detection.

6. **Academic Integrity & Transparency**:
   - Explicitly cautions students to cross-check all deadlines, seat limits, and GPA criteria against official gazettes at [nu.ac.bd](https://www.nu.ac.bd).
   - Zero fabricated awards, user statistics, or fake reviews.
   - Never fabricates fake AI answers when the backend experiences downtime or quota exhaustion.

---

## 🏗️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite.
- **Styling**: Tailwind CSS v4, custom Apple glass surface classes.
- **Icons**: Lucide React.
- **Typography**: `Hind Siliguri` (Bengali), `Plus Jakarta Sans`, and `Inter`.
- **Backend**: Google Apps Script Web App (`doGet`, `doPost`).
- **Database**: Google Sheets (`Conversations`, `Messages`, `Settings`).
- **Hosting Target**: GitHub Pages (fully automated via GitHub Actions).

---

## ⚙️ Backend API Details

The application connects to the deployed Google Apps Script endpoint:
```
https://script.google.com/macros/s/AKfycbzpku5s-873D9Mblresqd15o0Cjhr1oJM5609UdEZfUMahg41Vwknl7xojAR7S1kiommA/exec
```

### Supported Actions

#### `GET` Endpoints:
- `?action=health`: Verifies backend service status.
  ```json
  {"success":true,"app":"SFEC AI Live Chat","status":"online","messengerUrl":"https://m.me/ShadatFatih.Page"}
  ```
- `?action=messages&conversationId=...`: Retrieves conversation message thread.
- `?action=conversation&conversationId=...`: Retrieves conversation metadata.

#### `POST` Endpoints:
- `action: "createConversation"`: Payload `{ visitorId, visitorName }`.
- `action: "sendMessage"`: Payload `{ conversationId, visitorId, message }`.
- `action: "aiReply"`: Payload `{ conversationId, visitorId }`.
- `action: "closeConversation"`: Closes the current session.

### 🌐 Backend Integration Architecture
- The frontend connects directly to the Apps Script endpoint using standard JSON requests (`Content-Type: application/json`):
  ```
  POST /exec with action, conversationId, visitorId, and message.
  ```
- The complete, production-ready Apps Script backend code is provided in `google-apps-script/Code.gs`.

### 🔍 Root Cause of "AI service is temporarily unavailable" & Fix
1. **Model Deprecation / 404s**:
   Legacy models (e.g. `gemini-pro`, `gemini-1.0-pro`, `gemini-1.5-flash`, `gemini-2.0-flash`) have been deprecated or decommissioned in 2026, causing Gemini API calls to return HTTP 404.
   *Fix*: `Code.gs` uses active 2026 models (`gemini-flash-lite-latest`, `gemini-3.5-flash-lite`, and `gemini-3.8-flash`).
2. **Search Grounding Quota (HTTP 429)**:
   Calling `tools: [{ googleSearch: {} }]` on standard/free tier API keys often triggers `429 Quota Exceeded`.
   *Fix*: `Code.gs` implements an automatic graceful fallback. If search grounding returns HTTP 429 or 400, it immediately generates the educational response without grounding rather than failing the request.
3. **Missing `muteHttpExceptions: true`**:
   Without `muteHttpExceptions: true` in `UrlFetchApp.fetch()`, Google Apps Script throws a runtime JavaScript exception on any non-2xx status code. This forced execution into the generic `catch` block that produced the `"AI service is temporarily unavailable"` message.
   *Fix*: `Code.gs` enables `muteHttpExceptions: true`, inspects HTTP status codes, and sanitizes logs.

### 🛠️ How to Deploy / Update Google Apps Script
1. Open your Google Spreadsheet (with tabs `Conversations`, `Messages`, `Settings`).
2. Click **Extensions** $\rightarrow$ **Apps Script**.
3. Replace the existing content of `Code.gs` with the complete code from `google-apps-script/Code.gs`.
4. Go to **Project Settings** (gear icon) $\rightarrow$ **Script Properties**:
   - Ensure property `GEMINI_API_KEY` is set to your active Google Gemini API key.
5. Click **Deploy** $\rightarrow$ **Manage deployments**:
   - Click the **Edit** icon (pencil) next to your active deployment.
   - Set **Version** to **New version**.
   - Ensure **Execute as** is set to **Me** and **Who has access** is set to **Anyone**.
   - Click **Deploy**.
6. Verify health & diagnostics:
   - Health check: `GET <web-app-url>?action=health`
   - Safe diagnostics: `GET <web-app-url>?action=diag`

---

## 🚀 Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 2. Installation
```bash
git clone <repository-url>
cd sfec-ai-chat
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```env
VITE_GAS_ENDPOINT="https://script.google.com/macros/s/AKfycbzpku5s-873D9Mblresqd15o0Cjhr1oJM5609UdEZfUMahg41Vwknl7xojAR7S1kiommA/exec"
VITE_FACEBOOK_PAGE_URL="https://facebook.com/ShadatFatih.Page"
VITE_MESSENGER_URL="https://m.me/ShadatFatih.Page"
VITE_BASE_PATH=""
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Verification
```bash
npm run build
```
This bundles the optimized production assets into `dist/`.

---

## 🚢 GitHub Pages Deployment

The repository is pre-configured for automated deployment to GitHub Pages via GitHub Actions.

### Deployment Setup in GitHub:
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SFEC AI Live Chat"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub:
   - Click **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main` branch:
   - The workflow defined in `.github/workflows/deploy.yml` will automatically build the React bundle and publish the `dist/` directory to GitHub Pages.
4. Access your live application at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

### SPA Routing on GitHub Pages:
- The project includes `public/404.html` and a router (`src/context/RouterContext.tsx`) that handles deep links such as `/chat` or `/#/chat` without 404 errors when reloaded on GitHub Pages.
- `vite.config.ts` uses `base: process.env.VITE_BASE_PATH || './'`, ensuring asset paths work regardless of whether the site is hosted on a subpath or a custom domain.

---

## 🔒 Security & Privacy

- **No Secrets in Frontend**: No Gemini API keys or `AGENT_TOKEN` secrets exist anywhere in the frontend codebase.
- **Visitor Privacy**: No passwords, NID, or personal contact numbers are requested or recorded.
- **Client Storage**: Only non-sensitive conversation identifiers and the user's theme preference are retained in `localStorage`.

---

## 📞 Support & Contacts

- **Consultant**: Shadat Fatih Education Consultant
- **Official Facebook Page**: [facebook.com/ShadatFatih.Page](https://facebook.com/ShadatFatih.Page)
- **Direct Messenger**: [m.me/ShadatFatih.Page](https://m.me/ShadatFatih.Page)
