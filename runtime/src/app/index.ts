import { getContext } from 'hamber';
import { CONTEXT_KEY } from '@ramber/internal/shared';

export const stores = () => getContext(CONTEXT_KEY);

export { default as start } from './start/index';
export { default as goto } from './goto/index';
export { default as prefetch } from './prefetch/index';
export { default as prefetchRoutes } from './prefetchRoutes/index';