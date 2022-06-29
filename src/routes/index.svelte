<script context="module">
  export const prerender = true;
</script>

<script>
  import { LinkedChart, LinkedLabel, LinkedValue } from "svelte-tiny-linked-charts";
  import axios from "axios";
  import { onMount } from 'svelte';
  import Time from "svelte-time";

  let data = {
    "2005-01-01": 25,
    "2005-01-02": 20,
    "2005-01-03": 18,
    "2005-01-04": 17,
    "2005-01-05": 21
  }
  let data2 = {
    "2005-01-01": 25,
    "2005-01-02": 20,
    "2005-01-03": 18,
    "2005-01-04": 17,
    "2005-01-05": 21
  }

  let statsData = {
    "volume24": {
        "currentValue": "USD$1,280,000,000",
        "previousValue": "USD$980,000,000",
        "change": "30.61%"
    },
    "tvl": {
        "currentValue": "USD$4,670,000,000",
        "previousValue": "USD$5,370,000,000",
        "change": "-13.04%"
    },
    "fees24": {
        "currentValue": "USD$4,700,000",
        "previousValue": "USD$2,700,000",
        "change": "74.07%"
    }
  };
  let pairsData = {data:[]};
  let tokenData = {data:[]};
  const API_PREFIX = import.meta.env.VITE_API_PREFIX || 'static'; //change this to AXIOS config later 

  onMount(async () => {
    console.log('API', API_PREFIX);
    let response;
    try {
      response = await axios.get(API_PREFIX+'/v1/api/v2-daily-stats');
      console.log('got stats', response.data);
      statsData = response.data.data;
    }
    catch (e){
      console.error('stats', e);
    }
    try {
      response = await axios.get(API_PREFIX+'/v1/api/v2-pairs');
      console.log('got pairs', response.data);
      pairsData = {
        block_height: response.data.block_height,
        block_timestamp: new Date(response.data.block_timestamp*1000),
        data: response.data.data.slice(0, 10),
        txHash: response.data.txHash,
        cid: response.data.cid
      }
    }
    catch (e){
      console.error('pairs', e);
    }
    try {
      response = await axios.get(API_PREFIX+'/v1/api/v2-tokens');
      console.log('got tokens', response.data);
      tokenData = {
        block_height: response.data.block_height,
        block_timestamp: new Date(response.data.block_timestamp*1000),
        data: response.data.data.slice(0, 10),
        txHash: response.data.txHash,
        cid: response.data.cid
      }
    }
    catch (e){
      console.error('tokens', e);
    }
  });

</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<!-- This example requires Tailwind CSS v2.0+ -->
{#if 0}
<div>
  <!--
  <h3 class="text-lg leading-6 font-medium text-gray-900">
    Last 30 days
  </h3>
  -->
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/users -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Liquidity</p>
      </dt>
      <LinkedChart { data } />
    </div>

    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/mail-open -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Volume 24H</p>
      </dt>
      <LinkedChart data ={ data2 } fill="#2172E5" />
    </div>
  </dl>
</div>
{/if}
<div>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/users -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Volume 24H</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {statsData.volume24.currentValue ? statsData.volume24.currentValue : "$2.31b"}
        </p>
        {#if statsData.volume24.change == undefined || statsData.volume24.change.substr(0, 1) != "-"}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {statsData.volume24.change == undefined ? "65.62%" : statsData.volume24.change}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {statsData.volume24.change.substr(1)}
        </p>
        {/if}
      </dd>
    </div>

    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/cursor-click -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">TVL</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {statsData.tvl.currentValue ? statsData.tvl.currentValue : "$3.78b"}
        </p>
        {#if statsData.tvl.change == undefined || statsData.tvl.change.substr(0, 1) != "-"}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {statsData.tvl.change == undefined ? "65.62%" : statsData.tvl.change}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {statsData.tvl.change.substr(1)}
        </p>
        {/if}
      </dd>
    </div>

    <div class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
      <dt>
        <div class="absolute bg-indigo-500 rounded-md p-3">
          <!-- Heroicon name: outline/mail-open -->
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate">Fees 24H</p>
      </dt>
      <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
        <p class="text-xl font-semibold text-gray-900">
          {statsData.fees24.currentValue ? statsData.fees24.currentValue : "$$4.71m"}
        </p>
        {#if statsData.fees24.change == undefined || statsData.fees24.change.substr(0, 1) != "-"}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          {statsData.fees24.change == undefined ? "65.62%" : statsData.fees24.change}
        </p>
        {:else}
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          {statsData.fees24.change.substr(1)}
        </p>
        {/if}
      </dd>
    </div>

  </dl>
</div>
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
            {#each pairsData.data as pair, index}
            <tr class={(index+1)%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {index+1}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {pair.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.liquidity}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.volume_24h}
              </td>
              <!--
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.volume_7d}
              </td>
              -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.fees_24h}
              </td>
              <!--
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                {pair["1y_fees_liquidity"]}
              </td>
              -->
            </tr>
            {/each}
          </tbody>
      </table>
      <div class="">
        <a href="/pairs" class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"> View all </a>
      </div>
</div>
    </div>
  </div>
</div>
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
        <a class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://cloudflare-ipfs.com/ipfs/{tokenData.cid}">
          <!-- Heroicon name: solid/phone -->
          <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <span> IPFS </span>
        </a>
        <a class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" target="_blank" href="https://explorer-prost.powerloom.io/tx/{tokenData.txHash}">
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
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Change
              </th>
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
                {index}
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {#if token.price_change_24h[0] == "+"}
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
                {:else if token.price_change_24h[0] == "-"}
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
                  ~{token.price_change_24h}
                </p>
                {/if}
              </td>
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
        <div class="">
          <a href="/tokens" class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"> View all </a>
        </div>
        </div>
    </div>
  </div>
</div>

