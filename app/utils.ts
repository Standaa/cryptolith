import { web3 } from "@project-serum/anchor";
import { Token, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function newAccountWithLamports(
  connection: web3.Connection,
  lamports = 50e8,
): Promise<web3.Account> {
  const account = new web3.Account();

  let retries = 30;

  console.log(`Request Airdrop`);
  await connection.requestAirdrop(account.publicKey, lamports);

  while (true) {
    await sleep(500);
    if (lamports == (await connection.getBalance(account.publicKey))) {
      console.log(`Airdrop finished after ${retries} retries`);
      return account;
    }
    if (--retries <= 0) {
      break;
    }
  }
  throw new Error(`Airdrop of ${lamports} failed`);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAssociatedAddress(connection: any, mintAddress: web3.PublicKey, wallet: any) {
  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mintAddress,
    wallet.publicKey,
  );

  /* Wallet is passed as an Account here. Any Tx call using the token instance will fail */
  //TODO: Replace by normal call when web3 supports being passed a Wallet Adapter interface
  const mint = new Token(connection, mintAddress, TOKEN_PROGRAM_ID, wallet);
  let userAssociatedTokenAddress;
  try {
    userAssociatedTokenAddress = await mint.getAccountInfo(associatedAddress);
  } catch (e) {}

  if (!userAssociatedTokenAddress) {
    console.log("No associated address with user wallet");
    let tx = new web3.Transaction().add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintAddress,
        associatedAddress, //Associated Address
        wallet.publicKey, //Owner
        wallet.publicKey, //Payer
      ),
    );

    let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    let signed = await wallet.signTransaction(tx);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);

    userAssociatedTokenAddress = await mint.getAccountInfo(associatedAddress);
  }

  return userAssociatedTokenAddress;
}
