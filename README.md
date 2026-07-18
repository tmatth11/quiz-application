# Quiz Application

<img width="1916" height="904" alt="image" src="https://github.com/user-attachments/assets/e9bc05bd-4f2f-4b52-94e5-17d0f78aa8af" />

This quiz application is a personal project created with ASP.NET Core in .NET 10 and Angular 21. 
It features a local Microsoft SQL Server database to support the functionality for viewing, creating, editing, and deleting quizzes. 
The client allows users to perform those operations, along with taking their quizzes, right in the browser.

# Installation

1. Clone the repository
```
git clone https://github.com/tmatth11/quiz-application.git
```

# Usage

1. Switch to the server directory
```
cd quiz-application/QuizAppApi
```

2. Start the server
```
dotnet run
```

3. Switch to the client directory (in another terminal)
```
cd quiz-application/quiz-app-client
```

4. Install the necessary packages
```
npm install
```

5. Start the client
```
npm start
```

6. Navigate to http://localhost:4200/ on the browser

# Testing

1. Navigate to the API test directory
```
cd QuizAppApi.Tests
```

2. Run tests
```
dotnet test
```
