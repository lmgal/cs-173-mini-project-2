import { TezosToolkit } from "@taquito/taquito"
import { useEffect, useState } from "react"
import { BeaconWallet } from "@taquito/beacon-wallet"

export const useTezos = (wallet: BeaconWallet | null) => {
    const [tezos, setTezos] = useState<TezosToolkit | null>(null)

    useEffect(() => {
        if (wallet) {
            const tezos = new TezosToolkit(import.meta.env.RPC_URL as string)
            tezos.setWalletProvider(wallet)
            setTezos(tezos)
        }
    }, [wallet])

    return { tezos }
}