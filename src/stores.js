import { writable } from 'svelte/store';

export const showInfo = writable(false);
export const explorerPrefix = writable('');
export const anchorExplorerPrefix = writable('');