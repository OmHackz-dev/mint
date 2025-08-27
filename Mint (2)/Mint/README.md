# Mint - Modern Messaging Platform

A beautiful, feature-rich messaging webapp built with React, TypeScript, and Supabase. Mint provides real-time chat, user profiles, and a secure authentication system with a modern, intuitive interface.

![Mint Logo](mint.png)

## ✨ Features

### 🔐 Secure Authentication
- **Press-and-Hold Captcha**: Unique verification system to prevent bots
- **Supabase Auth**: Secure user authentication with email/password
- **Profile Management**: Customizable user profiles with avatars

### 💬 Real-Time Messaging
- **Instant Chat**: Real-time messaging with Supabase subscriptions
- **Markdown Support**: Rich text formatting with syntax highlighting
- **Colored Messages**: Optional text coloring for personalization
- **Chat History**: Persistent message storage and retrieval

### 👥 User Discovery
- **User Search**: Find people by username or full name
- **Instant Chat Start**: Begin conversations with one click
- **Profile Browsing**: View detailed user profiles and bios

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Smooth Animations**: Framer Motion powered interactions
- **Clean Interface**: Minimal, professional design aesthetic

### 🚀 Technical Features
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vite**: Fast development and build tooling
- **Real-time Updates**: Live chat updates and notifications

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Markdown**: React Markdown + Syntax Highlighter

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Supabase account and project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mint-messaging
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database

1. Go to your Supabase project's SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create all necessary tables and policies

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📱 Usage

### Authentication
1. **Sign Up**: Create an account with email, password, username, and full name
2. **Press-and-Hold Captcha**: Complete the verification by holding the button
3. **Sign In**: Use your credentials to access the platform

### Messaging
1. **Start Chat**: Use the search function to find users and start conversations
2. **Send Messages**: Type your message and optionally add color formatting
3. **Markdown**: Use Markdown syntax for rich text formatting
4. **Real-time**: Messages appear instantly for all participants

### Profile Management
1. **Edit Profile**: Update your username, bio, and avatar
2. **Customize**: Add a profile picture and personal bio
3. **Settings**: Toggle between light and dark themes

## 🗄️ Database Schema

### Tables

- **`profiles`**: User profile information (username, bio, avatar)
- **`chats`**: Chat rooms with participant lists
- **`messages`**: Individual messages with content and metadata

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data and chats they participate in
- Automatic profile creation on user registration

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
```

### Project Structure

```
src/
├── components/          # React components
│   ├── AuthForms.tsx   # Authentication forms
│   ├── ChatInterface.tsx # Chat interface
│   ├── ChatList.tsx    # Chat list view
│   ├── Navigation.tsx  # Sidebar navigation
│   ├── PressHoldCaptcha.tsx # Captcha component
│   ├── ProfileEditor.tsx # Profile editing
│   ├── ProfileView.tsx # Profile display
│   └── UserSearch.tsx  # User search modal
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── ThemeContext.tsx # Theme management
├── lib/                # Utility libraries
│   └── supabase.ts    # Supabase client
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### Key Components

- **PressHoldCaptcha**: Custom captcha with press-and-hold verification
- **ChatInterface**: Real-time messaging with Markdown support
- **UserSearch**: Find and start chats with other users
- **ProfileEditor**: Edit user profile information
- **Navigation**: Responsive sidebar with theme toggle

## 🎨 Customization

### Themes
- **Light Mode**: Clean white background with dark text
- **Dark Mode**: Dark background with light text
- **Mint Accent**: Custom mint green color scheme throughout

### Styling
- Tailwind CSS classes for consistent design
- CSS custom properties for theme switching
- Responsive breakpoints for mobile/desktop

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Connect your repository to Vercel or Netlify
2. Set environment variables in your deployment platform
3. Deploy automatically on git push

### Environment Variables

Ensure these are set in your production environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev) for beautiful icons

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the code comments for implementation details

---

Built with ❤️ using modern web technologies
