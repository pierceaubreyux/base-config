# Setup Guide

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
```

## Detailed Setup

### Prerequisites

Make sure you have installed:
- **Node.js** 18 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**

Check versions:
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
```

### Installation Steps

1. **Clone or download this repository**

2. **Navigate to project directory**
   ```bash
   cd base-configurator
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```
   
   This will install:
   - React 18
   - Three.js (3D rendering)
   - Vite (build tool)
   - Tailwind CSS (styling)
   - All dev dependencies

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   The app will automatically open in your browser at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Development Workflow

1. Make changes to files in `src/`
2. Vite will automatically hot-reload your changes
3. No need to refresh the browser manually

### Project Structure Explained

```
base-configurator/
├── src/
│   ├── components/
│   │   └── BaseConfigurator.jsx   # Main 3D component (Three.js scene)
│   ├── App.jsx                     # Root app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind + global styles
├── public/                         # Static assets (images, fonts, etc.)
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── package.json                    # Dependencies and scripts
└── README.md                       # Project documentation
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Output will be in dist/ folder
# Upload contents of dist/ to any static hosting service
```

### Deployment Options

The built files can be deployed to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3 + CloudFront**
- Any static file hosting service

### Troubleshooting

**Port already in use:**
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.js
```

**Three.js imports not working:**
```bash
# Make sure Three.js is installed
npm install three
```

**Tailwind styles not applying:**
```bash
# Rebuild Tailwind
npm run dev
# Check that index.css has @tailwind directives
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Next Steps

1. Customize the base shapes in `BaseConfigurator.jsx`
2. Add more prop models (import GLB/GLTF files)
3. Implement STL export using `three-stdlib`
4. Add texture image uploads
5. Create save/load functionality

### Need Help?

- Three.js docs: https://threejs.org/docs/
- React docs: https://react.dev/
- Vite docs: https://vitejs.dev/
- Tailwind docs: https://tailwindcss.com/
