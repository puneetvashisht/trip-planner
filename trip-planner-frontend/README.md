# Trip Planner Mobile App

A React Native mobile application for planning and managing trips, built with the same features as the React web application.

## 🚀 Features

### Authentication
- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure authentication with JWT tokens
- **Token Management**: Automatic token refresh and secure storage
- **User Profile**: View and manage user information

### Trip Management
- **Create Trips**: Add new trips with title, description, dates, and images
- **Image Upload**: Support for trip images with camera/gallery selection
- **Trip Details**: View comprehensive trip information
- **Edit/Delete**: Modify or remove existing trips

### Itinerary Planning
- **Daily Itineraries**: Create detailed daily schedules
- **Activity Management**: Add, edit, and delete activities within itineraries
- **Time Planning**: Schedule activities with start and end times
- **Flexible Dates**: Support for same-day itineraries

### User Experience
- **Modern UI**: Clean, intuitive interface with Material Design
- **Responsive Design**: Optimized for various screen sizes
- **Navigation**: Tab-based navigation with stack navigation for flows
- **Offline Support**: Local storage for authentication tokens

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.0
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Storage**: AsyncStorage for local data
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **Image Handling**: React Native Image Picker
- **HTTP Client**: Fetch API with custom service layer

## 📱 Screens

### Authentication Screens
- **LoginScreen**: User authentication with username/password
- **RegisterScreen**: New user registration

### Main App Screens
- **HomeScreen**: Welcome dashboard with quick actions
- **TripsScreen**: List and manage all trips
- **AddTripScreen**: Create new trips with image upload
- **TripDetailScreen**: View trip details and itineraries
- **ProfileScreen**: User profile and settings

## 🔧 Installation

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd TripPlannerMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npx react-native start
   ```

5. **Run the app**
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

## 🌐 Backend Integration

The mobile app integrates with the same backend API as the web application:

- **Base URL**: `http://localhost:9090`
- **Authentication**: JWT-based authentication
- **Endpoints**: Same API structure as web app
- **Image Storage**: Public image endpoints for trip photos

### API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/trips/*` - Trip management
- `/api/itinerary/*` - Itinerary and activity management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── services/           # API services and utilities
├── contexts/           # React Context providers
├── utils/              # Utility functions
└── config/             # Configuration files
```

## 🔐 Authentication Flow

1. **App Launch**: Check for existing authentication token
2. **Token Validation**: Verify token with backend
3. **Auto-Login**: Restore user session if token is valid
4. **Login/Register**: User authentication forms
5. **Token Storage**: Secure token storage in AsyncStorage
6. **Auto-Refresh**: Automatic token refresh before expiration

## 🎨 UI/UX Features

- **Material Design**: Consistent with Google's design language
- **Color Scheme**: Professional color palette with proper contrast
- **Typography**: Clear, readable text hierarchy
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Layout**: Adapts to different screen orientations
- **Accessibility**: Proper labeling and touch targets

## 📱 Platform Support

### Android
- **Minimum SDK**: API 21 (Android 5.0)
- **Target SDK**: API 33 (Android 13)
- **Permissions**: Camera, Storage, Internet

### iOS
- **Minimum Version**: iOS 12.0
- **Target Version**: iOS 16.0
- **Permissions**: Camera, Photo Library, Internet

## 🚀 Development

### Code Style
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type safety (optional)

### Testing
- **Jest**: Unit testing framework
- **React Native Testing Library**: Component testing

### Building
- **Android**: Generate APK/AAB files
- **iOS**: Archive and distribute via App Store

## 🔧 Configuration

### Environment Variables
- **API_BASE_URL**: Backend API endpoint
- **DEBUG**: Enable/disable debug logging

### Backend Configuration
- **CORS**: Enable cross-origin requests
- **Image Storage**: Configure public image endpoints
- **Authentication**: JWT token configuration

## 📋 TODO

- [ ] Add offline mode support
- [ ] Implement push notifications
- [ ] Add trip sharing functionality
- [ ] Integrate with calendar apps
- [ ] Add trip templates
- [ ] Implement search and filtering
- [ ] Add trip statistics and analytics
- [ ] Support for multiple languages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔗 Related Projects

- **Web Application**: React-based trip planner
- **Backend API**: Node.js/Express backend
- **Database**: MongoDB with Mongoose ODM

---

**Built with ❤️ using React Native**
