import React, { FC, useMemo, useState, useEffect, useCallback } from "react";
import { WalletNotConnectedError } from "@demox-labs/aleo-wallet-adapter-base";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import "./LandingPage.css";
import hmacSHA512 from "crypto-js/hmac-sha512";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";

function LandingPage() {
  const [address, setAddress] = useState();
  const [apiKey, setApiKey] = useState(null);
  //
  const { user, updateUser } = useUser();
  //
  const [callBackUrl, setCallBackUrl] = useState("");
  const [subscriptionFee, setSubscriptionFee] = useState(0);
  const [details, setDetails] = useState("");
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  // add logic for connecting wallet
  const ConnectWallet = async () => {
    console.log(publicKey, wallet);
    const program = "credits.aleo";
    const records = await requestRecords(program);
    console.log(records, "RECORDS");
    setAddress(publicKey);
  };

  const { wallet, publicKey, requestRecords, connect } = useWallet();

  // add logic for generating API key
  function generateAPIKey() {
    const randomGenerator = Math.random().toString(36).slice(2);
    const apiKey = hmacSHA512(randomGenerator, address).toString();
    console.log(apiKey);
    setApiKey(apiKey);
  }

  const registerUser = async () => {
    if (!callBackUrl || !subscriptionFee || !details || !apiKey) {
      setError("Please fill in all required details.");
      return;
    }
    const data = {
      walletAddress: address,
      amount: subscriptionFee,
      details: details,
      callBackUrl: callBackUrl,
      apiKey: apiKey,
    };
    try {
      const res = await axios.post("http://localhost:5000/api/register", data);
      {
        updateUser(res?.data.user);
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const getKey = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/login?walletAddress=${address}`
      );
      updateUser(res?.data.user);
      {
        res?.data.exists && navigate("/profile");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleClick = () => {
    navigate("/profile");
  };
  useEffect(() => {
    // call the backend api with wallet address and user profile

    {
      address && getKey();
    }
    {
      address && generateAPIKey();
    }
  }, [address]);

  let [balance, setBalance] = useState();

  // useEffect(() => {
  //   if (publicKey && !balance) {
  //     requestRecords('credits.aleo').then((res) => {
  //       const filteredRecords = res.filter((rec) => {
  //         return !rec.spent;
  //       });
  //       let recordsFormatted = filteredRecords.map((rec) =>
  //         JSON.parse(JSON.stringify(rec, null, 2)),
  //       );
  //       let balance = 0;
  //       recordsFormatted = recordsFormatted.map((elem) => {
  //         const currentRecord =
  //           parseInt(elem.data.microcredits.replace(/[^\d]/g, ''), 10) /
  //           100000000;
  //         balance += currentRecord;
  //         return currentRecord;
  //       });
  //       setBalance(balance);
  //     });
  //   }
  // }, []);

  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <h1>Payment Gateway Service on ALEO</h1>
        <p>
          Generate an API key after connecting your wallet and filling in the
          details.
        </p>
        {console.log(user)}
        {address ? (
          <div>
            <h1>Wallet Connected</h1>
            <p>Wallet Address: {address.substring(0, 15)}...</p>

            {user ? (
              <button className="profile-button" onClick={handleClick}>
                My Profile
              </button>
            ) : (
              <div>
                <label>Enter Details for your customer</label>
                <input
                  type="text"
                  placeholder="Enter Details for your customer"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
                <label>Enter Subscription Fee</label>
                <input
                  type="number"
                  placeholder="Enter Subscription Fee"
                  value={subscriptionFee}
                  onChange={(e) => setSubscriptionFee(e.target.value)}
                  required
                />
                <label>Enter callback url</label>
                <input
                  type="text"
                  placeholder="Enter callback url"
                  value={callBackUrl}
                  onChange={(e) => setCallBackUrl(e.target.value)}
                  required
                />
                <div className="button-container">
                  <button
                    className="generate-api-key-button"
                    onClick={registerUser}
                  >
                    Generate API Key
                  </button>
                </div>{" "}
              </div>
            )}
            {error && <p className="error-message">{error}</p>}
          </div>
        ) : (
          <div>
            <h1>Connect Wallet</h1>
            <p>Connect your wallet to continue</p>
            <button className="connect-wallet-button" onClick={ConnectWallet}>
              {" "}
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
