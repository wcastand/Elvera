import { Options, Transform } from './types'

export const defaultOpts: Options = { stiffness: 150, damping: 20, mass: 1, auto: true }
export const reg = new RegExp(/[0-9]*\.?[0-9]+/g)

export const rep = (from: string, to: string, value: number) => {
  const fm = from.match(reg)
  const tm = to.match(reg)
  if (!fm || !tm) throw new Error('from and to do not match')
  let result = to
  const fmatches = [...from.matchAll(reg)]
  const tmatches = [...to.matchAll(reg)]
  for (let i = tmatches.length - 1; i >= 0; i--) {
    const f = fmatches[i]
    const t = tmatches[i]
    const v = parseFloat(f[0]) + value * (parseFloat(t[0]) - parseFloat(f[0]))
    result = result.slice(0, t.index) + v + result.slice(t.index! + t[0].length, result.length)
  }
  return result
}

export const parse = (transforms: Transform) =>
  Object.entries(transforms).reduce(
    ([start, end], [propname, props]) => {
      if (props.length === 3) {
        const [from, to, unit] = props
        return [
          { ...start, [propname]: `${from}${unit}` },
          { ...end, [propname]: `${to}${unit}` },
        ]
      } else {
        const [from, to] = props
        return [
          { ...start, [propname]: from },
          { ...end, [propname]: to },
        ]
      }
    },
    [{}, {}]
  )

export const calculate = (currentValue: number, transforms: Transform) =>
  Object.entries(transforms).reduce<{ [key: string]: string }>((style, [propname, props]) => {
    if (props.length === 3) {
      const [from, to, unit] = props
      const value = from + currentValue * (to - from)
      return { ...style, [propname]: `${value}${unit}` }
    }
    if (typeof props[0] === 'number' && typeof props[1] === 'number') {
      const [from, to] = props
      const value = from + currentValue * (to - from)
      return { ...style, [propname]: value.toString() }
    }
    const [from, to] = props as [string, string]
    return { ...style, [propname]: rep(from, to, currentValue) }
  }, {})

export const isTransform = (key: string) =>
  [
    'matrix',
    'matrix3d',
    'perspective',
    'rotate',
    'rotate3d',
    'rotateX',
    'rotateY',
    'rotateZ',
    'translate',
    'translate3d',
    'translateX',
    'translateY',
    'translateZ',
    'scale',
    'scale3d',
    'scaleX',
    'scaleY',
    'scaleZ',
    'skew',
    'skewX',
    'skewY',
  ].includes(key)

export const computeStyle = (values: { [key: string]: string }): { [key: string]: string } =>
  Object.entries(values).reduce<{ [key: string]: string }>(
    (acc, [key, value]) =>
      isTransform(key) ? { ...acc, transform: `${acc.transform ? acc.transform + ' ' : ''}${key}(${value})` } : { ...acc, [key]: value },
    {}
  )

export const interpolate = (transforms: Transform, value: number) => computeStyle(calculate(value, transforms))
export default interpolate
