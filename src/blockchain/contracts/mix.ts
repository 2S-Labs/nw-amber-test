import { ethers } from 'ethers'
import { provider } from '../chain/index'
import erc20ABIJSON from '../abi/ERC20.json'
import { klaytn, caver } from '../chain/index'

const mixCA = '0xdd483a970a7a7fef2b223c3510fac852799a88bf'
const erc20ABI: any = erc20ABIJSON

const mixContract = new ethers.Contract(mixCA, erc20ABI, provider)

async function mixBalanceOf(address: string) {
  const data = await mixContract.balanceOf(address)
  return data
}

async function mixApprove() {
  const mixContractCaver = new caver.klay.Contract(erc20ABI, mixCA)
  const data = await mixContractCaver.methods.approve('0x79612E8EB0602883ba0cceb0B0BB58015869eBB2', '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({ from: klaytn.selectedAddress, gas: 2500000 })
  console.log(data);
}

export {
  mixBalanceOf, mixApprove
}