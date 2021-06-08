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
  const LITH_SEED = Buffer.from("WELCOMETOTHECRYPTOLITHICAGE");
  const LITH_CHILD_SEED = Buffer.from("PAMPIT");

  let lithAuthority: web3.PublicKey;
  let lithNonce: number;
  let lithMint: Token;
  let lithAccount: web3.PublicKey;
  let userLithAddress: web3.PublicKey;

  let lithChildAuthority: web3.PublicKey;
  let lithChildNonce: number;
  let lithChildMint: Token;
  let lithChildAccount: web3.PublicKey;
  let userLithChildAddress: web3.PublicKey;

  before(async () => {
    const [_lithAuthority, _nonce] = await web3.PublicKey.findProgramAddress(
      [LITH_SEED],
      cryptolithProgram.programId,
    );

    lithAuthority = _lithAuthority;
    lithNonce = _nonce;

    lithMint = await Token.createMint(
      provider.connection,
      payer,
      lithAuthority,
      null,
      8,
      TOKEN_PROGRAM_ID,
    );
    lithAccount = await lithMint.createAccount(lithAuthority);
    userLithAddress = await lithMint.createAssociatedTokenAccount(provider.wallet.publicKey);
  });

  it("Initializes Cryptolith State correctly", async () => {
    await cryptolithProgram.state.rpc.new({
      accounts: {},
    });

    await cryptolithProgram.state.rpc.initialize(
      lithNonce,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      {
        accounts: {
          lithMint: lithMint.publicKey,
          lithMintAuthority: lithAuthority,
          lithAccount: lithAccount,
          // userLithAddress: userLithAddress,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      },
    );

    const cryptolithStateAfterInit = await cryptolithProgram.state.fetch();
    assert.ok(cryptolithStateAfterInit.signer.equals(provider.wallet.publicKey));
    assert.ok(cryptolithStateAfterInit.authority.equals(provider.wallet.publicKey));
    assert.ok(cryptolithStateAfterInit.lithNonce === lithNonce);
    assert.ok(cryptolithStateAfterInit.lithMint.equals(lithMint.publicKey));
    assert.ok(cryptolithStateAfterInit.lithAccount.equals(lithAccount));
    // assert.ok(cryptolithStateAfterInit.lithTotalSupply.toNumber() === 10e7);

    // const lithAccountAfterMint = await lithMint.getAccountInfo(lithAccount);
    // @ts-ignore
    // assert.ok(lithAccountAfterMint.amount.toNumber() === 5e7);
  });

  it("Creates a new Cryptolith", async () => {
    const [_lithChildAuthority, _lithChildNonce] = await web3.PublicKey.findProgramAddress(
      [LITH_CHILD_SEED],
      cryptolithProgram.programId,
    );

    lithChildAuthority = _lithChildAuthority;
    lithChildNonce = _lithChildNonce;

    lithChildMint = await Token.createMint(
      provider.connection,
      payer,
      lithChildAuthority,
      null,
      8,
      TOKEN_PROGRAM_ID,
    );

    lithChildAccount = await lithChildMint.createAccount(_lithChildAuthority);
    userLithChildAddress = await lithChildMint.createAssociatedTokenAccount(
      provider.wallet.publicKey,
    );

    await cryptolithProgram.state.rpc.createCryptolith(lithChildNonce, new BN(5e5), {
      accounts: {
        lithChildMint: lithChildMint.publicKey,
        lithChildMintAuthority: lithChildAuthority,
        lithChildAccount: lithChildAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });

    const cryptolithStateAfterInit = await cryptolithProgram.state.fetch();
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].patrons === 0);
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].latitude === 48680752);
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].longitude === 2319358);
    assert.ok(
      cryptolithStateAfterInit.cryptoliths[0].mint.toBase58() ===
        lithChildMint.publicKey.toBase58(),
    );
  });

  it.skip("Contributes to Cryptolith", async () => {
    const ix = await cryptolithProgram.state.instruction.contributeCryptolith(
      new BN(10),
      lithChildMint.publicKey,
      {
        accounts: {
          fromLith: lithAccount,
          toLith: userLithAddress,
          lithAuthority: lithMint.publicKey,
          fromLithChild: lithChildAccount,
          toLithChild: userLithChildAddress,
          lithChildAuthority: lithChildMint.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signer: [provider.wallet.publicKey],
      },
    );

    let tx = new web3.Transaction().add(ix);

    let { blockhash } = await provider.connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = provider.wallet.publicKey;
    await provider.wallet.signTransaction(tx);

    const userAccountAfterContribution = await lithMint.getAccountInfo(userLithAddress);
    assert.ok(userAccountAfterContribution.amount.toNumber() === 5e7);
  });
});
