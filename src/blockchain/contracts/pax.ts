import { ethers } from 'ethers'
import { provider } from '../chain/index'
import erc20ABIJSON from '../abi/ERC20.json'
import { klaytn, caver } from '../chain/index'

const paxCA = '0x95f04d09a8dc87edcf1ba6fed443993fa2466465'
const erc20ABI: any = erc20ABIJSON

const mixContract = new ethers.Contract(paxCA, erc20ABI, provider)

async function paxBalanceOf(address: string) {
  const data = await mixContract.balanceOf(address)
  return data
}

async function paxApprove() {
  const paxContractCaver = new caver.klay.Contract(erc20ABI, paxCA)
  const data = await paxContractCaver.methods.approve('0x79612E8EB0602883ba0cceb0B0BB58015869eBB2', '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({ from: klaytn.selectedAddress, gas: 2500000 })
  console.log(data);
}

export {
  paxBalanceOf, paxApprove
}