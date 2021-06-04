import assert from "assert";
import { web3, Provider, workspace, setProvider, BN, Wallet } from "@project-serum/anchor";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

describe("cryptolith", () => {
  const provider = Provider.local();
  // Configure the client to use the local cluster.
  setProvider(provider);
  // Program for the tests.
  const cryptolithProgram = workspace.Cryptolith;
  // @ts-expect-error
  const payer = provider.wallet.payer as web3.Account;
  const CRYPTOLITH_SEED = Buffer.from("WELCOMETOTHECRYPTOLITHICAGE");
  const CRYPTOLITHN_SEED = Buffer.from("PAMPIT");

  let cryptolithAuthority: web3.PublicKey;
  let nonce: number;
  let lithTokenMint: Token;
  let lithTokenAccount: web3.PublicKey;
  let userAssociatedAddress: web3.PublicKey;

  before(async () => {
    const [_cryptolithAuthority, _nonce] = await web3.PublicKey.findProgramAddress(
      [CRYPTOLITH_SEED],
      cryptolithProgram.programId,
    );

    cryptolithAuthority = _cryptolithAuthority;
    nonce = _nonce;

    lithTokenMint = await Token.createMint(
      provider.connection,
      payer,
      cryptolithAuthority,
      null,
      8,
      TOKEN_PROGRAM_ID,
    );

    console.log("lithTokenMint", (await lithTokenMint.getMintInfo()).mintAuthority.toBase58());

    lithTokenAccount = await lithTokenMint.createAccount(cryptolithAuthority);
    userAssociatedAddress = await lithTokenMint.createAssociatedTokenAccount(provider.wallet.publicKey);

    console.log("lithTokenAccount", lithTokenAccount.toBase58());
    console.log("userAssociatedAddress", userAssociatedAddress.toBase58());
  });

  it("Initializes Cryptolith State correctly", async () => {
    await cryptolithProgram.state.rpc.new({
      accounts: {},
    });

    await cryptolithProgram.state.rpc.initialize(
      nonce,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      {
        accounts: {
          lithTokenMint: lithTokenMint.publicKey,
          lithTokenAccount: lithTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          lithTokenMintAuthority: cryptolithAuthority,
        },
      },
    );

    const cryptolithStateAfterInit = await cryptolithProgram.state.fetch();
    assert.ok(cryptolithStateAfterInit.nonce === nonce);
    assert.ok(cryptolithStateAfterInit.signer.equals(provider.wallet.publicKey));
    assert.ok(cryptolithStateAfterInit.authority.equals(provider.wallet.publicKey));
    assert.ok(cryptolithStateAfterInit.lithTokenMint.equals(lithTokenMint.publicKey));
    assert.ok(cryptolithStateAfterInit.lithTokenAccount.equals(lithTokenAccount));
    assert.ok(cryptolithStateAfterInit.lithTotalSupply.toNumber() === 10e7);

    const lithTokenAccountAfterMint = await lithTokenMint.getAccountInfo(lithTokenAccount);
    // @ts-ignore
    assert.ok(lithTokenAccountAfterMint.amount.toNumber() === 10e7);
  });

  it("Creates a new Cryptolith", async () => {
    const [_cryptolithAuthority, _nonce] = await web3.PublicKey.findProgramAddress(
      [CRYPTOLITHN_SEED],
      cryptolithProgram.programId,
    );

    cryptolithAuthority = _cryptolithAuthority;
    nonce = _nonce;

    const lithnTokenMint = await Token.createMint(
      provider.connection,
      payer,
      cryptolithAuthority,
      null,
      8,
      TOKEN_PROGRAM_ID,
    );

    console.log("lithnTokenMint", (await lithnTokenMint.getMintInfo()).mintAuthority.toBase58());
    const lithnTokenAccount = await lithnTokenMint.createAccount(cryptolithAuthority);
    const userLithnAssociatedAddress = await lithnTokenMint.createAssociatedTokenAccount(
      provider.wallet.publicKey,
    );

    console.log("lithnTokenAccount", lithnTokenAccount.toBase58());
    console.log("userLithnAssociatedAddress", userLithnAssociatedAddress.toBase58());

    console.log("lithnTokenMint.publicKey", lithnTokenMint.publicKey.toBase58());

    await cryptolithProgram.state.rpc.createCryptolith({
      accounts: {
        lithnTokenMint: lithnTokenMint.publicKey,
        // authority: provider.wallet.publicKey,
      },
    });

    assert.ok(true);
  });

  // it("Deposits a first time from wallet to user account", async () => {
  //   const cryptolithStateAfterInit = await cryptolithProgram.state();
  //   const mintAddress: web3.PublicKey = cryptolithStateAfterInit.lithTokenMint;

  //   // Refetch the token instead of getting lithTokenMint directly
  //   const lithTokenMintAfterInit = new Token(provider.connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  //   await cryptolithProgram.state.rpc.deposit(new BN(50000), {
  //     accounts: {
  //       lithTokenMintAuthority: cryptolithAuthority,
  //       lithTokenAccount: lithTokenAccount,
  //       userAssociatedTokenAccount: userAssociatedAddress,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     },
  //   });

  //   const lithTokenAccountAfterDeposit = await lithTokenMintAfterInit.getAccountInfo(lithTokenAccount);

  //   const userTokenAccountAfterDeposit = await lithTokenMintAfterInit.getAccountInfo(userAssociatedAddress);

  //   const cryptolithStateAfterDepositAfterInit = await cryptolithProgram.state();

  //   assert.ok(lithTokenAccountAfterDeposit.amount.toNumber() === 99950000);
  //   assert.ok(userTokenAccountAfterDeposit.amount.toNumber() === 50000);
  //   assert.ok(cryptolithStateAfterDepositAfterInit.collateralBalance.toNumber() === 50000);
  // });

  // it("Deposits a second time from wallet to user account", async () => {
  //   const cryptolithStateAfterInit = await cryptolithProgram.state();
  //   const mintAddress: web3.PublicKey = cryptolithStateAfterInit.lithTokenMint;

  //   // Refetch the token instead of getting lithTokenMint directly
  //   const lithTokenMintAfterInit = new Token(provider.connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  //   await cryptolithProgram.state.rpc.deposit(new BN(50000), {
  //     accounts: {
  //       lithTokenMintAuthority: cryptolithAuthority,
  //       lithTokenAccount: lithTokenAccount,
  //       userAssociatedTokenAccount: userAssociatedAddress,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //     },
  //   });

  //   const lithTokenAccountAfterDeposit = await lithTokenMintAfterInit.getAccountInfo(lithTokenAccount);

  //   const userTokenAccountAfterDeposit = await lithTokenMintAfterInit.getAccountInfo(userAssociatedAddress);

  //   const cryptolithStateAfterDepositAfterInit = await cryptolithProgram.state();

  //   assert.ok(lithTokenAccountAfterDeposit.amount.toNumber() === 99900000);
  //   assert.ok(userTokenAccountAfterDeposit.amount.toNumber() === 100000);
  //   assert.ok(cryptolithStateAfterDepositAfterInit.collateralBalance.toNumber() === 100000);
  // });

  // it("Should return an error if deposit is zero", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.deposit(new BN(0), {
  //       accounts: {
  //         lithTokenMintAuthority: cryptolithAuthority,
  //         lithTokenAccount: lithTokenAccount,
  //         userAssociatedTokenAccount: userAssociatedAddress,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Cannot deposit zero");
  // });

  // it("Withdraws a first time from user account to wallet", async () => {
  //   const cryptolithStateAfterInit = await cryptolithProgram.state();
  //   const mintAddress: web3.PublicKey = cryptolithStateAfterInit.lithTokenMint;

  //   const lithTokenMintAfterInit = new Token(provider.connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  //   await cryptolithProgram.state.rpc.withdraw(new BN(10), {
  //     accounts: {
  //       lithTokenMintAuthority: cryptolithAuthority,
  //       lithTokenAccount: lithTokenAccount,
  //       userAssociatedTokenAccount: userAssociatedAddress,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const lithTokenAccountAfterWithdrawal = await lithTokenMintAfterInit.getAccountInfo(lithTokenAccount);
  //   const userTokenAccountAfterWithdrawal = await lithTokenMintAfterInit.getAccountInfo(
  //     userAssociatedAddress,
  //   );

  //   const cryptolithStateAfterWithdrawalAfterInit = await cryptolithProgram.state();

  //   assert.ok(lithTokenAccountAfterWithdrawal.amount.toNumber() === 99900010);
  //   assert.ok(userTokenAccountAfterWithdrawal.amount.toNumber() === 99990);
  //   assert.ok(cryptolithStateAfterWithdrawalAfterInit.collateralBalance.toNumber() === 99990);
  // });

  // it("Withdraws a second time from user account to wallet", async () => {
  //   const cryptolithStateAfterInit = await cryptolithProgram.state();
  //   const mintAddress: web3.PublicKey = cryptolithStateAfterInit.lithTokenMint;

  //   const lithTokenMintAfterInit = new Token(provider.connection, mintAddress, TOKEN_PROGRAM_ID, payer);

  //   await cryptolithProgram.state.rpc.withdraw(new BN(10), {
  //     accounts: {
  //       lithTokenMintAuthority: cryptolithAuthority,
  //       lithTokenAccount: lithTokenAccount,
  //       userAssociatedTokenAccount: userAssociatedAddress,
  //       tokenProgram: TOKEN_PROGRAM_ID,
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const lithTokenAccountAfterWithdrawal = await lithTokenMintAfterInit.getAccountInfo(lithTokenAccount);
  //   const userTokenAccountAfterWithdrawal = await lithTokenMintAfterInit.getAccountInfo(
  //     userAssociatedAddress,
  //   );

  //   const cryptolithStateAfterWithdrawalAfterInit = await cryptolithProgram.state();

  //   assert.ok(lithTokenAccountAfterWithdrawal.amount.toNumber() === 99900020);
  //   assert.ok(userTokenAccountAfterWithdrawal.amount.toNumber() === 99980);
  //   assert.ok(cryptolithStateAfterWithdrawalAfterInit.collateralBalance.toNumber() === 99980);
  // });

  // it("Returns an error if withdrawal bigger than deposited collateral", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.withdraw(new BN(500000), {
  //       accounts: {
  //         lithTokenMintAuthority: cryptolithAuthority,
  //         lithTokenAccount: lithTokenAccount,
  //         userAssociatedTokenAccount: userAssociatedAddress,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   // Make sure test doesn't pass if withdrawal smaller than collateral
  //   assert.ok(err === "Cannot withdraw more than holdings");
  // });

  // it("Returns an error if withdrawal amount is zero", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.withdraw(new BN(0), {
  //       accounts: {
  //         lithTokenMintAuthority: cryptolithAuthority,
  //         lithTokenAccount: lithTokenAccount,
  //         userAssociatedTokenAccount: userAssociatedAddress,
  //         tokenProgram: TOKEN_PROGRAM_ID,
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Cannot withdraw zero");
  // });

  // it("Locks liquidity a first time", async () => {
  //   await cryptolithProgram.state.rpc.lock(new BN(10000), {
  //     accounts: {
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const cryptolithStateAfterLockAfterInit = await cryptolithProgram.state();
  //   assert.ok(cryptolithStateAfterLockAfterInit.lockedLiquidity.toNumber() === 10000);
  // });

  // it("Locks liquidity a second time", async () => {
  //   await cryptolithProgram.state.rpc.lock(new BN(10000), {
  //     accounts: {
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const cryptolithStateAfterLockAfterInit = await cryptolithProgram.state();
  //   assert.ok(cryptolithStateAfterLockAfterInit.lockedLiquidity.toNumber() === 20000);
  // });

  // it("Returns an error if lock amount is greater than 80% collateral", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.lock(new BN(100000), {
  //       accounts: {
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Lock Amount too large");
  // });

  // it("Returns an error if lock amount is zero", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.lock(new BN(0), {
  //       accounts: {
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Cannot lock zero");
  // });

  // it("Unlocks liquidity a first time", async () => {
  //   await cryptolithProgram.state.rpc.unlock(new BN(10000), {
  //     accounts: {
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const cryptolithStateAfterLockAfterInit = await cryptolithProgram.state();
  //   assert.ok(cryptolithStateAfterLockAfterInit.lockedLiquidity.toNumber() === 10000);
  // });

  // it("Unlocks liquidity a second time", async () => {
  //   await cryptolithProgram.state.rpc.unlock(new BN(10000), {
  //     accounts: {
  //       authority: provider.wallet.publicKey,
  //     },
  //   });

  //   const cryptolithStateAfterLockAfterInit = await cryptolithProgram.state();
  //   assert.ok(cryptolithStateAfterLockAfterInit.lockedLiquidity.toNumber() === 0);
  // });

  // it("Returns an error if unlock amount is greater than locked liquidity", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.unlock(new BN(500000), {
  //       accounts: {
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Unlock Amount too large");
  // });

  // it("Returns an error if unlock amount is zero", async () => {
  //   let err: string;
  //   try {
  //     await cryptolithProgram.state.rpc.unlock(new BN(0), {
  //       accounts: {
  //         authority: provider.wallet.publicKey,
  //       },
  //     });
  //   } catch (e) {
  //     err = e.toString();
  //   }
  //   assert.ok(err === "Cannot unlock zero");
  // });
});
