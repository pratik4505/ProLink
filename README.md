## Prolink

A social media website for professionals.
                                                
## Features

- **User Authentication:** Authentication through Login Signup page
- **Posting contents:** Users can post contents including images and videos in their posts.
- **Comments and replies** Anyone can comment on any post. Acoment can have many replies.
- **Requests:** Users can send connect or message request to any user.
- **Chats:** Connected users can chat trough messages.
- **Video call:** Connected users can also talk on video calls.
- **Notifications:** Users get notifications of requests, endorsements, video calls etc.
- **Endorsements:** Users can endorse each others skils.
- **Jobs:** Users can search for available jobs.
- **Profile:** Users can add or delete many types of informations in their profiles.


## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## External Libraries/APIs
- **Socket.IO**
- **Video Call**: PeerJs
- **Styling:**  Tailwind CSS


## Installation

1. Clone the repository:
   `git clone https://github.com/pratik4505/ProLink.git`

2. Install dependencies for both frontend and backend:

```
   cd Backend
   npm install

   cd Frontend
   npm install
```

3. PUT required API KEYS in .env file  (see .env.example)

4. Run the application:
```
//Run frontend (in the frontend directory)
npm run dev

//Run backend (in the backend directory)
npm run dev
```

5. Access the application at `http://localhost:5173/`



## Deployed Link
Access the deployed site here: `https://pro-link-ivory.vercel.app/`