# Quiz Builder

A modern, responsive full-stack **Quiz Builder** application that allows users to create custom quizzes with various types of questions, view all quizzes on a dashboard, and preview quiz details.

Built with **Next.js (React + TypeScript + CSS Modules)** on the frontend and **Node.js (Express + TypeScript + Prisma + SQLite)** on the backend.

---

## Features

- **Quiz Creation**: Build quizzes dynamically by adding/removing questions.
- **Three Supported Question Types**:
  - **Boolean**: True/False choice.
  - **Short Answer**: Single line text input.
  - **Multiple Choice**: Multiple options with checkboxes.
- **Answer Selection**: Specify correct answers for all question types.
- **Quiz Dashboard**: View, browse, and delete saved quizzes.
- **Quiz Detail**: Review detailed quiz structural layouts in read-only preview mode.
- **Premium Aesthetics**: Interactive dark glassmorphic design featuring ambient glows, modern typography, and smooth transitions.

---

## Technology Stack

### Backend
- **Core**: Node.js & Express.js with TypeScript
- **Database**: SQLite (local dev file-based)
- **ORM**: Prisma Client
- **Validation**: Zod schema validations

### Frontend
- **Core**: Next.js (Pages Router) & React with TypeScript
- **Styling**: CSS Modules using Vanilla CSS variables
- **Forms**: React Hook Form & Zod schema resolvers
- **Icons**: Lucide React

---

## Project Structure

```
quiz-builder/
├── backend/         # Express API
│   ├── src/         # API controllers, routers, database clients
│   ├── prisma/      # Prisma DB schema & seed scripts
│   ├── tsconfig.json
│   └── package.json
└── frontend/        # Next.js UI app
    ├── pages/       # React pages (quizzes list, creation form, details)
    ├── components/  # Layout, Quiz summary cards
    ├── styles/      # CSS variables, module stylesheets
    ├── utils/       # API call fetchers
    ├── tsconfig.json
    └── package.json
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` (usually bundled with Node.js)

### Step 1: Clone & Setup Backend
1. Open your terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Sync the SQLite database schema using Prisma:
   ```bash
   npx prisma db push
   ```
4. Populate the database with sample quizzes using the seed script:
   ```bash
   npx ts-node prisma/seed.ts
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
The backend server will run at **http://localhost:5001**.

### Step 2: Setup Frontend
1. Open a new terminal tab and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```
The frontend application will be active at **http://localhost:3000**.

---

## API Endpoints Reference

The backend exposes a REST API at `http://localhost:5001/api/quizzes`:

- `POST /api/quizzes` – Create a new quiz with questions.
- `GET /api/quizzes` – Return a summary list of all quizzes with titles, creation dates, and number of questions.
- `GET /api/quizzes/:id` – Return the full structure of a quiz including questions and correct answers.
- `DELETE /api/quizzes/:id` – Delete a quiz (questions are deleted automatically via Cascade onDelete settings).

---

## Creating a Sample Quiz in the UI

1. Open your browser and navigate to **http://localhost:3000/create**.
2. Write a **Quiz Title** (e.g. *Chemistry Basics*).
3. Under the **Questions** list, write a question name and choose a type:
   - **True / False**: Select either the `True` or `False` card to mark the correct choice.
   - **Short Answer Text**: Input the accepted text answer into the field.
   - **Multiple Choice Checkbox**: Add options using the **Add Option** button, enter the text for each choice, and check the checkbox next to the correct options.
4. Click **Create Quiz Blueprint** to submit. You will be redirected to the Dashboard where you can view your new quiz structure.
