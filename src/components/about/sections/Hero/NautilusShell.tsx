import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useColorMode } from "~/components/ui/theme/color-mode";

// Default values - theme-aware
const DEFAULT_COLOR_LIGHT = "#002b36"; // Dark color for light mode
const DEFAULT_COLOR_DARK = "#fdf6e3"; // Bright color for dark mode
const DEFAULT_OPACITY = 0.3;

export interface NautilusShell3DConfig {
   // Position and scale
   position?: [number, number, number];
   scale?: number;

   // Spiral parameters
   spiralA?: number; // Initial radius (default: 0.1)
   spiralB?: number; // Growth rate (default: 0.306 - golden ratio)
   spiralTurns?: number; // Number of turns (default: 3.5)
   spiralPoints?: number; // Points for main spiral (default: 1000)

   // Chamber configuration
   numChambers?: number; // Number of chambers (default: 26)
   pointsPerSeptum?: number; // Points per septum curve (default: 120)
   septumCurveMin?: number; // Minimum curve factor (default: 0.88)
   septumCurveMax?: number; // Maximum curve factor (default: 1.0)
   showRadialLines?: boolean; // Show radial lines from origin to chamber boundaries (default: false)
   numRadialLines?: number; // Number of radial lines from origin (default: same as numChambers)
   radialLineWidth?: number; // Width of radial lines (default: 1.0)

   // Inner spirals
   numInnerSpirals?: number; // Number of inner spiral layers (default: 5)
   innerSpiralSpacing?: number; // Spacing between inner spirals (default: 0.06)
   innerSpiralPoints?: number; // Points per inner spiral (default: 800)

   // 3D depth parameters
   depthAngleFactor?: number; // Angle factor for 3D depth calculation (default: 0.3)
   depthRadiusFactor?: number; // Radius factor for 3D depth calculation (default: 0.1)

   // Visual properties
   color?: string; // Shell color (default: '#002b36')
   opacity?: number; // Shell opacity (default: 0.85)
   lineWidthMain?: number; // Main spiral line width (default: 2.0)
   lineWidthSeptum?: number; // Septum line width (default: 1.5)
   lineWidthInner?: number; // Inner spiral line width (default: 1.2)
   lineWidthAperture?: number; // Aperture line width (default: 2.0)

   // Animation
   rotationSpeedZ?: number; // Z rotation speed (default: 0.06)
   rotationAmplitudeZ?: number; // Z rotation amplitude (default: 0.04)
   rotationSpeedX?: number; // X rotation speed (default: 0.05)
   rotationAmplitudeX?: number; // X rotation amplitude (default: 0.02)

   // Aperture
   aperturePoints?: number; // Points for aperture curve (default: 30)
   apertureAngleVariation?: number; // Aperture angle variation (default: 0.4)
   apertureFlare?: number; // Aperture flare factor (default: 0.15)
}

// Logarithmic spiral curve - mathematically precise
class LogarithmicSpiralCurve extends THREE.Curve<THREE.Vector3> {
   private a: number;
   private b: number;
   private turns: number;
   private depthAngleFactor: number;
   private depthRadiusFactor: number;

   constructor(a = 0.1, b = 0.306, turns = 3.5, depthAngleFactor = 0.3, depthRadiusFactor = 0.1) {
      super();
      this.a = a;
      this.b = b;
      this.turns = turns;
      this.depthAngleFactor = depthAngleFactor;
      this.depthRadiusFactor = depthRadiusFactor;
   }

   getPoint(t: number): THREE.Vector3 {
      const angle = this.turns * 2 * Math.PI * t;
      // Nautilus shell uses golden ratio growth rate (~0.306)
      const radius = this.a * Math.exp(this.b * angle);
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      // Subtle 3D depth for shell curvature
      const z = Math.sin(angle * this.depthAngleFactor) * radius * this.depthRadiusFactor;
      return new THREE.Vector3(x, y, z);
   }
}

