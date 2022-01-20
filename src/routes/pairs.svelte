<script context="module">
	export const prerender = true;
</script>

<script>
  import axios from "axios";
	import { onMount } from 'svelte';

	let data = [];

	onMount(async () => {
    const response = await axios.get('/v2-pairs.json');
    data = response.data;
    console.log('got pairs', response.data);
	});
</script>

<svelte:head>
	<title>Pools</title>
</svelte:head>
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liquidity
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 24H
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 7D
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 24H
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 1Y/Liquity
              </th>
            </tr>
          </thead>
          <tbody>
            {#each data as pool}
            <tr class={pool.index%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.index}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {pool.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.liquidity}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.volume_24h}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.volume_7d}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.fees_24h}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                {pool["1y_fees_liquidity"]}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
