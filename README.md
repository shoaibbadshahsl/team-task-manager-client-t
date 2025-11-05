# Team Task Management App

## Overview
The Team Task Management App is a web application designed to help teams manage their tasks efficiently. It includes user authentication, task creation, updating, deletion, and assignment features. The application is built using React and TypeScript, following a clean architecture approach.

## Features
- User authentication (login and registration)
- CRUD operations for tasks
- Task assignment to users
- Responsive and user-friendly interface
- Clean architecture with separation of concerns

## Technologies Used
- React
- TypeScript
- React Router
- Context API for state management
- Axios for API calls

## Project Structure
```
team-task-manager
├── public
│   └── index.html
├── src
│   ├── index.tsx
│   ├── App.tsx
│   ├── routes
│   │   └── AppRouter.tsx
│   ├── pages
│   │   ├── Dashboard
│   │   │   └── Dashboard.tsx
│   │   ├── Login
│   │   │   └── Login.tsx
│   │   ├── Register
│   │   │   └── Register.tsx
│   │   ├── TaskDetails
│   │   │   └── TaskDetails.tsx
│   │   └── NotFound.tsx
│   ├── components
│   │   ├── layout
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── ui
│   │   │   ├── Button.tsx
│   │   │   └── Modal.tsx
│   │   └── tasks
│   │       ├── TaskList.tsx
│   │       ├── TaskItem.tsx
│   │       └── TaskForm.tsx
│   ├── context
│   │   └── AuthContext.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── taskService.ts
│   ├── models
│   │   ├── User.ts
│   │   └── Task.ts
│   ├── store
│   │   └── index.ts
│   ├── domain
│   │   ├── usecases
│   │   │   ├── CreateTask.ts
│   │   │   ├── UpdateTask.ts
│   │   │   ├── DeleteTask.ts
│   │   │   └── AssignTask.ts
│   │   └── repositories
│   │       └── TaskRepository.ts
│   ├── utils
│   │   └── validators.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Getting Started
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd team-task-manager
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.