// Generate curved septa (chamber walls) - these curve inward to form closed chambers
function generateSeptum(
   startAngle: number,
   endAngle: number,
   numPoints: number = 120,
   a: number = 0.1,
   b: number = 0.306,
   curveMin: number = 0.88,
   curveMax: number = 1.0,
   depthAngleFactor: number = 0.3,
   depthRadiusFactor: number = 0.1,
): THREE.Vector3[] {
   const points: THREE.Vector3[] = [];

   for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const angle = startAngle + (endAngle - startAngle) * t;
      const radius = a * Math.exp(b * angle);

      // Curved septum - curves inward toward center, more pronounced in middle
      const curveFactor = curveMin + (curveMax - curveMin) * Math.sin(t * Math.PI);
      const x = radius * Math.cos(angle) * curveFactor;
      const y = radius * Math.sin(angle) * curveFactor;
      const z = Math.sin(angle * depthAngleFactor) * radius * depthRadiusFactor;

      points.push(new THREE.Vector3(x, y, z));
   }

   return points;
}

function NautilusShell3D(config: NautilusShell3DConfig = {}) {
   const {
      position = [0, 0, 0],
      scale = 1,
      spiralA = 0.1,
      spiralB = 0.306,
      spiralTurns = 3.5,
      spiralPoints = 1000,
      numChambers = 26,
      pointsPerSeptum = 120,
      septumCurveMin = 0.88,
      septumCurveMax = 1.0,
      numInnerSpirals = 5,
      innerSpiralSpacing = 0.06,
      innerSpiralPoints = 800,
      color = DEFAULT_COLOR_LIGHT, // Will be overridden by Scene component with theme-aware color
      opacity = DEFAULT_OPACITY,
      lineWidthMain = 2.0,
      lineWidthSeptum = 1.5,
      lineWidthInner = 1.2,
      lineWidthAperture = 2.0,
      rotationSpeedZ = 0.06,
      rotationAmplitudeZ = 0.04,
      rotationSpeedX = 0.05,
      rotationAmplitudeX = 0.02,
      aperturePoints = 30,
      apertureAngleVariation = 0.4,
      apertureFlare = 0.15,
      showRadialLines = false,
      numRadialLines,
      radialLineWidth = 1.0,
      depthAngleFactor = 0.3,
      depthRadiusFactor = 0.1,
   } = config;

   const effectiveNumRadialLines = numRadialLines ?? numChambers;

   const groupRef = useRef<THREE.Group>(null);
   const shellColor = useMemo(() => new THREE.Color(color), [color]);

   // Main spiral outline - outer edge of shell
   const spiralGeometry = useMemo(() => {
      const curve = new LogarithmicSpiralCurve(
         spiralA,
         spiralB,
         spiralTurns,
         depthAngleFactor,
         depthRadiusFactor,
      );
      const points = curve.getPoints(spiralPoints);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
   }, [spiralA, spiralB, spiralTurns, spiralPoints, depthAngleFactor, depthRadiusFactor]);

   // Generate septa (chamber walls) - curved walls that form closed chambers
   const septa = useMemo(() => {
      const septaLines: THREE.Line[] = [];

      for (let i = 1; i < numChambers; i++) {
         const startAngle = ((i - 1) / numChambers) * spiralTurns * 2 * Math.PI;
         const endAngle = (i / numChambers) * spiralTurns * 2 * Math.PI;
         const points = generateSeptum(
            startAngle,
            endAngle,
            pointsPerSeptum,
            spiralA,
            spiralB,
            septumCurveMin,
            septumCurveMax,
            depthAngleFactor,
            depthRadiusFactor,
         );
         const geometry = new THREE.BufferGeometry().setFromPoints(points);

         const material = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            linewidth: lineWidthSeptum,
         });

         septaLines.push(new THREE.Line(geometry, material));
      }

      return septaLines;
   }, [
      numChambers,
      pointsPerSeptum,
      spiralA,
      spiralB,
      spiralTurns,
      septumCurveMin,
      septumCurveMax,
      depthAngleFactor,
      depthRadiusFactor,
      shellColor,
      opacity,
      lineWidthSeptum,
   ]);

   // Generate inner spiral lines to show chamber progression
   const innerSpirals = useMemo(() => {
      const spirals: THREE.Line[] = [];

      for (let i = 1; i <= numInnerSpirals; i++) {
         const offset = i * innerSpiralSpacing;
         const curve = new LogarithmicSpiralCurve(
            spiralA + offset,
            spiralB,
            spiralTurns,
            depthAngleFactor,
            depthRadiusFactor,
         );
         const points = curve.getPoints(innerSpiralPoints);
         const geometry = new THREE.BufferGeometry().setFromPoints(points);

         const material = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            linewidth: lineWidthInner,
         });

         spirals.push(new THREE.Line(geometry, material));
      }

      return spirals;
   }, [
      numInnerSpirals,
      innerSpiralSpacing,
      innerSpiralPoints,
      spiralA,
      spiralB,
      spiralTurns,
      depthAngleFactor,
      depthRadiusFactor,
      shellColor,
      opacity,
      lineWidthInner,
   ]);

   // Material for main spiral outline
   const shellMaterial = useMemo(() => {
      return new THREE.LineBasicMaterial({
         color: shellColor,
         transparent: true,
         opacity: opacity,
         depthWrite: false,
         linewidth: lineWidthMain,
      });
   }, [shellColor, opacity, lineWidthMain]);

   const spiralLine = useMemo(
      () => new THREE.Line(spiralGeometry, shellMaterial),
      [spiralGeometry, shellMaterial],
   );

   // Generate aperture outline - the opening of the shell
   const apertureGeometry = useMemo(() => {
      const finalAngle = spiralTurns * 2 * Math.PI;
      const finalRadius = spiralA * Math.exp(spiralB * finalAngle);

      // Create a curved aperture opening
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= aperturePoints; i++) {
         const t = i / aperturePoints;
         const angle = finalAngle + (t - 0.5) * apertureAngleVariation;
         const radius = finalRadius * (1 + t * apertureFlare);
         const x = radius * Math.cos(angle);
         const y = radius * Math.sin(angle);
         const z = Math.sin(angle * depthAngleFactor) * radius * depthRadiusFactor;
         points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
   }, [
      spiralA,
      spiralB,
      spiralTurns,
      aperturePoints,
      apertureAngleVariation,
      apertureFlare,
      depthAngleFactor,
      depthRadiusFactor,
   ]);

   const apertureLine = useMemo(() => {
      const material = new THREE.LineBasicMaterial({
         color: shellColor,
         transparent: true,
         opacity: opacity,
         depthWrite: false,
         linewidth: lineWidthAperture,
      });
      return new THREE.Line(apertureGeometry, material);
   }, [apertureGeometry, shellColor, opacity, lineWidthAperture]);

   // Generate radial lines from origin to chamber boundaries
   const radialLines = useMemo(() => {
      if (!showRadialLines) {
         return [];
      }

      const lines: THREE.Line[] = [];

      for (let i = 0; i < effectiveNumRadialLines; i++) {
         const angle = (i / effectiveNumRadialLines) * spiralTurns * 2 * Math.PI;
         const radius = spiralA * Math.exp(spiralB * angle);
         const x = radius * Math.cos(angle);
         const y = radius * Math.sin(angle);
         const z = Math.sin(angle * depthAngleFactor) * radius * depthRadiusFactor;

         const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(x, y, z),
         ]);

         const material = new THREE.LineBasicMaterial({
            color: shellColor,
            transparent: true,
            opacity: opacity,
            depthWrite: false,
            linewidth: radialLineWidth,
         });

         lines.push(new THREE.Line(geometry, material));
      }

      return lines;
   }, [
      showRadialLines,
      effectiveNumRadialLines,
      spiralA,
      spiralB,
      spiralTurns,
      depthAngleFactor,
      depthRadiusFactor,
      shellColor,
      opacity,
      radialLineWidth,
   ]);

   useEffect(() => {
      return () => {
         spiralGeometry.dispose();
         apertureGeometry.dispose();
         shellMaterial.dispose();
         spiralLine.geometry.dispose();
         spiralLine.material.dispose();
         apertureLine.geometry.dispose();
         apertureLine.material.dispose();
         innerSpirals.forEach((line) => {
            line.geometry.dispose();
            const material = line.material;
            if (Array.isArray(material)) {
               material.forEach((mat) => mat.dispose());
            } else {
               material.dispose();
            }
         });
         septa.forEach((line) => {
            line.geometry.dispose();
            const material = line.material;
            if (Array.isArray(material)) {
               material.forEach((mat) => mat.dispose());
            } else {
               material.dispose();
            }
         });
         radialLines.forEach((line) => {
            line.geometry.dispose();
            const material = line.material;
            if (Array.isArray(material)) {
               material.forEach((mat) => mat.dispose());
            } else {
               material.dispose();
            }
         });
      };
   }, [
      apertureGeometry,
      apertureLine,
      innerSpirals,
      radialLines,
      septa,
      shellMaterial,
      spiralGeometry,
      spiralLine,
   ]);

   useFrame((state) => {
      if (groupRef.current) {
         // Keep position static - no floating animation
         groupRef.current.position.set(position[0], position[1], position[2]);
         // Gentle rotation (rotation doesn't change position or scale)
         groupRef.current.rotation.z =
            Math.sin(state.clock.elapsedTime * rotationSpeedZ) * rotationAmplitudeZ;
         groupRef.current.rotation.x =
            Math.sin(state.clock.elapsedTime * rotationSpeedX) * rotationAmplitudeX;
      }
   });

   return (
      <group ref={groupRef} position={position} scale={scale}>
         {/* Radial lines from origin (if enabled) */}
         {radialLines.map((line, index) => (
            <primitive key={`radial-${index}`} object={line} />
         ))}
         {/* Inner spirals showing chamber progression */}
         {innerSpirals.map((line, index) => (
            <primitive key={`inner-${index}`} object={line} />
         ))}
         {/* Septa - curved chamber walls */}
         {septa.map((line, index) => (
            <primitive key={`septum-${index}`} object={line} />
         ))}
         {/* Main spiral outline */}
         <primitive object={spiralLine} />
         {/* Aperture - shell opening */}
         <primitive object={apertureLine} />
      </group>
   );
}

