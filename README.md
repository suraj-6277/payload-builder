# PayloadBuilder

PayloadBuilder is an Angular-based frontend paired with a lightweight Node/Express API (in `payload-builder-api/`) for extracting and building payloads from documents.

## Table of contents
- Project overview
- Prerequisites
- Installation
- Running (frontend & backend)
- Environment & secrets
- Building and testing
- Contribution & commit guidance
- Pushing to GitHub (recommended flow)

## Prerequisites
- Node.js (v18+ recommended)
- npm (or yarn)
- Angular CLI (optional for global `ng` usage)

## Installation
1. Clone the repository locally (or initialize if you already have it):

```bash
git clone <your-repo-url> payload-builder
cd payload-builder
```

2. Install root/frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd payload-builder-api
npm install
cd ..
```

## Running the project locally

- Frontend (Angular dev server):

```bash
npm run start
# or
ng serve
```

- Backend API (in a separate terminal):

```bash
cd payload-builder-api
node index.js
```

After both are running, open `http://localhost:4200/` to view the app.

## Environment & secrets
- Do NOT commit environment files or secrets. This repository includes `.gitignore` entries for `.env` and related files.
- Keep any credentials, API keys, or secret configuration in a local `.env` file (for example: `payload-builder-api/.env`) and never push them to GitHub.

## Building

```bash
npm run build
```

Build artifacts are placed into the `dist/` folder.

## Tests

Run unit tests:

```bash
npm test
```

## Contribution & commit guidance
- Keep commits small and focused (one logical change per commit).
- Use clear commit messages, e.g., `chore: add .gitignore`, `docs: improve README`, `feat(api): add template extractor`.
- Prefer feature branches: `git checkout -b feat/add-extractor` and open a pull request.

Suggested commit split before first push:
1. `chore: add .gitignore` (add patterns to avoid committing secrets and build artifacts)
2. `docs: improve README` (this file)
3. `chore: add contributing guidelines` (optional)

## Pushing to GitHub (recommended flow)

1. Create a repository on GitHub under your account (`suraj-6277`).
2. Add the remote and push your branches. Example commands:

```bash
# from repo root
git init                      # if the repo is not already a git repo
git add .
git commit -m "chore: add .gitignore"
git commit -m "docs: improve README" --allow-empty -m "Update README with setup and push instructions" # adjust as needed
# create and push main branch
git branch -M main
git remote add origin git@github.com:suraj-6277/<repo-name>.git
git push -u origin main
```

Notes:
- If you need to split changes into multiple commits, stage files selectively with `git add <path>` and commit frequently.
- Review `git status` and `git diff` before committing.

## Next steps I can take for you
- Create or update `.gitignore` to ensure env files are ignored. (done)
- Improve `README.md` with setup and push instructions. (done)
- Create `CONTRIBUTING.md` and a sample PR checklist (optional).
- If you want, I can run a sequence of `git` commands here to create granular commits and push — but you'll need to confirm remote repo creation and provide permission to run git commands.  