// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require("@project-serum/anchor");
const { Token, TOKEN_PROGRAM_ID } = require("@solana/spl-token");

module.exports = async function (provider) {
  anchor.setProvider(provider);

  const connection = provider.connection;
  const payer = provider.wallet.payer;

  const LITH_SEED = Buffer.from("WELCOMETOTHECRYPTOLITHICAGE");
  const LITH_CHILD_SEED = Buffer.from("PAMPIT");

  let lithAuthority;
  let lithNonce;
  let lithMint;
  let lithAccount;

  const cryptolithProgram = anchor.workspace.Cryptolith;

  let lithChildAuthority;
  let lithChildNonce;
  let lithChildMint;
  let lithChildAccount;

  console.log("cryptolithProgram.programId", cryptolithProgram.programId.toBase58());

  const [_lithAuthority, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
    [LITH_SEED],
    cryptolithProgram.programId,
  );

  lithNonce = _nonce;
  lithAuthority = _lithAuthority;

  lithMint = await Token.createMint(connection, payer, lithAuthority, null, 8, TOKEN_PROGRAM_ID);

  lithAccount = await lithMint.createAccount(lithAuthority);

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
        lithAccount: lithAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        lithMintAuthority: lithAuthority,
      },
    },
  );

  const [_lithChildAuthority, _lithChildNonce] = await anchor.web3.PublicKey.findProgramAddress(
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

  await cryptolithProgram.state.rpc.createCryptolith(lithChildNonce, new anchor.BN(5e5), {
    accounts: {
      lithChildMint: lithChildMint.publicKey,
      lithChildMintAuthority: lithChildAuthority,
      lithChildAccount: lithChildAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });

  const lithProgramAfterInit = await cryptolithProgram.state.fetch();

  console.log("Wallet publickey :", provider.wallet.publicKey.toBase58());
  console.log("lithProgram signer :", lithProgramAfterInit.signer.toBase58());
  console.log("lithAuthority publickey :", lithAuthority.toBase58());
  console.log("lithMint publickey :", lithMint.publicKey.toBase58());
  console.log("lithAccount :", lithAccount.toBase58());

  console.log("lithChildMint publickey :", lithChildMint.publicKey.toBase58());
  console.log("lithChildAuthority publickey :", lithChildAuthority.toBase58());
  console.log("lithChildAccount :", lithChildAccount.toBase58());
};
