import { writable } from 'svelte/store';

export let selectedPoint = writable(null);

export let hoveredPoint = writable(null);