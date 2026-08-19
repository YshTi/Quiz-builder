# Quiz Builder

A modern, responsive full-stack **Quiz Builder** application for creating, browsing, previewing, and deleting structured quizzes.

The application is built with:

- **Frontend:** Next.js, React, TypeScript, React Hook Form, Zod, CSS Modules
- **Backend:** Node.js, Express, TypeScript, Prisma, SQLite

The project follows the assessment requirement of keeping the frontend and backend in separate `/frontend` and `/backend` directories.

---

## Features

### Quiz Creation

- Create a quiz with a custom title.
- Dynamically add and remove questions.
- Configure the correct answer or answers for every question.
- Client-side form validation with React Hook Form and Zod.
- Server-side validation with Zod before data is written to the database.

### Supported Question Types

#### Boolean

- True / False answers.
- Exactly one answer can be marked as correct.

#### Short Answer

- Single-line text answer.
- One accepted correct answer.

#### Multiple Choice Checkbox

- Add and remove answer options dynamically.
- Select one or more correct answers.
- Prevent empty or duplicate options.

### Quiz Dashboard

- View all saved quizzes.
- See the total number of quizzes.
- See the total number of questions.
- See the most recently created quiz.
- Search quizzes by title.
- Sort quizzes by:
  - Newest
  - Oldest
  - Title A–Z

- Responsive pagination:
  - 6 quizzes per page on desktop
  - 4 quizzes per page on tablet and mobile

- Delete quizzes using a custom confirmation modal.

### Quiz Detail

- Open any quiz from the dashboard.
- View the full quiz structure.
- View question types, options, and correct answers.
- Read-only mode as required by the assessment.

### UI / UX

- Responsive layout for desktop, tablet, and mobile.
- Light and dark themes.
- Persistent theme preference.
- Glassmorphic interface.
- Shared design tokens using CSS variables.
- Reusable button styles.
- Accessible focus states.
- Custom styled sorting dropdown.
- Loading, empty, and error states.
- Animated transitions and decorative background elements.

---

## Technology Stack

### Frontend

- **Next.js** — Pages Router
- **React**
- **TypeScript**
- **React Hook Form**
- **Zod**
- **CSS Modules**
- **Lucide React**
- **React Icons**
- **ESLint**
- **Prettier**

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **SQLite**
- **Zod**
- **ESLint**
- **Prettier**

---

## Project Structure

```text
quiz-builder/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   └── quizController.ts
│   │   ├── routes/
│   │   │   └── quizRoutes.ts
│   │   ├── schemas/
│   │   │   └── quizSchema.ts
│   │   ├── utils/
│   │   │   └── questionMapper.ts
│   │   ├── db.ts
│   │   └── index.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── tsconfig.build.json
│
├── frontend/
│   ├── components/
│   │   ├── ConfirmModal.tsx
│   │   ├── Layout.tsx
│   │   ├── QuizCard.tsx
│   │   └── SortDropdown.tsx
│   │
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   ├── create.tsx
│   │   └── quizzes/
│   │       ├── index.tsx
│   │       └── [id].tsx
│   │
│   ├── public/
│   ├── styles/
│   │   ├── globals.css
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── utilities.css
│   │   ├── buttons.css
│   │   └── *.module.css
│   │
│   ├── utils/
│   │   └── api.ts
│   │
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── next.config.ts
│
├── .gitignore
└── README.md
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- **Node.js 18 or newer**
- **npm**

Check your versions:

```bash
node --version
npm --version
```

---

# Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

## 1. Install dependencies

```bash
npm install
```

## 2. Create the environment file

Copy the example environment file:

```bash
cp .env.example .env
```

The default backend environment should contain:

```env
PORT=5001
DATABASE_URL="file:./dev.db"
FRONTEND_URL=http://localhost:3000
```

### Environment Variables

| Variable       | Purpose                           |
| -------------- | --------------------------------- |
| `PORT`         | Port used by the Express server   |
| `DATABASE_URL` | Prisma SQLite database connection |
| `FRONTEND_URL` | Allowed frontend origin for CORS  |

---

## 3. Generate Prisma Client

```bash
npm run prisma:generate
```

---

## 4. Create / update the database

```bash
npm run prisma:db-push
```

This creates the local SQLite database from:

```text
backend/prisma/schema.prisma
```

The database file is local-only and is not committed to Git.

---

## 5. Seed sample data

This step is optional, but useful for immediately testing the dashboard.

```bash
npm run seed
```

The seed script creates example quizzes in the SQLite database.

---

## 6. Start the backend development server

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5001
```

