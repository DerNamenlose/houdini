<script lang="ts">
	import { GQL_AddItem } from '$houdini'

	async function add() {
		await GQL_AddItem.mutate({ variables: { input: { text: 'bonjour!' } } })
	}
</script>

<button on:click={add} />
