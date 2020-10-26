import { useState, useEffect, useRef } from 'react'

import { ChainOptions } from './types'

export const defaultOpts: ChainOptions = { auto: true }

export const useChain = (springs: any[] = [], options: Partial<ChainOptions> = defaultOpts) => {
  const { auto } = { ...defaultOpts, ...options } as ChainOptions
  const currentRef = useRef(0)
  const [isStopped, setStopped] = useState(false)
  const springsRef = useRef(springs)
  const start = () => {
    setStopped(false)
    springsRef.current[currentRef.current].start()
  }
  const stop = () => {
    setStopped(true)
    springsRef.current[currentRef.current].stop()
  }
  const reset = () => {
    setStopped(auto)
    currentRef.current = 0
    springsRef.current.map((s) => s.reset())
  }

  useEffect(() => {
    if (springsRef.current !== springs) springsRef.current = springs
  }, [springs])

  useEffect(() => {
    if (!isStopped) {
      springsRef.current.map((spring, idx) =>
        spring.onEnd(() => {
          if (idx + 1 < springsRef.current.length) {
            currentRef.current = idx + 1
            springsRef.current[idx + 1].start()
          }
        })
      )
    }
    return () => {
      springsRef.current.map((spring) => spring.removeListeners())
    }
  }, [isStopped])

  useEffect(() => {
    if (auto) {
      setStopped(false)
      springsRef.current[currentRef.current].start()
    }
  }, [])
  return { current: currentRef.current, start, stop, reset }
}
export default useChain
