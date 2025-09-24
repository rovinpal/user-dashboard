# User Management Dashboard
A simple web application to view, add, edit, and delete users using a mock backend API (JSONPlaceholder).
This dashboard allows users to manage user details such as first name, last name, email, and department. 
It supports viewing, adding, editing, deleting users, as well as pagination, search, sort, and filter functionalities.


## Features
- View all users fetched from JSONPlaceholder API
- Add new users (local state + simulated API)
- Edit existing users (both API users and newly added users)
- Delete users (with confirmation)
- Pagination with selectable limits (10, 25, 50, 100)
- Search users by first name, last name, email, or department
- Sort users by any column
- Filter users via popup form
- Notifications for success or error actions
- Responsive design for desktop and mobile


## Technologies Used
- React 18
- Vite (fast React setup)
- Material-UI (MUI) for components
- Axios for API calls
- JSONPlaceholder as mock backend API
- JavaScript (ES6+), HTML, CSS


## Setup & Installation

1. Clone the repository

git clone https://github.com/rovinpal/user-dashboard
cd user-dashboard

2. Install dependencies
npm install

3. Start the development server
npm run dev

4. Open in browser
ex: http://localhost:5173


## Assumptions
- Newly added users are stored only in local state since JSONPlaceholder cannot persist them
- User IDs <= 10 are considered existing API users; IDs > 10 are newly added
- Department field is optional
- Sorting, filtering, and pagination are performed on client-side


## Challenges Faced
- JSONPlaceholder does not persist new users, so had to manage them in local state
- Handling updates for newly added users required careful state management
- Ensuring pagination, search, sort, and filter all work together on client-side


## Improvements (if more time allowed)
- Enhance filter options with multi-select departments
- Implement infinite scroll or virtualized list for better performance
- Improve responsive design and accessibility (keyboard navigation, ARIA labels)
