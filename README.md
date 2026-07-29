PayloadBuilder is an Angular-based frontend paired with a lightweight Node/Express API...

A full-stack document processing application that extracts data from documents and generates dynamic payload templates.

## Tech Stack

### Frontend
- Angular
- TypeScript
- HTML/CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Project Structure

```text
payload-builder/
├── frontend/     # Angular application
├── backend/      # Express API
├── README.md
└── .gitignore
```

## Features

- Upload PDF/DOCX documents
- Extract text from documents
- Generate dynamic payload templates
- Create nested JSON payloads
- Save templates to MongoDB
- REST API for template management

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB

## Installation

Clone the repository:

```bash
git clone https://github.com/suraj-6277/payload-builder.git
cd payload-builder
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs at:

```
http://localhost:4200
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```
http://localhost:5000
```

## Environment Variables

Create a `.env` file inside the `backend` folder.

Example:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
GEMINI_API_KEY=your_api_key
ANTHROPIC_API_KEY=your_api_key
```

## Build

```bash
cd frontend
npm run build
```

## Future Improvements

- User authentication
- Template versioning
- Drag-and-drop payload builder
- Export templates as JSON
- Role-based access control

## Author

**Suraj Jadhav**

GitHub: https://github.com/suraj-6277