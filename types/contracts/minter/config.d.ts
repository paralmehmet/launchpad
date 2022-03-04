import { Addr, Coin, Expiration } from "./shared-types";

export interface Config {
admin: Addr
base_token_uri: string
num_tokens: number
per_address_limit: number
sg721_code_id: number
start_time: Expiration
unit_price: Coin
whitelist?: (Addr | null)
[k: string]: unknown
}
