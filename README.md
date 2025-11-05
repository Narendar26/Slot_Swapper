\# 🔄 SlotSwapper



A peer-to-peer time-slot scheduling application where users can swap calendar events with each other.



Built for: ServiceHive Full Stack Intern Technical Challenge  

Author:Narendar Singh 

Email:narendarsinghmpc26@gmail.com



---



\## 🎯 What This App Does



\- Users can create calendar events (meetings, appointments, etc.)

\- Mark events as "swappable"

\- Browse other users' swappable events in a marketplace

\- Request to swap your event for someone else's event

\- Accept or reject incoming swap requests

\- When accepted, events automatically swap ownership



---



\## 🛠️ Tech Stack



\### Backend

\- \*\*Node.js\*\* \& \*\*Express\*\* - Server and REST API

\- \*\*MongoDB\*\* - Database

\- \*\*Mongoose\*\* - ODM for MongoDB

\- \*\*JWT\*\* - Authentication tokens

\- \*\*bcrypt\*\* - Password hashing



\### Frontend

\- \*\*React 18\*\* - UI framework

\- \*\*Vite\*\* - Build tool and dev server

\- \*\*Tailwind CSS\*\* - Styling

\- \*\*React Router\*\* - Navigation

\- \*\*Axios\*\* - HTTP requests

\- \*\*React Hot Toast\*\* - Notifications



---



\## 📦 Installation Instructions



\### Prerequisites



Before starting, make sure you have:

