import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function BaseConfigurator() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const baseRef = useRef(null);
  const propsRef = useRef([]);
  const selectedPropRef = useRef(null);
  const mouseDown = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });

  const [baseShape, setBaseShape] = useState('cylinder');
  const [baseTexture, setBaseTexture] = useState('stone');
  const [baseSize, setBaseSize] = useState(3);
  const [placedProps, setPlacedProps] = useState([]);
  const [selectedPropId, setSelectedPropId] = useState(null);

  const textures = {
    stone: { color: 0x8b8680, roughness: 0.9, metalness: 0.1 },
    wood: { color: 0x8b6f47, roughness: 0.95, metalness: 0.0 },
    metal: { color: 0x9ca3af, roughness: 0.3, metalness: 0.8 },
    marble: { color: 0xf8f9fa, roughness: 0.2, metalness: 0.1 },
    obsidian: { color: 0x1a1a1a, roughness: 0.4, metalness: 0.6 }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 30);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 50;
    mainLight.shadow.camera.left = -10;
    mainLight.shadow.camera.right = 10;
    mainLight.shadow.camera.top = 10;
    mainLight.shadow.camera.bottom = -10;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.3);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);

    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0d0d0d,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(20, 40, 0x1a1a1a, 0x1a1a1a);
    scene.add(gridHelper);

    const handleMouseDown = (e) => {
      mouseDown.current = true;
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!mouseDown.current) return;
      
      const deltaX = e.clientX - mousePos.current.x;
      const deltaY = e.clientY - mousePos.current.y;
      
      const rotationSpeed = 0.005;
      
      const angle = deltaX * rotationSpeed;
      const currentPos = camera.position;
      const distance = Math.sqrt(currentPos.x ** 2 + currentPos.z ** 2);
      
      const currentAngle = Math.atan2(currentPos.z, currentPos.x);
      const newAngle = currentAngle + angle;
      
      camera.position.x = distance * Math.cos(newAngle);
      camera.position.z = distance * Math.sin(newAngle);
      camera.position.y = Math.max(2, Math.min(15, camera.position.y - deltaY * 0.02));
      
      camera.lookAt(0, 0, 0);
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.002;
      const currentDistance = camera.position.length();
      const newDistance = Math.max(3, Math.min(20, currentDistance + e.deltaY * zoomSpeed));
      
      camera.position.multiplyScalar(newDistance / currentDistance);
      camera.lookAt(0, 0, 0);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel, { passive: false });

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    if (baseRef.current) {
      sceneRef.current.remove(baseRef.current);
      baseRef.current.geometry.dispose();
      baseRef.current.material.dispose();
    }

    let geometry;
    const height = 0.5;

    switch (baseShape) {
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(baseSize, baseSize, height, 32);
        break;
      case 'square':
        geometry = new THREE.BoxGeometry(baseSize * 2, height, baseSize * 2);
        break;
      case 'hexagon':
        geometry = new THREE.CylinderGeometry(baseSize, baseSize, height, 6);
        break;
      case 'octagon':
        geometry = new THREE.CylinderGeometry(baseSize, baseSize, height, 8);
        break;
      default:
        geometry = new THREE.CylinderGeometry(baseSize, baseSize, height, 32);
    }

    const textureProps = textures[baseTexture];
    const material = new THREE.MeshStandardMaterial({
      color: textureProps.color,
      roughness: textureProps.roughness,
      metalness: textureProps.metalness
    });

    const base = new THREE.Mesh(geometry, material);
    base.position.y = height / 2;
    base.castShadow = true;
    base.receiveShadow = true;
    sceneRef.current.add(base);
    baseRef.current = base;
  }, [baseShape, baseTexture, baseSize]);

  const addProp = (propType) => {
    if (!sceneRef.current) return;

    let geometry;
    let material;
    const id = Date.now();

    switch (propType) {
      case 'rock':
        geometry = new THREE.DodecahedronGeometry(0.4, 0);
        material = new THREE.MeshStandardMaterial({ 
          color: 0x5a5a5a, 
          roughness: 0.95,
          flatShading: true 
        });
        break;
      
      case 'pillar':
        geometry = new THREE.CylinderGeometry(0.15, 0.18, 1.5, 8);
        material = new THREE.MeshStandardMaterial({ 
          color: 0xd4d4d4, 
          roughness: 0.7 
        });
        break;
      
      case 'crystal':
        geometry = new THREE.ConeGeometry(0.3, 1.2, 6);
        material = new THREE.MeshStandardMaterial({ 
          color: 0x60a5fa,
          roughness: 0.1,
          metalness: 0.5,
          transparent: true,
          opacity: 0.8
        });
        break;
      
      case 'skull':
        geometry = new THREE.SphereGeometry(0.25, 16, 16);
        material = new THREE.MeshStandardMaterial({ 
          color: 0xe8e4d9, 
          roughness: 0.9 
        });
        break;

      default:
        geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        material = new THREE.MeshStandardMaterial({ color: 0x888888 });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * baseSize * 1.5,
      propType === 'pillar' ? 1.25 : 0.75,
      (Math.random() - 0.5) * baseSize * 1.5
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { id, type: propType };

    sceneRef.current.add(mesh);
    propsRef.current.push(mesh);
    setPlacedProps(prev => [...prev, { id, type: propType }]);
  };

  const removeProp = (id) => {
    const propIndex = propsRef.current.findIndex(p => p.userData.id === id);
    if (propIndex !== -1) {
      const prop = propsRef.current[propIndex];
      sceneRef.current.remove(prop);
      prop.geometry.dispose();
      prop.material.dispose();
      propsRef.current.splice(propIndex, 1);
      
      if (selectedPropRef.current?.userData.id === id) {
        selectedPropRef.current = null;
        setSelectedPropId(null);
      }
      
      setPlacedProps(prev => prev.filter(p => p.id !== id));
    }
  };

  const selectProp = (id) => {
    const prop = propsRef.current.find(p => p.userData.id === id);
    if (prop) {
      selectedPropRef.current = prop;
      setSelectedPropId(id);
    }
  };

  const moveProp = (axis, direction) => {
    if (!selectedPropRef.current) return;
    const step = 0.2;
    if (axis === 'x') selectedPropRef.current.position.x += direction * step;
    if (axis === 'y') selectedPropRef.current.position.y += direction * step;
    if (axis === 'z') selectedPropRef.current.position.z += direction * step;
  };

  const exportSTL = () => {
    alert('STL export requires three-stdlib library. For production: npm install three-stdlib');
  };

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-950 to-gray-900 font-mono">
      <div ref={mountRef} className="flex-1 relative">
        <div className="absolute top-5 left-5 bg-black/80 px-4 py-3 rounded-lg text-blue-400 text-xs backdrop-blur-md border border-blue-400/30 z-10">
          <div className="font-bold mb-1.5">CONTROLS</div>
          <div className="text-gray-400">Click + Drag: Rotate Camera</div>
          <div className="text-gray-400">Scroll: Zoom In/Out</div>
        </div>
      </div>

      <div className="w-[340px] bg-gray-950 border-l border-gray-900 overflow-y-auto p-6 text-white">
        <h1 className="text-xl font-bold text-blue-400 tracking-widest mb-6">
          BASE BUILDER
        </h1>

        <section className="mb-6">
          <h3 className="text-[10px] font-bold text-blue-400 tracking-wider mb-2.5">SHAPE</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {['cylinder', 'square', 'hexagon', 'octagon'].map(shape => (
              <button
                key={shape}
                onClick={() => setBaseShape(shape)}
                className={`p-2.5 rounded text-[10px] uppercase transition-colors ${
                  baseShape === shape 
                    ? 'bg-blue-400 text-black font-bold border border-blue-400' 
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-[10px] font-bold text-blue-400 tracking-wider mb-2.5">SIZE: {baseSize.toFixed(1)}</h3>
          <input
            type="range"
            min="1.5"
            max="5"
            step="0.5"
            value={baseSize}
            onChange={(e) => setBaseSize(parseFloat(e.target.value))}
            className="w-full accent-blue-400"
          />
        </section>

        <section className="mb-6">
          <h3 className="text-[10px] font-bold text-blue-400 tracking-wider mb-2.5">MATERIAL</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.keys(textures).map(texture => (
              <button
                key={texture}
                onClick={() => setBaseTexture(texture)}
                className={`p-2.5 rounded text-[10px] uppercase transition-colors ${
                  baseTexture === texture 
                    ? 'bg-blue-400 text-black font-bold border border-blue-400' 
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
                }`}
              >
                {texture}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-[10px] font-bold text-blue-400 tracking-wider mb-2.5">ADD PROPS</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {['rock', 'pillar', 'crystal', 'skull'].map(prop => (
              <button
                key={prop}
                onClick={() => addProp(prop)}
                className="p-2.5 bg-gray-900 border border-gray-800 text-blue-400 rounded text-[10px] uppercase hover:bg-gray-800 transition-colors"
              >
                + {prop}
              </button>
            ))}
          </div>
        </section>

        {placedProps.length > 0 && (
          <section className="mb-6">
            <h3 className="text-[10px] font-bold text-blue-400 tracking-wider mb-2.5">PROPS ({placedProps.length})</h3>
            <div className="max-h-[180px] overflow-y-auto space-y-1">
              {placedProps.map(prop => (
                <div
                  key={prop.id}
                  className={`p-2 rounded text-[10px] flex justify-between items-center ${
                    selectedPropId === prop.id 
                      ? 'bg-gray-800 border border-blue-400' 
                      : 'bg-gray-900 border border-gray-800'
                  }`}
                >
                  <button
                    onClick={() => selectProp(prop.id)}
                    className={`flex-1 text-left ${selectedPropId === prop.id ? 'text-blue-400' : 'text-gray-500'}`}
                  >
                    {prop.type.toUpperCase()}
                  </button>
                  <button
                    onClick={() => removeProp(prop.id)}
                    className="bg-red-500 text-white px-2 py-0.5 rounded text-[9px]"
                  >
                    DEL
                  </button>
                </div>
              ))}
            </div>
            
            {selectedPropId && (
              <div className="mt-3 p-2.5 bg-gray-900 rounded border border-gray-800">
                <div className="text-[9px] text-blue-400 mb-2 font-bold">MOVE SELECTED</div>
                <div className="grid grid-cols-3 gap-1 mb-1">
                  <button onClick={() => moveProp('x', -1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">← X</button>
                  <button onClick={() => moveProp('y', 1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">↑ Y</button>
                  <button onClick={() => moveProp('x', 1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">X →</button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => moveProp('z', -1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">↑ Z</button>
                  <button onClick={() => moveProp('y', -1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">↓ Y</button>
                  <button onClick={() => moveProp('z', 1)} className="p-1.5 bg-gray-800 border border-gray-700 text-gray-400 rounded text-[9px]">Z ↓</button>
                </div>
              </div>
            )}
          </section>
        )}

        <button
          onClick={exportSTL}
          className="w-full p-3.5 bg-blue-400 text-black rounded-md text-xs font-bold uppercase tracking-widest hover:bg-blue-300 transition-colors"
        >
          Export STL
        </button>
      </div>
    </div>
  );
}