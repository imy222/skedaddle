# Power-up Sprite Sheet Specifications

## Cape Power-up
Frame size: 32x48 pixels
Location: 128x192 region

### Transform Animation (4 frames)
- Frame 1: Cape materialization
- Frame 2: Cape unfurl
- Frame 3: Cape settle
- Frame 4: Full flow
Duration: 100ms per frame

### Powered-Up States
1. **Running with Cape** (6 frames)
   - Cape physics properties
   - Purple gradient effects
   - Digital trail particles

2. **Jumping with Cape** (4 frames)
   - Spread cape pose
   - Enhanced purple trails
   - Success green accents

### Technical Properties
- Cape colors:
  - Main: #6542BE (MYOB Purple)
  - Trim: #1A237E (MYOB Navy)
  - Glow: #00A878 (Success Green)
- Animation timing:
  - Transform: 400ms
  - Cape wave: 600ms
  - Particle refresh: 100ms 