export interface SceneConfig {
   cameraPosition?: [number, number, number];
   cameraFov?: number;
   ambientLightIntensity?: number;
   directionalLightPosition?: [number, number, number];
   directionalLightIntensity?: number;
   shellConfig?: NautilusShell3DConfig;
}

function Scene({ config }: { config?: SceneConfig }) {
   const { camera } = useThree();
   const { colorMode } = useColorMode();
   const theme = colorMode;
   const shellColor = theme === "dark" ? DEFAULT_COLOR_DARK : DEFAULT_COLOR_LIGHT;
   const shellOpacity = theme === "dark" ? 0.5 : DEFAULT_OPACITY; // Higher opacity in dark mode for visibility

   const {
      cameraPosition = [0, 0, 4.5],
      cameraFov = 60,
      ambientLightIntensity = 0.6,
      directionalLightPosition = [5, 5, 5],
      directionalLightIntensity = 0.3,
      shellConfig = {
         scale: 0.02,
         showRadialLines: true,
         numRadialLines: 22,
         radialLineWidth: 1,
         depthAngleFactor: 0.3,
         depthRadiusFactor: 0.1,
         numChambers: 22,
         spiralA: 0.2,
         spiralB: 0.3,
         spiralTurns: 3.4,
         spiralPoints: 2000,
         pointsPerSeptum: 200,
         septumCurveMin: 0.8,
         septumCurveMax: 0.8,
         numInnerSpirals: 1,
         innerSpiralSpacing: 0.2,
         innerSpiralPoints: 1200,
         // color and opacity will be set by finalShellConfig
         lineWidthMain: 2,
         lineWidthSeptum: 2,
         lineWidthInner: 2,
         lineWidthAperture: 2,
         rotationSpeedZ: 0.06,
         rotationAmplitudeZ: 0.04,
         rotationSpeedX: 0.1,
         rotationAmplitudeX: 0.02,
         aperturePoints: 30,
         apertureAngleVariation: 0.4,
         apertureFlare: 0.15,
      }, // Default scale
   } = config || {};

   // Merge shellConfig with theme-aware color and opacity
   const finalShellConfig = useMemo(
      () => ({
         ...shellConfig,
         color: shellColor, // Always use theme-aware color
         opacity: shellConfig.opacity ?? shellOpacity, // Use theme-aware opacity unless overridden
      }),
      [shellConfig, shellColor, shellOpacity],
   );

   useEffect(() => {
      camera.position.set(...cameraPosition);
      if (camera instanceof THREE.PerspectiveCamera) {
         camera.fov = cameraFov;
         camera.updateProjectionMatrix();
      }
      camera.lookAt(0, 0, 0);
   }, [camera, cameraPosition, cameraFov]);

   return (
      <>
         {/* Simple ambient lighting for dark shell */}
         <ambientLight intensity={ambientLightIntensity} />
         {/* Subtle directional light for depth */}
         <directionalLight
            position={directionalLightPosition}
            intensity={directionalLightIntensity}
         />

         <NautilusShell3D {...finalShellConfig} />
      </>
   );
}

