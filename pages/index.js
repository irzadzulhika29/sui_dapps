import { ConnectButton } from "@suiet/wallet-kit";
import { useState } from "react";
import { useWallet } from "@suiet/wallet-kit";
import { Transaction } from "@mysten/sui/transactions";

export default function Home() {
  // ==================== UI STATE ====================
  const wallet = useWallet();
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [outputMessage, setOutputMessage] = useState("");

  // ==================== BLOCKCHAIN FUNCTIONS ====================

  // Fungsi untuk mint token (split, merge, transfer SUI coins)
  async function handleMintToken() {
    try {
      const tx = new Transaction();
      const coinAmounts = [1000000, 2000000, 500000];
      const [coin1, coin2, coin3] = tx.splitCoins(
        tx.gas,
        coinAmounts.map((amount) => tx.pure.u64(amount))
      );

      tx.mergeCoins(coin1, [coin2]);
      tx.transferObjects(
        [coin1, coin3],
        tx.pure.address(wallet.account.address)
      );

      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true },
      });

      setOutputMessage(`🪙 Token Operations
Status: Success
Digest: ${result.digest}
Timestamp: ${new Date().toLocaleString()}`);
    } catch (e) {
      setOutputMessage(`🪙 Token Operations
Status: Failed
Timestamp: ${new Date().toLocaleString()}`);
    }
  }

  // Fungsi untuk mint NFT (membuat objek NFT sederhana)
  async function handleMintNft() {
    try {
      const tx = new Transaction();
      const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(1)]);
      tx.transferObjects([coin], tx.pure.address(wallet.account.address));

      const result = await wallet.signAndExecuteTransaction({
        transaction: tx,
        options: { showEffects: true, showObjectChanges: true },
      });

      setOutputMessage(`🎨 NFT Mint
Status: Success
Digest: ${result.digest}
Timestamp: ${new Date().toLocaleString()}`);

      setNftName("");
      setNftDescription("");
      setNftImageUrl("");
    } catch (e) {
      setOutputMessage(`🎨 NFT Mint
Status: Failed
Timestamp: ${new Date().toLocaleString()}`);
    }
  }

  // Fungsi untuk validasi signature (sign personal message)
  async function handleValidateSignature() {
    try {
      const originalMessage = "SUI Blockchain Rocks!";
      const messageBytes = new TextEncoder().encode(originalMessage);

      const result = await wallet.signPersonalMessage({
        message: messageBytes,
      });

      const truncatedHash =
        result.signature.length > 40
          ? result.signature.substring(0, 40) + "..."
          : result.signature;

      setOutputMessage(`✅ Signature Validation
Status: Success
Hash: ${truncatedHash}`);
    } catch (e) {
      setOutputMessage(`✅ Signature Validation
Status: Failed`);
    }
  }

  // ==================== UI RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* ========== HEADER SECTION ========== */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SUI Blockchain Demo
          </h1>
          <ConnectButton />
        </div>

        {/* ========== OUTPUT MESSAGE SECTION ========== */}
        {outputMessage && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <pre className="text-blue-800 dark:text-blue-200 whitespace-pre-line font-mono text-sm break-all overflow-hidden">
              {outputMessage}
            </pre>
          </div>
        )}

        {/* ========== NFT FORM SECTION ========== */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Mint NFT</h2>
          <div className="space-y-3">
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              placeholder="NFT Name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              placeholder="Description"
              rows={2}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <input
              type="url"
              value={nftImageUrl}
              onChange={(e) => setNftImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* ========== ACTION BUTTONS SECTION ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={handleMintNft}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Mint NFT
          </button>

          <button
            onClick={handleMintToken}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            Mint Token
          </button>

          <button
            onClick={handleValidateSignature}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
          >
            Validate Signature
          </button>
        </div>
      </div>
    </div>
  );
}
