# Panic Proof ✌️

## A gamified AI-powered disaster preparedness and emergency response app

### Why Panic Proof ✌️?

In an increasingly unpredictable world where natural and man-made disasters are becoming more frequent and severe, being prepared can make all the difference. Panic Proof was born out of the need to provide a comprehensive, user-friendly tool that empowers individuals and communities to take proactive measures before disaster strikes, respond effectively during emergencies, and recover more quickly in the aftermath.

Our mission is simple: to save lives and reduce suffering by making disaster preparedness accessible to everyone, regardless of their technical expertise or prior knowledge of emergency management.

## Features

### 🤖 AI-Powered Emergency Assistant
- Chat with an intelligent AI assistant specialized in disaster preparedness
- Get personalized advice and actionable checklists based on your specific needs
- Save AI-generated checklists directly to your preparation list
- Real-time responses with context-aware emergency guidance

### 🚨 Smart Alert System
- Receive immediate notifications about impending disasters in your area
- Customize alert preferences based on location and disaster types
- Access detailed information about each alert, including severity levels and recommended actions
- Location-based risk assessment and emergency instructions

### 📋 Gamified Preparation Tasks
- Complete disaster-specific preparation checklists with point rewards
- Track your preparedness progress with intuitive visual indicators
- Unlock badges and achievements for completing preparedness milestones
- Custom checklist creation and management system

### 🗺️ Smart Location Management
- Save multiple locations (home, work, school, family members) for targeted alerts
- Set primary location for personalized emergency planning
- Location-specific disaster risk assessments
- Manage evacuation routes and safety information for each location

### � Emergency Contact System
- Store and organize important emergency contacts with relationship tags
- Quick access to emergency services with one-tap calling
- Local and out-of-state contact management
- Integrated contact verification and backup systems

### 📚 Comprehensive Resource Library
- Browse curated disaster preparedness resources by category
- Access emergency services, medical facilities, and shelter information
- Educational content covering all major disaster types
- Offline-available guides for emergency situations

### 👤 Personalized User Profiles
- Detailed household profiles with specific needs (pets, children, elderly, medical conditions)
- Customized preparedness plans based on family composition
- Secure profile management with Clerk authentication
- Two-factor authentication and privacy controls

### 💬 Real-time Chat Interface
- Seamless chat experience with typing indicators
- Message history persistence across sessions
- Structured AI responses with actionable checklists
- Cross-platform message synchronization

## App Screenshots

<table>
  <tr>
    <td><img src="/assets/images/app-screenshots/1. splash.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/2. home-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/3. alert-screen.png" alt="App Screenshot" width="200"/></td>
  </tr>
  <tr>
    <td><img src="/assets/images/app-screenshots/4. prepare-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/5. gamified-prepare-screen.png" alt="App Screenshot" width="200"/></td>
    <td><img src="/assets/images/app-screenshots/6. resources-screen.png" alt="App Screenshot" width="200"/></td>
  </tr>
</table>

## Tech Stack

### Frontend & Mobile
- **Framework**: React Native with Expo (SDK 51+)
- **Language**: TypeScript for type safety and better developer experience
- **Navigation**: Expo Router with file-based routing system
- **UI Components**: Custom component library with consistent design system
- **Styling**: React Native StyleSheet with custom colors and spacing constants

### State Management
- **Primary Store**: Zustand for lightweight, scalable state management
- **Persistence**: AsyncStorage integration for offline data persistence
- **Store Architecture**: Modular stores (auth, user, tasks, alerts, chat, disasters, resources)

### Backend & Database
- **Database**: Supabase PostgreSQL with real-time capabilities
- **Authentication**: Clerk for secure user authentication and management
- **Security**: Row Level Security (RLS) policies for data protection
- **File Storage**: Supabase Storage for user assets and media

### AI & External Services
- **AI Assistant**: Google Gemini API for intelligent emergency preparedness advice
- **Smart Features**: Context-aware checklist generation and personalized recommendations
- **Data Processing**: Structured AI responses with actionable insights

### Development & Deployment
- **Build Tool**: Expo EAS Build for cross-platform compilation
- **Version Control**: Git with GitHub integration
- **Environment**: Multiple environment support (development, staging, production)
- **Package Manager**: npm with bun support for faster installations

