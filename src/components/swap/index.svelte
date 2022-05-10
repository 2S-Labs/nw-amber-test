<script lang="ts">
  import { ethers, BigNumber } from 'ethers'
  import { divide, multiply, bignumber } from 'mathjs'
  import {
    getData,
    getCurrentPool,
    estimatePos,
    estimateNeg,
    addKctLiquidity,
    totalSupply,
  } from '@/blockchain/contracts/exchange'
  import { getPoolData, estimateSwap } from '@/blockchain/contracts/utils'
  import { mixTokenCA, paxTokenCA, mix_pax_lpTokenCA } from '@/blockchain/address/index'
  import { balanceOf } from '@/blockchain/contracts/lp'
  import { lpBalanceOf, myAddress } from '@/stores/index'
  import { paxApprove } from '@/blockchain/contracts/pax'
  import { mixApprove } from '@/blockchain/contracts/mix'

  let tokenAAmount: any = ''
  let tokenBAmount: any = ''
  let amberAmount: any = ''
  let estimateAmber: any = ''

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
    await estimateLPAmount()
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
    await estimateLPAmount()
  }

  async function makeLP() {
    const amountA = ethers.utils.parseEther(tokenAAmount.toString()).toString()
    const amountB = ethers.utils.parseEther(tokenBAmount.toString()).toString()
    console.log(amountA, amountB)
    await addKctLiquidity(amountA, amountB)
    $lpBalanceOf = Number(ethers.utils.formatEther(await balanceOf($myAddress))).toFixed(6)
  }

  async function approveMix() {
    await mixApprove()
  }

  async function approvePax() {
    await paxApprove()
  }

  async function estimateLPAmount() {
    const data = await getPoolData(mix_pax_lpTokenCA)
    const totalLp = await totalSupply()
    const totalLPSupply = bignumber(totalLp.toString())
    const reserveA = bignumber(data.reserveA.toString())
    const reserveB = bignumber(data.reserveB.toString())
    const amountA = bignumber(tokenAAmount.toString())
    const amountB = bignumber(tokenBAmount.toString())
    const valueA = divide(multiply(amountA, totalLPSupply), reserveA)
    const valueB = divide(multiply(amountB, totalLPSupply), reserveB)
    console.log(valueA.toString())
    console.log(valueB.toString())
    if (valueA > valueB) {
      console.log('valueA > valueB')
      estimateAmber = Number(valueB.toString()).toFixed(16)
    } else {
      console.log('valueA < valueB')
      estimateAmber = Number(valueA.toString()).toFixed(16)
    }
  }

  async function estimateTokenAmount() {
    const data = await getPoolData(mix_pax_lpTokenCA)
    const totalLp = await totalSupply()
    const totalLPSupply = bignumber(totalLp.toString())
    const reserveA = bignumber(data.reserveA.toString())
    const reserveB = bignumber(data.reserveB.toString())
    const amberAMT = bignumber(amberAmount)
    const estimateAAmount = divide(multiply(reserveA, amberAMT), totalLPSupply)
    const estimateBAmount = divide(multiply(reserveB, amberAMT), totalLPSupply)

    const estimateTokenBValue = multiply(divide(reserveB, reserveA), estimateAAmount)
    const estimateTokenAValue = multiply(divide(reserveA, reserveB), estimateBAmount)

    const estimateAvalueA = divide(multiply(estimateAAmount, totalLPSupply), reserveA)
    const estimateAvalueB = divide(multiply(estimateTokenBValue, totalLPSupply), reserveB)

    const estimateBvalueA = divide(multiply(estimateBAmount, totalLPSupply), reserveA)
    const estimateBvalueB = divide(multiply(estimateTokenAValue, totalLPSupply), reserveB)

    if (estimateAvalueA > estimateAvalueB) {
      console.log('estimateAvalueA > estimateAvalueB', false)
      // estimateAmber = Number(estimateAvalueB.toString()).toFixed(16)
    } else {
      console.log('estimateAvalueA < estimateAvalueB')
      tokenAAmount = Number(estimateAAmount.toString()).toFixed(6)
      tokenBAmount = Number(estimateTokenBValue.toString()).toFixed(6)
      estimateAmber = Number(estimateAvalueA.toString()).toFixed(16)
    }

    if (estimateBvalueA > estimateBvalueB) {
      console.log('estimateBvalueA > estimateBvalueB')
      tokenAAmount = Number(estimateTokenAValue.toString()).toFixed(6)
      tokenBAmount = Number(estimateBAmount.toString()).toFixed(6)
      estimateAmber = Number(estimateBvalueB.toString()).toFixed(16)
    } else {
      console.log('estimateBvalueA < estimateBvalueB', false)
      // estimateAmber = Number(estimateBvalueA.toString()).toFixed(16)
    }
  }
</script>

<div class="box">
  <button on:click={approvePax}>pax approve</button>
  <button on:click={approveMix}>mix approve</button>
  <input
    type="number"
    name="amber amount"
    placeholder="amber amount"
    bind:value={amberAmount}
    on:keyup={estimateTokenAmount}
  />
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
  <div class="estimate-amber">
    estimate amber: {estimateAmber}
  </div>
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
    .estimate-amber {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
