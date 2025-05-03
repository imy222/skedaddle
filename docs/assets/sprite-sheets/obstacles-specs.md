# Obstacle Specifications

## Overview
The game features a single type of obstacle that the player must avoid:
- A clock showing "overtime" text
- Collision with any obstacle triggers game over

## Technical Specifications

### Clock Obstacle
- **Size**: 32x32 pixels
- **Format**: PNG with transparency
- **Animation**: None (static image)
- **Scale in Game**: 0.2
- **Collision Box**: 60% of sprite width, 70% of sprite height
- **Movement**: Moves left at constant speed
- **Spawn Position**: Right edge of screen, grounded on path

## Gameplay Mechanics
- Obstacles spawn from the right side of the screen
- Move left at a constant speed
- Must be avoided by jumping over them
- Collision triggers immediate game over
- Spawn rate increases with score

## Asset Requirements
1. Clock image with "overtime" text
   - Clean, readable design
   - Consistent with game's visual style
   - Clear silhouette for gameplay readability

## File Structure
```
assets/
  obstacles/
    development/
      clock/
        overtime-clock.png
``` 