### Architecture Patterns
- **Clean Architecture**: Separation of concerns with services, stores, and components
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Offline-First**: Data persistence and graceful offline functionality
- **Real-time Sync**: Cross-store data synchronization and live updates

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)
- Supabase account for database services
- Clerk account for authentication services
- Google AI Studio account for Gemini API access

### Installation

1. Clone the repository
```bash
git clone https://github.com/jamiul-islam/panic-proof.git
cd panic-proof
```

2. Install dependencies
```bash
npm install
# or if you prefer bun for faster installation
bun install
```

3. Set up environment variables
```bash
# Create a .env.local file in the root directory with:
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key
```

4. Set up Supabase database
```bash
# Run the database schema and seed data (if available)
# Make sure to enable RLS policies for security
```

5. Start the development server
```bash
bun start
```

6. Run on your preferred platform
```bash
# For iOS Simulator
i               # press i for ios simulator
# or
bun start --ios

# For Android Emulator
bun start --android

# For web (limited functionality)
bun start --web
```

## Key Features Implemented

### 🗄️ **Database Architecture**
- **8+ Supabase tables** with complex relationships
- **Row Level Security (RLS)** for data protection  
- **Real-time synchronization** between app and database
- **UUID-based user identification** with Clerk integration

### 🤖 **AI Integration**
- **Google Gemini AI** for emergency preparedness advice
- **Structured AI responses** with actionable checklists
- **Context-aware recommendations** based on user profile
- **Dynamic checklist generation** for different disaster types

### 🔐 **Security & Authentication**
- **Clerk authentication** with JWT tokens
- **Multi-factor authentication** support
- **Secure profile management** with encrypted data
- **Cross-platform session management**

### 📱 **Mobile Experience**
- **Native performance** with Expo React Native
- **Offline-first architecture** with local data persistence
- **Cross-screen data synchronization** 
- **Responsive design** for all screen sizes

### 🎮 **Gamification Elements**
- **Point-based reward system** for completed tasks
- **Progress tracking** with visual indicators  
- **Achievement badges** for preparedness milestones
- **Category-based filtering** and organization

## Contributing

This project is part of a University of London Final Project. While contributions are welcome, please note that this is primarily an academic project demonstrating full-stack mobile development capabilities.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices and maintain type safety
- Ensure all new features include proper error handling
- Test on both iOS and Android platforms
- Update documentation for any new features or API changes

## Project Status

✅ **Core Features Complete**
- AI-powered emergency assistance with Gemini integration
- Full authentication system with Clerk
- Comprehensive database with Supabase RLS
- Real-time chat interface with persistent storage
- Gamified task and checklist system
- Multi-location emergency planning
- Contact and resource management

🔧 **Known Issues**
- Minor TypeScript error in `utils/dev-helpers.ts` (duplicate code block)
- Expo configuration conflicts (app.json vs app.config.js)
- Missing peer dependency: expo-auth-session

## Performance & Scalability

- **Database**: Optimized queries with proper indexing
- **Caching**: Local storage with AsyncStorage for offline functionality  
- **State Management**: Efficient Zustand stores with selective persistence
- **Real-time Updates**: Supabase real-time subscriptions for live data
- **Error Handling**: Comprehensive error boundaries and user feedback

## Security Features

- **Row Level Security**: All Supabase tables protected with RLS policies
- **Authentication**: Secure Clerk integration with JWT tokens
- **Data Validation**: Input sanitization and type checking throughout
- **API Security**: Environment-based configuration management


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

### Academic Institution
- **University of London** - Final Project supervision and guidance
- **Computer Science Program** - Technical framework and requirements

### Technologies & Services
- **Expo Team** - For the exceptional React Native development platform
- **Supabase** - For providing enterprise-grade PostgreSQL with real-time capabilities
- **Clerk** - For robust authentication and user management services
- **Google AI** - For Gemini API enabling intelligent emergency assistance
- **Zustand Team** - For lightweight and efficient state management

### Open Source Community
- **React Native Community** - For continuous improvements and extensive ecosystem
- **TypeScript Team** - For enhanced developer experience and type safety
- **Emergency Management Professionals** - Whose guidelines informed our preparedness recommendations

### Special Recognition
This project demonstrates practical application of:
- Full-stack mobile development with modern tools
- AI integration for social good and emergency preparedness
- Secure database architecture with real-time capabilities
- User experience design for critical emergency applications

---

**Built with ❤️ for a safer, more prepared world.**

*A University of London Computer Science Final Project by [Jamiul Islam](https://github.com/jamiul-islam)*
