use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, TokenAccount, Transfer};

const LITH_SEED: &str = "WELCOMETOTHECRYPTOLITHICAGE";
const LITH_CHILD_SEED: &str = "PAMPIT";

#[program]
mod cryptolith {
    use super::*;

    // Specify size for dynamic vec allocation
    #[state(1024)]
    pub struct CryptolithState {
        pub initialized: bool,
        pub authority: Pubkey,
        pub signer: Pubkey,
        pub lith_nonce: u8,
        pub lith_mint: Pubkey,
        pub lith_account: Pubkey,
        pub lith_total_supply: u64,
        pub cryptoliths: Vec<Cryptolith>,
    }

    impl CryptolithState {
        pub fn new(_ctx: Context<New>) -> Result<Self> {
            Ok(Self {
                initialized: false,
                authority: Pubkey::default(),
                signer: Pubkey::default(),
                lith_nonce: 0,
                lith_mint: Pubkey::default(),
                lith_account: Pubkey::default(),
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
            self.lith_nonce = nonce;
            self.signer = signer;
            self.authority = authority;
            self.lith_mint = *ctx.accounts.lith_mint.to_account_info().key; // Token Mint Account pub key
            self.lith_account = *ctx.accounts.lith_account.to_account_info().key; // Token Mint Account pub key

            // Mint total token supply to deployer account
            let amount = u64::pow(10, 8);
            self.lith_total_supply = amount.clone();

            let seeds = &[LITH_SEED.as_bytes(), &[self.lith_nonce]];
            let signer = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                MintTo {
                    mint: ctx.accounts.lith_mint.to_account_info(),
                    to: ctx.accounts.lith_account.to_account_info(),
                    authority: ctx.accounts.lith_mint_authority.to_account_info(),
                },
                signer,
            );
            token::mint_to(cpi_ctx, amount)?;

            // let amount_to_transfer = amount / 2;

            /*  TODO: REMOVE FOR TEST PURPOSES ONLY
            Lith should not be transferred to user on init */
            // let cpi_ctx = CpiContext::new_with_signer(
            //     ctx.accounts.token_program.clone(),
            //     Transfer {
            //         from: ctx.accounts.lith_account.to_account_info(),
            //         to: ctx.accounts.user_lith_address.to_account_info(),
            //         authority: ctx.accounts.lith_mint_authority.to_account_info(),
            //     },
            //     signer,
            // );
            // token::transfer(cpi_ctx, amount_to_transfer)?;

            Ok(())
        }

        pub fn create_cryptolith(
            &mut self,
            ctx: Context<CreateCryptolith>,
            nonce: u8,
            realisation_amount: u64,
        ) -> Result<()> {
            msg!("Create new Cryptolith!");

            let cryptolith = Cryptolith {
                id: *ctx.accounts.lith_child_mint.to_account_info().key,
                patrons: 0,
                latitude: 48680752,
                longitude: 2319358,
                height: 3,
                funding_amount: 0,
                realisation_amount: realisation_amount,
                nonce: nonce,
                mint: *ctx.accounts.lith_child_mint.to_account_info().key,
                mint_authority: *ctx.accounts.lith_child_mint_authority.to_account_info().key,
                mint_account: *ctx.accounts.lith_child_account.to_account_info().key,
            };

            if self.cryptoliths.len() == 0 {
                self.cryptoliths = vec![cryptolith.clone()];
            } else {
                self.cryptoliths.push(cryptolith.clone());
            }

            // Mint total token supply to deployer account
            let amount = u64::pow(10, 8);

            let seeds = &[LITH_CHILD_SEED.as_bytes(), &[nonce]];
            let signer = &[&seeds[..]];

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                MintTo {
                    mint: ctx.accounts.lith_child_mint.to_account_info(),
                    to: ctx.accounts.lith_child_account.to_account_info(),
                    authority: ctx.accounts.lith_child_mint_authority.to_account_info(),
                },
                signer,
            );
            token::mint_to(cpi_ctx, amount)?;

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

            msg!("NONCE: {}", &target_cryptolith[0].nonce.to_string());

            // Transfer Lithn back to his address
            let seeds = &[LITH_CHILD_SEED.as_bytes(), &[target_cryptolith[0].nonce]];
            let signer = &[&seeds[..]];

            let lithn_amount = amount / 10;

            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.clone(),
                Transfer {
                    from: ctx.accounts.from_lith_child.to_account_info(),
                    to: ctx.accounts.to_lith_child.to_account_info(),
                    authority: ctx.accounts.lith_child_authority.to_account_info(),
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
    lith_account: CpiAccount<'info, TokenAccount>,
    // For testing purposes
    // #[account(mut)]
    // user_lith_address: CpiAccount<'info, TokenAccount>,
    #[account("token_program.key == &token::ID")]
    token_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CreateCryptolith<'info> {
    #[account(mut, "lith_child_mint.decimals == 8")]
    lith_child_mint: CpiAccount<'info, Mint>,
    lith_child_mint_authority: AccountInfo<'info>,
    #[account(mut)]
    lith_child_account: CpiAccount<'info, TokenAccount>,
    #[account("token_program.key == &token::ID")]
    token_program: AccountInfo<'info>,
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
    pub from_lith_child: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub to_lith_child: CpiAccount<'info, TokenAccount>,
    #[account(mut)]
    pub lith_child_authority: AccountInfo<'info>,
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
    pub mint: Pubkey,
    pub mint_authority: Pubkey,
    pub nonce: u8,
    pub mint_account: Pubkey,
    pub patrons: u32,
    pub latitude: i32,
    pub longitude: i32,
    pub height: u8,
    pub funding_amount: u64,
    pub realisation_amount: u64,
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
