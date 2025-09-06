import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

function Controls({ autoRotate, minDistance, maxDistance }) {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.enableDamping = true;
    controls.current.autoRotate = autoRotate;
    controls.current.autoRotateSpeed = 0.5;

    controls.current.minDistance = minDistance;
    controls.current.maxDistance = maxDistance;

    controls.current.target.set(32, 0, 0); // initial look at planets
    controls.current.update();

    return () => controls.current.dispose();
  }, [camera, gl, autoRotate, minDistance, maxDistance]);

  // 🔁 Log every frame to console (DEV only)
  useFrame(() => {
    if (!controls.current) return;

    // const cam = camera.position;
    // const rot = camera.rotation;
    // const tgt = controls.current.target;

    // console.log("Camera Position:", cam.x.toFixed(2), cam.y.toFixed(2), cam.z.toFixed(2));
    // console.log("Camera Rotation:", rot.x.toFixed(2), rot.y.toFixed(2), rot.z.toFixed(2));
    // console.log("Target:", tgt.x.toFixed(2), tgt.y.toFixed(2), tgt.z.toFixed(2));
  });

  return null;
}

export default Controls;
