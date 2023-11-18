import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import hmacSHA512 from "crypto-js/hmac-sha512";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";
import { idlFactory } from "./ledger.did";

function LandingPage() {
  const [wallet, setWallet] = useState();
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
  async function connectWallet() {
    const icpCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    const whitelist = [icpCanisterId];
    const publicKey = await window.ic.plug.requestConnect({ whitelist });
    console.log("Connected to ", publicKey);
    const icpActor = await window.ic.plug.createActor({
      canisterId: icpCanisterId,
      interfaceFactory: idlFactory,
    });

    console.log(window.ic.plug.sessionManager.sessionData.principalId);
    setWallet(await window.ic.plug.sessionManager.sessionData.principalId);
    console.log(await icpActor.icrc1_name());

    console.log(await window.ic.plug.isConnected());
    console.log(window.ic.plug.sessionManager.sessionData);
    {
      // publicKey && navigate("/profile");
    }
  }

  // add logic for generating API key
  function generateAPIKey() {
    const randomGenerator = Math.random().toString(36).slice(2);
    const apiKey = hmacSHA512(randomGenerator, wallet).toString();
    console.log(apiKey);
    setApiKey(apiKey);
  }

  const registerUser = async () => {
    if (!callBackUrl || !subscriptionFee || !details || !apiKey) {
      setError("Please fill in all required details.");
      return;
    }
    const data = {
      walletAddress: wallet,
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
        `http://localhost:5000/api/login?walletAddress=${wallet}`
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
      wallet && getKey();
    }
    {
      wallet && generateAPIKey();
    }
  }, [wallet]);

  return (
    <div className="landing-page">
      <div className="landing-page-container">
        <h1>Payment Gateway Service on ICP</h1>
        <p>
          Generate an API key after connecting your wallet and filling in the
          details.
        </p>
        {console.log(user)}
        {wallet ? (
          <div>
            <h1>Wallet Connected</h1>
            <p>Wallet Address: {wallet}</p>

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
            <button className="connect-wallet-button" onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
