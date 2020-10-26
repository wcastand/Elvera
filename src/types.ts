export type State = {
  springid: string
  isStarted: boolean
  time: number
  done: boolean
  stiffness: number
  damping: number
  mass: number
  value: number
  velocity: number
}
export type Action =
  | { type: 'velocity'; payload: number }
  | { type: 'value'; payload: number }
  | { type: 'state'; payload: number }
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'reset'; payload: boolean }

export type Value = [number, number, string] | [string, string] | [number, number]
export type Transform = {
  [key: string]: Value
}
export type Options = {
  stiffness: number
  damping: number
  mass: number
  auto: boolean
}
export type ChainOptions = {
  auto: boolean
}

export type Result = State & {
  start: () => void
  stop: () => void
  reset: () => void
  onEnd: (fn: () => void) => void
  removeListeners: () => void
}
