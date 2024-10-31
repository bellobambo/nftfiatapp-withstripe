"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {
  ConnectButton,
  ConnectEmbed,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { client } from "./client";
import { chain } from "./chain";
import { getContractMetadata } from "thirdweb/extensions/common";
import { contract } from "../../utils/contract";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export default function Home() {
  const account = useActiveAccount();
  const { data: contractMetaData } = useReadContract(getContractMetadata, {
    contract: contract,
  });

  const [clientSecret, setClientSecert] = useState<string>("");

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw "Did you forget to add a .env.local file?";
  }

  const stripe = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );

  if (!account) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Strpe + Engine</h1>
        <ConnectEmbed
          client={client}
          chain={chain}
          showThirdwebBranding={false}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          border: "1px solid #333",
          borderRadius: "8px",
        }}
      >
        <ConnectButton client={client} chain={chain} />
        {contractMetaData && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              marginTop: "20px",
            }}
          >
            <MediaRenderer
              client={client}
              src={contractMetaData.image}
              style={{
                borderRadius: "5px",
              }}
            />
          </div>
        )}
        {!clientSecret ? (
          <button
            style={{
              marginTop: "20px",
              padding: "1rem 2rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "royalblue",
              width: "100%",
              cursor: "pointer",
            }}
          >
            Buy With Credit Card
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
