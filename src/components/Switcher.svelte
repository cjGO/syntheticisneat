<script>
	import { modelSize } from '../routes/stores.js';

	export let arg1;
	export let arg2;

	let display;

	$: {
		display = $modelSize === 'facebook/esm2_t6_8M_UR50D_' ? arg1 : arg2;
	}

	function switchArg() {
		// Switch the modelSize depending on the current value
		if ($modelSize === 'facebook/esm2_t6_8M_UR50D_') {
			modelSize.set('facebook/esm2_t33_650M_UR50D_');
		} else {
			modelSize.set('facebook/esm2_t6_8M_UR50D_');
		}
	}
</script>

<button on:click={switchArg}>
	{display}
</button>
