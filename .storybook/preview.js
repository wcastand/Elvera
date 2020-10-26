import React from 'react'
import SpringProvider from '../src/useSpringContext'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
  (Story) => (
    <SpringProvider>
      <Story />
    </SpringProvider>
  ),
]
