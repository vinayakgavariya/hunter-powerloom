<script context="module">
  export const prerender = true;
</script>

<script>
  import axios from "axios";
  import { onMount } from 'svelte';
  import Time from "svelte-time";

  let pairsData = {data:[]};
  const API_PREFIX = import.meta.env.VITE_API_PREFIX;

  onMount(async () => {
    console.log('API', API_PREFIX);
    let response;
    try {
      response = await axios.get(API_PREFIX+'/v1/api/v2-pairs');
      console.log('got pairs', response.data);
      pairsData = {
        block_height: response.data.block_height,
        block_timestamp: new Date(response.data.block_timestamp*1000),
        data: response.data.data,
        txHash: response.data.txHash,
        cid: response.data.cid
      }
    }
    catch (e){
      console.error('stats', e);
    }
  });
</script>

<svelte:head>
  <title>Pairs</title>
</svelte:head>
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6 ">
  <div class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
    <div class="ml-4 mt-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Top Pairs</h3>
          <p class="text-sm text-gray-500">
            {#if pairsData.block_height}Synced to <a href="https://etherscan.io/block/{pairsData.block_height}"class="text-indigo-800" target="_blank">{pairsData.block_height}</a> <Time relative timestamp={pairsData.block_timestamp} />{/if}
          </p>
        </div>
      </div>
    </div>
    <div class="ml-4 mt-4 flex-shrink-0 flex">
      <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{pairsData.cid}">
        <!-- Heroicon name: solid/phone -->
        <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        <span> IPFS </span>
      </a>
      <a class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://explorer-prost.powerloom.io/tx/{pairsData.txHash}">
        <!-- Heroicon name: solid/mail -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
        <span> Proof </span>
      </a>
    </div>
  </div>
</div><div class="flex flex-col">
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
              <!--
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 7D
              </th>
              -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 24H
              </th>
              <!--
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 1Y/Liquity
              </th>
              -->
            </tr>
          </thead>
          <tbody>
            {#each pairsData.data as pool, index}
            <tr class={(index+1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index+1}
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
              <!--
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.volume_7d}
              </td>
              -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pool.fees_24h}
              </td>
              <!--
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                {pool["1y_fees_liquidity"]}
              </td>
              -->
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
