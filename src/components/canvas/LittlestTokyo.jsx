'use client'

import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Environment, PerspectiveCamera, useAnimations, useGLTF } from "@react-three/drei"
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { Common } from './View'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';


export function LittlestTokyo(props) {
  // const { scene, nodes, animations, materials } = useGLTF('/LittlestTokyo.glb', 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/', true)  
  // texture loaded incorrectly this why, idk why need further investigation in useGLTF
  // https://github.com/pmndrs/drei/blob/master/src/core/useGLTF.tsx
  // https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/core/hooks.tsx
  
  const { scene, nodes, animations, materials } = useGLTF('/LittlestTokyo.glb', '/gltf/', false, (loader) => { loader = GLTFLoader})  
  // const { mixer, names, actions } = useAnimations(animations, scene)

  const { gl, scene: threeScene } = useThree()
  const bgColor = useMemo(() => new THREE.Color( 0xbfe3dd ), [])
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator( gl ), [gl])
  const mixerRef = useRef()

  gl.antialias = true
  gl.linear = true
  const texture = pmremGenerator.fromScene( new RoomEnvironment(), 0.01 ).texture;
  
  // useEffect(() => {
  //   actions[names[0]].play().setDuration(18)
  // })
  // can also do it this way
  // const animationAction = mixer.clipAction(animations[0])
  // animationAction.play()

  useFrame((state, delta) => {
    if (mixerRef.current) mixerRef.current.update(delta)
    // if (mixer) mixer.update(delta)
  })

  const modelRef = useRef();

  const loadModel = async () => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const gltf = await loader.loadAsync('/LittlestTokyo.glb');

    const model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.01, 0.01, 0.01);
    modelRef.current = model;
    threeScene.add(model);

    // play animation
    const mixer = new THREE.AnimationMixer(model)
    mixerRef.current = mixer
    const animationAction = mixer.clipAction(gltf.animations[0])
    animationAction.play()
  };

  useEffect(() => {
    loadModel();
    return () => {
      if (modelRef.current) {
        threeScene.remove(modelRef.current);
      }
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <color attach='background' args={[0xbfe3dd]} />
      <Environment map={texture}></Environment>
      {/* <ambientLight intensity={2} /> */}
      <PerspectiveCamera
        makeDefault
        fov={40}
        position={[4, 2, 10]}
        near={0.1}
        far={1000}
        aspect={window.innerWidth / window.innerHeight}
      />
      {/* <primitive object={scene} {...props} toneMapped={true}></primitive> */}
      {/* <LittlestTokyoModel {...props} /> */}
    </Suspense>
  )
}