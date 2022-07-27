<script context="module">
  export const prerender = true;
</script>

<script>
  import axios from "axios";
  import { onMount } from 'svelte';
  import Time from "svelte-time";

  let tokenData = {data:[], fullData:[]};
  const API_PREFIX = import.meta.env.VITE_API_PREFIX || 'static';
  let recentReset = import.meta.env.VITE_RECENT_RESET == 'true';
  const V3 = import.meta.env.VITE_UNISWAPV3 == 'true';
	const APP_NAME = import.meta.env.VITE_APP_NAME || 'Uniswap ' + (V3 ? 'V3' : 'V2');
  let name = '';

  onMount(async () => {
    name = location.search.substr(8);
    console.log('search', name);
    let response;
    try {
      response = await axios.get(API_PREFIX+'/v1/api/'+(V3 ? 'v3' : 'v2')+'-tokens');
      console.log('got tokens', response.data);
      tokenData = {
        block_height: response.data.block_height,
        block_timestamp: new Date(response.data.block_timestamp*1000),
        data: response.data.data,
        fullData: response.data.data,
        txHash: response.data.txHash,
        cid: response.data.cid
      }
      searchTokens();
      localStorage.removeItem('pooler_cf_force');
    }
    catch (e){
      console.error('tokens', e);
      if (!localStorage.getItem('pooler_cf_force')){
        localStorage.setItem('pooler_cf_force', 'true');
        location.reload();
      }
    }
  });

  function searchTokens(){
    //if (name)
    {
      tokenData.data = tokenData.fullData.filter(token => {
        return (token.symbol.indexOf(name.toUpperCase()) != -1 || token.name.toUpperCase().indexOf(name.toUpperCase()) != -1);
      });
    }
  }

  $: {
    console.log('got search', name);
    searchTokens();
  }
  
</script>

<svelte:head>
  <title>{APP_NAME} Tokens</title>
</svelte:head>
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
            <h3 class="text-lg leading-6 font-medium text-gray-900">Top Tokens</h3>
            <p class="text-sm text-gray-500">
              {#if tokenData.block_height}Synced to <a href="https://etherscan.io/block/{tokenData.block_height}"class="text-indigo-800" target="_blank">{tokenData.block_height}</a> <Time relative timestamp={tokenData.block_timestamp} />{/if}
            </p>
          </div>
        </div>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0 flex">
        <form class="space-y-8 divide-y divide-gray-200">
          <div class="mt-1 relative flex items-center">
            <input type="text" name="search" id="search"  placeholder="Search for Tokens" bind:value={name} class="px-2 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md">
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm" id="price-currency"> 🔎  </span>
            </div>
          </div>
        </form>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0 flex">
        <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{tokenData.cid}">
          <!-- Heroicon name: solid/phone -->
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span> IPFS </span>
        </a>
        <a class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://polygonscan.com/tx/{tokenData.txHash}#eventlog">
          <!-- Heroicon name: solid/mail -->
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          <span> Proof </span>
        </a>
      </div>
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
                Symbol
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              {#if !recentReset}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Change
              </th>
              {/if}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 24H
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Liquidity
              </th>
            </tr>
          </thead>
          <tbody>
            {#each tokenData.data as token, index}
            <tr class={(index+1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index+1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {token.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.symbol}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.price}
              </td>
              {#if !recentReset}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {#if (token.price_change_24h[0] == "+" || !isNaN(token.price_change_24h[0])) && token.price_change_24h != "0.0%"}
                <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <!-- Heroicon name: solid/arrow-sm-up -->
                  <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">
                    Increased by
                  </span>
                  {token.price_change_24h}
                </p>
                {:else if token.price_change_24h[0] == "-" && token.price_change_24h != "-0.0%"}
                <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                  <!-- Heroicon name: solid/arrow-sm-down -->
                  <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <span class="sr-only">
                    Decreased by
                  </span>
                  {token.price_change_24h}
                </p>
                {:else}
                <p class="ml-2 flex items-baseline text-sm font-semibold text-grey-600">
                  ~{isNaN(token.price_change_24h[0]) ? token.price_change_24h.substr(1): token.price_change_24h}
                </p>
                {/if}
              </td>
              {/if}
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.volume_24h}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.liquidity}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
