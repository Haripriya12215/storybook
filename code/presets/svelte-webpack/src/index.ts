import type { PresetProperty } from 'storybook/internal/types';

export * from './types';

export const addons: PresetProperty<'addons'> = [
  require.resolve('@storybook/preset-svelte-webpack/framework-preset-svelte'),
  require.resolve('@storybook/preset-svelte-webpack/framework-preset-svelte-docs'),
];
