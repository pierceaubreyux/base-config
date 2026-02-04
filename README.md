# Base Configurator

A 3D miniature base configurator built with React and Three.js. Design and customize miniature bases with different shapes, materials, and decorative props, then export to STL for 3D printing.

## Features

- **Base Customization**: Choose from 4 shapes (cylinder, square, hexagon, octagon)
- **Material Library**: 5 materials (stone, wood, metal, marble, obsidian)
- **Props System**: Add decorative elements (rocks, pillars, crystals, skulls)
- **3D Controls**: Rotate camera, zoom, and position props
- **Export**: STL export functionality (requires implementation)

## Tech Stack

- **React 18** - UI framework
- **Three.js** - 3D rendering
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd base-configurator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
base-configurator/
├── src/
│   ├── components/
│   │   └── BaseConfigurator.jsx   # Main 3D configurator component
│   ├── App.jsx                     # Root component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## Usage

1. **Select Base Shape**: Choose from cylinder, square, hexagon, or octagon
2. **Adjust Size**: Use the slider to change base diameter
3. **Choose Material**: Select a material for the base surface
4. **Add Props**: Click prop buttons to add decorative elements
5. **Position Props**: Select a prop from the list and use directional buttons to move it
6. **Export**: Click "Export STL" to download (requires STL export implementation)

## Camera Controls

- **Click + Drag**: Rotate camera around the base
- **Scroll**: Zoom in/out

## Roadmap

- [ ] Implement actual STL export using three-stdlib
- [ ] Add GLB/GLTF model loading for custom props
- [ ] Implement rotation and scaling for props
- [ ] Add snap-to-grid functionality
- [ ] Create prop boundary constraints
- [ ] Add save/load configurations
- [ ] Support custom texture uploads
- [ ] Improve procedural prop generation
- [ ] Add undo/redo functionality
- [ ] Implement prop duplication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by [HeroForge](https://www.heroforge.com)
- Built with [Three.js](https://threejs.org/)
