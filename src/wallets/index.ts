import { BaseWallet } from './base'
import { DeflyWallet } from './defly'
import { ExodusWallet } from './exodus'
import { KmdWallet } from './kmd'
import { MnemonicWallet } from './mnemonic'
import { MyAlgoWallet } from './myalgo'
import { PeraWallet } from './pera'
import { WalletConnect } from './walletconnect'
import { WALLET_ID } from 'src/constants'

export type WalletMap = {
  [WALLET_ID.DEFLY]: typeof DeflyWallet
  [WALLET_ID.EXODUS]: typeof ExodusWallet
  [WALLET_ID.KMD]: typeof KmdWallet
  [WALLET_ID.MNEMONIC]: typeof MnemonicWallet
  [WALLET_ID.MYALGO]: typeof MyAlgoWallet
  [WALLET_ID.PERA]: typeof PeraWallet
  [WALLET_ID.WALLETCONNECT]: typeof WalletConnect
}

function createWalletMap(): WalletMap {
  return {
    [WALLET_ID.DEFLY]: DeflyWallet,
    [WALLET_ID.EXODUS]: ExodusWallet,
    [WALLET_ID.KMD]: KmdWallet,
    [WALLET_ID.MNEMONIC]: MnemonicWallet,
    [WALLET_ID.MYALGO]: MyAlgoWallet,
    [WALLET_ID.PERA]: PeraWallet,
    [WALLET_ID.WALLETCONNECT]: WalletConnect
  }
}

const allWallets = createWalletMap()

export { allWallets, BaseWallet, ExodusWallet, PeraWallet }
