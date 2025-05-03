# Character Sprite Sheet Specifications

## Base Character
Frame size: 32x48 pixels
Location: Top-left of sprite sheet (0,0 to 128,192)

### Animations
1. **Idle Animation** (4 frames)
   - Business professional stance
   - Tablet/phone interaction
   - MYOB-branded attire
   - Frame duration: 200ms

2. **Running Animation** (6 frames)
   - Dynamic business running pose
   - Briefcase motion
   - Frame duration: 100ms

3. **Jumping Animation** (4 frames)
   - Professional leap pose
   - Purple motion trails
   - Frame duration: 150ms

4. **Landing Animation** (3 frames)
   - Professional landing pose
   - Frame duration: 100ms

## Technical Details
- Animation frame rate: 12fps
- Collision bounds: 28x44 pixels
- Pivot point: Bottom center
- Hit box offset: 2px from sides 