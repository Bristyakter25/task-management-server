
# 📝 Task Management Backend  

## 🚀 Description  
This is the backend service for the **Task Management** application, built using **Node.js** and **Express.js**. It provides RESTful APIs for managing tasks and database interactions. **MongoDB** is used for data storage.  

## 🔗 Live Links  
- 🌐 API Base URL: https://task-management-26416.web.app/ 

## 📦 Dependencies  
The backend relies on the following libraries and frameworks:  

- **Node.js** – JavaScript runtime for backend  
- **Express.js** – Lightweight backend framework  
- **MongoDB** – NoSQL database for task storage  
- **Mongoose** – ODM (Object Data Modeling) for MongoDB  
- **Firebase Admin SDK** – Authentication and user management  

## ⚙️ Installation Steps  

### Prerequisites  
Ensure you have **Node.js** and **MongoDB** installed on your system.  

### Setup Instructions  
1. Clone the repository:  
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables:  
   - Create a `.env` file in the backend root directory  
   - Add the following configurations:  
     ```env
     PORT=5000
     MONGO_URI=your-mongodb-connection-string
     FIREBASE_ADMIN_CREDENTIALS=your-firebase-admin-sdk-json
     ```
4. Start the backend server:  
   ```bash
   npm start
   ```
5. The API will be available at `http://localhost:5000/`  

## 🛠 Technologies Used  

### Backend Stack  
- **Node.js** – JavaScript runtime for backend  
- **Express.js** – Web framework for building APIs  
- **MongoDB** – NoSQL database for task storage  
