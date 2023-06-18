'use client'

import { useAnimations, useGLTF } from "@react-three/drei"
import { Common } from './View'
import { Suspense, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

export function LittlestTokyo(props) {
  const { scene , animations } = useGLTF('/LittlestTokyo.glb')  
  const { mixer, names, actions } = useAnimations(animations, scene)

  useEffect(() => {
    actions[names[0]].play()
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
      <primitive object={scene} {...props}></primitive>
      <Common color={0xbfe3dd} cameraPosition={[5, 2, 8]} />
    </Suspense>
  )
}