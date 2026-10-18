"use client";
import { useRouter } from "next/navigation";
import Web3 from "web3";
import ABI from "@/lib/ABI.json";
import { useWeb3 } from "@/context/Web3Context";

const CONTRACT_ADDRESS = "0x795e47574f11055806e294f1b95090cd46ececdd";

export default function WalletPage() {
  const router = useRouter();
  const { saveState, web3State } = useWeb3();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask found na! Please MetaMask install koro.");
        return;
      }
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
      saveState({ web3, contract, account: accounts[0] });
      router.push("/view-all-tasks");
    } catch (error) {
      console.error(error);
      alert("Wallet connect hoyni. Please try again.");
    }
  };

  return (
    <div>
      <div className="wallet_header">
        <span>WELCOME TO</span>
        <p>TODO 3.0</p>
      </div>

      <div className="connect_wallet_section todo_btn">
        {web3State.account ? (
          <div>
            <div className="wallet_info">
              <div className="wallet_dot"></div>
              <span>Connected: </span>
              <span className="wallet_address">{web3State.account}</span>
            </div>
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => router.push("/view-all-tasks")}>
                Go to App →
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>Please connect your MetaMask wallet to use the app</p>
            <button onClick={connectWallet}>🦊 Connect MetaMask</button>
          </div>
        )}
      </div>
    </div>
  );
}
