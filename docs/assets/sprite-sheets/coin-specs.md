# Coin Animation Specifications

## Overview
The coin animation system requires two sets of frames:
1. Spinning animation (idle state)
2. Collection animation (when collected)

## Coin Design Theme
- Style: Modern, tech-themed digital coin
- Base Color: Gold (#FFD700) with blue tech accents (#6542be - MYOB Purple)
- Size: 32x32 pixels per frame
- Format: PNG with transparency

## Spinning Animation Requirements
Create 8 individual frames (frame-0.png to frame-7.png):

1. Frame 0: Full coin face (circular)
2. Frame 1: Slight horizontal squeeze (85% width)
3. Frame 2: Edge view (thin line)
4. Frame 3: Slight horizontal squeeze (85% width) showing reverse side
5. Frame 4: Full reverse side view
6. Frame 5: Slight horizontal squeeze (85% width) showing reverse side
7. Frame 6: Edge view (thin line)
8. Frame 7: Slight horizontal squeeze (85% width) returning to front

File Structure:
```
assets/
  coins/
    development/
      spinning/
        frame-0.png  (front face)
        frame-1.png  (transition)
        frame-2.png  (edge)
        frame-3.png  (transition)
        frame-4.png  (reverse)
        frame-5.png  (transition)
        frame-6.png  (edge)
        frame-7.png  (transition)
```

## Collection Animation Requirements
Create 6 individual frames (frame-0.png to frame-5.png):

1. Frame 0: Normal size coin with slight glow
2. Frame 1: 110% size with increased glow
3. Frame 2: 120% size with maximum glow
4. Frame 3: 130% size with sparkle effects
5. Frame 4: 140% size starting to fade (50% opacity)
6. Frame 5: 150% size almost transparent (20% opacity)

File Structure:
```
assets/
  coins/
    development/
      collect/
        frame-0.png  (initial glow)
        frame-1.png  (growing)
        frame-2.png  (peak glow)
        frame-3.png  (sparkle)
        frame-4.png  (fading)
        frame-5.png  (disappearing)
```

## Technical Specifications

### Image Requirements
- Resolution: 32x32 pixels
- Format: PNG with transparency
- Color Depth: 32-bit (RGBA)
- Background: Transparent

### Animation Timing
- Spin Animation: 10 FPS (frames per second)
- Collection Animation: 15 FPS

### Visual Effects
1. Spinning Animation:
   - Smooth transition between frames
   - Consistent lighting across rotation
   - Subtle shine effect that moves across the coin

2. Collection Animation:
   - Glowing effect increases with each frame
   - Sparkle particles in later frames
   - Smooth fade-out transition
   - Color shift from gold to bright white in final frames

### Implementation Notes
- Each frame should be centered in the 32x32 canvas
- Maintain consistent lighting direction throughout spin
- Use anti-aliasing for smooth edges
- Include 1px padding around the coin for glow effects 