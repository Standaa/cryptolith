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
  let cryptolithnAuthority: web3.PublicKey;
  let nonce: number;
  let noncen: number;
  let lithTokenMint: Token;
  let lithTokenAccount: web3.PublicKey;
  let lithnTokenMint: Token;
  let lithnTokenAccount: web3.PublicKey;
  let userLithAddress: web3.PublicKey;
  let userLithnAddress: web3.PublicKey;

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

    lithTokenAccount = await lithTokenMint.createAccount(cryptolithAuthority);
    userLithAddress = await lithTokenMint.createAssociatedTokenAccount(provider.wallet.publicKey);

    const [_cryptolithnAuthority, _noncen] = await web3.PublicKey.findProgramAddress(
      [CRYPTOLITHN_SEED],
      cryptolithProgram.programId,
    );

    cryptolithnAuthority = _cryptolithnAuthority;
    noncen = _noncen;

    lithnTokenMint = await Token.createMint(
      provider.connection,
      payer,
      cryptolithAuthority,
      null,
      8,
      TOKEN_PROGRAM_ID,
    );

    lithnTokenAccount = await lithnTokenMint.createAccount(cryptolithAuthority);
    userLithnAddress = await lithnTokenMint.createAssociatedTokenAccount(provider.wallet.publicKey);
  });

  it("Initializes Cryptolith State correctly", async () => {
    await cryptolithProgram.state.rpc.new({
      accounts: {},
    });

    await cryptolithProgram.state.rpc.initialize(
      nonce,
      noncen,
      provider.wallet.publicKey,
      provider.wallet.publicKey,
      {
        accounts: {
          lithMint: lithTokenMint.publicKey,
          lithMintAuthority: cryptolithAuthority,
          programLithAccount: lithTokenAccount,
          userLithAddress: userLithAddress,
          lithNMint: lithnTokenMint.publicKey,
          lithNMintAuthority: cryptolithnAuthority,
          programLithNAccount: lithnTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
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
    assert.ok(lithTokenAccountAfterMint.amount.toNumber() === 5e7);
  });

  it("Creates a new Cryptolith", async () => {
    await cryptolithProgram.state.rpc.createCryptolith({
      accounts: {
        lithnTokenMint: lithnTokenMint.publicKey,
      },
    });

    const cryptolithStateAfterInit = await cryptolithProgram.state.fetch();
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].patrons === 0);
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].latitude === 48680752);
    assert.ok(cryptolithStateAfterInit.cryptoliths[0].longitude === 2319358);
    assert.ok(
      cryptolithStateAfterInit.cryptoliths[0].mintAccount.toBase58() === lithnTokenMint.publicKey.toBase58(),
    );
  });

  it.skip("Contributes to Cryptolith", async () => {
    const ix = await cryptolithProgram.state.instruction.contributeCryptolith(
      new BN(10),
      lithnTokenMint.publicKey,
      {
        accounts: {
          fromLith: lithTokenAccount,
          toLith: userLithAddress,
          lithAuthority: lithTokenMint.publicKey,
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

    const userAccountAfterContribution = await lithTokenMint.getAccountInfo(userLithAddress);
    assert.ok(userAccountAfterContribution.amount.toNumber() === 5e7);
  });
});
