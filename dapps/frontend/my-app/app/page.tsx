'use client';

import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import {
  getBlockchainValue,
  getBlockchainEvents,
} from '@/services/blockchain.service';
import { useWriteContract } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/config/contracts";


export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const [value, setValue] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync } = useWriteContract();


  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const v = await getBlockchainValue();
        const e = await getBlockchainEvents();
        setValue(v);
        setEvents(e);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

    async function handleSetValue() {
  if (!isConnected) return;

  try {
    await writeContractAsync({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: "setValue",
      args: [123n],
    });

    alert("Transaksi dikirim. Tunggu confirm.");
  } catch (e) {
    console.error(e);
    alert("Transaksi gagal");
  }
}
 

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="p-6 border rounded space-y-6 w-full max-w-2xl">
        <h1 className="text-xl font-bold">Connect Wallet + Read Backend</h1>

        {!isConnected ? (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Connected address:</p>
            <p className="font-mono text-xs break-all">{address}</p>

            <button
              onClick={() => disconnect()}
              className="text-sm underline text-red-600"
            >
              Disconnect
            </button>
          </div>
        )}
        <button
            onClick={handleSetValue}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Set Value 123
          </button>

        <div className="space-y-3">
          <h2 className="font-semibold">Backend Blockchain Data</h2>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              <div>
                <p className="text-sm font-semibold">Latest Value</p>
                <pre className="text-xs overflow-auto border p-3 rounded">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </div>

              <div>
                <p className="text-sm font-semibold">Events</p>
                <pre className="text-xs overflow-auto border p-3 rounded">
                  {JSON.stringify(events, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
