<script context="module">
	export const prerender = true;
</script>

<script>
  import { LinkedChart, LinkedLabel, LinkedValue } from "svelte-tiny-linked-charts";
  import axios from "axios";
	import { onMount } from 'svelte';

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

  let pairsData = [];
  let tokenData = [];


  onMount(async () => {
    console.log('halo');
    let response = await axios.get('/v2-pairs.json');
    console.log('got pairs', response.data.length);
    pairsData = response.data.slice(0, 10);
    response = await axios.get('/tokens.json');
    console.log('got tokens', response.data.length);
    tokenData = response.data.slice(0, 10);
  });

</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<!-- This example requires Tailwind CSS v2.0+ -->
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
        <p class="text-2xl font-semibold text-gray-900">
          $2.31b
        </p>
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          65.62%
        </p>
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
        <p class="text-2xl font-semibold text-gray-900">
          $4.71m
        </p>
        <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
          <!-- Heroicon name: solid/arrow-sm-up -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Increased by
          </span>
          105.80%
        </p>
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
        <p class="text-2xl font-semibold text-gray-900">
          $3.78b
        </p>
        <p class="ml-2 flex items-baseline text-sm font-semibold text-red-600">
          <!-- Heroicon name: solid/arrow-sm-down -->
          <svg class="self-center flex-shrink-0 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <span class="sr-only">
            Decreased by
          </span>
          2.29%
        </p>
      </dd>
    </div>
  </dl>
</div>
<div class="py-4 flex justify-between">
  <h3 class="text-lg font-medium text-gray-900">
    Top Pairs
  </h3>
  <a href="/pairs"class="text-indigo-800">See all</a>
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
            {#each pairsData as pair}
            <tr class={pair.index%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.index}
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.volume_7d}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pair.fees_24h}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                {pair["1y_fees_liquidity"]}
              </td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
<div class="py-4 flex justify-between">
  <h3 class="text-lg font-medium text-gray-900">
    Top Tokens
  </h3>
  <a href="/tokens"class="text-indigo-800">See all</a>
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
                Price
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Change
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume 24H
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TVL
              </th>
            </tr>
          </thead>
          <tbody>
            {#each tokenData as token}
            <tr class={token.index%2 == 0 ? "bg-gray-50" : "bg-white"}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.index}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {token.name}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.symbol}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {token.volume_24h}
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
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

