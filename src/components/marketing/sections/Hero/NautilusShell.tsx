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

export interface NautilusShellProps {
   className?: string;
   sceneConfig?: SceneConfig;
}

export default function NautilusShell({ className, sceneConfig }: NautilusShellProps) {
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
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
