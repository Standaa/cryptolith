import React, {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import { Idl, Program, Provider, web3 } from "@project-serum/anchor";
import Wallet from "@project-serum/sol-wallet-adapter";

// import { PROVIDER_URL_KEY, NETWORK_URL_KEY } from "../../utils/solana";
// import { config } from "../../config";
// import idl from "../../../../derisk-anchor/target/idl/derisk_anchor.json";

const NETWORK_URL_KEY = "http://localhost:8899";
let WALLET_URL_KEY = "https://phantom.app/";
const PROGRAM_ID_KEY = "BTUP4TioquQzGDE9wD5qiTzPKQjDaaJNxHSdV3rD6JyM";

export type WalletContextValues = {
  provider: Provider;
  providerName: string;
  setProviderName: any;
  setNetworkUrl: any;
  wallet: any;
  // poolProgram: Program;
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

export default function WalletProvider(
  props: PropsWithChildren<ReactNode>
): ReactElement {
  const [providerName, setProviderName] = useState<string>("Phantom");
  const [networkUrl, setNetworkUrl] = useState(NETWORK_URL_KEY);

  //   const seed = "testSeed";
  // let userWallet: any;
  // let derivedAccount: web3.PublicKey;
  // let provider: Provider;
  // let cryptolithProgram: Program;

  const opts: web3.ConfirmOptions = {
    preflightCommitment: "singleGossip",
    commitment: "confirmed",
  };

  // const programId = new web3.PublicKey(config.programId);
  // const programId = new web3.PublicKey(PROGRAM_ID_KEY);

  const { provider, wallet, connection } = useMemo(() => {
    const opts: web3.ConfirmOptions = {
      preflightCommitment: "singleGossip",
      commitment: "singleGossip",
    };

    console.log("CALLED");

    let wallet;

    switch (providerName) {
      case "Phantom":
        if (window.solana && window.solana?.isPhantom) {
          wallet = window.solana;
          // Redirect to Phantom website
        } else {
          WALLET_URL_KEY = "https://phantom.app/";
          wallet = new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY);
        }
        break;
      case "Sollet":
        WALLET_URL_KEY = "https://www.sollet.io";
        wallet = new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY);
        break;
      default:
        WALLET_URL_KEY = "https://phantom.app/";
        wallet = new Wallet(WALLET_URL_KEY, NETWORK_URL_KEY);
    }

    const connection = new web3.Connection(NETWORK_URL_KEY, "root");
    const provider = new Provider(connection, wallet, opts);
    // const poolProgram = new Program(idl as Idl, programId, provider);

    return {
      provider,
      wallet,
      // poolProgram,
      connection,
    };
  }, [providerName, networkUrl]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        providerName,
        setProviderName,
        setNetworkUrl,
        wallet,
        // poolProgram,
        connection,
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
}
