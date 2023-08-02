import { writable } from 'svelte/store';

export let selectedPoint = writable(null);
export let hoveredPoint = writable(null);

// for highlighting amino acid sequence u.i.
export const highlightedIndex = writable(-1);
export const targetIndex = writable(-1);

export const selectedProtein = writable(null)
export const selectedAminoAcids = writable(null)