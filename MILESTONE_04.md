# Milestone 04 - Final Project Documentation

## Student Details
- **NetID**: svn9705  
- **Name**: Sanjana Nambiar  

---

## Repository Link  
This project is hosted on GitHub, where you can find all the code and documentation related to its implementation:  
[GitHub Repository Link](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Sanjana-Nambiar/tree/master)  

---

## URL for Deployed Site  
The project has been deployed on an NYU-hosted server, making it accessible for testing and demonstration.  
- **Deployed Site URL**: [http://linserv1.cims.nyu.edu:36620/](http://linserv1.cims.nyu.edu:36620/)  

---

## Workflow and Form URLs  

### URL for Form 1: User Login/Registration  
- **Purpose**: If a user is not logged in, they will be redirected to the login or registration page. This ensures that only authenticated users can access the application’s features.  
- **Steps**:  
  1. Navigate to the [login page](http://linserv1.cims.nyu.edu:36620/login).  
  2. If you do not have an account, register using the [registration page](http://linserv1.cims.nyu.edu:36620/register).  
  3. Once logged in, you can view trips, add trips, and explore detailed trip-related features.  
- **Default Credentials for Testing**:  
  - Username: `admin12345`  
  - Password: `admin12345`  

---

### URL for Form 2: Add a New Trip  
- **Purpose**: After logging in, users can add a new trip. This feature allows users to keep track of trips for expense management and planning.  
- **Steps**:  
  1. Navigate to the [home page](http://linserv1.cims.nyu.edu:36620/).  
  2. Use the `Add New Trip` button located in the navigation bar or below the hero section image to add a trip.  
  3. Once added, the trip will appear on the home page for further interactions.  
- **Link to Add Trip**: [Trip Add](http://linserv1.cims.nyu.edu:36620/trip/add)  

### URL for Form 3: Add Expenses to a Trip  
- **Purpose**: Allows users to log expenses for specific trips, enabling better financial tracking.  
- **Steps**:  
  1. After logging in, navigate to the [home page](http://linserv1.cims.nyu.edu:36620/).  
  2. Click on a specific trip to view its details (e.g., [Trip Check](http://linserv1.cims.nyu.edu:36620/trip/trip-check)).  
  3. Use the `Add Expense` button within the trip details view to log expenses.  
  4. The expenses will be associated with the selected trip and displayed accordingly.  
- **Link to Add Expense**: [Expense Add](http://linserv1.cims.nyu.edu:36620/trip/trip-check/add-expense)  


## Key Code Examples  

### Example 1: Constructor Implementation  
- **File**: [`session.mjs`](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Sanjana-Nambiar/blob/master/backend/src/session.mjs)  
- **Description**:  
  - Implements a `SessionManager` class to handle user sessions efficiently.  
  - Includes three static methods:
    1. `addUser`: Adds a user to the session.  
    2. `deleteUser`: Deletes a user session.  
    3. `checkSession`: Validates whether a session is active for a given user.  
  - By using static methods, the class eliminates the need for instantiation, allowing direct usage of the methods for session management.  

### Example 2: Higher-Order Function (HOF) for Authorization  
- **File**: [`app.mjs`](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Sanjana-Nambiar/blob/0389886daf58024b834b8f59527b6419e128fd6e/backend/src/app.mjs#L44)  
- **Description**:  
  - A Higher-Order Function (HOF) is implemented to ensure route authorization.  
  - The HOF takes another function as an argument, along with the `req` and `res` objects.  
  - It checks whether the user has an active session (`session.user`) and grants access to the route if authorized.  

### Database Schema  
- **File**: [`db.mjs`](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Sanjana-Nambiar/blob/0389886daf58024b834b8f59527b6419e128fd6e/backend/src/db.mjs)  
- **Description**:  
  - Defines the MongoDB schemas for managing users, trips, and expenses.  
  - Ensures proper data structure, validation, and indexing to support the application's functionality.  

## Research Topics and Tools  

1. **React.js (6 pts)**  
   - **Usage**:  
     - React was used for creating the frontend of the application.  
     - All components are modularized within the `components` folder, ensuring a clean and maintainable codebase.  
     - Dynamic state management and props are leveraged for seamless user interaction.  
   - **Reference Links**:  
     - [React.js Guide on W3Schools](https://www.w3schools.com/react/)  
     - [React Overview on GeeksforGeeks](https://www.geeksforgeeks.org/react/)  
     - [Axios vs Fetch API](https://medium.com/@johnnyJK/axios-vs-fetch-api-selecting-the-right-tool-for-http-requests-ecb14e39e285)  

2. **Bootstrap (2 pts)**  
   - **Usage**:  
     - Integrated for styling and responsive design.  
     - Bootstrap attributes and classes were used throughout the project, including the hero section in the [`Home.js`](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Sanjana-Nambiar/blob/0389886daf58024b834b8f59527b6419e128fd6e/frontend/src/components/Home.js#L64).  
   - **Reference Links**:  
     - [Bootstrap Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)  
     - [W3Schools Bootstrap Reference](https://www.w3schools.com/bootstrap/bootstrap_ref_all_classes.asp)  


3. **Mocha, Chai, and MongoDB Memory Server (3 pts)**  
   - **Usage**:  
     - Mocha and Chai were used for testing backend APIs.  
     - MongoDB Memory Server created a mock database for isolated testing.  
     - This setup ensures API robustness without relying on the production database.  
   - **Reference Links**:  
     - [Testing APIs with Mocha and Chai](https://www.digitalocean.com/community/tutorials/test-a-node-restful-api-with-mocha-and-chai)  
     - [Unit Testing with MongoDB Memory Server](https://dev.to/pawel/unit-testing-node-js-rest-api-mongodb-with-mocha-1f35) 
    - **Test Video**: 
      - A video demonstration of the project is available for reference:  [Watch Demonstration](https://www.youtube.com/shorts/ZzmffnUgroU)  

4. **Recharts (2 pts)**  
   - **Usage**:  
     - Recharts was used to create visually appealing area charts on the home and trip pages.  
     - The charts provide an interactive and intuitive way for users to analyze data.  
   - **Reference Links**:  
     - [Recharts Area Chart Example](https://recharts.org/en-US/examples/SimpleAreaChart)  
     - [Recharts Overview on Refine.dev](https://refine.dev/blog/recharts/#create-area-chart-using-recharts)  

## Conclusion  

This project combines secure authentication, robust session management, user-friendly trip and expense tracking, and interactive data visualizations. With its modular architecture and thorough testing, the application is both scalable and maintainable, offering a comprehensive solution for collaborative trip management.  


