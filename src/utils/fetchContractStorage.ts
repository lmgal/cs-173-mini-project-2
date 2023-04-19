import axios from "axios"

type address = string
type ContractStorage = {
    epoch: string,
    owner: address,
    fromOwner: number,
    balanceOwner: number,
    counterparty: address,
    hashedSecret: string,
    fromCounterparty: number,
    balanceCounterparty: number
}

export const fetchContractStorage = async () => {
    const { data } = await axios.get(process.env.CONTRACT_STORAGE_URL as string)
    return {
        epoch: data.epoch,
        owner: data.owner,
        fromOwner: Number.parseFloat(data.fromOwner),
        balanceOwner: Number.parseFloat(data.balanceOwner),
        counterparty: data.counterparty,
        hashedSecret: data.hashedSecret,
        fromCounterparty: Number.parseFloat(data.fromCounterparty),
        balanceCounterparty: Number.parseFloat(data.balanceCounterparty)
    } as ContractStorage
}