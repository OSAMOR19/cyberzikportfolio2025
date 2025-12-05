# Christmas Theme Layer

A complete, toggleable Christmas theme overlay for your Next.js portfolio. All effects are controlled by a global ON/OFF switch and stored in localStorage.

## Features

### 1. Christmas Mode Toggle
- **Location**: Fixed top-right corner
- **Functionality**: Enables/disables all Christmas effects
- **Persistence**: State saved in localStorage
- **Component**: `ChristmasToggle`

### 2. Soft Christmas Background Glow
- **Effect**: Red and green gradient glows around page edges
- **Style**: Subtle, premium-looking with blur
- **Performance**: CSS-based, no performance impact
- **Component**: `ChristmasGlow`

### 3. Falling Snow Animation
- **Technology**: HTML5 Canvas
- **Performance**: Optimized with ~100 snowflakes max
- **Features**:
  - Responsive to screen size
  - Lightweight animation
  - Doesn't block interactions
- **Component**: `ChristmasSnow`

### 4. Christmas Music (Optional)
- **Location**: Fixed left side, top
- **Features**:
  - Play/pause control
  - No autoplay (user must click)
  - Volume set to 30%
  - Looping background music
- **Source**: Uses free Christmas music (Bensound)
- **Component**: `ChristmasMusic`

### 5. Button Sparkle Effects
- **Effect**: Sparkle burst animation on button hover
- **Implementation**: CSS classes + React component
- **Features**:
  - Gold sparkle particles
  - Glowing border animation
  - Does not modify button text or functionality
- **CSS**: `christmas-effects.css`
- **Component**: `ChristmasButton`

### 6. Floating Christmas Decorations
- **Decorations**:
  - 4 corner elements (bells, stars, gifts, trees)
  - Hanging ornaments at top
  - Candy canes in corners
- **Animation**: Smooth floating with Framer Motion
- **Positioning**: Smart placement to avoid content overlap
- **Component**: `ChristmasDecorations`

### 7. Santa Hat on Logo
- **Target**: Automatically detects and decorates logos
- **Features**:
  - CSS-drawn SVG Santa hat
  - Gentle bobbing animation
  - Rotated for natural look
- **Component**: `SantaHat` and `LogoWithSantaHat`

## File Structure

```
components/Christmas/
├── ChristmasContext.tsx      # Global state management
├── ChristmasToggle.tsx        # ON/OFF toggle button
├── ChristmasGlow.tsx          # Background glow effects
├── ChristmasSnow.tsx          # Falling snow canvas
├── ChristmasMusic.tsx         # Background music player
├── ChristmasDecorations.tsx   # Floating decorations
├── ChristmasButton.tsx        # Button sparkle wrapper
├── SantaHat.tsx               # Santa hat component
├── ChristmasWrapper.tsx       # Main wrapper component
├── christmas-effects.css      # CSS animations
├── index.tsx                  # Export all components
└── README.md                  # This file
```

## How It Works

### Installation (Already Done)

1. **Layout Integration** (`app/layout.tsx`):
   ```tsx
   import { ChristmasProvider } from '@/components/Christmas'
   // Wrap your app with ChristmasProvider
   ```

2. **Page Integration** (`app/page.tsx`):
   ```tsx
   import { ChristmasWrapper, LogoWithSantaHat } from '@/components/Christmas'
   // Add <ChristmasWrapper /> at the top of your return
   // Wrap logos with <LogoWithSantaHat>
   ```

3. **CSS Import** (`app/layout.tsx`):
   ```tsx
   import '../components/Christmas/christmas-effects.css'
   ```

### Usage

#### Basic Setup (Current Implementation)
The theme is fully integrated. Users can toggle Christmas mode using the button in the top-right corner.

#### Using Individual Components

**Christmas Button with Sparkles:**
```tsx
import { ChristmasButton } from '@/components/Christmas'

<ChristmasButton className="your-classes">
  Click Me
</ChristmasButton>
```

**Add Santa Hat to Any Element:**
```tsx
import { LogoWithSantaHat } from '@/components/Christmas'

<LogoWithSantaHat>
  <YourLogo />
</LogoWithSantaHat>
```

**Custom Santa Hat Positioning:**
```tsx
import { SantaHat } from '@/components/Christmas'

<div className="relative">
  <YourElement />
  <SantaHat top="10px" right="5px" scale={0.5} />
</div>
```

## How to Turn Features ON/OFF

### For Users (Runtime)
1. Click the Christmas toggle button in the top-right corner
2. All effects will activate/deactivate instantly
3. Preference is saved in localStorage

### For Developers (Code)

#### Remove All Christmas Features:
```tsx
// 1. Remove from app/layout.tsx:
// - Remove ChristmasProvider import
// - Remove christmas-effects.css import
// - Unwrap children from ChristmasProvider

// 2. Remove from app/page.tsx:
// - Remove ChristmasWrapper component
// - Remove LogoWithSantaHat wrappers (keep the Image components)

// 3. Optional: Delete the entire components/Christmas folder
```

#### Disable Specific Features:
Edit `components/Christmas/ChristmasWrapper.tsx` and comment out unwanted components:

```tsx
export const ChristmasWrapper = () => {
  return (
    <>
      <ChristmasGlow />
      <ChristmasSnow />
      <ChristmasDecorations />
      <ChristmasToggle />
      {/* <ChristmasMusic /> */}  // Disable music
    </>
  )
}
```

## Performance Notes

- **Snow Animation**: Uses requestAnimationFrame for smooth 60fps
- **Canvas Rendering**: Cleared and redrawn each frame
- **Snowflake Count**: Adaptive (scales with screen width, max 100)
- **CSS Effects**: GPU-accelerated transforms and animations
- **Memory**: All effects clean up on unmount
- **Bundle Size**: ~15KB total (minified)

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Optimized and responsive

## Customization

### Change Colors:
Edit `ChristmasGlow.tsx` to change the glow colors:
```tsx
background: 'radial-gradient(circle, rgba(YOUR_RGB, 0.3) 0%, transparent 70%)'
```

### Change Snow Density:
Edit `ChristmasSnow.tsx`:
```tsx
const count = Math.min(YOUR_MAX, Math.floor(window.innerWidth / YOUR_DIVISOR))
```

### Change Decorations:
Edit `ChristmasDecorations.tsx` and modify the `decorations` array or add new emojis.

### Change Music:
Edit `ChristmasMusic.tsx` and replace the audio source URL:
```tsx
audioRef.current = new Audio('YOUR_MUSIC_URL')
```

## Cleanup After Christmas

To completely remove all Christmas features:

1. Delete the entire `components/Christmas/` folder
2. Remove imports from `app/layout.tsx`:
   - `import '../components/Christmas/christmas-effects.css'`
   - `import { ChristmasProvider } from '@/components/Christmas'`
3. Unwrap children in `app/layout.tsx` (remove `<ChristmasProvider>`)
4. Remove imports from `app/page.tsx`:
   - `import { ChristmasWrapper, LogoWithSantaHat } from '@/components/Christmas'`
5. Remove `<ChristmasWrapper />` from the page
6. Replace `<LogoWithSantaHat>` wrappers with just the Image components

Total time: ~2 minutes

## Support

All Christmas code is self-contained in the `components/Christmas/` folder and can be safely removed without affecting the rest of your application.

## Credits

- Snow Animation: Custom canvas implementation
- Music: Bensound (free music)
- Decorations: Unicode emoji + CSS animations
- Framework: React + Next.js + Framer Motion
- State Management: React Context API

---

**Merry Christmas!** 🎄🎅⭐
