import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Payment() {
  const [wallet, setWallet] = useState();
  const [address, setAddress] = useState("");
  const [callBackUrl, setCallBackUrl] = useState("");
  const [subscriptionFee, setSubscriptionFee] = useState();
  const [details, setDetails] = useState("");
  const [user, setUser] = useState("");
  const { walletAddress } = useParams();
  const { apiKey } = useParams();

  const getKey = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/login?apiKey=${apiKey}`
      );
      setUser(res?.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getKey();
  }, [apiKey]);

  async function connectWallet() {
    console.log(walletAddress);
    const icpCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    const whitelist = [icpCanisterId];
    const publicKey = await window.ic.plug.requestConnect({ whitelist });
    console.log("Connected to ", publicKey);

    console.log(await window.ic.plug.isConnected());
    console.log(window.ic.plug.sessionManager.sessionData);
    console.log(window.ic.plug.sessionManager.sessionData.principalId);
    if (
      walletAddress === window.ic.plug.sessionManager.sessionData.principalId
    ) {
      setAddress(walletAddress);
    } else {
      alert("Wallet address is not correct");
    }
  }

  async function pay() {
    const transferArgs = {
      to: user?.walletAddress,
      amount: user.amount * (10 ** 8),
      memo: new Uint16Array(8),
    };
    console.log(user.amount * (10 ** 8));
    console.log(transferArgs)

    await window.ic.plug.requestTransfer(transferArgs);
    await axios.patch(`http://localhost:5000/api/update/${apiKey}/${address}`)
    const res = axios.get(
      `${user?.callBackUrl}?apiKey=${apiKey}&walletAddress=${walletAddress}&subscription=true`
    ); // call the call backurl with the payment details

  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h2>Payment</h2>
        <div className="dashboard-stats">
          <div className="stat">
            <div className="stat-value">{user?.amount}</div>
            <div className="stat-label">Subscription Fee</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user?.details}</div>
            <div className="stat-label">Details</div>
          </div>
          <div className="stat">
            <div className="stat-value">{user?.walletAddress}</div>
            <div className="stat-label">Owner</div>
          </div>
        </div>
        <div>
          <div className="stat">
            {address ? (
              <button onClick={pay}>Pay</button>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;

// http://localhost:3000/payment/c4555bb28d512410cbc49106dc4889e95894111e8d015903035fa2b6857cea5aacdbd5d0dbed5a4fefc9cfb5dfa1757050fbde5c76900f3ed174bf137858ed86/67cuo-dmpvr-2ixn7-x6ow6-yvgpg-nr5di-b5czp-hcl3w-wlanj-kr5uc-vqe
// 67cuo-dmpvr-2ixn7-x6ow6-yvgpg-nr5di-b5czp-hcl3w-wlanj-kr5uc-vqe
// 67cuo-dmpvr-2ixn7-x6ow6-yvgpg-nr5di-b5czp-hcl3w-wlanj-kr5uc-vqe
