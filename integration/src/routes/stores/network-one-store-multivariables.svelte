<script lang="ts">
  import { browser } from '$app/env';
  import { MultiUserStore } from '$houdini';

  const variables1 = { id: '1' };
  const u1 = MultiUserStore();
  $: browser && u1.fetch({ variables: variables1 });

  const variables5 = { id: '5' };
  const u5 = MultiUserStore();
  $: browser && u5.fetch({ variables: variables5 });
</script>

<h1>network-one-store-multivariables</h1>

<div id="result">
  {$u1.data?.user.id} - {$u1.data?.user.name}
</div>

<div id="result-5">
  {$u5.data?.user.id} - {$u5.data?.user.name}
</div>
