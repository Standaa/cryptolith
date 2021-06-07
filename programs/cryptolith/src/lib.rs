use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, TokenAccount, Transfer};

const CRYPTOLITH_SEED: &str = "WELCOMETOTHECRYPTOLITHICAGE";
const CRYPTOLITHN_SEED: &str = "PAMPIT";

#[program]
mod cryptolith {
    use super::*;

    // Specify size for dynamic vec allocation
    #[state(1024)]
    pub struct CryptolithState {
        pub initialized: bool,
        pub nonce: u8,
        pub authority: Pubkey,
        pub signer: Pubkey,
        pub lith_token_mint: Pubkey,
        pub lith_token_account: Pubkey,
        pub lith_total_supply: u64,
        pub cryptoliths: Vec<Cryptolith>,
    }

    impl CryptolithState {
        pub fn new(_ctx: Context<New>) -> Result<Self> {
            Ok(Self {
                initialized: false,
                nonce: 0,
                authority: Pubkey::default(),
                signer: Pubkey::default(),
                lith_token_mint: Pubkey::default(),
                lith_token_account: Pubkey::default(),
                lith_total_supply: 0,
                cryptoliths: Vec::new(),
            })
        }

        pub fn initialize(
            &mut self,
            ctx: Context<Initialize>,
            nonce: u8,
            noncen: u8,
            authority: Pubkey,
            signer: Pubkey,
        ) -> Result<()> {
            msg!("Initialize Cryptolith state!");
            self.initialized = true;
            self.nonce = nonce;
            self.signer = signer;
            self.authority = authority;
            self.lith_token_mint = *ctx.accounts.lith_mint.to_account_info().key; // Token Mint Account pub key
            self.lith_token_account = *ctx.accounts.program_lith_account.to_account_info().key; // Token Mint Account pub key

            // Mint total token supply to deployer account
            let amount = u64::pow(10, 8);
            self.lith_total_supply = amount.clone();

            let seeds = &[CRYPTOLITH_SEED.as_bytes(), &[self.nonce]];
            let signer = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                MintTo {
                    mint: ctx.accounts.lith_mint.to_account_info(),
                    to: ctx.accounts.program_lith_account.to_account_info(),
                    authority: ctx.accounts.lith_mint_authority.to_account_info(),
                },
                signer,
            );
            token::mint_to(cpi_ctx, amount)?;

            let amount_to_transfer = amount / 2;

            /*  TODO: REMOVE FOR TEST PURPOSES ONLY
            Lith should not be transferred to user on init */
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                Transfer {
                    from: ctx.accounts.program_lith_account.to_account_info(),
                    to: ctx.accounts.user_lith_address.to_account_info(),
                    authority: ctx.accounts.lith_mint_authority.to_account_info(),
                },
                signer,
            );
            token::transfer(cpi_ctx, amount_to_transfer)?;

            let n_seeds = &[CRYPTOLITHN_SEED.as_bytes(), &[noncen]];
            let n_signer = &[&n_seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                MintTo {
                    mint: ctx.accounts.lith_n_mint.to_account_info(),
                    to: ctx.accounts.program_lith_n_account.to_account_info(),
                    authority: ctx.accounts.lith_n_mint_authority.to_account_info(),
                },
                n_signer,
            );
            token::mint_to(cpi_ctx, amount)?;

