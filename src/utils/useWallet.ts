import { useState, useEffect } from "react"
import { BeaconWallet } from "@taquito/beacon-wallet"

export const useWallet = () => {
    const [wallet, setWallet] = useState<BeaconWallet | null>(null)

    useEffect(() => {
        setWallet(new BeaconWallet({ 
            name: "Tezos Escrow Dapp" 
        }))
    }, [])

    const connectWallet = async () => {
        return await wallet?.requestPermissions({
            network: {
                // @ts-ignore
                type: "ghostnet",
            }
        })
    }

    const disconnectWallet = async () => {
        await wallet?.clearActiveAccount()
        setWallet(null)
    }

    const getActiveAccount = async () => {  
        const activeAccount = await wallet?.client.getActiveAccount()
        return activeAccount ? activeAccount.address : null
    }

    return { wallet, connectWallet, disconnectWallet, getActiveAccount }
}