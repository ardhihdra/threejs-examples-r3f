'use client'

import * as THREE from 'three'
import { PerspectiveCamera, useAnimations, useGLTF } from "@react-three/drei"
import { Common } from './View'
import { Suspense, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export function Soldier(props) {
  const { scene, animations } = useGLTF('/Soldier.glb')  
  const { mixer, names, actions } = useAnimations(animations, scene)
  const { gl, camera, scene: mainScene } = useThree()

  mainScene.background = useMemo(() => new THREE.Color( 0xa0a0a0 ), []);
  mainScene.fog = useMemo(() => new THREE.Fog( 0xa0a0a0, 10, 50 ), []);

  // Set shadowmap
  gl.shadowMap.enabled = true
  gl.shadowMap.type = THREE.PCFSoftShadowMap

  useEffect(() => {
    actions[names[0]].play()
    camera.lookAt(0, 1, 0)
    // camera.lookAt(-1, 0, 2)
  })
  // can also do it this way
  // const mixer = new THREE.AnimationMixer(scene)
  // const animationAction = mixer.clipAction(animations[0])
  // animationAction.play()

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta)
  })

  return (
    <Suspense fallback={null}>
      <primitive object={scene} castShadow receiveShadow {...props}></primitive>
      <color attach='background' args={['white']} />
      <PerspectiveCamera
        makeDefault
        fov={45}
        position={[1, 2, -3]}
        near={1}
        far={1000}
      />
      <hemisphereLight position={[0, 20, 0]} args={[ 0xffffff, 0x8d8d8d ]}/>
      <directionalLight args={[0xffffff]} position={[-3, 10, -10]} castShadow camera={[-2, 2, 2, -2, 0.1, 40]} />
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshPhongMaterial
          rotation={[- Math.PI / 4, 0, 0]}
          // color={0xcbcbcb}
          color='red'
          depthWrite={false}
          receiveShadow
        />
      </mesh>
    </Suspense>
  )
}