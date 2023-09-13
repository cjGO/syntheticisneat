<script>
	import { onMount } from 'svelte';
	import { highlightedIndex, hoveredAA } from '../routes/stores'; // import your store

	export let pdbId = 'O23976'; // default PDB ID
	let container;
	let viewer;
	let model;

	onMount(async () => {
		if (typeof window !== 'undefined') {
			const _3Dmol = await import('3dmol');

			viewer = _3Dmol.createViewer(container, {});

			// Fetch the PDB file data
			const response = await fetch(`https://alphafold.ebi.ac.uk/files/AF-${pdbId}-F1-model_v4.pdb`);
			const pdbData = await response.text();

			// Add the PDB data to the viewer
			model = viewer.addModel(pdbData, 'pdb');

			// Change to sphere model with small radii
			model.setStyle({}, { stick: {} });

			// Set all residues to green
			model.setStyle({}, { stick: { colorscheme: 'greenCarbon' } });

			viewer.zoomTo();
			viewer.render();
		}
	});

	// Reactive statement to update the highlighted residue
	$: if (model) {
		// Reset all residues to green
		model.setStyle({}, { stick: { colorscheme: 'greenCarbon' } });

		// Set the highlighted residue to red
		model.setStyle({ resi: $highlightedIndex+1 }, { sphere: { colorscheme: 'redCarbon' } });
		model.setStyle({ resi: $hoveredAA+1 }, { sphere: { colorscheme: 'blueCarbon' } });

		viewer.render();
	}
</script>

<div bind:this={container} style="height: 400px; width: 400px;" />
