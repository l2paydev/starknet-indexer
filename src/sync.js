// Before running this script, you must setup your database to include a `transfers` table.
// See README.md for instructions.
import { decodeTransfersInBlock, filter } from "./starknet.js";
import { rpc } from "./config.js";

// Configure indexer for streaming Starknet Sepolia data starting at the specified block.
export const config = {
  streamUrl: rpc,
  startingBlock: 73100,
  network: "starknet",
  filter,
  finality: "DATA_STATUS_PENDING",
  sinkType: "postgres",
  sinkOptions: {
    noTls: true,
    tableName: "transfers",
  },
};

// Transform each block using the function defined in starknet.js.
export default decodeTransfersInBlock;