            Ok(())
        }

        pub fn create_cryptolith(&mut self, ctx: Context<CreateCryptolith>) -> Result<()> {
            let cryptolith = Cryptolith {
                id: *ctx.accounts.lithn_token_mint.to_account_info().key,
                patrons: 0,
                latitude: 48680752,
                longitude: 2319358,
                height: 3,
                funding_amount: 0,
                realisation_amount: 20000,
                mint_account: *ctx.accounts.lithn_token_mint.to_account_info().key,
                authority: self.authority,
            };

            self.cryptoliths = vec![cryptolith.clone()];

            Ok(())
        }

        pub fn contribute_cryptolith(
            &mut self,
            ctx: Context<Contribute>,
            amount: u64,
            id: Pubkey,
        ) -> Result<()> {
            if amount == 0 {
                return Err(ErrorCode::DepositZero.into());
            }
            if amount > u64::MAX {
                return Err(ErrorCode::DepositTooBig.into());
            }
            // Transfer lith to cryptolith lith account
            let cpi_ctx = CpiContext::new(
                ctx.accounts.token_program.clone(),
                Transfer {
                    from: ctx.accounts.from_lith.to_account_info(),
                    to: ctx.accounts.to_lith.to_account_info(),
                    authority: ctx.accounts.lith_authority.to_account_info(),
                },
            );
            token::transfer(cpi_ctx, amount)?;

            let target_cryptolith: Vec<Cryptolith> = self
                .cryptoliths
                .clone()
                .into_iter()
                .filter(|lith| lith.id == id)
                .collect();

            // Transfer Lithn back to his address
            let seeds = &[CRYPTOLITHN_SEED.as_bytes(), &[self.nonce]];
            let signer = &[&seeds[..]];

            let lithn_amount = amount / 10;

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                Transfer {
                    from: ctx.accounts.from_lithn.to_account_info(),
                    to: ctx.accounts.to_lithn.to_account_info(),
                    authority: ctx.accounts.lithn_authority.to_account_info(),
                },
                signer,
            );
            token::transfer(cpi_ctx, lithn_amount)?;

            Ok(())
        }
    }

    pub fn initialize_user_account(ctx: Context<InitializeUserAccount>) -> ProgramResult {
        let user_account = &mut ctx.accounts.user_account;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct New {}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut, "lith_mint.decimals == 8")]
    lith_mint: CpiAccount<'info, Mint>,
    lith_mint_authority: AccountInfo<'info>,
    #[account(mut)]
    program_lith_account: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    user_lith_address: CpiAccount<'info, TokenAccount>,
    #[account(mut, "lith_n_mint.decimals == 8")]
    lith_n_mint: CpiAccount<'info, Mint>,
    lith_n_mint_authority: AccountInfo<'info>,
    #[account(mut)]
    program_lith_n_account: CpiAccount<'info, TokenAccount>,
    #[account("token_program.key == &token::ID")]
    token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CreateCryptolith<'info> {
    #[account(mut, "lithn_token_mint.decimals == 8")]
    lithn_token_mint: CpiAccount<'info, Mint>,
    // #[account(signer)]
    // authority: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct InitializeUserAccount<'info> {
    #[account(associated = authority, space = 256 )]
    user_account: ProgramAccount<'info, UserCryptolithAccount>,
    #[account(mut, signer)]
    authority: AccountInfo<'info>,
    rent: Sysvar<'info, Rent>,
    system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct Contribute<'info> {
    #[account(mut)]
    pub from_lith: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub to_lith: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub lith_authority: AccountInfo<'info>,
    #[account(mut)]
    pub from_lithn: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub to_lithn: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub lithn_authority: AccountInfo<'info>,
    #[account("token_program.key == &token::ID")]
    pub token_program: AccountInfo<'info>,
}

// #[derive(Accounts)]
// pub struct LithTransfer<'info> {
//     #[account(mut)]
//     pub lith_token_mint_authority: AccountInfo<'info>,
//     #[account(mut)]
//     pub from_account: CpiAccount<'info, TokenAccount>,
//     #[account(mut)]
//     pub to_account: CpiAccount<'info, TokenAccount>,
//     #[account("token_program.key == &token::ID")]
//     pub token_program: AccountInfo<'info>,
// }

// #[derive(Accounts)]
// pub struct Withdraw<'info> {
//     #[account(mut)]
//     pub lith_token_account: CpiAccount<'info, TokenAccount>,
//     //TODO: Check ACL
//     #[account(mut)]
//     pub lith_token_mint_authority: AccountInfo<'info>,
//     #[account(mut)]
//     pub user_associated_token_account: CpiAccount<'info, TokenAccount>,
//     #[account("token_program.key == &token::ID")]
//     pub token_program: AccountInfo<'info>,
//     #[account(signer)]
//     pub authority: AccountInfo<'info>,
// }

#[associated]
pub struct UserCryptolithAccount {
    pub cryptoliths: Vec<Contribution>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Cryptolith {
    pub id: Pubkey,
    pub patrons: u32,
    pub latitude: i32,
    pub longitude: i32,
    pub height: u8,
    pub funding_amount: u64,
    pub realisation_amount: u64,
    pub mint_account: Pubkey,
    pub authority: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Contribution {
    pub cryptolith_id: Pubkey,
    pub lith_invested: u64,
}

#[error]
pub enum ErrorCode {
    #[msg("Access unauthorized")]
    AccessControl,
    #[msg("Cannot deposit zero")]
    DepositZero,
    #[msg("Deposit Amount too small")]
    DepositTooSmall,
    #[msg("Deposit Amount too large")]
    DepositTooBig,
    #[msg("Cannot withdraw zero")]
    WithdrawalZero,
    #[msg("Withdrawal Amount too small")]
    WithdrawalTooSmall,
    #[msg("Withdrawal Amount too large")]
    WithdrawalTooBig,
    #[msg("Cannot withdraw more than holdings")]
    WithdrawalBalanceConflict,
    #[msg("Cannot lock zero")]
    LockZero,
    #[msg("Lock Amount too large")]
    LockTooBig,
    #[msg("Cannot unlock zero")]
    UnlockZero,
    #[msg("Unlock Amount too large")]
    UnlockTooBig,
}
