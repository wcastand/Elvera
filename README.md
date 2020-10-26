# Elvera (unpublished for now)

<!--- These are examples. See https://shields.io for others or to customize this set of shields. You might want to include dependencies, project status and licence info here --->

<!-- ![GitHub repo size](https://img.shields.io/github/repo-size/scottydocs/README-template.md)
![GitHub contributors](https://img.shields.io/github/contributors/scottydocs/README-template.md)
![GitHub stars](https://img.shields.io/github/stars/scottydocs/README-template.md?style=social)
![GitHub forks](https://img.shields.io/github/forks/scottydocs/README-template.md?style=social)
![Twitter Follow](https://img.shields.io/twitter/follow/scottydocs?style=social) -->

Elvera is a utility that allows react devs to do spring animation easily without overloading `requestAnimationFrame` with multiple callback.

## Installing Elvera

To install Elvera, follow these steps:

```
npm add elvera
```

```
yarn add elvera
```

## Using Elvera

To use Elvera, follow these steps:

```tsx
import React from 'react'
import { useSpring } from 'elvera'

export const Test = () => {
  const [, style] = useSpring({ left: [0, 150, 'px'] })
  return (
    <div style={{ zIndex: 0, position: 'relative' }}>
      <span style={{ position: 'relative', display: 'block', width: 150, height: 50, ...style }}>Hello</span>
    </div>
  )
}
```

## Documentation

### useSpring

#### Parameters

`useSpring` takes up to 2 parameters:

- The first one being the transforms to apply to create the style.
- The second being the spring's options.

| Name       | Description                                       | Default                                                | Type      |
| ---------- | ------------------------------------------------- | ------------------------------------------------------ | --------- |
| transforms | transform used by interpolate to create the style | \{\}                                                   | Transform |
| options    | options of the Spring                             | \{ stiffness: 150, damping: 20, mass: 1, auto: true \} | Options   |

#### Return

`useSpring` returns an array `[spring, style]`

| Name   | Description                                          | Type                                       |
| ------ | ---------------------------------------------------- | ------------------------------------------ |
| spring | The spring object                                    | Result                                     |
| style  | The style of the spring animation based on transform | \{ \[key: string\]: string \} // css style |

### useSimpleSpring

#### Parameters

`useSimpleSpring` takes up 1 parameter:

| Name    | Description           | Default                                                | Type    |
| ------- | --------------------- | ------------------------------------------------------ | ------- |
| options | options of the Spring | \{ stiffness: 150, damping: 20, mass: 1, auto: true \} | Options |

#### Return

`useSimpleSpring` returns a spring object

| Name   | Description       | Type   |
| ------ | ----------------- | ------ |
| spring | The spring object | Result |

### interpolate

#### Parameters

`interpolate` takes up to 2 parameters:

- The first one being the transforms to apply to create the style.
- The second being the spring's value.

| Name       | Description                                       | Default | Type      |
| ---------- | ------------------------------------------------- | ------- | --------- |
| transforms | transform used by interpolate to create the style | \{\}    | Transform |
| value      | value of the Spring                               | 0       | number    |

#### Return

`interpolate` returns the style object

| Name  | Description                                          | Type                                       |
| ----- | ---------------------------------------------------- | ------------------------------------------ |
| style | The style of the spring animation based on transform | \{ \[key: string\]: string \} // css style |

### useChain

#### Parameters

`useChain` takes up to 2 parameters:

- The first one being an array of spring to chain (needs to have `auto:false`).
- The second being the chain's options.

| Name    | Description          | Default      | Type         |
| ------- | -------------------- | ------------ | ------------ |
| springs | springs to chain     | []           | Result[]     |
| options | options of the chain | {auto: true} | ChainOptions |

#### Return

`useChain` returns an chain object

| Name    | Description                              | Type        |
| ------- | ---------------------------------------- | ----------- |
| current | index of the current spring being played | number      |
| start   | to start the chain if `auto: false`      | () => void) |
| end     | to stop the chain                        | () => void) |
| reset   | to reset the chain                       | () => void) |

#### Transform

`Transform` is the object used to interpolate the style from the spring's value.

The value can have multiple form:

- [from, to, unit] = [number, number, unit]
- [from, to] = [string, string]
- [from, to] = [number, number]

The key represent the css property with the exception of the `transform` property that is splitted between the following properties:

- matrix
- matrix3d
- perspective
- rotate
- rotate3d
- rotateX
- rotateY
- rotateZ
- translate
- translate3d
- translateX
- translateY
- translateZ
- scale
- scale3d
- scaleX
- scaleY
- scaleZ
- skew
- skewX
- skewY

##### Examples

```js
{
  left: [0, 100, 'px'],
  transformX: [0, 120],
  scale: [0.3, 2]
}
```

#### Result

`Result` is the spring object and his current state.

| Name            | Description                                           | Default  | Type       |
| --------------- | ----------------------------------------------------- | -------- | ---------- |
| springid        | id of the spring (used for events)                    | -        | string     |
| isStarted       | is the spring animating                               | false    | boolean    |
| time            | time of the last frame (from `requestAnimationFrame`) | 0        | number     |
| done            | is the spring animation finished                      | false    | boolean    |
| stiffness       | spring energetic load                                 | 150      | number     |
| damping         | spring resistence                                     | 20       | number     |
| mass            | spring mass                                           | 1        | number     |
| value           | current spring value(between 0(start) and 1(end))     | 0        | number     |
| velocity        | velocity of the spring                                | 0        | number     |
| start           | function to start the spring animation                | -        | () => void |
| end             | function to stop the spring animation                 | -        | () => void |
| reset           | function to reset the spring animation                | -        | () => void |
| onEnd           | callback at the end of the spring animation           | () => {} | () => void |
| removeListeners | remove listeners of the spring animation              | -        | () => void |

```ts
export type Result = {
  springid: string
  isStarted: boolean
  time: number
  done: boolean
  stiffness: number
  damping: number
  mass: number
  value: number
  velocity: number

  start: () => void
  stop: () => void
  reset: () => void
  onEnd: (fn: () => void) => void
  removeListeners: () => void
}
```

## Contributing to Elvera

To contribute to Elvera, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin Elvera/<location>`
5. Create the pull request.

Alternatively see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## License

This project uses the following license: [MIT](LICENSE).
