# Contest Tracker

Contest Tracker is a web application designed to help users track programming
contests across multiple platforms like Codeforces, Leetcode, and CodeChef. It
provides features like bookmarking contests, adding solution links, and
filtering contests based on platforms and search queries.

---

## Features
- **Automatic Data Fetching**: Retrieves contest data automatically from Codeforces using their API and from Leetcode and CodeChef through web scraping.
- **Track Contests**: View upcoming and past contests from multiple platforms.
- **Bookmark Contests**: Save contests for quick access.
- **Add Solution Links**: Add and view solution links for contests.
- **Filters and Search**: Filter contests by platform and search by contest
  name.
- **Pagination**: Efficiently navigate through large datasets of contests.

---

## API Documentation

### Endpoints

#### **Contests**

- **GET `/contests`**

  - Fetch contests with optional filters like platform, search, and pagination.
  - Query Parameters:
    - `platform` (string or array): Filter contests by platform (e.g.,
      `Codeforces`, `Leetcode`).
    - `page` (number): Page number for pagination.
    - `limit` (number): Number of contests per page.
    - `search` (string): Search contests by name.
    - `startDate` (string): Filter contests starting after this date.
    - `endDate` (string): Filter contests ending before this date.
  - Example:
    ```
    GET /contests?platform=Codeforces,Leetcode&page=1&limit=10
    ```

- **POST `/contests/solution`**
  - Add a solution link to a contest.
  - Body:
    ```json
    {
      "contestId": "64f1e9c2f3a2b1e5d8c9a123",
      "solution_link": "https://example.com/solution"
    }
    ```

#### **User**

- **GET `/user`**
  - Fetch user details.
  - Requires authentication.
  - Example:
    ```
    GET /user
    ```

- **POST `/user`**
  - Update user details.
  - Requires authentication.
  - Body:
    ```json
    {
      "name": "Updated Name",
      "email": "updated.email@example.com"
    }
    ```

- **POST `/user/bookmark`**
  - Bookmark a contest.
  - Body:
    ```json
    {
      "contestId": "64f1e9c2f3a2b1e5d8c9a123"
    }
    ```

#### **Auth**
  Authentication is done with cookies and jwt
- **POST `/auth/signup`**
  - Register a new user.
  - Body:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "securePassword123"
    }
    ```
- **POST `/auth/reset`**
  - Reset a user's password.
  - Middleware Authentication
  - Body:
    ```json
    {
      "email": "user@example.com",
      "newPassword": "newSecurePassword123"
    }
    ```
- **POST `/auth/login`**
  - Authenticate a user and return a token.
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
---

## Interfaces

### Contest

```ts
interface Contest {
  _id: string;
  name: string;
  platform: string;
  url: string;
  start_time: Date;
  end_time: Date;
  solution_link?: string;
  bookmarked?: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  bookmarks: string[]; // Array of contest IDs
}
```

## Project Structure

### Backend

- **Technologies:** Node.js, Express, MongoDB
- **Folder Structure:**
```
/backend
├── /controllers
├── /models
├── /routes
├── /middlewares
├── /utils
```

### Frontend

- **Technologies:** React, TypeScript, Vite
- **Folder Structure:**
```
/backend
├── /components
├── /pages
├── /assets
```

## How to Run

### Backend
- Navigate to the backend directory:
```
cd Backend
```
- Install depeendencies:
```
npm i
```
- Start the server
```
npm run dev
```

### Frontend
- Navigate to the frontend directory
```
cd frontend
```
- Install Dependencies:
```
npm i
```
- Start the development server
```
npm run dev
```
