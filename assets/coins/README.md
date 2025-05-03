# Coins Asset Structure

## Development Directory
For individual frame development and testing

### Spinning Animation
- 8 frames (100ms each)
- Frame size: 16x16 pixels
- Naming: frame-0.png to frame-7.png
```
Frame 0: Full face view
Frame 1: 45° rotation
Frame 2: Edge view
Frame 3: 135° rotation
Frame 4: Reverse face
Frame 5: 225° rotation
Frame 6: Edge view
Frame 7: 315° rotation
```

### Collection Animation
- 6 frames (50ms each)
- Frame size: 16x16 pixels
- Naming: collect-0.png to collect-5.png
```
Frame 0: Normal size
Frame 1: Slight sparkle
Frame 2: Bright flash
Frame 3: Start shrink
Frame 4: Fade out
Frame 5: Disappear
```

## Technical Specifications
- Format: PNG-8 with transparency
- Colors:
  - MYOB Purple: #6542BE (main)
  - MYOB Navy: #1A237E (edge)
  - White: #FFFFFF (shine)
  - Success Green: #00A878 (effects)
- Maximum 8 colors per frame
- No anti-aliasing
- Center point registration 