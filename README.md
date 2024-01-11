
    User Registration and Login Application
    
This application allows users to register, log in, and update their profile information. It is built using Node.js, Express, MongoDB, and Mongoose.

Libraries Used
Express: Web application framework for Node.js
body-parser: Parses incoming request bodies
mongoose: ODM (Object Document Mapper) for MongoDB
lodash: Utility library for common JS tasks
mongoose-encryption: Plugin for encrypting Mongoose fields
dotenv: Loads environment variables from a .env file



Install dependencies:
npm install

Create a MongoDB Atlas account and database:

Sign up for MongoDB Atlas (https://www.mongodb.com/atlas/database)
Create a new cluster
Create a database user and password


Create a .env file:
In the root directory of the project, create a file named .env


Add the following variables to the .env file:
SECRET=your_secret_key
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster_name>.mongodb.net/<database_name>
Replace the placeholders with your actual MongoDB credentials


Start the server:
npm start
Use code with caution. Learn more
Application Endpoints
GET /: Displays the signup form
GET /login.html: Displays the login form
POST /signupform: Handles user registration
POST /login: Handles user login
POST /updateUserDetails: Handles user profile updates


Additional Notes
The application uses EJS templates for rendering HTML pages.
The user password is encrypted before being stored in the database using the mongoose-encryption plugin.
The dotenv library is used to load sensitive information from the .env file, preventing it from being exposed in the code.
