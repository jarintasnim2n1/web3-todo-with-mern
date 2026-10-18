"use client";
import { createContext, useContext, useState } from "react";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [web3State, setWeb3State] = useState({
    web3: null,
    contract: null,
    account: null,
  });

  const saveState = ({ web3, contract, account }) => {
    setWeb3State({ web3, contract, account });
  };

  const clearState = () => {
    setWeb3State({ web3: null, contract: null, account: null });
  };

  return (
    <Web3Context.Provider value={{ web3State, saveState, clearState }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used inside Web3Provider");
  }
  return context;
}
