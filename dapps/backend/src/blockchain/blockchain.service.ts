import { Injectable } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import SIMPLE_STORAGE from './simple-storage.json';

@Injectable()
export class BlockchainService {
  private client;
  private contractAddress: `0x${string}`;

  constructor() {
    this.client = createPublicClient({
      chain: avalancheFuji,
      transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
    });

    // GANTI dengan address hasil deploy Day 2
    // eslint-disable-next-line prettier/prettier
    this.contractAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B' as `0x${string}`;
  }

  // 🔹 Read latest value
  async getLatestValue() {
    const value = await this.client.readContract({
      address: this.contractAddress,
      abi: SIMPLE_STORAGE.abi,
      functionName: 'getValue',
    });

    return {
      value: value.toString(),
    };
  }

  // 🔹 Read ValueUpdated events
  async getValueUpdatedEvents(fromBlock: number, toBlock: number) {
    const events = await this.client.getLogs({
      address: this.contractAddress,
      event: {
        type: 'event',
        name: 'ValueUpdated',
        inputs: [
          {
            name: 'newValue',
            type: 'uint256',
            indexed: false,
          },
        ],
      },
      fromBlock: 50612525n, 
      toBlock: 50613000n,
    });

    return events.map((event) => ({
      blockNumber: event.blockNumber?.toString(),
      value: event.args.newValue.toString(),
      txHash: event.transactionHash,
    }));
  }
}