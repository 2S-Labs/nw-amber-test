<script lang="ts">
  import { ethers } from 'ethers'
  import { isConnect, myAddress, myAddressShort, lpBalanceOf } from '@/stores/index'
  import { klaytn } from '@/blockchain/chain/index'
  import { balanceOf } from '@/blockchain/contracts/lp'

  if (window.klaytn) {
    window.klaytn.on('accountsChanged', function () {
      connect()
    })
  }

  async function connect() {
    if (klaytn === undefined) {
      alert("There's no Kaikas. Please install Kaikas wallet.")
      return
    }
    klaytn.enable().then(() => {
      $isConnect = true
      $myAddress = klaytn.selectedAddress
      $myAddressShort = `${$myAddress.slice(0, 6)}...${$myAddress.slice(-4)}`
    })
    $lpBalanceOf = Number(
      ethers.utils.formatEther(await balanceOf(klaytn.selectedAddress))
    ).toFixed(6)
  }
</script>

<button on:click={connect}> connect </button>

{#if $isConnect}
  <div class="address">
    {$myAddress}
  </div>
  <div class="number">
    Amber: ${$lpBalanceOf}
  </div>
{/if}

<style lang="scss">
  button {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #000;
    font-size: 14px;
    font-weight: bold;
    padding: 5px 10px;
    margin: 10px;
  }
  .address {
    font-size: 14px;
    font-weight: bold;
    margin: 10px;
  }
  .number {
    font-size: 14px;
    font-weight: bold;
    margin: 10px;
  }
</style>