function NautilusShell2DFallback({ className, sceneConfig }: { className?: string; sceneConfig?: SceneConfig }) {
   // 2D NautilusShell fallback - clean smooth nautilus spiral with shared 3D features
   const { colorMode } = useColorMode();
   const theme = colorMode;
   const shellColor = theme === "dark" ? DEFAULT_COLOR_DARK : DEFAULT_COLOR_LIGHT;
   const shellOpacity = theme === "dark" ? 0.5 : DEFAULT_OPACITY;

   // Generate a smooth logarithmic spiral
   const generateSpiral = (a, b, turns, numPoints, scale) => {
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
         const t = i / numPoints;
         const angle = t * turns * 2 * Math.PI;
         const r = a * Math.exp(b * angle);
         const x = r * Math.cos(angle) * scale;
         const y = r * Math.sin(angle) * scale;
         points.push({ x, y });
      }
      return points;
   };

   // Smooth points using moving average to eliminate jaggedness
   const smoothPoints = (points, windowSize = 5) => {
      const smoothed = [];
      const half = Math.floor(windowSize / 2);
      for (let i = 0; i < points.length; i++) {
         let sumX = 0, sumY = 0, count = 0;
         for (let j = Math.max(0, i - half); j <= Math.min(points.length - 1, i + half); j++) {
            sumX += points[j].x;
            sumY += points[j].y;
            count++;
         }
         smoothed.push({ x: sumX / count, y: sumY / count });
      }
      return smoothed;
   };

   // Main outer spiral
   const spiralPoints = useMemo(() => generateSpiral(0.2, 0.3, 3.4, 500, 100), []);
   // Inner spiral (slightly offset for depth) - smoothed
   const innerSpiralPoints = useMemo(() => smoothPoints(generateSpiral(0.2 + 0.15, 0.3, 3.4, 500, 100), 7), []);
   // Second inner spiral - smoothed
   const innerSpiral2Points = useMemo(() => smoothPoints(generateSpiral(0.2 + 0.3, 0.3, 3.4, 500, 100), 9), []);

   // Generate septa (chamber walls) - curved walls
   const generateSepta = () => {
      const septa = [];
      const numChambers = 22;
      for (let i = 1; i < numChambers; i++) {
         const startAngle = ((i - 1) / numChambers) * 3.4 * 2 * Math.PI;
         const endAngle = (i / numChambers) * 3.4 * 2 * Math.PI;
         const midAngle = (startAngle + endAngle) / 2;
         const startR = 0.2 * Math.exp(0.3 * startAngle);
         const endR = 0.2 * Math.exp(0.3 * endAngle);
         const midR = 0.2 * Math.exp(0.3 * midAngle);
         
         const x1 = startR * Math.cos(startAngle) * 100;
         const y1 = startR * Math.sin(startAngle) * 100;
         const x2 = endR * Math.cos(endAngle) * 100;
         const y2 = endR * Math.sin(endAngle) * 100;
         const mx = midR * Math.cos(midAngle) * 100;
         const my = midR * Math.sin(midAngle) * 100;
         
         septa.push({ x1, y1, x2, y2, mx, my });
      }
      return septa;
   };

   const septa = useMemo(() => generateSepta(), []);

   // Generate radial lines (fewer for cleaner look)
   const generateRadialLines = () => {
      const lines = [];
      const numRadial = 6;
      for (let i = 0; i < numRadial; i++) {
         const angle = (i / numRadial) * 3.4 * 2 * Math.PI;
         const r = 0.2 * Math.exp(0.3 * angle);
         const x = r * Math.cos(angle) * 100;
         const y = r * Math.sin(angle) * 100;
         lines.push({ x, y });
      }
      return lines;
   };

   const radialLines = useMemo(() => generateRadialLines(), []);

   // Generate aperture
   const generateAperture = () => {
      const points = [];
      const finalAngle = 3.4 * 2 * Math.PI;
      const finalRadius = 0.2 * Math.exp(0.3 * finalAngle);
      const aperturePoints = 60;
      
      for (let i = 0; i <= aperturePoints; i++) {
         const t = i / aperturePoints;
         const angle = finalAngle + (t - 0.5) * 0.4;
         const radius = finalRadius * (1 + t * 0.15);
         const x = radius * Math.cos(angle) * 100;
         const y = radius * Math.sin(angle) * 100;
         points.push({ x, y });
      }
      return points;
   };

   const aperturePoints = useMemo(() => generateAperture(), []);

   // Convert points to smooth SVG path using cubic bezier (Catmull-Rom spline)
   const pointsToPath = (points) => {
      if (points.length === 0) return '';
      if (points.length === 1) return 'M ' + (points[0].x + 200) + ' ' + (points[0].y + 200);
      if (points.length === 2) {
         return 'M ' + (points[0].x + 200) + ' ' + (points[0].y + 200) + ' L ' + (points[1].x + 200) + ' ' + (points[1].y + 200);
      }
      
      let path = 'M ' + (points[0].x + 200) + ' ' + (points[0].y + 200);
      
      for (let i = 0; i < points.length - 1; i++) {
         const p0 = i > 0 ? points[i - 1] : points[i];
         const p1 = points[i];
         const p2 = points[i + 1];
         const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
         
         const cp1x = p1.x + (p2.x - p0.x) / 6;
         const cp1y = p1.y + (p2.y - p0.y) / 6;
         const cp2x = p2.x - (p3.x - p1.x) / 6;
         const cp2y = p2.y - (p3.y - p1.y) / 6;
         
         path += ' C ' + (cp1x + 200) + ' ' + (cp1y + 200) + ', ' + (cp2x + 200) + ' ' + (cp2y + 200) + ', ' + (p2.x + 200) + ' ' + (p2.y + 200);
      }
      return path;
   };

   const spiralPath = pointsToPath(spiralPoints);
   const innerSpiralPath = pointsToPath(innerSpiralPoints);
   const innerSpiral2Path = pointsToPath(innerSpiral2Points);
   const aperturePath = pointsToPath(aperturePoints);

   return (
      <div
         className={`w-full h-full ${className || ""}`}
         style={{
            background: "transparent",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
         }}
      >
         <svg
            viewBox="0 0 400 400"
            style={{
               position: "absolute",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               width: "80%",
               height: "80%",
               transformOrigin: "center center",
            }}
         >
            {/* Radial lines from origin (fewer) - breath effect */}
            {radialLines.map((line, i) => (
               <line
                  key={`radial-${i}`}
                  className="animate-breath-pulse"
                  x1={200}
                  y1={200}
                  x2={line.x + 200}
                  y2={line.y + 200}
                  stroke={shellColor}
                  strokeWidth={1}
                  opacity={shellOpacity * 0.3}
               />
            ))}
            
            {/* Inner spiral 2 (lightest, smooth) */}
            <path
               className="animate-unblur-focus"
               d={innerSpiral2Path}
               fill="none"
               stroke={shellColor}
               strokeWidth={1}
               opacity={shellOpacity * 0.4}
               style={{ animationDelay: "0.1s" }}
            />
            
            {/* Inner spiral 1 (smooth) */}
            <path
               className="animate-unblur-focus"
               d={innerSpiralPath}
               fill="none"
               stroke={shellColor}
               strokeWidth={1.5}
               opacity={shellOpacity * 0.6}
               style={{ animationDelay: "0.2s" }}
            />
            
            {/* Septa - chamber walls - labyrinth pulse */}
            {septa.map((septum, i) => (
               <path
                  key={`septum-${i}`}
                  className="animate-labyrinth-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  d={'M ' + (septum.x1 + 200) + ' ' + (septum.y1 + 200) + ' Q ' + (septum.mx + 200) + ' ' + (septum.my + 200) + ' ' + (septum.x2 + 200) + ' ' + (septum.y2 + 200)}
                  fill="none"
                  stroke={shellColor}
                  strokeWidth={1.5}
                  opacity={shellOpacity * 0.7}
               />
            ))}
            
            {/* Main spiral outline */}
            <path
               className="animate-manuscript-reveal"
               style={{ animationDelay: "0.3s" }}
               d={spiralPath}
               fill="none"
               stroke={shellColor}
               strokeWidth={2}
               opacity={shellOpacity}
            />
            
            {/* Aperture - shell opening */}
            <path
               className="animate-unblur-focus"
               style={{ animationDelay: "0.4s" }}
               d={aperturePath}
               fill="none"
               stroke={shellColor}
               strokeWidth={2}
               opacity={shellOpacity}
            />
         </svg>
      </div>
   );
}

