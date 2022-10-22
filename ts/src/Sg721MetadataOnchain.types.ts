/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.16.5.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export type Uint64 = string;
export interface AllNftInfoResponse {
  access: OwnerOfResponse;
  info: NftInfoResponseForMetadata;
}
export interface OwnerOfResponse {
  approvals: Approval[];
  owner: string;
}
export interface Approval {
  expires: Expiration;
  spender: string;
}
export interface NftInfoResponseForMetadata {
  extension: Metadata;
  token_uri?: string | null;
}
export interface Metadata {
  animation_url?: string | null;
  attributes?: Trait[] | null;
  background_color?: string | null;
  description?: string | null;
  external_url?: string | null;
  image?: string | null;
  image_data?: string | null;
  name?: string | null;
  youtube_url?: string | null;
}
export interface Trait {
  display_type?: string | null;
  trait_type: string;
  value: string;
}
export interface AllOperatorsResponse {
  operators: Approval[];
}
export interface AllTokensResponse {
  tokens: string[];
}
export interface ApprovalResponse {
  approval: Approval;
}
export interface ApprovalsResponse {
  approvals: Approval[];
}
export type Decimal = string;
export interface CollectionInfoResponse {
  creator: string;
  description: string;
  explicit_content?: boolean | null;
  external_link?: string | null;
  image: string;
  royalty_info?: RoyaltyInfoResponse | null;
  start_trading_time?: Timestamp | null;
}
export interface RoyaltyInfoResponse {
  payment_address: string;
  share: Decimal;
}
export interface ContractInfoResponse {
  name: string;
  symbol: string;
}
export interface InstantiateMsg {
  collection_info: CollectionInfoForRoyaltyInfoResponse;
  minter: string;
  name: string;
  symbol: string;
}
export interface CollectionInfoForRoyaltyInfoResponse {
  creator: string;
  description: string;
  explicit_content?: boolean | null;
  external_link?: string | null;
  image: string;
  royalty_info?: RoyaltyInfoResponse | null;
  start_trading_time?: Timestamp | null;
}
export interface MinterResponse {
  minter: string;
}
export interface NftInfoResponse {
  extension: Metadata;
  token_uri?: string | null;
}
export interface NumTokensResponse {
  count: number;
}
export interface OperatorsResponse {
  operators: Approval[];
}
export type QueryMsg = {
  owner_of: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  approval: {
    include_expired?: boolean | null;
    spender: string;
    token_id: string;
  };
} | {
  approvals: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  all_operators: {
    include_expired?: boolean | null;
    limit?: number | null;
    owner: string;
    start_after?: string | null;
  };
} | {
  num_tokens: {};
} | {
  contract_info: {};
} | {
  nft_info: {
    token_id: string;
  };
} | {
  all_nft_info: {
    include_expired?: boolean | null;
    token_id: string;
  };
} | {
  tokens: {
    limit?: number | null;
    owner: string;
    start_after?: string | null;
  };
} | {
  all_tokens: {
    limit?: number | null;
    start_after?: string | null;
  };
} | {
  minter: {};
} | {
  collection_info: {};
};
export interface TokensResponse {
  tokens: string[];
}