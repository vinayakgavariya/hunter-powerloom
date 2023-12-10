<script context="module">
  export const prerender = true;
</script>

<script>
  import {
    LinkedChart,
    LinkedLabel,
    LinkedValue,
  } from "svelte-tiny-linked-charts";
  import axios from "axios";
  import { onMount } from "svelte";
  import Time from "svelte-time";
  import { anchorExplorerPrefix, explorerPrefix } from "../stores.js";
  import AreaChart  from "../lib/components/AreaChart.svelte";
  import BarChart from "$lib/components/BarChart.svelte";

  let data = {
    "2005-01-01": 25,
    "2005-01-02": 20,
    "2005-01-03": 18,
    "2005-01-04": 17,
    "2005-01-05": 21,
  };
  let data2 = {
    "2005-01-01": 25,
    "2005-01-02": 20,
    "2005-01-03": 18,
    "2005-01-04": 17,
    "2005-01-05": 21,
  };

  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let statsData = null;
  let epochInfo = null;
  let pairsData = { data: [] };
  let pairsData7d = {};
  let pairsData7dSet = false;
  let tokenData = { data: [] };
  const API_PREFIX = import.meta.env.VITE_API_PREFIX || "static"; //change this to AXIOS config later
  let recentReset = import.meta.env.VITE_RECENT_RESET == "true";
  const V3 = import.meta.env.VITE_UNISWAPV3 == "true";
  const APP_NAME =
    import.meta.env.VITE_APP_NAME || "Uniswap " + (V3 ? "v3" : "v2");
  let showChangeData = true;
  let top_tokens_cid = "";
  let top_pairs_cid = "";
  let top_pairs_7d_cid = "";
  let stats_cid = "";
  let stats_project_id = import.meta.env.VITE_24H_STATS_PROJECT_ID;
  let top_tokens_project_id = import.meta.env.VITE_24H_TOP_TOKENS_PROJECT_ID;
  let top_pairs_project_id = import.meta.env.VITE_24H_TOP_PAIRS_PROJECT_ID;
  let top_pairs_7d_project_id = import.meta.env.VITE_7D_TOP_PAIRS_PROJECT_ID;

  onMount(async () => {
    console.log("API", API_PREFIX);

    let response;

    // NOTE: This flow for UI load is simplified a bit by assuming if all project IDs got finalized in last processed epoch.
    // It is however possible to build a more robust UI that can handle the case where some project IDs are not finalized yet.

    try {
      response = await axios.get(
        API_PREFIX + `/last_finalized_epoch/${stats_project_id}`
      );
      console.log("got last finalized epoch", response.data);
      if (response.data) {
        epochInfo = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("last finalized epoch", e);
    }

    try {
      response = await axios.get(
        API_PREFIX + `/data/${epochInfo.epochId}/${stats_project_id}/`
      );
      console.log("got stats", response.data);
      if (response.data) {
        statsData = response.data;
        if (!response.data.complete) {
          recentReset = true;
        }
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("stats", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/data/${epochInfo.epochId}/${top_pairs_7d_project_id}/`
      );
      console.log("got 7d top pairs", response.data);
      if (response.data) {
        if (response.data.complete) {
          for (let pair of response.data.pairs) {
            pairsData7d[pair.name] = pair;
          }
          pairsData7dSet = true;
        } else {
          console.warn("7 day data is not ready!");
        }
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("7d top pairs", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/cid/${epochInfo.epochId}/${top_tokens_project_id}/`
      );
      console.log("got top tokens cid", response.data);
      if (response.data) {
        top_tokens_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("top tokens cid", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/cid/${epochInfo.epochId}/${stats_project_id}/`
      );
      console.log("got stats cid", response.data);
      if (response.data) {
        stats_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("stats cid", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/cid/${epochInfo.epochId}/${top_pairs_project_id}/`
      );
      console.log("got top pairs cid", response.data);
      if (response.data) {
        top_pairs_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("top pairs cid", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/cid/${epochInfo.epochId}/${top_pairs_7d_project_id}/`
      );
      console.log("got 7d top pairs cid", response.data);
      if (response.data) {
        top_pairs_7d_cid = response.data;
      } else {
        throw new Error(JSON.stringify(response.data));
      }
    } catch (e) {
      console.error("7d top pairs cid", e);
    }
    try {
      response = await axios.get(
        API_PREFIX + `/data/${epochInfo.epochId}/${top_pairs_project_id}/`
      );
      console.log("got pairs", response.data);
      pairsData = {
        block_height: epochInfo.blocknumber,
        block_timestamp_ms: epochInfo.timestamp * 1000,
        block_timestamp: new Date(epochInfo.timestamp * 1000),
        data: response.data.pairs.slice(0, 10),
        txHash: 0,
        begin_block_timestamp_7d: 0,
        cid: 0,
      };

      localStorage.removeItem("pooler_cf_force");
    } catch (e) {
      console.error("pairs", e);
      if (!localStorage.getItem("pooler_cf_force")) {
        localStorage.setItem("pooler_cf_force", "true");
        location.reload();
      }
    }
    try {
      response = await axios.get(
        API_PREFIX + `/data/${epochInfo.epochId}/${top_tokens_project_id}/`
      );
      console.log("got tokens", response.data);
      tokenData = {
        block_height: epochInfo.blocknumber,
        block_timestamp_ms: epochInfo.timestamp * 1000,
        block_timestamp: new Date(epochInfo.timestamp * 1000),
        data: response.data.tokens.slice(0, 10),
        txHash: response.data.txHash,
        cid: response.data.cid,
      };
    } catch (e) {
      console.error("tokens", e);
    }
  });
</script>

<svelte:head>
  <title>{APP_NAME} Dashboard</title>
</svelte:head>

{#if recentReset}
  <!-- This example requires Tailwind CSS v2.0+ -->
  <div class="rounded-md bg-yellow-50 p-4">
    <div class="flex">
      <div class="flex-shrink-0">
        <!-- Heroicon name: solid/exclamation -->
        <svg
          class="h-5 w-5 text-yellow-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-yellow-800">Reset in progress</h3>
        <div class="mt-2 text-sm text-yellow-700">
          <p>
            This node recently started snapshotting from scratch - volume and
            other 24 hour data will catch up soon!
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

{#if statsData}
  <div class="rounded-md bg-gradient-to-r from-blue-200 to-blue-100 p-4">
  <div class="flex items-center">
    <div class="flex-shrink-0">
      <!-- Heroicon name: solid/information-circle -->
      <svg
        class="h-6 w-6 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="ml-4">
      <p class="text-sm text-gray-800">
        Explore detailed statistics for a curated selection of {V3 ? "pools" : "pairs"} known for high liquidity. More {V3 ? "pools" : "pairs"} will be dynamically supported soon!
      </p>
      <p class="mt-2 text-sm">
        <a href="/pairs" class="whitespace-nowrap font-medium text-blue-600 hover:text-blue-700">
          View Current {V3 ? "Pools" : "Pairs"}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  </div>
</div>

<div class="flex items-center justify-end">
  <a
    class="inline-flex items-center px-4 py-2 border border-indigo-500 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
    target="_blank"
    href="https://cloudflare-ipfs.com/ipfs/{stats_cid}"
  >
    <svg
      role="img"
      class="-ml-1 mr-2 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <title>IPFS icon</title>
      <path
        fill="currentColor"
        d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"
      />
    </svg>
    <span class="text-white">Explore Data</span>
  </a>
</div>



  <div>
    <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
      >
      <dt class="flex items-center">
        <div class="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full p-3">
            <!-- Heroicon name: outline/users -->
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
        </div>
        <p class="ml-4 text-lg font-semibold text-indigo-700">Volume 24H</p>
        <p class="ml-16 text-sm font-medium text-gray-500 truncate"></p>
    </dt>
    
        <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
          <p class="text-xl font-semibold text-gray-900">
            {USDollar.format(statsData.volume24h)}
          </p>
          {#if showChangeData}
            {#if statsData.volumeChange24h == undefined || statsData.volumeChange24h > 0}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
              >
                <!-- Heroicon name: solid/arrow-sm-up -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Increased by </span>
                {`${statsData.volumeChange24h.toFixed(2)}%`}
              </p>
            {:else}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-red-600"
              >
                <!-- Heroicon name: solid/arrow-sm-down -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Decreased by </span>
                {`${statsData.volumeChange24h.toFixed(2)}%`}
              </p>
            {/if}
          {/if}
        </dd>
      </div>

      <div
        class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
      >
      <dt class="flex items-center">
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-full p-3">
            <!-- Heroicon name: outline/cursor-click -->
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
        </div>
        <p class="ml-4 text-xl font-semibold text-indigo-800">Total Value Locked (TVL)</p>
    </dt>
    
    
    
    
        <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
          <p class="text-xl font-semibold text-gray-900">
            {USDollar.format(statsData.tvl)}
          </p>
          {#if showChangeData}
            {#if statsData.tvlChange24h == undefined || statsData.tvlChange24h > 0}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
              >
                <!-- Heroicon name: solid/arrow-sm-up -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Increased by </span>
                {`${statsData.tvlChange24h.toFixed(2)}%`}
              </p>
            {:else}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-red-600"
              >
                <!-- Heroicon name: solid/arrow-sm-down -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Decreased by </span>
                {`${statsData.tvlChange24h.toFixed(2)}%`}
              </p>
            {/if}
          {/if}
        </dd>
      </div>

      <div
        class="relative bg-white pt-5 px-4 pb-3 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
      >
      <dt class="flex items-center">
        <div class="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 rounded-full p-3">
            <!-- Heroicon name: outline/mail-open -->
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
        </div>
        <p class="ml-4 text-lg font-semibold text-indigo-700">Fees 24H</p>
    </dt>
    
        <dd class="ml-16 pb-6 flex items-baseline sm:pb-3">
          <p class="text-xl font-semibold text-gray-900">
            {USDollar.format(statsData.fee24h)}
          </p>
          {#if showChangeData}
            {#if statsData.feeChange24h == undefined || statsData.feeChange24h > 0}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
              >
                <!-- Heroicon name: solid/arrow-sm-up -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Increased by </span>
                {`${statsData.feeChange24h.toFixed(2)}%`}
              </p>
            {:else}
              <p
                class="ml-2 flex items-baseline text-sm font-semibold text-red-600"
              >
                <!-- Heroicon name: solid/arrow-sm-down -->
                <svg
                  class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only"> Decreased by </span>
                {`${statsData.feeChange24h.toFixed(2)}%`}
              </p>
            {/if}
          {/if}
        </dd>
      </div>
    </dl>
  </div>
{/if}
<!-- This example requires Tailwind CSS v2.0+ -->
<div class="pt-4">
  <div
    class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6"
  >
    <div
      class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap"
    >
      <div class="ml-4 mt-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path
                d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
              ></path></svg
            >
          </div>
          <div class="ml-4">
            <h3 class="text-lg leading-6 font-semibold text-indigo-600">
              Top {V3 ? "Pools" : "Pairs"}
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              {#if epochInfo}
                Synced to 
                <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}" class="text-indigo-800" target="_blank">
                  {epochInfo.epochEnd}
                </a>
                <Time relative timestamp={pairsData.block_timestamp} />
                {#if pairsData.block_timestamp_ms + 600000 < +new Date()}
                  <span class="text-orange-500">⏳</span>
                {/if}
              {/if}
            </p>
          </div>
          
        </div>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0 flex">
        <a
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          target="_blank"
          href="https://cloudflare-ipfs.com/ipfs/{top_pairs_cid}"
        >
          <!-- Heroicon name: solid/phone -->
          <svg
            role="img"
            class="-ml-1 mr-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><title>IPFS icon</title><path
              d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"
            /></svg
          >
          <span> Data </span>
        </a>
        {#if pairsData7dSet && top_pairs_7d_cid}
          <a
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            target="_blank"
            href="https://cloudflare-ipfs.com/ipfs/{top_pairs_7d_cid}"
          >
            <!-- Heroicon name: solid/phone -->
            <svg
              role="img"
              class="-ml-1 mr-2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              ><title>IPFS icon</title><path
                d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"
              /></svg
            >
            <span> 7d Data </span>
          </a>
        {/if}
        {#if pairsData.txHash}
          <a
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            target="_blank"
            href="{$anchorExplorerPrefix}/tx/{pairsData.txHash}#eventlog"
          >
            <!-- Heroicon name: solid/mail -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path></svg
            >
            <span> Proof </span>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-indigo-500 text-white">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Liquidity
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Volume 24H
              </th>
              {#if pairsData7dSet}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Volume 7D
                </th>
              {/if}
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Fees 24H
              </th>
              {#if pairsData7dSet}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Fees 7D
                </th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each pairsData.data as pair, index}
              <tr class={(index + 1) % 2 == 0 ? "bg-gray-50" : "bg-white"}>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {pair.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(pair.liquidity)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(pair.volume24h)}
                </td>
                {#if pairsData7dSet}
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {USDollar.format(pairsData7d[pair.name].volume7d)}
                  </td>
                {/if}
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(pair.fee24h)}
                </td>
                {#if pairsData7dSet}
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {USDollar.format(pairsData7d[pair.name].fee7d)}
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="mt-4">
          <a
            href="/pairs"
            class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-indigo-500 bg-white hover:bg-indigo-50 border border-indigo-500 rounded-md transition-all duration-300"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pt-4">
  <div
    class="bg-white px-4 py-5 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg sm:px-6"
  >
    <div
      class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap"
    >
      <div class="ml-4 mt-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg
              class="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path
                d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"
              ></path></svg
            >
          </div>
          <div class="ml-4">
            <h3 class="text-lg leading-6 font-semibold text-indigo-600">
              Top Tokens
            </h3>
            <p class="mt-1 text-sm text-gray-600">
              {#if epochInfo}
                Synced to 
                <a href="{$explorerPrefix}/block/{epochInfo.epochEnd}" class="text-indigo-800" target="_blank">
                  {epochInfo.epochEnd}
                </a>
                <Time relative timestamp={tokenData.block_timestamp} />
                {#if tokenData.block_timestamp_ms + 600000 < +new Date()}
                  <span class="text-orange-500">⏳</span>
                {/if}
              {/if}
            </p>
          </div>
          
        </div>
      </div>
      <div class="ml-4 mt-4 flex-shrink-0 flex">
        <a
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          target="_blank"
          href="https://cloudflare-ipfs.com/ipfs/{top_tokens_cid}"
        >
          <!-- Heroicon name: solid/phone -->
          <svg
            role="img"
            class="-ml-1 mr-2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><title>IPFS icon</title><path
              d="M12 0L1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 002.138 0l7.534 4.35a1.794 1.794 0 000 .403l-7.535 4.35a1.8 1.8 0 00-2.137 0l-7.536-4.35a1.795 1.795 0 000-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 00-1.069 1.852l-7.535 4.35a1.8 1.8 0 00-.349-.2l-.009-8.653a1.8 1.8 0 001.07-1.851zm-18.648.048l7.535 4.35a1.8 1.8 0 001.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 00-1.069-1.852v-8.7c.124-.054.24-.122.35-.202z"
            /></svg
          >
          <span> Data </span>
        </a>
        {#if tokenData.txHash}
          <a
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            target="_blank"
            href="{$anchorExplorerPrefix}/tx/{tokenData.txHash}#eventlog"
          >
            <!-- Heroicon name: solid/mail -->
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path></svg
            >
            <span> Proof </span>
          </a>
        {/if}
      </div>
    </div>
  </div>
</div>
<div class="flex flex-col">
  <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-indigo-500 text-white">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Symbol
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Price
              </th>
              {#if showChangeData}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Price Change
                </th>
              {/if}
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Volume 24H
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                Liquidity
              </th>
            </tr>
          </thead>
          <tbody>
            {#each tokenData.data as token, index}
              <tr class={(index + 1) % 2 == 0 ? "bg-gray-50" : "bg-white"}>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {token.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {token.symbol}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(token.price)}
                </td>
                {#if showChangeData}
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {#if token.priceChange24h >= 0}
                      <p
                        class="ml-2 flex items-baseline text-sm font-semibold text-green-600"
                      >
                        <!-- Heroicon name: solid/arrow-sm-up -->
                        <svg
                          class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="sr-only"> Increased by </span>
                        {`${token.priceChange24h.toFixed(2)}%`}
                      </p>
                    {:else if token.priceChange24h && token.priceChange24h != 0}
                      <p
                        class="ml-2 flex items-baseline text-sm font-semibold text-red-600"
                      >
                        <!-- Heroicon name: solid/arrow-sm-down -->
                        <svg
                          class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="sr-only"> Decreased by </span>
                        {`${token.priceChange24h.toFixed(2)}%`}
                      </p>
                    {/if}
                  </td>
                {/if}
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(token.volume24h)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {USDollar.format(token.liquidity)}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="mt-4">
          <a
            href="/tokens"
            class="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-600 rounded-md transition-all duration-300"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

   

  <!-- <BarChart/> -->

