import React, { FC, ReactNode, useCallback, useState } from "react";
import { LiveMedia } from "../media/LiveMedia";
import { FlexBox } from "../layout/FlexBoxCenter";
import { BsArrowRepeat } from "react-icons/bs";
import { generateTxHash } from "../../generateHash";
import { cn } from "../../lib/css/cs";

interface ICreateLayout {
  children: ReactNode;
  codeCid?: string;
  hideLiveMedia?: boolean;
}

export const CreateLayout: FC<ICreateLayout> = ({
  hideLiveMedia,
  codeCid,
  children,
}) => {
  const [hash, setHash] = useState<string>(generateTxHash());

  const onClickRefreshHash = useCallback(() => {
    setHash(generateTxHash());
  }, []);

  return (
    <div
      className={cn(
        hideLiveMedia
          ? "w-full"
          : "grid-cols-1 lg:grid-cols-3 inline-grid gap-6"
      )}
    >
      <div
        className={cn(
          hideLiveMedia ? "w-full" : "col-span-2",
          " ring-slate-100 lg:ring-1 rounded-md bg-white sm:rounded-lg"
        )}
      >
        {children}
      </div>
      {!hideLiveMedia && (
        <div className={"ring-1 ring-slate-100 rounded-md pt-4 "}>
          <div className={"mb-3 p-4"}>
            <div>
              {!codeCid && (
                <>
                  <div style={{ minHeight: 500 }}></div>
                </>
              )}
              {codeCid && (
                <>
                  <LiveMedia
                    ipfsUrl={{ cid: codeCid, hash }}
                    minHeight={500}
                    style={{}}
                  ></LiveMedia>
                  <a onClick={onClickRefreshHash}>
                    <FlexBox
                      style={{
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <div>New Hash</div>
                      <BsArrowRepeat style={{ marginLeft: ".5rem" }} />
                    </FlexBox>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
