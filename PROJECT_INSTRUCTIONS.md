# Audio and Video Player - Portfolio Project

Build a premium audio and video player that showcases modern web development skills.

## Phase 1: Basic Requirements ✅

**Objective:** Fulfill the basic user stories below.

**User Stories:**
- You should have an h1 element for the main title of the page
- You should have two section elements
- Inside the first section element, you should have an h2 element for the title of the video playing
- Below the h2 element, you should have a video element with controls and width attributes (width: 640)
- Inside the video element, you should have a source element with a src attribute pointing to a video file and a type attribute
- Inside the second section element, you should have an h2 element for the title of the song playing
- Below the h2 element, you should have an audio element with the controls and loop attributes, and a src attribute that points to an audio file

**Resources:**
- Video: https://cdn.freecodecamp.org/curriculum/labs/what-is-the-map-method-and-how-does-it-work.mp4
- Audio: https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3
- Audio: https://cdn.freecodecamp.org/curriculum/js-music-player/we-are-going-to-make-it.mp3

---

## Phase 2: Premium Enhancement 🎨

Transform this into a portfolio-worthy project with modern design and functionality.

### Design System

**Color Palette:**
- **Dark Blue** (Primary): #1a1f3a, #2c3e65
- **Mid Blue** (Accent): #4a69bd, #5f7ccd
- **Cherry Red** (Highlight): #e74c3c, #c0392b
- **Whites** (Text/BG): #ffffff, #f8f9fa, #ecf0f1

**Typography:**
- Modern sans-serif fonts (Inter, Poppins, or system fonts)
- Clear hierarchy with size and weight variations

### Custom Media Player Features

**Video Player:**
- Custom play/pause button with smooth animations
- Custom progress bar with scrubbing capability
- Time display (current/total)
- Volume slider with mute toggle
- Playback speed controls (0.5x, 1x, 1.5x, 2x)
- Fullscreen toggle
- Loading state indicator

**Audio Player:**
- Playlist with multiple tracks (minimum 3 songs)
- Previous/Next track buttons
- Shuffle and repeat modes
- Visual waveform or progress visualization
- Album art display area
- Track information (title, artist, duration)

### JavaScript Functionality

**Core Features:**
- Hide native controls, build custom UI
- Click events for all custom controls
- Real-time progress updates
- Keyboard shortcuts (Space: play/pause, Arrow keys: seek, M: mute)
- Volume persistence (localStorage)
- Remember last played track and position
- Smooth transitions between tracks

**Enhanced UX:**
- Loading states and error handling
- Responsive touch controls for mobile
- Drag to scrub on progress bar
- Hover effects with visual feedback
- Click outside to close any open menus/controls

### Responsive Design Requirements

**Mobile (< 768px):**
- Stack sections vertically
- Touch-optimized controls (larger hit areas)
- Simplified control layout
- Collapsible playlist

**Tablet (768px - 1024px):**
- Side-by-side or stacked based on orientation
- Full feature set with optimized spacing

**Desktop (> 1024px):**
- Maximum width container with centering
- Hover states and tooltips
- Enhanced visual effects

### Modern Styling

**Visual Effects:**
- Smooth transitions (300ms ease)
- Subtle shadows for depth
- Gradient backgrounds or accents
- Border radius for modern feel (8px-16px)
- Focus states for accessibility

**Animations:**
- Play/pause icon morphing
- Progress bar fill animations
- Volume slider feedback
- Track switching transitions
- Loading spinner

**Layout:**
- CSS Grid or Flexbox
- Consistent spacing system (8px base unit)
- Card-based design with elevation
- Clear visual hierarchy

### Portfolio Goals

This project should demonstrate:
- ✅ Clean, semantic HTML structure
- ✅ Advanced CSS with custom properties
- ✅ Vanilla JavaScript DOM manipulation
- ✅ Event handling and state management
- ✅ Responsive design principles
- ✅ Accessibility considerations
- ✅ Modern UI/UX patterns
- ✅ Cross-browser compatibility
