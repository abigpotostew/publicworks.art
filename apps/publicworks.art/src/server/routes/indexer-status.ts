import { z } from "zod";
import { isISODate } from "../../util/isISODate";
import { stores } from "../../store/stores";
import { authorizedProcedure, baseProcedure, t } from "../trpc";
import {
  CreateProjectRequestZ,
  editProjectZod,
  EditUserRequestZ,
} from "../../store";
import { TRPCError } from "@trpc/server";
import { serializeWork } from "../../dbtypes/works/serialize-work";
import { normalizeMetadataUri } from "../../wasm/metadata";
import {
  deleteCid,
  getMetadataWorkId,
  uploadFileToPinata,
} from "../../ipfs/pinata";
import { dataUrlToBuffer } from "../../base64/dataurl";
import { serializeUser } from "src/dbtypes/users/serialize-user";
import config from "../../wasm/config";

const getLastSweptBlock = baseProcedure
  .input(z.object({}).nullish())

  .query(async ({ input, ctx }) => {
    const lastSweptPromise = stores().indexer.getLastSweptHeight();
    const latestBlockPromise = fetch(
      `${config.restEndpoint}/cosmos/base/tendermint/v1beta1/blocks/latest`
    );
    const [lastSweptBlock, latestBlock] = await Promise.all([
      lastSweptPromise,
      latestBlockPromise,
    ]);
    if (!latestBlock.ok) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    const latestBlockJson = await latestBlock.json();
    const heightString = latestBlockJson.block?.header?.height as
      | string
      | null
      | undefined;
    const blockTimestamp =
      latestBlockJson.block?.header?.time || new Date(0).toISOString();
    const lastSweptBlockHeight = parseInt(lastSweptBlock?.height || "0");
    const latestBlockHeight = parseInt(heightString || "0");
    return {
      diff: latestBlockHeight - lastSweptBlockHeight,
      lastSweptBlock: {
        height: lastSweptBlockHeight,
        timestamp: lastSweptBlock.updatedDate.toISOString(),
      },
      latestBlockHeight: {
        height: latestBlockHeight,
        timestamp: blockTimestamp,
      },
    };
  });

export const indexerRouter = t.router({
  // Public
  getLastSweptBlock: getLastSweptBlock,
});
