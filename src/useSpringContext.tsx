import React, { createContext, useState, useEffect, useRef } from 'react'

import { State, Action, Result } from './types'

export const SpringContext = createContext<{
  springs: { [key: string]: Result }
  getSpring: (id: string) => Result | null
  addSpringLoop: (springid: string, spring: State) => void
  clearSprings: () => void
}>({
  springs: {},
  getSpring: () => null,
  addSpringLoop: () => {},
  clearSprings: () => {},
})

export const reducer = (state: Result, action: Action) => {
  switch (action.type) {
    case 'velocity':
      return { ...state, velocity: action.payload }
    case 'value':
      return { ...state, value: action.payload }
    case 'state':
      let lastTime = state.time
      if (action.payload > lastTime + 64) lastTime = action.payload
      let numSteps = Math.floor(action.payload - lastTime)
      let velocity = state.velocity
      let value = state.value
      for (let i = 0; i < numSteps; i++) {
        const force = -state.stiffness * (value - 1)
        const fdamping = -state.damping * velocity
        const acceleration = (force + fdamping) / state.mass
        velocity = velocity + (acceleration * 1) / 1000
        value = value + (velocity * 1) / 1000
      }

      const isVelocity = Math.abs(velocity) <= 0.01
      const isDisplacement = state.stiffness !== 0 ? Math.abs(1 - value) <= 0.01 : true
      const done = isVelocity && isDisplacement
      if (done) {
        value = 1
        velocity = 0
        document.dispatchEvent(new Event(`${state.springid}_onEnd`))
      }
      return { ...state, done, velocity, value, time: lastTime + numSteps }
    default:
      return state
  }
}

export const SpringProvider: React.FC = ({ children }) => {
  const timeIdRef = useRef<number | null>(null)
  const [springs, dispatch] = useState<{ [key: string]: Result }>({})

  const clearSprings = () => dispatch({})
  const getSpring = (springid: string) => {
    const v = Object.entries(springs).find(([key]) => key === springid)
    if (v) return v[1]
    else return null
  }
  const addSpringLoop = (springid: string, spring: State) => {
    const start = () => {
      dispatch((s) => ({ ...s, [springid]: { ...s[springid], isStarted: true } }))
      timeIdRef.current = requestAnimationFrame(loop)
    }
    const stop = () => dispatch((s) => ({ ...s, [springid]: { ...s[springid], isStarted: false } }))
    const reset = () => {
      dispatch((s) => ({ ...s, [springid]: { ...s[springid], isStarted: spring.isStarted, done: false, value: 0, velocity: 0 } }))
      if (spring.isStarted) timeIdRef.current = requestAnimationFrame(loop)
    }

    dispatch((s: { [key: string]: Result }) => ({
      ...s,
      [springid]: { ...spring, start, stop, reset, onEnd: () => {}, removeListeners: () => {} },
    }))
  }
  const loop = (time: number) => {
    if (!timeIdRef.current) return
    dispatch((s) => {
      const dd: [string, Result][] = Object.entries(s).map(([k, v]) => [
        k,
        v.done || !v.isStarted ? v : reducer(v, { type: 'state', payload: time }),
      ])
      /*
        Don't cancel if at least one is not done and started
        
        - done: true | isStarted: false => cancel
        - done: true | isStarted: true => cancel 
        - done: false | isStarted: true => not cancel
        - done: false | isStarted: false => cancel
        */
      const hasToCancel = !dd.some(([, d]) => !d.done && d.isStarted)
      if (hasToCancel) timeIdRef.current = null
      else timeIdRef.current = requestAnimationFrame(loop)
      return Object.fromEntries(dd)
    })
  }

  useEffect(() => {
    if (!timeIdRef.current) {
      const hasToCancel = !Object.values(springs).some((d) => !d.done && d.isStarted)
      if (!hasToCancel) timeIdRef.current = requestAnimationFrame(loop)
    }
  }, [springs, timeIdRef])

  useEffect(() => {
    timeIdRef.current = requestAnimationFrame(loop)
    return () => {
      if (timeIdRef.current) cancelAnimationFrame(timeIdRef.current)
      timeIdRef.current = null
    }
  }, [])

  return <SpringContext.Provider value={{ springs, getSpring, addSpringLoop, clearSprings }}>{children}</SpringContext.Provider>
}

export default SpringProvider
