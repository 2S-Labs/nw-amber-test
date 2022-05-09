<script lang="ts">
  import { ethers, BigNumber } from 'ethers'
  import { divide, multiply, bignumber } from 'mathjs'
  import {
    getData,
    getCurrentPool,
    estimatePos,
    estimateNeg,
    addKctLiquidity,
  } from '@/blockchain/contracts/exchange'
  import { getPoolData, estimateSwap } from '@/blockchain/contracts/utils'
  import { mixTokenCA, paxTokenCA, mix_pax_lpTokenCA } from '@/blockchain/address/index'
  import { balanceOf } from '@/blockchain/contracts/lp'
  import { lpBalanceOf, myAddress } from '@/stores/index'

  let tokenAAmount: any = ''
  let tokenBAmount: any = ''

  async function getPoolInfo() {
    const data = await getPoolData(mix_pax_lpTokenCA)
    const reserveA = data.reserveA
    const reserveB = data.reserveB
    console.log(reserveA, reserveB)
    console.log(divide(bignumber(reserveA.toString()), bignumber(reserveB.toString())).toString())
    console.log(divide(bignumber(reserveB.toString()), bignumber(reserveA.toString())).toString())

    console.log(data)
  }

  async function tokenAEstimate() {
    if (tokenBAmount === null || tokenBAmount === 0) {
      tokenBAmount = 0
    } else {
      tokenBAmount = tokenBAmount.toString().replace(/(^0+)/, '')
    }
    const data = await getPoolData(mix_pax_lpTokenCA)
    const reserveA = data.reserveA
    const reserveB = data.reserveB
    const estimateTokenAValue = multiply(
      divide(bignumber(reserveA.toString()), bignumber(reserveB.toString())),
      bignumber(tokenBAmount.toString())
    )
    if (estimateTokenAValue.toString() === '0') {
      tokenAAmount = Number(estimateTokenAValue.toString())
    } else {
      tokenAAmount = Number(estimateTokenAValue.toString()).toFixed(6)
    }
  }

  async function tokenBEstimate() {
    if (tokenAAmount === null || tokenAAmount === 0) {
      tokenAAmount = 0
    } else {
      tokenAAmount = tokenAAmount.toString().replace(/(^0+)/, '')
    }
    const data = await getPoolData(mix_pax_lpTokenCA)
    const reserveA = data.reserveA
    const reserveB = data.reserveB
    const estimateTokenBValue = multiply(
      divide(bignumber(reserveB.toString()), bignumber(reserveA.toString())),
      bignumber(tokenAAmount.toString())
    )
    if (estimateTokenBValue.toString() === '0') {
      tokenBAmount = Number(estimateTokenBValue.toString())
    } else {
      tokenBAmount = Number(estimateTokenBValue.toString()).toFixed(6)
    }
  }

  async function makeLP() {
    const amountA = ethers.utils.parseEther(tokenAAmount.toString()).toString()
    const amountB = ethers.utils.parseEther(tokenBAmount.toString()).toString()
    console.log(amountA, amountB)
    await addKctLiquidity(amountA, amountB)
    $lpBalanceOf = Number(
      ethers.utils.formatEther(await balanceOf($myAddress))
    ).toFixed(6)
  }
</script>

<div class="box">
  <input
    type="number"
    name="token A"
    placeholder="PAX Token Amount"
    bind:value={tokenAAmount}
    on:keyup={tokenBEstimate}
  />
  <input
    type="number"
    name="token B"
    placeholder="MIX Token Amount"
    bind:value={tokenBAmount}
    on:keyup={tokenAEstimate}
  />
  <button on:click={getPoolInfo}>btn</button>
  <button on:click={makeLP}>Get Amber (Add Liquidity PAX-MIX)</button>
</div>

<style lang="scss">
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    input {
      width: 100%;
      height: 50px;
    }
    button {
      width: 100%;
      height: 50px;
    }
  }
</style>
