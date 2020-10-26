import { act, renderHook } from '@testing-library/react-hooks'

import { useSpring, useSimpleSpring } from './useSpring'
import interpolate, { parse, computeStyle, isTransform, calculate } from './interpolate'

import { wrapper } from './helpers'

test('isTranform', () => {
  expect(isTransform('matrix')).toBe(true)
  expect(isTransform('matrix3d')).toBe(true)
  expect(isTransform('perspective')).toBe(true)
  expect(isTransform('rotate')).toBe(true)
  expect(isTransform('rotate3d')).toBe(true)
  expect(isTransform('rotateX')).toBe(true)
  expect(isTransform('rotateY')).toBe(true)
  expect(isTransform('rotateZ')).toBe(true)
  expect(isTransform('translate')).toBe(true)
  expect(isTransform('translate3d')).toBe(true)
  expect(isTransform('translateX')).toBe(true)
  expect(isTransform('translateY')).toBe(true)
  expect(isTransform('translateZ')).toBe(true)
  expect(isTransform('scale')).toBe(true)
  expect(isTransform('scale3d')).toBe(true)
  expect(isTransform('scaleX')).toBe(true)
  expect(isTransform('scaleY')).toBe(true)
  expect(isTransform('scaleZ')).toBe(true)
  expect(isTransform('skew')).toBe(true)
  expect(isTransform('skewX')).toBe(true)
  expect(isTransform('skewY')).toBe(true)

  expect(isTransform('left')).toBe(false)
})

test('computeStyle', () => {
  expect(computeStyle({ left: '12px', translateX: '100px', rotate: '180deg' })).toStrictEqual({
    left: '12px',
    transform: 'translateX(100px) rotate(180deg)',
  })
})

test('parse', () => {
  expect(
    parse({
      left: [100, 0, 'px'],
      translateX: [100, -100, 'px'],
      matrix: ['1.0, 2.0, 3.0, 4.0, 5.0, 6.0', '2.0, 4.0, 3.0, 4.0, 5.0, 6.0'],
    })
  ).toStrictEqual([
    { left: '100px', translateX: '100px', matrix: '1.0, 2.0, 3.0, 4.0, 5.0, 6.0' },
    { left: '0px', translateX: '-100px', matrix: '2.0, 4.0, 3.0, 4.0, 5.0, 6.0' },
  ])
})

test('parse + computeStyle', () => {
  const [start, end] = parse({
    left: [100, 0, 'px'],
    translateX: [100, -100, 'px'],
    matrix: ['1.0, 2.0, 3.0, 4.0, 5.0, 6.0', '2.0, 4.0, 3.0, 4.0, 5.0, 6.0'],
  })
  expect(computeStyle(start)).toStrictEqual({ left: '100px', transform: 'translateX(100px) matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0)' })
  expect(computeStyle(end)).toStrictEqual({ left: '0px', transform: 'translateX(-100px) matrix(2.0, 4.0, 3.0, 4.0, 5.0, 6.0)' })
})

test('calculate', () => {
  expect(calculate(0.5, { left: [0, 100, 'px'] })).toStrictEqual({ left: '50px' })
  expect(calculate(0.5, { left: [0, 100, 'px'], translateX: ['0px', '100px'] })).toStrictEqual({ left: '50px', translateX: '50px' })
})

test('calculate + computeStyle', () => {
  expect(
    computeStyle(
      calculate(0.5, {
        left: [100, 0, 'px'],
        translateX: [100, -100, 'px'],
        matrix: ['1.0, 2.0, 3.0, 4.0, 5.0, 6.0', '2.0, 4.0, 3.0, 4.0, 5.0, 6.0'],
      })
    )
  ).toStrictEqual({ left: '50px', transform: 'translateX(0px) matrix(1.5, 3, 3, 4, 5, 6)' })
})

test('should use spring', async () => {
  const { result, waitFor } = renderHook(() => useSpring({ left: [0, 100, 'px'], translateX: [-100, 200, 'px'] }, { auto: false }), {
    wrapper,
  })
  expect(result.current[1]).toStrictEqual({
    left: '0px',
    transform: 'translateX(-100px)',
  })
  act(() => result.current[0].start())
  await waitFor(() => result.current[0].done, { timeout: 1000 })
  expect(result.current[1]).toStrictEqual({
    left: '100px',
    transform: 'translateX(200px)',
  })
})
test('should use simple spring', async () => {
  const { result, waitFor } = renderHook(() => useSimpleSpring({ auto: false }), { wrapper })
  expect(interpolate({ left: [0, 100, 'px'], translateX: [-100, 200, 'px'] }, result.current.value)).toStrictEqual({
    left: '0px',
    transform: 'translateX(-100px)',
  })
  act(() => result.current.start())
  await waitFor(() => result.current.done, { timeout: 1000 })
  expect(interpolate({ left: [0, 100, 'px'], translateX: [-100, 200, 'px'] }, result.current.value)).toStrictEqual({
    left: '100px',
    transform: 'translateX(200px)',
  })
})

test('should use spring', async () => {
  const { result, waitFor } = renderHook(
    () =>
      useSpring(
        {
          left: [0, 100, 'px'],
          translateX: [-100, 200, 'px'],
          rotate: [0, 180, 'deg'],
          scale3d: ['2.5, 1.2, 0.3', '1, 2, 0.3'],
        },
        { auto: false }
      ),
    { wrapper }
  )
  expect(result.current[1]).toStrictEqual({ left: '0px', transform: 'translateX(-100px) rotate(0deg) scale3d(2.5, 1.2, 0.3)' })
  act(() => result.current[0].start())
  await waitFor(() => result.current[0].done, { timeout: 1000 })
  expect(result.current[1]).toStrictEqual({
    left: '100px',
    transform: `translateX(200px) rotate(180deg) scale3d(1, 2, 0.3)`,
  })
})

test('should call onEnd', async () => {
  const onEnd = jest.fn()
  const { result, waitFor } = renderHook(() => useSpring(), { wrapper })
  act(() => result.current[0].onEnd(onEnd))
  await waitFor(() => result.current[0].done, { timeout: 2000 })
  expect(onEnd.mock.calls.length).toBe(1)
})
