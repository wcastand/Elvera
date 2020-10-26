import shortid from 'shortid'
import { useContext, useRef, useEffect, useMemo } from 'react'

import interpolate from './interpolate'
import { SpringContext } from './useSpringContext'
import { Options, Transform, Result } from './types'

export const defaultOpts: Options = { stiffness: 150, damping: 20, mass: 1, auto: true }

export const useSimpleSpring = (options: Partial<Options> = defaultOpts): Result => {
  const { stiffness, damping, mass, auto } = { ...defaultOpts, ...options } as Options
  const springCtx = useContext(SpringContext)
  const springId = useRef(shortid.generate())
  const spring = useMemo(() => springCtx.getSpring(springId.current), [springId.current, springCtx])
  const listenerRef = useRef<() => void>()
  const onEnd = (fn: () => void) => {
    listenerRef.current = fn
    document.addEventListener(`${springId.current}_onEnd`, fn)
  }
  const removeListeners = () => {
    if (listenerRef.current) document.removeEventListener(`${springId.current}_onEnd`, listenerRef.current)
  }
  useEffect(() => {
    springCtx.addSpringLoop(springId.current, {
      springid: springId.current,
      time: Date.now(),
      isStarted: auto,
      velocity: 0,
      done: false,
      stiffness,
      value: 0,
      damping,
      mass,
    })
  }, [])

  useEffect(() => () => removeListeners(), [])

  return { ...spring!, onEnd, removeListeners }
}

export const useSpring = (transforms: Transform = {}, options: Partial<Options> = defaultOpts): [Result, { [key: string]: string }] => {
  const spring = useSimpleSpring(options)
  return [spring, interpolate(transforms, spring.value)]
}

export default useSpring
