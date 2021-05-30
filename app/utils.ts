import { web3 } from "@project-serum/anchor";

export async function newAccountWithLamports(connection: web3.Connection, lamports = 50e8): Promise<web3.Account> {
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