You can verify that it is running by opening:

```text
http://localhost:5001/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "..."
}
```

---

# Frontend Setup

Open a second terminal and navigate to the frontend directory:

```bash
cd frontend
```

## 1. Install dependencies

```bash
npm install
```

---

## 2. Create the frontend environment file

Copy the example file:

```bash
cp .env.example .env.local
```

The default frontend environment should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

This tells the frontend where the backend API is running.

---

## 3. Start the frontend development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Running the Full Application

The application requires both servers to be running at the same time.

### Terminal 1

```bash
cd backend
npm run dev
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Application Routes

## Home

```text
/
```

Landing page for the Quiz Builder application.

---

## Create Quiz

```text
/create
```

Create a new quiz with one or more questions.

---

## Quiz Dashboard

```text
/quizzes
```

View, search, sort, paginate, and delete quizzes.

---

## Quiz Detail

```text
/quizzes/:id
```

View the selected quiz and all of its questions in read-only mode.

---

# API Reference

The backend REST API is available at:

```text
http://localhost:5001/api
```

## Create Quiz

```http
POST /api/quizzes
```

Creates a new quiz and its questions.

Example request:

```json
{
  "title": "JavaScript Basics",
  "questions": [
    {
      "type": "BOOLEAN",
      "text": "JavaScript runs in web browsers.",
      "options": ["True", "False"],
      "correctAnswers": ["True"]
    },
    {
      "type": "INPUT",
      "text": "Which keyword declares a block-scoped variable?",
      "options": [],
      "correctAnswers": ["let"]
    },
    {
      "type": "CHECKBOX",
      "text": "Which of these are JavaScript primitive types?",
      "options": ["String", "Boolean", "Number", "Array"],
      "correctAnswers": ["String", "Boolean", "Number"]
    }
  ]
}
```

---

## Get All Quizzes

```http
GET /api/quizzes
```

Returns quiz summaries containing:

- ID
- Title
- Creation date
- Number of questions

Example:

```json
[
  {
    "id": "quiz-id",
    "title": "JavaScript Basics",
    "createdAt": "2026-08-19T12:00:00.000Z",
    "questionCount": 3
  }
]
```

---

## Get Quiz Details

```http
GET /api/quizzes/:id
```

Returns the complete quiz structure, including:

- quiz metadata
- questions
- question type
- options
- correct answers

---

## Delete Quiz

```http
DELETE /api/quizzes/:id
```

Deletes the selected quiz.

Associated questions are automatically deleted through the Prisma cascade relation.

---

# Creating a Sample Quiz Using the UI

Start both servers and navigate to:

```text
http://localhost:3000/create
```

Then:

1. Enter a quiz title.

2. Add one or more questions.

3. Choose a question type.

### True / False

Select either:

```text
True
```

or:

```text
False
```

as the correct answer.

### Short Answer Text

Enter the accepted correct answer into the text field.

### Multiple Choice Checkbox

- Add options using **Add Option**.
- Enter text for every option.
- Select one or more options as correct answers.
- Remove options when necessary.

4. Add more questions using:

```text
Add Question
```

5. Click:

```text
Save Quiz
```

6. After successful creation, the application redirects to:

```text
/quizzes
```

The new quiz will appear on the dashboard.

---

# Dashboard Features

The dashboard provides several additional management tools.

## Search

Use the search input to filter quizzes by title.

---

## Sorting

Quizzes can be sorted by:

- Newest
- Oldest
- Title A–Z

---

## Pagination

The dashboard displays:

- **6 quizzes per page on desktop**
- **4 quizzes per page on tablet/mobile**

Pagination controls appear automatically when necessary.

---

## Dashboard Statistics

The dashboard shows:

- Total quizzes
- Total questions
- Latest quiz

---

## Delete Quiz

Click the delete icon on a quiz card.

A custom confirmation modal appears before deletion.

Deletion cannot be undone.

---

# Light and Dark Themes

The interface supports both:

- Light mode
- Dark mode

Use the theme control in the navigation bar to switch between them.

The selected theme is stored locally and remains selected after refreshing the page.

---

# Validation

Validation is implemented on both the frontend and backend.

## Quiz Rules

- Quiz title must contain at least 3 characters.
- A quiz must contain at least one question.

## Boolean Questions

- Options must be `True` and `False`.
- Exactly one correct answer is required.

## Short Answer Questions

- No options are stored.
- Exactly one non-empty correct answer is required.

## Checkbox Questions

- At least two options are required.
- Options cannot be empty.
- Options must be unique.
- At least one correct answer is required.
- Every correct answer must exist in the options list.

Backend validation prevents invalid requests from bypassing frontend validation.

---

# Database

The project uses SQLite through Prisma.

Schema location:

```text
backend/prisma/schema.prisma
```

The main models are:

```text
Quiz
Question
```

A quiz can contain multiple questions.

Deleting a quiz automatically deletes its associated questions.

---

# Prisma Commands

Generate Prisma Client:

```bash
npm run prisma:generate
```

Synchronize the database schema:

```bash
npm run prisma:db-push
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

