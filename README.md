# drift

An elegant, OLED-optimized screensaver with integrated productivity tools. Designed to prevent screen burn-in while keeping you productive with floating widgets that orbit around your screen.

> **Note**: This is just a simple fun project I made to quickly solve a problem I had - wanting a beautiful screensaver that was both OLED-friendly and productive.

## ✨ Features

### 🎵 **Spotify Integration**

- Browse and play your playlists directly from the screensaver
- Supports both Premium and non-Premium accounts
- Web Playback SDK integration for Premium users
- External device control for non-Premium users
- Real-time track display with album art and progress

### 📝 **Todo List**

- Clean, intuitive task management
- Persistent storage with localStorage
- Mark tasks as complete/incomplete
- Delete tasks with hover controls
- Displays pending and completed task counts

### ⏰ **Pomodoro Timer**

- Customizable work and break durations (20-45 min work, 5-15 min break)
- Visual progress indicator
- Cycle counter
- Pause/resume functionality
- Reset option

### 🕐 **Dynamic Clock**

- 12/24-hour format support
- Character-level floating animations
- Smooth, organic movement
- Date display with full formatting

### 🎨 **OLED Optimized Design**

- Pure black background (OLED pixels completely off)
- Orbital animations prevent burn-in
- Minimal bright elements preserve battery
- Smooth transitions and movements
- Glassmorphism design with subtle transparency

## 🚀 Getting Started

### Prerequisites

- Spotify Developer Account (for music features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/danielarbabian/drift.git
   cd drift
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Copy the example environment file:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Spotify credentials:

   ```env
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000
   ```

4. **Configure Spotify App**

   In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):

   - Create a new app
   - Add `http://127.0.0.1:3000` to Redirect URIs
   - Note: Use `127.0.0.1` instead of `localhost` for proper OAuth flow

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**

   Navigate to [http://127.0.0.1:3000](http://127.0.0.1:3000)

## ⚙️ Configuration

### Spotify Setup

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add your redirect URI: `http://127.0.0.1:3000`
4. Required scopes are automatically requested:
   - `user-read-playback-state`
   - `user-modify-playback-state`
   - `user-read-currently-playing`
   - `playlist-read-private`
   - `playlist-read-collaborative`
   - `streaming` (Premium only)
   - `user-read-email` (Premium only)
   - `user-read-private` (Premium only)

### Settings Options

Access settings by moving your mouse and clicking the gear icon:

- **Clock Animation**: Static or floating character animation
- **Time Format**: 12-hour or 24-hour display
- **Pomodoro Settings**: Customize work (20-45 min) and break (5-15 min) durations
- **Floating Elements**: Toggle visibility of each component:
  - Spotify Player
  - Pomodoro Timer
  - Todo List

## 🎮 Usage

### Basic Controls

- **Mouse Movement**: Reveals control buttons
- **Settings Button**: Configure all preferences
- **Info Button**: View app information
- **Fullscreen Button**: Toggle fullscreen mode

### Spotify Features

- **Connect**: Click "Connect Account" and authorize the app
- **Browse Playlists**: View your playlists with thumbnails and track counts
- **Playback**:
  - Premium users get full web player with direct browser control
  - Non-Premium users can switch playlists on active Spotify devices
- **Controls**: Play/pause, skip tracks, view progress (Premium only)

### Todo List

- **Add Tasks**: Click "Add Task" or use keyboard shortcuts
- **Complete Tasks**: Click the circle icon to mark as done
- **Delete Tasks**: Hover over tasks to reveal delete button
- **Keyboard Shortcuts**: Enter to add, Escape to cancel

### Pomodoro Timer

- **Start/Pause**: Click the play/pause button
- **Reset**: Click the reset button to restart the cycle
- **Cycles**: Automatically alternates between work and break periods
- **Progress**: Visual progress bar shows remaining time

## 🏗️ Project Structure

```
├── app/                   # App directory
│   ├── page.tsx           # Main screensaver page
│   └── globals.css        # Global styles and animations
├── components/
│   ├── screensaver/       # Screensaver-specific components
│   │   ├── Clock.tsx      # Floating clock component
│   │   ├── SpotifyPlayer.tsx
│   │   ├── TodoList.tsx
│   │   ├── PomodoroTimer.tsx
│   │   └── ...
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
│   ├── useSpotify.ts      # Spotify integration logic
│   ├── useLocalStorage.ts # Persistent settings
│   └── ...
├── lib/                   # Utility functions
│   ├── spotify-actions.ts # Server actions for Spotify API
│   └── constants.ts       # App constants
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
