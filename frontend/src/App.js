// App.js
import React, { useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./components/UserContext";

import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Payment from "./components/Payment";
import Navbar from "./components/Navbar";
require("@demox-labs/aleo-wallet-adapter-reactui/styles.css");

function App() {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Aleo Pay",
      }),
    ],
    []
  );

  return (
    <UserProvider>
      <WalletProvider
        wallets={wallets}
        decryptPermission={DecryptPermission.AutoDecrypt}
        network={WalletAdapterNetwork.Testnet}
        autoConnect
      >
        <WalletModalProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/profile" element={<Dashboard />} />
              <Route
                path="/payment/:apiKey/:walletAddress"
                element={<Payment />}
              />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </UserProvider>
  );
}

export default App;
