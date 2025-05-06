# UI Elements Specifications

## Game Interface Elements
Location: 128x128 region

### 1. Buttons
- Start Button (96x32 pixels)
  - Purple gradient (#6542BE to #4527A0)
  - White text
  - Hover state glow
- Restart Button (96x32 pixels)
  - Navy gradient (#1A237E to #0D47A1)
  - White text
  - Hover state glow

### 2. Score Display
- Font: Monospace
- Size: 32px
- Colors:
  - Text: #FFFFFF
  - Stroke: #6542BE
  - Shadow: #000000

## Game Over Screen
- Background: Semi-transparent black (alpha: 0.7)
- Panel: #1A237E (alpha: 0.9)
- Border: #6542BE
- Text elements:
  - Title: 64px monospace
  - Score: 48px monospace
  - Button: 28px monospace

## Power-up Progress Bar
- Width: 200px
- Height: 10px
- Colors:
  - Background: #000000 (alpha: 0.5)
  - Fill: #6542BE
  - Border: #1A237E

## Menu Elements
- Buttons:
  - Size: 260x80px
  - Background: #6542BE
  - Hover: #7E57C2
  - Text: White
- Labels:
  - Size: 24px monospace
  - Color: White
  - Stroke: Black

## Technical Details
- Resolution: Vector-based UI
- Font rendering: Crisp edges
- Animation: Smooth transitions
- Responsive layout support

### Technical Properties
- Font: Pixelated sans-serif
- Animation frame rate: 6fps
- Glow pulse: 800ms cycle 