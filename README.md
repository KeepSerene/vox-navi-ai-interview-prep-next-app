# VoxNavi

<div align="center">

<img src="./public/logo.svg" alt="VoxNavi Logo" width="120" />

<h2>AI-Powered Interview Preparation Platform</h2>

<p>
VoxNavi is a modern, responsive web application designed to help job seekers prepare for interviews through AI-powered mock interviews and detailed feedback.
</p>

</div>

<div align="center">

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.5.0-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

</div>

## 🔗 Live Demo

Experience VoxNavi in action: [https://vox-navi.vercel.app/](https://vox-navi.vercel.app/)

## 📱 Desktop View

![VoxNavi Desktop View](/public/vox-navi-home.png "Homepage")

## ✨ Features

- **AI Voice Interviews**: Practice with Vapi's voice assistant for a realistic interview experience
- **Customizable Interviews**: Generate interviews tailored to specific job roles, experience levels, and tech stacks
- **Comprehensive Feedback**: Get detailed assessments powered by Google's Gemini AI
- **User Authentication**: Secure signup and login system via Firebase Authentication
- **Interview Library**: Access and attempt interviews created by other users
- **Dark Mode Design**: Modern, sleek UI with responsive design for all devices
- **Detailed Performance Analytics**: View scores across multiple categories including communication skills, technical knowledge, and problem-solving
- **Privacy Control**: Option to delete all user data upon account deletion

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Backend**: Next.js API Routes, Firebase Admin SDK
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Form Validation**: Zod, React Hook Form
- **AI Services**:
  - Voice Assistant: Vapi AI
  - Feedback Generation: Google Gemini
  - Interview Questions: OpenAI
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/KeepSerene/vox-navi-ai-interview-prep-next-app
cd vox-navi-ai-interview-prep-next-app
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env.local` file with the following variables:

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Service Account)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Google AI SDK
GOOGLE_API_KEY=

# Vapi
NEXT_PUBLIC_VAPI_API_KEY=
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📚 Project Structure

```
vox-navi-next15-app/
├── app/                  # Next.js pages and API routes
├── components/           # Reusable React components
├── constants/            # Application constants
├── firebase/             # Firebase configuration and utils
├── lib/                  # Utility functions and hooks
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── ...config files
```

## 🔒 Authentication Flow

VoxNavi uses Firebase Authentication with secure session cookies for enhanced security:

- Server-side session validation
- HTTP-only cookies
- Session expiration and automatic renewal

## User Authentication using Firebase Auth

![Firebase authentication flowchart](/public/auth-flowchart.png "Firebase Authentication Flowchart")

### Sign Up Flow

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'darkMode': true, 'background': '#0d1117', 'primaryColor': '#30363d', 'primaryTextColor': '#e6edf3', 'primaryBorderColor': '#30363d', 'lineColor': '#8b949e', 'secondaryColor': '#161b22', 'tertiaryColor': '#161b22' }}}%%
sequenceDiagram
    participant User as User/Browser
    participant Client as Client-side Code (using clientAuth)
    participant ServerAction as Server Actions
    participant AdminSDK as Admin SDK (adminAuth)
    participant FirebaseAuth as Firebase Authentication
    participant FirebaseDB as Firebase Firestore

    Note over User, FirebaseDB: Sign Up Flow
    User->>Client: Enter name, email, password
    Client->>FirebaseAuth: createUserWithEmailAndPassword()
    FirebaseAuth-->>Client: Return user credential with UID
    Client->>ServerAction: Call signUpAction with UID, name, email, password
    ServerAction->>AdminSDK: Use adminDB to check if user exists
    AdminSDK->>FirebaseDB: Query Firestore (users collection)
    FirebaseDB-->>AdminSDK: Return user record (if exists)

    alt User already exists
        AdminSDK-->>ServerAction: Return error - user exists
        ServerAction-->>Client: Return error message
        Client-->>User: Display error toast
    else User doesn't exist
        AdminSDK->>FirebaseDB: Create new user document in Firestore
        FirebaseDB-->>AdminSDK: Confirm document created
        AdminSDK-->>ServerAction: Return success
        ServerAction-->>Client: Return success message
        Client->>User: Display success toast & redirect to sign-in
    end

```

### Sign In Flow

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'darkMode': true, 'background': '#0d1117', 'primaryColor': '#30363d', 'primaryTextColor': '#e6edf3', 'primaryBorderColor': '#30363d', 'lineColor': '#8b949e', 'secondaryColor': '#161b22', 'tertiaryColor': '#161b22' }}}%%
sequenceDiagram
    participant User as User/Browser
    participant Client as Client-side Code (using clientAuth)
    participant ServerAction as Server Actions
    participant AdminSDK as Admin SDK (adminAuth)
    participant FirebaseAuth as Firebase Authentication
    participant FirebaseDB as Firebase Firestore

    Note over User, FirebaseDB: Sign In Flow
    User->>Client: Enter email, password
    Client->>FirebaseAuth: signInWithEmailAndPassword()
    FirebaseAuth-->>Client: Return user credential
    Client->>FirebaseAuth: getIdToken()
    FirebaseAuth-->>Client: Return idToken (JWT)
    Client->>ServerAction: Call signInAction with email, idToken
    ServerAction->>AdminSDK: Verify user exists by email
    AdminSDK->>FirebaseAuth: getUserByEmail()
    FirebaseAuth-->>AdminSDK: Return user record (or error)

    alt User doesn't exist
        AdminSDK-->>ServerAction: Return error
        ServerAction-->>Client: Return error message
        Client-->>User: Display error toast
    else User exists
        ServerAction->>AdminSDK: createSessionCookie(idToken)
        AdminSDK->>FirebaseAuth: Verify idToken & create session
        FirebaseAuth-->>AdminSDK: Return session cookie
        AdminSDK->>ServerAction: Return session cookie
        ServerAction->>ServerAction: Set HTTP-only cookie in response
        ServerAction-->>Client: Return success
        Client->>User: Display success toast & redirect to home
    end

