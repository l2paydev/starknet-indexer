/* Starknet ETH indexer
 *
 * This file contains a filter and transform to index Starknet ETH transactions.
 */

// You can import any library supported by Deno.
import { hash, uint256 } from "https://esm.run/starknet@5.14";
import { formatUnits } from "https://esm.run/viem@1.4";

const DECIMALS = 18;
// Can read from environment variables if you want to.
// In that case, run with `--env-from-file .env` and put the following in .env:
// TOKEN_DECIMALS=18
// const DECIMALS = Deno.env.get('TOKEN_DECIMALS') ?? 18;

import {network, tokens} from "./config.js";

export const filter = {
  // Only request header if any event matches.
  header: {
    weak: true,
  },
  events: tokens.map(token => ({
      fromAddress: token.address,
      keys : [hash.getSelectorFromName("Transfer")],
      includeReceipt : false,
  })),
};

export function decodeTransfersInBlock({ header, events }) {
  const { blockNumber, blockHash, timestamp } = header;
  return events.map(({ event, transaction }) => {
    const transactionHash = transaction.meta.hash;
    const transferId = `${transactionHash}_${event.index}`;
    const contract_address = event.fromAddress;

    const token = tokens.find(t => t.address === contract_address);

    const [fromAddress, toAddress, amountLow, amountHigh] = event.data;

    // console.log("event data, symbol", token.symbol, event.data);

    let amountRaw = 0;
    let amount = 0;
    try {
      amountRaw = uint256.uint256ToBN({ low: amountLow, high: amountHigh });
      amount = formatUnits(amountRaw, token.decimals);      
    } catch (error) {
      console.error(error);
    }

    // Convert to snake_case because it works better with postgres.
    return {
      network: network,
      symbol: token.symbol,
      contract_address: contract_address,
      block_hash: blockHash,
      block_number: +blockNumber,
      block_timestamp: timestamp,
      transaction_hash: transactionHash,
      transfer_id: transferId,
      from_address: fromAddress,
      to_address: toAddress,
      amount: +amount,
      amount_raw: amountRaw.toString(),
    };
  });
}