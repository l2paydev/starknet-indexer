# Create db table first

```
create table transfers(
  network text, -- network name, e.g. starknet-goerli
  symbol text, -- token symbol, e.g. ETH
  contract_address text, -- token contract address, e.g. ETH
  block_hash text, -- hex encoded block hash
  block_number bigint,
  block_timestamp timestamp,
  transaction_hash text, -- hex encoded transaction hash
  transfer_id text, -- unique transfer id
  from_address text, -- address sending the token
  to_address text, -- address receiving the token
  amount numeric, -- amount as float. Some precision is lost, but we can aggregate it
  amount_raw text, -- amount, as bigint
  _cursor bigint -- REQUIRED: needed for data invalidation
);
```