```

### Session Validation Flow (Future Requests)

```mermaid
%%{init: {'theme': 'dark', 'themeVariables': { 'darkMode': true, 'background': '#0d1117', 'primaryColor': '#30363d', 'primaryTextColor': '#e6edf3', 'primaryBorderColor': '#30363d', 'lineColor': '#8b949e', 'secondaryColor': '#161b22', 'tertiaryColor': '#161b22' }}}%%
sequenceDiagram
    participant User as User/Browser
    participant ServerAction as Server Actions
    participant AdminSDK as Admin SDK (adminAuth)
    participant FirebaseAuth as Firebase Authentication

    Note over User, FirebaseAuth: Session Validation (Future Requests)
    User->>ServerAction: Request protected page/data
    ServerAction->>AdminSDK: Verify session cookie
    AdminSDK->>FirebaseAuth: validateSessionCookie()
    FirebaseAuth-->>AdminSDK: Return decoded claims or error

    alt Valid session
        AdminSDK-->>ServerAction: User is authenticated
        ServerAction-->>User: Return protected content
    else Invalid session
        AdminSDK-->>ServerAction: Authentication failed
        ServerAction-->>User: Redirect to login
    end

```

## Detailed Auth Explanations

### Sign Up Process:

1. User enters their information in the AuthForm component
2. Client-side Firebase creates the auth record via `createUserWithEmailAndPassword`
3. You get a user credential with a UID from Firebase Authentication
4. The server action `signUpAction` then stores additional user information in Firestore
5. If successful, user is redirected to sign in

### Sign In Process:

1. User enters email/password in the AuthForm
2. Client-side Firebase authenticates via `signInWithEmailAndPassword`
3. You request an ID token (JWT) from the authenticated user
4. The server action `signInAction` verifies the user and creates a session cookie
5. This cookie is set in the HTTP response as an HTTP-only cookie
6. Future requests will include this cookie automatically, authenticating the user

### What is the ID Token (`idToken`)?

The ID token is a JWT (JSON Web Token) that:

- Is created by Firebase when a user authenticates
- Contains the user's identity information
- Is cryptographically signed to verify authenticity
- Is short-lived (usually 1 hour)
- Gets exchanged on the server for a longer-lived session cookie

## 📊 Interview and Feedback System

1. **Interview Generation**:

   - Custom interviews based on job role, experience level, and tech stack
   - Questions generated using AI models

2. **Voice Interview Process**:

   - Real-time voice interaction with the AI assistant
   - Transcript recording for feedback generation

3. **Feedback Analysis**:
   - Multiple performance categories assessment
   - Strengths and areas for improvement
   - Overall score and detailed recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Lead developer: [Dhrubajyoti Bhattacharjee](https://github.com/KeepSerene)

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Vapi AI](https://vapi.ai/)
- [Google Gemini](https://ai.google.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
