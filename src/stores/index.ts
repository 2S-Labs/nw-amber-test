import { writable } from 'svelte/store'

export const klaytn: any = writable(null)
export const caver: any = writable(null)
export const isConnect: any = writable(false)
export const myAddress: any = writable(null)
export const myAddressShort: any = writable('0x0000...0000')
export const lpBalanceOf: any = writable(0)