use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, TokenAccount, Transfer};

const CRYPTOLITH_SEED: &str = "WELCOMETOTHECRYPTOLITHICAGE";

#[program]
mod cryptolith {
    use super::*;

    #[state]
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
            authority: Pubkey,
            signer: Pubkey,
        ) -> Result<()> {
            msg!("Initialize Cryptolith state!");
            self.initialized = true;
            self.nonce = nonce;
            self.signer = signer;
            self.authority = authority;
            self.lith_token_mint = *ctx.accounts.lith_token_mint.to_account_info().key; // Token Mint Account pub key
            self.lith_token_account = *ctx.accounts.lith_token_account.to_account_info().key; // Token Mint Account pub key

            // Mint total token supply to deployer account
            let amount = u64::pow(10, 8);
            self.lith_total_supply = amount.clone();

            let seeds = &[CRYPTOLITH_SEED.as_bytes(), &[self.nonce]];
            let signer = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                MintTo {
                    mint: ctx.accounts.lith_token_mint.to_account_info(),
                    to: ctx.accounts.lith_token_account.to_account_info(),
                    authority: ctx.accounts.lith_token_mint_authority.to_account_info(),
                },
                signer,
            );
            token::mint_to(cpi_ctx, amount)?;

            Ok(())
        }

        pub fn create_cryptolith(&mut self, ctx: Context<CreateCryptolith>) -> Result<()> {
            let cryptolith = Cryptolith {
                id: Pubkey::default(),
                patrons: 0,
                latitude: 48680752,
                longitude: 2319358,
                height: 3,
                funding_amount: 0,
                realisation_amount: 20000,
                mint_account: Pubkey::default(),
                // mint_account: *ctx.accounts.lithn_token_mint.to_account_info().key,
                authority: self.authority,
            };

            self.cryptoliths = vec![cryptolith.clone()];

            Ok(())
        }

        // pub fn transfer_lith(&mut self, ctx: Context<LithTransfer>, amount: u64) -> Result<()> {
        //     if amount == 0 {
        //         return Err(ErrorCode::DepositZero.into());
        //     }
        //     if amount > u64::MAX {
        //         return Err(ErrorCode::DepositTooBig.into());
        //     }

        //     let seeds = &[CRYPTOLITH_SEED.as_bytes(), &[self.nonce]];
        //     let signer = &[&seeds[..]];

        //     let cpi_ctx = CpiContext::new_with_signer(
        //         ctx.accounts.token_program.clone(),
        //         Transfer {
        //             from: ctx.accounts.from_account.to_account_info(),
        //             to: ctx.accounts.to_account.to_account_info(),
        //             authority: ctx.accounts.lith_token_mint_authority.to_account_info(),
        //         },
        //         signer,
        //     );
        //     token::transfer(cpi_ctx, amount)?;
        //     Ok(())
        // }

        // pub fn contribute_cryptolith(
        //     &mut self,
        //     ctx: Context<Contribute>,
        //     amount: u64,
        // ) -> Result<()> {
        //     if amount == 0 {
        //         return Err(ErrorCode::DepositZero.into());
        //     }
        //     if amount > u64::MAX {
        //         return Err(ErrorCode::DepositTooBig.into());
        //     }

        //     let seeds = &[CRYPTOLITH_SEED.as_bytes(), &[self.nonce]];
        //     let signer = &[&seeds[..]];

        //     let cpi_ctx = CpiContext::new_with_signer(
        //         ctx.accounts.token_program.clone(),
        //         Transfer {
        //             from: ctx.accounts.user_associated_token_account.to_account_info(),
        //             to: ctx.accounts.lith_token_account.to_account_info(),
        //             authority: ctx.accounts.lith_token_mint_authority.to_account_info(),
        //         },
        //         signer,
        //     );
        //     token::transfer(cpi_ctx, amount)?;

        //     Ok(())
        // }

        // pub fn withdraw(&mut self, ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        //     if amount == 0 {
        //         return Err(ErrorCode::WithdrawalZero.into());
        //     }
        //     if amount > u64::MAX {
        //         return Err(ErrorCode::WithdrawalTooBig.into());
        //     }
        //     let user_balance = ctx.accounts.user_associated_token_account.amount;

        //     if user_balance < amount {
        //         return Err(ErrorCode::WithdrawalBalanceConflict.into());
        //     }
        //     let cpi_ctx = CpiContext::new(
        //         ctx.accounts.token_program.clone(),
        //         Transfer {
        //             from: ctx.accounts.user_associated_token_account.to_account_info(),
        //             to: ctx.accounts.lith_token_account.to_account_info(),
        //             authority: ctx.accounts.authority.to_account_info(),
        //         },
        //     );
        //     token::transfer(cpi_ctx, amount)?;

        //     Ok(())
        // }
    }

    pub fn initialize_user_account(ctx: Context<InitializeUserAccount>) -> ProgramResult {
        let user_account = &mut ctx.accounts.user_account;
        // user_account.shares = 0;
        // user_account.collateral = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct New {}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut, "lith_token_mint.decimals == 8")]
    lith_token_mint: CpiAccount<'info, Mint>,
    #[account(mut)]
    lith_token_account: CpiAccount<'info, TokenAccount>,
    lith_token_mint_authority: AccountInfo<'info>,
    #[account("token_program.key == &token::ID")]
    token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CreateCryptolith<'info> {
    // #[account(signer)]
    // authority: AccountInfo<'info>,
    #[account(mut, "lithn_token_mint.decimals == 8")]
    lithn_token_mint: CpiAccount<'info, Mint>,
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
    pub lith_token_account: CpiAccount<'info, TokenAccount>,
    //TODO: Check ACL
    #[account(mut)]
    pub lith_token_mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub user_associated_token_account: CpiAccount<'info, TokenAccount>,
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
