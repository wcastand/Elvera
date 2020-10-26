import React from 'react'

import useChain from './useChain'
import interpolate from './interpolate'
import useSpring, { useSimpleSpring } from './useSpring'
import SpringProvider from './useSpringContext'

export const Test: React.FC<{ tr: any }> = ({ tr }) => {
  const s = useSimpleSpring({ auto: false })
  const s2 = useSimpleSpring({ auto: false, damping: 5 })
  React.useEffect(() => {
    s.onEnd(() => console.log('end'))
  }, [])
  return (
    <>
      <div>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s.start()}>
          start
        </button>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s.stop()}>
          stop
        </button>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s.reset()}>
          reset
        </button>
      </div>
      <div>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s2.start()}>
          start 2
        </button>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s2.stop()}>
          stop 2
        </button>
        <button style={{ zIndex: 99, marginBottom: 20 }} onClick={() => s2.reset()}>
          reset 2
        </button>
      </div>
      <div>
        <button
          style={{ zIndex: 99, marginBottom: 20 }}
          onClick={() => {
            s.start()
            s2.start()
          }}
        >
          start both
        </button>
        <button
          style={{ zIndex: 99, marginBottom: 20 }}
          onClick={() => {
            s.stop()
            s2.stop()
          }}
        >
          stop both
        </button>
        <button
          style={{ zIndex: 99, marginBottom: 20 }}
          onClick={() => {
            s.reset()
            s2.reset()
          }}
        >
          reset both
        </button>
      </div>
      <div style={{ zIndex: 0, position: 'relative' }}>
        <span style={{ position: 'relative', display: 'block', width: 150, height: 50, ...interpolate(tr, s.value) }}>Hello</span>
      </div>
      <div style={{ zIndex: 0, position: 'relative' }}>
        <span style={{ position: 'relative', display: 'block', width: 150, height: 50, ...interpolate(tr, s2.value) }}>Hello</span>
      </div>
    </>
  )
}
export const TestComplete: React.FC<{ tr: any }> = ({ tr }) => {
  const [spring, style] = useSpring(tr, { auto: false })
  return (
    <>
      <button style={{ zIndex: 99, marginBottom: 50 }} onClick={() => spring.start()}>
        start
      </button>
      <div style={{ zIndex: 0, position: 'relative' }}>
        <span style={{ position: 'relative', display: 'block', width: 150, height: 50, ...style }}>Hello</span>
      </div>
    </>
  )
}

export const TestStagger = () => {
  const spring1 = useSimpleSpring({ auto: false })
  const spring2 = useSimpleSpring({ auto: false })
  const spring3 = useSimpleSpring({ auto: false })
  const { start, stop, reset } = useChain([spring1, spring2, spring3], { auto: false })
  return (
    <>
      <div style={{ zIndex: 99, marginBottom: 50 }}>
        <button onClick={() => start()}>start</button>
        <button onClick={() => stop()}>stop</button>
        <button onClick={() => reset()}>reset</button>
      </div>
      <div style={{ zIndex: 1, position: 'relative', width: 100, height: 160, transformOrigin: 'center' }}>
        <span
          style={{
            display: 'block',
            position: 'relative',
            textAlign: 'center',
            ...interpolate({ left: [0, 100, 'px'] }, spring1.value),
            ...interpolate({ top: [0, 100, 'px'] }, spring2.value),
            ...interpolate({ rotate: [0, 360, 'deg'] }, spring3.value),
          }}
        >
          Hello
        </span>
      </div>
    </>
  )
}

export const wrapper: React.FC = ({ children }) => <SpringProvider>{children}</SpringProvider>