Seed sample quizzes:

```bash
npm run seed
```

---

# Code Quality

The project uses ESLint and Prettier.

## Frontend

Format files:

```bash
cd frontend
npm run format
```

Check formatting without modifying files:

```bash
npm run format:check
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

---

## Backend

Format files:

```bash
cd backend
npm run format
```

Check formatting:

```bash
npm run format:check
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

---

# Final Verification Before Submission

Before submitting the assessment, run the following checks.

## Backend

```bash
cd backend

npm install
npm run prisma:generate
npm run prisma:db-push
npm run seed

npm run format
npm run format:check
npm run lint
npm run build
```

Then start it:

```bash
npm run dev
```

Verify:

```text
GET    /health
GET    /api/quizzes
POST   /api/quizzes
GET    /api/quizzes/:id
DELETE /api/quizzes/:id
```

---

## Frontend

```bash
cd frontend

npm install
npm run format
npm run format:check
npm run lint
npm run build
```

Then:

```bash
npm run dev
```

Manually verify:

- Home page loads.
- Light/dark theme works.
- Theme persists after refresh.
- Quiz creation works.
- Boolean questions work.
- Short-answer questions work.
- Checkbox questions work.
- Questions can be added and removed.
- Validation messages appear correctly.
- Successful creation redirects to the dashboard.
- Dashboard statistics are correct.
- Search works.
- Sorting works.
- Pagination works.
- Delete confirmation modal works.
- Deleted quizzes disappear from the dashboard.
- Quiz details render correctly.
- Mobile and tablet layouts work.

---

# Git / Submission Check

Before the final push:

```bash
git status
```

Check that generated or local files are not tracked:

```bash
git ls-files | grep -E '(^|/)(node_modules|dist|\.next)(/|$)|\.env$|\.db$'
```

The command above should return no output.

The following should **not** be committed:

```text
node_modules/
.next/
dist/
.env
.env.local
*.db
```

The following should be committed:

```text
backend/.env.example
frontend/.env.example
```

---

# Production Commands

## Backend

Build:

```bash
cd backend
npm run build
```

Start the compiled server:

```bash
npm start
```

---

## Frontend

Build:

```bash
cd frontend
npm run build
```

Start:

```bash
npm start
```

---

# Assessment Scope

The application intentionally focuses on the requirements of the Full-Stack JavaScript Engineer assessment.

Implemented:

- Quiz creation
- Dynamic questions
- Boolean questions
- Short-answer questions
- Multiple-choice checkbox questions
- Quiz dashboard
- Quiz detail view
- Quiz deletion
- Persistent database
- Responsive UI
- Environment configuration
- ESLint
- Prettier
- README documentation

Quiz solving, scoring, authentication, and editing existing quizzes are intentionally outside the requested scope.

---

## License

This project was created as a Full-Stack JavaScript Engineer technical assessment.
