<script context="module">
  export const prerender = true;
</script>

<script>
  import axios from "axios";
  import { onMount } from 'svelte';
  import Time from "svelte-time";
  import { anchorExplorerPrefix, explorerPrefix } from '../stores.js';

  let pairsData = {data:[], fullData:[]};
  let pairsData7d = {};
  let top_pairs_cid = '';
  let top_pairs_7d_cid = '';
  const API_PREFIX = import.meta.env.VITE_API_PREFIX;
  let recentReset = import.meta.env.VITE_RECENT_RESET == 'true';
  const V3 = import.meta.env.VITE_UNISWAPV3 == 'true';
	const APP_NAME = import.meta.env.VITE_APP_NAME || 'Uniswap ' + (V3 ? 'v3' : 'v2');
  let showChangeData = true;
  let name = '';
  let top_pairs_project_id = 'aggregate_uniswap_24h_top_pairs:b72767bbbd95e505ab72501b22784258fdff3dc0fc1ecee4d1fafe854d3dbdfb:UNISWAPV2-ph15-prod';
  let top_pairs_7d_project_id = 'aggregate_uniswap_7d_top_pairs:e9ef15493ebc1be7640743c0b6a96fc2c33a7cbd5263eed9418c818b63a05254:UNISWAPV2-ph15-prod';
  let currentEpoch = null;
  let epochInfo = null;
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  onMount(async () => {
    name = location.search.substr(8);
    console.log('search', name);
    let response;
    try {
      response = await axios.get(API_PREFIX+`/current_epoch`);
      console.log('got epoch', response.data);
      if (response.data) {
        currentEpoch = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('currentEpoch', e);
    }
    try {
      response = await axios.get(API_PREFIX+`/epoch/${currentEpoch.epochId-1}`);
      console.log('got epoch info', response.data);
      if (response.data) {
        epochInfo = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('EpochInfo', e);
    }
    try {
      response = await axios.get(API_PREFIX+`/data/${currentEpoch.epochId-1}/${top_pairs_7d_project_id}/`);
      console.log('got stats', response.data);
      if (response.data) {
        for (let pair of response.data.pairs) {
          pairsData7d[pair.name] = pair;
        }
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('stats', e);
    }
    try {
      response = await axios.get(API_PREFIX+`/cid/${currentEpoch.epochId-1}/${top_pairs_project_id}/`);
      console.log('got top pairs cid', response.data);
      if (response.data) {
        top_pairs_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('top pairs cid', e);
    }
    try {
      response = await axios.get(API_PREFIX+`/cid/${currentEpoch.epochId-1}/${top_pairs_7d_project_id}/`);
      console.log('got top pairs cid', response.data);
      if (response.data) {
        top_pairs_7d_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    }
    catch (e){
      console.error('top pairs cid', e);
    }
    try {
      response = await axios.get(API_PREFIX+`/data/${currentEpoch.epochId-1}/${top_pairs_project_id}/`);
      console.log('got pairs', response.data);
      pairsData = {
        block_height: epochInfo.blocknumber,
        block_timestamp_ms: epochInfo.timestamp*1000,
        block_timestamp: new Date(epochInfo.timestamp*1000),
        data: response.data.pairs,
        fullData: response.data.pairs,
        txHash: response.data.txHash,
        begin_block_timestamp_7d: 0,
        cid: response.data.cid
      };
      
      searchPairs();
      localStorage.removeItem('pooler_cf_force');
    }
    catch (e){
      console.error('pairs', e);
      if (!localStorage.getItem('pooler_cf_force')){
        localStorage.setItem('pooler_cf_force', 'true');
        location.reload();
      }
    }
  });

  function searchPairs(){
    //if (name)
    {
      pairsData.data = pairsData.fullData.filter(pair => {
        return pair.name.indexOf(name.toUpperCase()) != -1;
      });
    }
  }

  $: {
    console.log('got search', name);
    searchPairs();
  }

</script>

<svelte:head>
  <title>{APP_NAME} {V3 ? 'Pools' : 'Pairs'}</title>
</svelte:head>
{#if recentReset}
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="rounded-md bg-yellow-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/exclamation -->
      <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-yellow-800">Reset in progress</h3>
      <div class="mt-2 text-sm text-yellow-700">
        <p>We observed an issue with snapshotting and have reset the data - volume and other 24 hour data will catch up soon!</p>
      </div>
    </div>
  </div>
</div>
{/if}
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="pt-4">
<div class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6 ">
  <div class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
    <div class="ml-4 mt-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
        </div>
        <div class="ml-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Top {V3 ? 'Pools' : 'Pairs'}</h3>
          <p class="text-sm text-gray-500">
            {#if epochInfo}Synced to <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}"class="text-indigo-800" target="_blank">{epochInfo.epochEnd}</a> <Time relative timestamp={pairsData.block_timestamp} />{/if}
          </p>
        </div>
      </div>
    </div>
    <div class="ml-4 mt-4 flex-shrink-0 flex">
      <form class="space-y-8 divide-y divide-gray-200">
        <div class="mt-1 relative flex items-center">
          <input type="text" name="search" id="search"  placeholder="Search for Pairs" bind:value={name} class="px-2 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md">
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm" id="price-currency"> 🔎  </span>
          </div>
        </div>
      </form>
    </div>
    <div class="ml-4 mt-4 flex-shrink-0 flex">
      <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{top_pairs_cid}">
        <!-- Heroicon name: solid/phone -->
        <svg role="img" class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>IPFS icon</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"/></svg>
        <span> Data </span>
      </a>
      <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{top_pairs_7d_cid}">
        <!-- Heroicon name: solid/phone -->
        <svg role="img" class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>IPFS icon</title><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"/></svg>
        <span> 7d Data </span>
      </a>
      {#if pairsData.txHash}
      <a class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="{$anchorExplorerPrefix}/tx/{pairsData.txHash}#eventlog">
        <!-- Heroicon name: solid/mail -->
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
        <span> Proof </span>
      </a>
      {/if}
    </div>
  </div>
</div>
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
              {#if pairsData7d}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 7D
              </th>
              {/if}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 24H
              </th>
              {#if pairsData7d}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees 7D
              </th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each pairsData.data as pool, i}
            <tr class={(i+1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {i+1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {pool.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USDollar.format(pool.liquidity)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USDollar.format(pool.volume24h)}
              </td>
              {#if pairsData7d}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USDollar.format(pairsData7d[pool.name].volume7d)}
              </td>
              {/if}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USDollar.format(pool.fee24h)}
              </td>
              {#if pairsData7d}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {USDollar.format(pairsData7d[pool.name].fee7d)}
              </td>
              {/if}
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</div>
