'use client'

import { Stats } from '@react-three/drei'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Suspense, useRef, useState } from 'react'

const Dog = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.Dog), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })
const LittlestTokyo = dynamic(() => import('@/components/canvas/LittlestTokyo').then((mod) => mod.LittlestTokyo), { ssr: false })
const Soldier = dynamic(() => import('@/components/canvas/Soldier').then((mod) => mod.Soldier), { ssr: false })

export default function Page() {
  const [scene, setScene] = useState('littlePuppy')

  return (
    <>
      <div className='mx-auto flex w-full flex-row flex-wrap items-center md:flex-row'>
        {/* jumbo */}
        <div className='flex h-screen w-1/5 flex-col items-start justify-center  bg-stone-900 text-center md:text-left '>
          <div className='min-w-full border-b border-stone-600 p-4 font-bold text-blue-600'>
            three.js
          </div>
          <div className='min-w-full border-b border-stone-600 p-4 font-bold text-blue-600'>
            <input placeholder='Search...' className='w-full bg-stone-900 p-2 text-white'></input>
          </div>
          <div className='h-full min-w-full overflow-y-auto p-3 text-stone-300'>
            <div className='mb-4 text-blue-600'>webgl</div>
            {
              Object.keys(SCENE_LIST).map((key, idx) => {
                const sl = SCENE_LIST[key]
                return (
                  <div
                    key={idx}
                    className={`relative mx-auto my-12 w-full cursor-pointer rounded-md bg-red-400 sm:my-4 ${key === scene ? 'border-2 border-blue-500': ''}`}
                    onClick={() => setScene(key)}
                  >
                    <Image src={sl.img} alt='backdrop' width='312' height='180' className='inset-0 rounded-md'/>
                    <div className='absolute bottom-0 left-0 z-10 w-full rounded-b-md bg-stone-700 p-2 text-xs sm:text-lg'>{sl.title}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
        {SCENE_LIST[scene].jsx}
      </div>
    </>
  )
}

function NormalView({orbit, children, title}) {
  const sceneRef = useRef()

  return (
    <div ref={sceneRef} className='flex-1 border-0 p-0 text-center'>
      <View orbit={orbit} className='relative h-screen w-full border-0 p-0'>
        {children}
        <Stats parent={sceneRef} className='stats'/>
      </View>
      {title}
    </div>
  )
}

const SCENE_LIST = {
  littlePuppy: {
    title: 'R3F',
    img: '/img/dog.png',
    jsx: (
      <NormalView>
        <Suspense fallback={null}>
          <Dog scale={2} position={[0, -1.6, 0]} rotation={[0.0, -0.3, 0]} />
          <Common color={'lightpink'} />
        </Suspense>
      </NormalView>
    ),
  },
  littlestTokyo: {
    title: 'animation / keyframes',
    img: '/img/littlest-tokyo.jpeg',
    jsx: (
      <NormalView
        orbit
        title={(
          <div className='absolute top-0 z-10 box-border w-full select-none p-2 text-center'>
            <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - animation - keyframes<br/>
            Model: <a href="https://artstation.com/artwork/1AGwX" target="_blank" rel="noopener">Littlest Tokyo</a> by
            <a href="https://artstation.com/glenatron" target="_blank" rel="noopener">Glen Fox</a>, CC Attribution.
          </div>
        )}
      >
        <LittlestTokyo scale={0.01} position={[1, 1, 0]} />
      </NormalView>
    ),
  },
  soldier: {
    title: 'animation / skinning / blending',
    img: '/img/robot.jpeg',
    jsx: (
      <NormalView
        orbit={false}
        title={(
          <div className='absolute top-0 z-10 box-border w-full select-none p-2 text-center'>
              <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - Skeletal Animation Blending
              (model from <a href="https://www.mixamo.com/" target="_blank" rel="noopener">mixamo.com</a>)<br/>
              Note: crossfades are possible with blend weights being set to (1,0,0), (0,1,0) or (0,0,1)
          </div>
        )}
      >
        <Soldier position={[0, 0, 0]} />
      </NormalView>
    )
  }
}
