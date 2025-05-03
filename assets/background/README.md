# Background Assets Structure

## Development Directory
Contains individual background layers for parallax scrolling

### Layer Specifications

1. **Far Background** (`/development/far/`)
   - Size: 256x64 pixels
   - Content: City skyline
   - Scroll speed: 0.2x
   - Files:
     - bg-far.png (Main background)
     - bg-far-tile.png (Tileable version)

2. **Middle Layer** (`/development/middle/`)
   - Size: 256x64 pixels
   - Content: Modern office silhouettes
   - Scroll speed: 0.5x
   - Files:
     - bg-middle.png (Main background)
     - bg-middle-tile.png (Tileable version)

3. **Front Layer** (`/development/front/`)
   - Size: 256x64 pixels
   - Content: Tech desk items
   - Scroll speed: 1.0x
   - Files:
     - bg-front.png (Main background)
     - bg-front-tile.png (Tileable version)

## Technical Specifications
- Format: PNG-8 with transparency
- Colors: Modern office theme
- Resolution: Pixel-perfect edges
- Tiling: Must be seamless for infinite scrolling

## File Naming Convention
- Main files: bg-[layer].png
- Tileable versions: bg-[layer]-tile.png
- Working files: bg-[layer]-draft.png

## Implementation Notes
- Each layer must tile seamlessly horizontally
- Maintain consistent height across all layers
- Consider parallax scroll rates in design
- Ensure smooth transitions between tiles

## Asset Requirements
1. Far Background Layer:
   - Seamless city skyline
   - Subtle details
   - Light color palette
   - Minimal complexity

2. Middle Layer:
   - Office building silhouettes
   - Medium detail level
   - Balanced contrast
   - Recognizable shapes

3. Front Layer:
   - Detailed office items
   - Higher contrast
   - Clear shapes
   - Professional elements 