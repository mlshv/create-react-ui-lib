import type { StoryDefault, Story } from '@ladle/react'

import { DemoComponent } from './DemoComponent'

// More on how to set up stories at: https://ladle.dev/docs/stories
export default {
  title: 'Example/DemoComponent',
} satisfies StoryDefault

export const Default: Story = () => <DemoComponent initialCount={0} />

export const WithInitialCount: Story = () => <DemoComponent initialCount={42} />
