import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { PASSDOWN_ABI, PASSDOWN_ADDRESS } from './constants';

type SupportedNetwork = keyof typeof PASSDOWN_ADDRESS;
const supportedNetworks: SupportedNetwork[] = ['baseSepolia'];


function readContract(network: string, contractAddress: string, contractAbi: any, contractMethod: string, contractParams: any) {
    const chain = getChain(network);
    const publicClient = createPublicClient({
        chain,
        transport: http(),
    });
    return publicClient.readContract(
        {
            address: contractAddress as `0x${string}`,
            abi: contractAbi,
            functionName: contractMethod,
            args: [...contractParams],
        }
    );
}

export function getUserWills(walletAddress: string) {
    let resPromises = [];
    for (let network of supportedNetworks) {
        const resPromise = readContract(network, PASSDOWN_ADDRESS[network], PASSDOWN_ABI, 'getUserWills', [walletAddress]);
        resPromises.push(resPromise);
    }
    return Promise.all(resPromises);
}

export function getChain(network: string) {
    switch (network) {
        case 'baseSepolia':
            return baseSepolia;
        default:
            return baseSepolia;
    }
}