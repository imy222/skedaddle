# Character Animation Assets Structure

## Directory Organization
```
assets/character/
├── development/          # Individual frame development
│   ├── idle/            # 4 frames (200ms each)
│   │   ├── frame-0.png  # Standing, device check
│   │   ├── frame-1.png  # Slight movement
│   │   ├── frame-2.png  # Device interaction
│   │   └── frame-3.png  # Return to standing
│   ├── running/         # 6 frames (100ms each)
│   │   ├── frame-0.png  # Start running
│   │   ├── frame-1.png  # Mid-stride
│   │   ├── frame-2.png  # Full stride
│   │   ├── frame-3.png  # Mid-return
│   │   ├── frame-4.png  # Full return
│   │   └── frame-5.png  # Cycle complete
│   ├── jumping/         # 4 frames (150ms each)
│   │   ├── frame-0.png  # Jump start
│   │   ├── frame-1.png  # Rising
│   │   ├── frame-2.png  # Peak
│   │   └── frame-3.png  # Falling
│   └── landing/         # 3 frames (100ms each)
│       ├── frame-0.png  # Touch down
│       ├── frame-1.png  # Impact
│       └── frame-2.png  # Recovery
└── final/               # Final sprite sheets
    ├── character.png    # Combined sprite sheet
    └── character.json   # Texture atlas data

## Image Specifications
- Individual frame size: 32x48 pixels
- Format: PNG-8 with transparency
- Color palette:
  - MYOB Purple: #6542BE
  - MYOB Navy: #1A237E
  - MYOB White: #FFFFFF
  - Success Green: #00A878 (effects)

## Naming Conventions
- Development frames: frame-[number].png
- Consistent numbering: 0-based indexing
- Final sprite sheet: character.png
- Atlas data: character.json

## Frame Timing
- Idle: 200ms per frame
- Running: 100ms per frame
- Jumping: 150ms per frame
- Landing: 100ms per frame

## Technical Notes
- 1px padding between sprites
- Consistent registration point (bottom center)
- Clear silhouette for gameplay
- Optimized for performance 