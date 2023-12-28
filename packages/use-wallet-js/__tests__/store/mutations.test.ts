import { Store } from '@tanstack/store'
import { NetworkId } from 'src/network/constants'
import {
  State,
  addWallet,
  defaultState,
  removeWallet,
  setAccounts,
  setActiveAccount,
  setActiveNetwork,
  setActiveWallet
} from 'src/store'
import { WalletId } from 'src/wallets/supported/constants'

describe('Mutations', () => {
  let store: Store<State>

  beforeEach(() => {
    store = new Store<State>(defaultState)
  })

  describe('addWallet', () => {
    it('should add a new wallet and set it as active', () => {
      const walletId = WalletId.DEFLY
      const account = {
        name: 'Defly Wallet 1',
        address: 'address'
      }
      const walletState = {
        accounts: [account],
        activeAccount: account
      }

      addWallet(store, { walletId, wallet: walletState })

      const state = store.state
      expect(state.wallets.get(walletId)).toEqual(walletState)
      expect(state.activeWallet).toBe(walletId)
    })
  })

  describe('removeWallet', () => {
    beforeEach(() => {
      store = new Store<State>({
        ...defaultState,
        wallets: new Map([
          [
            WalletId.DEFLY,
            {
              accounts: [
                {
                  name: 'Defly Wallet 1',
                  address: 'address'
                }
              ],
              activeAccount: {
                name: 'Defly Wallet 1',
                address: 'address'
              }
            }
          ],
          [
            WalletId.PERA,
            {
              accounts: [
                {
                  name: 'Pera Wallet 1',
                  address: 'address'
                }
              ],
              activeAccount: {
                name: 'Pera Wallet 1',
                address: 'address'
              }
            }
          ]
        ]),
        activeWallet: WalletId.DEFLY
      })
    })

    it('should remove an active wallet', () => {
      const walletId = WalletId.DEFLY

      expect(store.state.wallets.get(walletId)).toBeDefined()
      expect(store.state.activeWallet).toBe(walletId)

      removeWallet(store, { walletId })
      expect(store.state.wallets.get(walletId)).toBeUndefined()

      // Active wallet should be null
      expect(store.state.activeWallet).toBeNull()
    })

    it('should remove a non-active wallet', () => {
      const walletId = WalletId.PERA
      const activeWallet = store.state.activeWallet

      expect(store.state.wallets.get(walletId)).toBeDefined()

      removeWallet(store, { walletId })
      expect(store.state.wallets.get(walletId)).toBeUndefined()

      // Active wallet should not change
      expect(store.state.activeWallet).toBe(activeWallet)
    })

    it('should do nothing if walletId is not in wallets map', () => {
      const walletId = WalletId.EXODUS
      const activeWallet = store.state.activeWallet

      expect(store.state.wallets.size).toBe(2)
      expect(store.state.wallets.get(walletId)).toBeUndefined()

      removeWallet(store, { walletId })
      expect(store.state.wallets.get(walletId)).toBeUndefined()

      // Wallets map should not change
      expect(store.state.wallets.size).toBe(2)

      // Active wallet should not change
      expect(store.state.activeWallet).toBe(activeWallet)
    })
  })

  describe('setActiveWallet', () => {
    // @todo: Should fail if walletId is not in wallets map
    it('should set the active wallet', () => {
      setActiveWallet(store, { walletId: WalletId.DEFLY })
      expect(store.state.activeWallet).toBe(WalletId.DEFLY)
    })

    it('should set the active wallet to null', () => {
      addWallet(store, {
        walletId: WalletId.DEFLY,
        wallet: {
          accounts: [
            {
              name: 'Defly Wallet 1',
              address: 'address'
            }
          ],
          activeAccount: {
            name: 'Defly Wallet 1',
            address: 'address'
          }
        }
      })
      expect(store.state.activeWallet).toBe(WalletId.DEFLY)

      setActiveWallet(store, { walletId: null })
      expect(store.state.activeWallet).toBeNull()
    })
  })

  describe('setActiveAccount', () => {
    it('should set the active account', () => {
      const walletId = WalletId.DEFLY
      const account1 = {
        name: 'Defly Wallet 1',
        address: 'address1'
      }
      const account2 = {
        name: 'Defly Wallet 2',
        address: 'address2'
      }
      const walletState = {
        accounts: [account1, account2],
        activeAccount: account1
      }

      addWallet(store, { walletId, wallet: walletState })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)

      setActiveAccount(store, { walletId, address: account2.address })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account2)
    })

    it('should do nothing if walletId is not in wallets map', () => {
      const walletId = WalletId.DEFLY
      const account1 = {
        name: 'Defly Wallet 1',
        address: 'address1'
      }
      const account2 = {
        name: 'Defly Wallet 2',
        address: 'address2'
      }
      const walletState = {
        accounts: [account1, account2],
        activeAccount: account1
      }

      addWallet(store, { walletId, wallet: walletState })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)

      setActiveAccount(store, { walletId: WalletId.EXODUS, address: 'exodusAddress' })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)
    })

    it('should do nothing if provided account is not found in wallet state', () => {
      const walletId = WalletId.DEFLY
      const account1 = {
        name: 'Defly Wallet 1',
        address: 'address1'
      }
      const account2 = {
        name: 'Defly Wallet 2',
        address: 'address2'
      }
      const walletState = {
        accounts: [account1, account2],
        activeAccount: account1
      }

      addWallet(store, { walletId, wallet: walletState })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)

      setActiveAccount(store, { walletId: WalletId.DEFLY, address: 'foo' })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)
    })
  })

  describe('setAccounts', () => {
    it('should set new accounts', () => {
      const walletId = WalletId.DEFLY
      const account1 = {
        name: 'Defly Wallet 1',
        address: 'address1'
      }
      const account2 = {
        name: 'Defly Wallet 2',
        address: 'address2'
      }
      const walletState = {
        accounts: [account1],
        activeAccount: account1
      }

      addWallet(store, { walletId, wallet: walletState })
      expect(store.state.wallets.get(walletId)?.accounts).toEqual([account1])

      const newAccounts = [account1, account2]
      setAccounts(store, { walletId, accounts: newAccounts })
      expect(store.state.wallets.get(walletId)?.accounts).toEqual(newAccounts)
    })

    it('should set the active account if previous active account is not in new accounts list', () => {
      const walletId = WalletId.DEFLY
      const account1 = {
        name: 'Defly Wallet 1',
        address: 'address1'
      }
      const account2 = {
        name: 'Defly Wallet 2',
        address: 'address2'
      }
      const account3 = {
        name: 'Defly Wallet 3',
        address: 'address3'
      }
      const walletState = {
        accounts: [account1],
        activeAccount: account1
      }

      addWallet(store, { walletId, wallet: walletState })
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account1)

      // New accounts list does not include active account (account1)
      const newAccounts = [account2, account3]
      setAccounts(store, { walletId, accounts: newAccounts })

      // Active account should be set to first account in new accounts list (account2)
      expect(store.state.wallets.get(walletId)?.activeAccount).toEqual(account2)
    })
  })

  describe('setActiveNetwork', () => {
    it('should set the active network', () => {
      // Default network is TESTNET
      expect(store.state.activeNetwork).toBe(NetworkId.TESTNET)

      const networkId = NetworkId.MAINNET
      setActiveNetwork(store, { networkId })
      expect(store.state.activeNetwork).toBe(networkId)
    })
  })
})
