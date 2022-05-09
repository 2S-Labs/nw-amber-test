import { ethers } from 'ethers'
import { provider, klaytn, caver } from '../chain/index'
import exchangeABIJSON from '../abi/Exchange.json'

const exchangeCA = '0x79612e8eb0602883ba0cceb0b0bb58015869ebb2'
const exchangeABI: any = exchangeABIJSON

const exchangeContract = new ethers.Contract(exchangeCA, exchangeABI, provider)
const exchangeContractCaver = new caver.klay.Contract(exchangeABI, exchangeCA)

async function getData() {
  const data = await exchangeContract.getReserves('0x79612e8eb0602883ba0cceb0b0bb58015869ebb2')
  return data
}

async function getCurrentPool() {
  const data = await exchangeContract.getCurrentPool()
  return data
}

async function estimatePos(token: string, amount: string) {
  const data = await exchangeContract.estimatePos(token, amount)
  return data
}

async function estimateNeg(token: string, amount: string) {
  const data = await exchangeContract.estimateNeg(token, amount)
  return data
}

async function addKctLiquidity(amountA: string, amountB: string) {
  const data = await exchangeContractCaver.methods.addKctLiquidity(amountA, amountB).send({ from: klaytn.selectedAddress, gas: 2500000 })
  console.log(data);
}

export {
  getData, getCurrentPool, estimatePos, estimateNeg, addKctLiquidity
}