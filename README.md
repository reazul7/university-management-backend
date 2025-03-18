# University Management System (Backend)
The University Management Backend is a scalable and secure API built using TypeScript, Node.js, and Express.js with MongoDB (Mongoose) as the database. It serves as the backbone of a university management system, handling authentication, course enrollments, faculty and student management, and more.



## 🚀 Features
- **Role-Based Authentication:** Supports SuperAdmin, Admin, Faculty, and Student roles.
- **User & Admin Management:** Admins can manage users, while SuperAdmin can create or remove Admins.
- **Course Management:** Admin can create and manage courses.
- **Student Enrollment:** Students can enroll in courses based on semester registration.
- **Academic Structure:** Supports Academic Departments, Faculties, and Semesters.
- **Secure API:** Implements authentication with JWT, bcrypt for password hashing, and cookie-parser for session handling.



## 🛠️ Tech Stack
**Backend:** TypeScript, Node.js, Express.js
**Database:** MongoDB (Mongoose ODM)
**Authentication:** JWT, bcrypt, cookie-parser
**Validation:** Zod
**Utilities & Middleware:** CORS, ESLint, Prettier, HTTP Status Codes
**Environment Configuration:** dotenv



## 🛡️ Security & Middleware
**CORS Configuration:** Only allows requests from FRONTEND_URL
**JWT Authentication:** Protects sensitive routes
**Data Validation:** Ensured via Zod schema



## 📦 Installation
1️⃣ **Clone the Repository**
   ```bash
   git clone https://github.com/reazul7/university-management-backend.git
   ```
2️⃣ **Navigate to the project directory:**
  ```bash
   cd university-management-backend
   ```
3️⃣ **Install Dependencies**
   ```bash
   yarn
   ```
4️⃣ **Set Up Environment Variables**
   ```bash
   Create a .env file and add the necessary configuration settings fron .env.text
   ```
5️⃣ **Run the Server**
   ```bash
   yarn start:dev
   ```



## 📁 Project File Structure
    ├── dist                   # Compiled files (alternatively `build`)
    ├── /src
    │   ├──  app.ts
    │   ├──  server.ts         # Main server file
    ├── /src/app
    │   ├── ├── builder/
    │   ├── ├── config/        # Configurations
    │   ├── ├── DB/            # Database connection
    │   ├── ├── errors/        # Custom error handling
    │   ├── ├── interface/     # TypeScript interfaces
    │   ├── ├── middleware/    # Authentication, Validation
    │   ├── ├── modules/       # Feature-specific logic
    │   ├── ├── routes/        # API Routes
    │   ├── ├── utils/         # Helper functions
    ├── .env                   # Environment variables
    ├── package.json           # Dependencies
    ├── LICENSE
    └── README.md



## 🤝 Contributing
- Fork the repo
- Create a new branch (feature/new-feature)
- Commit changes
- Create a pull request

    

<!-- ## API Reference
#### Academic Department Routes

```http
  /api/v1/academic-departments
```

| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `POST` | `/create-academic-department` | Add a new **Department** |
| `GET` | `/` | Get all Departments | -->



<!-- ## 📜 License
- This project is licensed under the MIT License. -->



## Authors 
- [reazul7](https://github.com/reazul7/)



<!-- ## Badges
Add badges from somewhere like: [shields.io](https://shields.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0) -->



<!-- ## License
[MIT](https://choosealicense.com/licenses/mit/)
![Logo](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/th5xamgrr6se0x5ro4g6.png) -->
