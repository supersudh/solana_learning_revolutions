#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("CEJrN3Ko8aVJjdv11KqJ68bciXsVRnuMDhBCbCB9snac");

#[program]
pub mod test_project {
    use super::*;

  pub fn close(_ctx: Context<CloseTestProject>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.test_project.count = ctx.accounts.test_project.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.test_project.count = ctx.accounts.test_project.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeTestProject>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.test_project.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeTestProject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + TestProject::INIT_SPACE,
  payer = payer
  )]
  pub test_project: Account<'info, TestProject>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTestProject<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub test_project: Account<'info, TestProject>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub test_project: Account<'info, TestProject>,
}

#[account]
#[derive(InitSpace)]
pub struct TestProject {
  count: u8,
}
