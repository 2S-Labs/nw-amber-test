import { ethers } from 'ethers'
import { provider } from '../chain/index'
import erc20ABIJSON from '../abi/ERC20.json'

const lpCA = '0x79612e8eb0602883ba0cceb0b0bb58015869ebb2'
const erc20ABI: any = erc20ABIJSON

const lpContract = new ethers.Contract(lpCA, erc20ABI, provider)

async function balanceOf(address: string) {
  const data = await lpContract.balanceOf(address)
  return data
}

export {
  balanceOf
}