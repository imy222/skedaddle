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

# Powerup Specifications

## Score-Based Size Increase Powerup

### Trigger Conditions
- Activates automatically when player's score reaches multiples of 10 (10, 20, 30, etc.)
- Duration: 10 seconds
- No manual collection required

### Effects
- Increases character size significantly
- Makes coin collection easier due to larger collision area
- Visual feedback during active duration

### Visual Indicators
1. Activation Effects
   - Burst of MYOB purple particles around character
   - Flash of white light
   - Screen shake effect (subtle)
   - "POWER UP!" text animation
   - Pulsing glow effect around character

2. During Powerup
   - Character scale increase to 2.5x normal size
   - Continuous particle trail effect in MYOB colors
   - Subtle pulsing effect on character (scale 2.5x to 2.3x)
   - Semi-transparent purple aura
   - Timer bar at top of screen showing duration

3. Deactivation Effects
   - Fade out of particle effects
   - Quick flash
   - Smooth scale down animation
   - "POWER DOWN" text fade

### Technical Details
- Initial scale increase: 2.5x normal size
- Pulse animation: Scale 2.5x to 2.3x (duration: 1000ms, repeat)
- Particle effects:
  - Color 1: #6542BE (MYOB Purple)
  - Color 2: #1A237E (MYOB Navy)
  - Color 3: #00A878 (Success Green)
- Duration timer: 10000ms
- Smooth transitions:
  - Power up animation: 500ms
  - Power down animation: 300ms

### Implementation Notes
- Use Phaser's particle system for effects
- Implement timer bar with smooth decrease
- Scale collision boundaries proportionally
- Add screen shake on activation
- Consider adding sound effects
- Maintain smooth animation transitions

### Edge Cases
- Handle multiple triggers (if score increases by 20+ at once)
- Manage state if game over occurs during powerup
- Smooth transition if powerup expires during jump/movement
- Ensure particle effects clean up properly
- Handle rapid score increases gracefully 