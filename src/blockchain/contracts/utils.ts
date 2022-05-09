import { ethers } from 'ethers'
import { provider } from '../chain/index'
import utilsABIJSON from '../abi/Utils.json'

const utilsCA = '0x7A74B3be679E194E1D6A0C29A343ef8D2a5AC876'
const utilsABI: any = utilsABIJSON

const utilsContract = new ethers.Contract(utilsCA, utilsABI, provider)

async function getPoolData(lp: string) {
  const data = await utilsContract.getPoolData(lp)
  return data
}

async function estimateSwap(tokenIn: string, tokenOut: string, amountIn: string) {
  const path: Array<string> = []
  const data = await utilsContract.estimateSwap(tokenIn, tokenOut, amountIn, path)
  return data
}

export {
  getPoolData, estimateSwap
}