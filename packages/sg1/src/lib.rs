use cosmwasm_std::{coins, Addr, BankMsg, CosmosMsg, Decimal, MessageInfo, Uint128};
use cw_utils::{must_pay, PaymentError};
use sg_std::{create_fund_community_pool_msg, StargazeMsgWrapper, NATIVE_DENOM};
use thiserror::Error;

// governance parameters
const FEE_BURN_PERCENT: u64 = 50;
const DEV_INCENTIVE_PERCENT: u64 = 10;

type SubMsg = CosmosMsg<StargazeMsgWrapper>;

/// Burn and distribute fees and return an error if the fee is not enough
pub fn checked_fair_burn(
    info: &MessageInfo,
    fee: u128,
    developer: Option<Addr>,
) -> Result<Vec<SubMsg>, FeeError> {
    let payment = must_pay(info, NATIVE_DENOM)?;
    if payment.u128() < fee {
        return Err(FeeError::InsufficientFee(fee, payment.u128()));
    };

    Ok(fair_burn(fee, developer))
}

/// Burn and distribute fees, assuming the right fee is passed in
pub fn fair_burn(fee: u128, developer: Option<Addr>) -> Vec<SubMsg> {
    let mut msgs: Vec<SubMsg> = vec![];

    let (burn_percent, dev_fee) = match developer {
        Some(dev) => {
            let dev_fee = (Uint128::from(fee) * Decimal::percent(DEV_INCENTIVE_PERCENT)).u128();
            let msg = BankMsg::Send {
                to_address: dev.to_string(),
                amount: coins(dev_fee, NATIVE_DENOM),
            };
            msgs.push(SubMsg::Bank(msg));
            (
                Decimal::percent(FEE_BURN_PERCENT - DEV_INCENTIVE_PERCENT),
                dev_fee,
            )
        }
        None => (Decimal::percent(FEE_BURN_PERCENT), 0u128),
    };

    // burn half the fee
    let burn_fee = (Uint128::from(fee) * burn_percent).u128();
    let burn_coin = coins(burn_fee, NATIVE_DENOM);
    msgs.push(SubMsg::Bank(BankMsg::Burn { amount: burn_coin }));

    // Send other half to community pool
    msgs.push(create_fund_community_pool_msg(coins(
        fee - (burn_fee + dev_fee),
        NATIVE_DENOM,
    )));

    msgs
}

#[derive(Error, Debug, PartialEq)]
pub enum FeeError {
    #[error("Insufficient fee: expected {0}, got {1}")]
    InsufficientFee(u128, u128),

    #[error("{0}")]
    Payment(#[from] PaymentError),
}

#[cfg(test)]
mod tests {
    use cosmwasm_std::{coins, Addr, BankMsg};

    use crate::{fair_burn, SubMsg};

    #[test]
    fn check_fair_burn_no_dev_rewards() {
        let msgs = fair_burn(1000u128, None);
        let burn_msg = SubMsg::Bank(BankMsg::Burn {
            amount: coins(500, "ustars".to_string()),
        });
        assert_eq!(msgs.len(), 2);
        assert_eq!(msgs[0], burn_msg);
    }

    #[test]
    fn check_fair_burn_with_dev_rewards() {
        let msgs = fair_burn(1000u128, Some(Addr::unchecked("geordi")));
        let bank_msg = SubMsg::Bank(BankMsg::Send {
            to_address: "geordi".to_string(),
            amount: coins(100, "ustars".to_string()),
        });
        let burn_msg = SubMsg::Bank(BankMsg::Burn {
            amount: coins(400, "ustars".to_string()),
        });
        assert_eq!(msgs.len(), 3);
        assert_eq!(msgs[0], bank_msg);
        assert_eq!(msgs[1], burn_msg);
    }
}