\- \*\*Node.js 18+\*\* installed (\[Download here](https://nodejs.org/))

\- \*\*MongoDB\*\* installed and running (\[Download here](https://www.mongodb.com/try/download/community))



---



\### Step 1: Download/Clone This Repository



\*\*Option A:\*\* Download ZIP

\- Click the green "Code" button above

\- Click "Download ZIP"

\- Extract the ZIP file to your computer



\*\*Option B:\*\* Clone with Git

```bash

git clone https://github.com/YOUR\_USERNAME/slot-swapper.git

cd slot-swapper


Step 2: Setup Backend
# Navigate to backend folder

cd backend



\# Install dependencies (this takes 1-2 minutes)

npm install


Create environment file:
Create a file named .env in the backend folder with this content:

PORT=5000

MONGODB\_URI=mongodb://localhost:27017/slot-swapper

JWT\_SECRET=my\_secret\_key\_for\_testing

JWT\_EXPIRE=7d

NODE\_ENV=development


Start the backend server:
npm run dev

Success looks like:
🚀 Server running on port 5000

✅ MongoDB connected successfully


Step 3: Setup Frontend
# Navigate to frontend folder (from slot-swapper root)

cd frontend



\# Install dependencies

npm install


Create environment file:
Create a file named .env in the frontend folder with this content:

VITE\_API\_URL=http://localhost:5000/api

Start the frontend server:
npm run dev

✅ Success looks like:
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
⚠️ Keep this terminal window open too!




Step 4: Open the Application

1.Open your browser

2.Go to: http://localhost:5173

3.You should see the login page with a blue gradient background




How to Test the Application

Complete Test Scenario

1\. Create First User (Alice)



Click "Sign up"

Fill in:

Name: Alice

Email: alice@test.com

Password: password123

Confirm Password: password123

Click "Sign Up"

You'll be redirected to the Dashboard

2\. Create an Event



Click "➕ Create Event"

Fill in:

Title: Team Meeting

Description: Weekly sync

Start Time: Tomorrow at 10:00 AM

End Time: Tomorrow at 11:00 AM

Click "Create Event"

3\. Make Event Swappable



Click "Make Swappable" button on the event

Status changes to green "SWAPPABLE"

4\. Create Second User (Bob)



Open a new incognito/private browser window (Ctrl+Shift+N)

Go to http://localhost:5173

Register as Bob (bob@test.com / password123)

Create event: "Focus Time" (2:00-3:00 PM)

Make it swappable

5\. Request a Swap



As Bob, click "🛒 Marketplace"

See Alice's "Team Meeting"

Click "Request Swap 🔄"

Select your "Focus Time" to offer

Click "Send Request"

6\. Accept the Swap



Switch back to Alice's browser window
Click "📬 Requests"

See Bob's incoming request

Click "✓ Accept Trade"

7\. Verify the Swap



Alice now has Bob's "Focus Time" event

Bob now has Alice's "Team Meeting" event

🎉 Success! The swap worked perfectly.



📚 API Endpoints
Authentication

POST /api/auth/register - Register new user

POST /api/auth/login - Login user

GET /api/auth/me - Get current user (requires auth)


Events

GET /api/events - Get user's events (requires auth)

POST /api/events - Create event (requires auth)

PATCH /api/events/:id - Update event status (requires auth)

DELETE /api/events/:id - Delete event (requires auth)


Swaps

GET /api/swaps/swappable-slots - Get marketplace slots (requires auth)

POST /api/swaps/request - Request a swap (requires auth)

GET /api/swaps/incoming - Get incoming requests (requires auth)

GET /api/swaps/outgoing - Get outgoing requests (requires auth)

POST /api/swaps/respond/:requestId - Accept/reject swap (requires auth)


🏗️ Project Structure



slot-swapper/

├── backend/

│   ├── src/

│   │   ├── config/

│   │   │   └── database.js

│   │   ├── controllers/

│   │   │   ├── authController.js

│   │   │   ├── eventController.js

│   │   │   └── swapController.js

│   │   ├── middleware/

│   │   │   └── auth.js

│   │   ├── models/

│   │   │   ├── User.js

│   │   │   ├── Event.js

│   │   │   └── SwapRequest.js

│   │   ├── routes/

│   │   │   ├── auth.js

│   │   │   ├── events.js

│   │   │   └── swaps.js

│   │   └── server.js

│   └── package.json

│

└── frontend/

&nbsp;   ├── src/

&nbsp;   │   ├── components/

&nbsp;   │   ├── context/

&nbsp;   │   ├── hooks/

&nbsp;   │   ├── pages/

&nbsp;   │   ├── services/

&nbsp;   │   ├── utils/

&nbsp;   │   └── App.jsx

&nbsp;   └── package.json

💡 Key Features \& Implementation
1. Swap Logic State Machine
BUSY → SWAPPABLE → SWAP\_PENDING → BUSY (on accept)

&nbsp;                ↓

&nbsp;             SWAPPABLE (on reject)

This prevents:

❌ Double-booking

❌ Race conditions

❌ Data inconsistency

2. Security

1.JWT Authentication: Stateless tokens for scalability

2.Password Hashing: bcrypt with 10 salt rounds

3.Protected Routes: Middleware checks token on every request

4.Input Validation: Both client and server-side


3\. User Experience

Color-coded statuses: Green (SWAPPABLE), Yellow (PENDING), Blue (BUSY)

Clear swap visualization: "What You'll Get" vs "What You'll Give Up"

Toast notifications: Instant feedback on all actions

Responsive design: Works on mobile, tablet, desktop


🔧 Troubleshooting

"Cannot connect to MongoDB"

Solution:







\# Windows

net start MongoDB



\# Mac

brew services start mongodb-community



\# Linux

sudo systemctl start mongod

"Port 5000 already in use"

Solution: Change PORT=5000 to PORT=5001 in backend/.env, and update frontend .env to VITE\_API\_URL=http://localhost:5001/api



"Registration fails / 500 error"

Solution: Make sure MongoDB is running and accessible at mongodb://localhost:27017



Frontend shows blank page

Solution:



Check browser console (F12) for errors

Make sure backend is running

Verify frontend/.env has correct API URL

Contact

Developer:Narendar Singh

Email: narendarsinghmpc26@gmail.com

GitHub: https://github.com/Narendar26

License

MIT License - Open source for educational purposes.









