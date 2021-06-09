import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Idl, Program, Provider, web3 } from "@project-serum/anchor";
import Wallet from "@project-serum/sol-wallet-adapter";

import { config } from "../../config";
import idl from "../../../target/idl/cryptolith.json";

const NETWORK_URL_KEY = "http://localhost:8899";
let WALLET_URL_KEY = "https://phantom.app/";

export type WalletContextValues = {
  provider: Provider;
  providerName: string;
  setProviderName: any;
  setNetworkUrl: any;
  connected: boolean;
  setConnected: any;
  wallet: any;
  cryptolithProgram: Program;
  connection: web3.Connection;
};

export function useWallet(): WalletContextValues {
  const w = useContext(WalletContext);
  if (!w) {
    throw new Error("Missing wallet context");
  }
  return w;
}

export const WalletContext = createContext<null | WalletContextValues>(null);

export default function WalletProvider(props: PropsWithChildren<ReactNode>): ReactElement {
  const [providerName, setProviderName] = useState<string>("Phantom");
  const [connected, setConnected] = useState<boolean>(false);
  const [networkUrl, setNetworkUrl] = useState(NETWORK_URL_KEY);

  const [wallet, setWallet] = useState();
  const programId = new web3.PublicKey(config.programId);

  const { provider, connection, cryptolithProgram } = useMemo(() => {
    const opts: web3.ConfirmOptions = {
      commitment: "confirmed",
    };

    switch (providerName) {
      case "Phantom":
        if (window.solana && window.solana?.isPhantom) {
          setWallet(window.solana);
          // Redirect to Phantom website
        } else {
          WALLET_URL_KEY = "https://phantom.app/";
          setWallet(new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY));
        }
        break;
      case "Sollet":
        WALLET_URL_KEY = "https://www.sollet.io";
        setWallet(new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY));
        break;
      default:
        WALLET_URL_KEY = "https://phantom.app/";
        setWallet(new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY));
    }

    const connection = new web3.Connection(NETWORK_URL_KEY, "root");
    const provider = new Provider(connection, wallet, opts);
    const cryptolithProgram = new Program(idl as Idl, programId, provider);

    return {
      provider,
      cryptolithProgram,
      connection,
    };
  }, [providerName, networkUrl]);

  useEffect(() => {
    if (wallet) {
      wallet.on("connect", () => {
        if (wallet?.publicKey) {
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length,
                )}`
              : walletPublicKey;

          console.log("Connected to:", keyToDisplay);
        }
      });

      wallet.on("disconnect", () => {
        console.log("Wallet disconnected");
      });
    }
  }, [wallet, connected]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        providerName,
        setProviderName,
        setNetworkUrl,
        wallet,
        connected,
        setConnected,
        cryptolithProgram,
        connection,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}
