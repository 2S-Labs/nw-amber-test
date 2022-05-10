import { ethers } from 'ethers'
// import Caver from 'caver-js'

const rpc = 'https://klaytn01.fandom.finance/'
// const caver = new Caver(rpc)
const provider = new ethers.providers.JsonRpcProvider(rpc)
const signer = provider.getSigner()
const klaytn = window.klaytn
const caver = window.caver

export {
  provider, signer, klaytn, caver
}