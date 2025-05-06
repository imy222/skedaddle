# Power-up Sprite Sheet Specifications

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
   - Burst of purple particles around character
   - Flash of light
   - Screen shake effect (subtle)
   - "POWER UP!" text animation
   - Pulsing glow effect around character

2. During Powerup
   - Character scale increase to 2.5x normal size
   - Continuous particle trail effect in purple colors
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
  - Color 1: #6542BE (Purple)
  - Color 2: #1A237E (Navy)
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

# Power-up Effects Specifications

## Visual Effects

### Activation Effect
- Duration: 0.5s
- Elements:
  - Flash of light
  - Burst of purple particles around character
  - Scale-up animation
  - Glow effect

### Active State
- Duration: 10s
- Elements:
  - Continuous particle trail
  - Character size increase (1.5x)
  - Pulsing glow effect
  - Progress bar indicator

### Deactivation
- Duration: 0.3s
- Elements:
  - Fade out particles
  - Scale down animation
  - Flash effect

## Color Scheme
- Primary: #6542BE (Purple)
- Secondary: #1A237E (Navy)
- Accent: #FFFFFF (White)
- Particles: Mix of primary and secondary colors

## Technical Details
- Sprite sheet dimensions: 64x64px per frame
- Frame rate: 24fps
- Total frames: 8 frames per effect
- File format: PNG with transparency 