export interface NautilusShellProps {
   className?: string;
   sceneConfig?: SceneConfig;
}

export default function NautilusShell({ className, sceneConfig }: NautilusShellProps) {
   const [isMounted, setIsMounted] = useState(false);
   const [webglAvailable, setWebglAvailable] = useState(false);
   const [force2D, setForce2D] = useState(false);

   useEffect(() => {
      setIsMounted(true);
      // Check WebGL availability
      try {
         const canvas = document.createElement('canvas');
         const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
         setWebglAvailable(!!gl);
      } catch (e) {
         setWebglAvailable(false);
      }
      // Allow dev-mode toggle via URL param
      if (import.meta.env.DEV) {
         const params = new URLSearchParams(window.location.search);
         if (params.get('spiral') === '2d') {
            setForce2D(true);
         }
      }
   }, []);

   if (!isMounted) {
      return (
         <div
            className={`w-full h-full ${className || ""}`}
            style={{
               background: "transparent",
               position: "absolute",
               inset: 0,
               width: "100%",
               height: "100%",
            }}
         />
      );
   }

   // Fallback when WebGL is not available OR forced in dev mode
   if (!webglAvailable || force2D) {
      // Dev mode toggle back to 3D
      if (import.meta.env.DEV && force2D) {
         return (
            <>
               <NautilusShell2DFallback className={className} sceneConfig={sceneConfig} />
               <button
                  onClick={() => setForce2D(false)}
                  style={{
                     position: 'absolute',
                     top: '10px',
                     right: '10px',
                     zIndex: 1000,
                     padding: '4px 8px',
                     background: 'rgba(0,0,0,0.5)',
                     color: 'white',
                     border: '1px solid white',
                     borderRadius: '4px',
                     cursor: 'pointer',
                     fontSize: '12px',
                  }}
               >
                  Switch to 3D
               </button>
            </>
         );
      }
      return <NautilusShell2DFallback className={className} sceneConfig={sceneConfig} />;
   }

   // Dev mode toggle button
   if (import.meta.env.DEV) {
      return (
         <>
            <div
               className={`w-full h-full ${className || ""}`}
               style={{
                  background: "transparent",
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
               }}
            >
               <Canvas
                  camera={{
                     position: sceneConfig?.cameraPosition || [0, 0, 4.5],
                     fov: sceneConfig?.cameraFov || 60,
                  }}
                  gl={{
                     antialias: true,
                     alpha: true,
                     powerPreference: "high-performance",
                     failIfMajorPerformanceCaveat: false,
                  }}
                  onError={(error) => {
                     console.log('WebGL error (fallback active):', error.message);
                  }}
               >
                  <Suspense fallback={null}>
                     <Scene config={sceneConfig} />
                  </Suspense>
               </Canvas>
            </div>
            <button
               onClick={() => setForce2D(true)}
               style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  zIndex: 1000,
                  padding: '4px 8px',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
               }}
            >
               Switch to 2D
            </button>
         </>
      );
   }
   return (
      <div
         className={`w-full h-full ${className || ""}`}
         style={{
            background: "transparent",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
         }}
      >
         <Canvas
            camera={{
               position: sceneConfig?.cameraPosition || [0, 0, 4.5],
               fov: sceneConfig?.cameraFov || 60,
            }}
            gl={{
               antialias: true,
               alpha: true,
               powerPreference: "high-performance",
            }}
         >
            <Suspense fallback={null}>
               <Scene config={sceneConfig} />
            </Suspense>
         </Canvas>
      </div>
   );
}
