import React, { FC, ReactNode, useCallback, useState } from "react";
import { RowWideContainer } from "../layout/RowWideContainer";
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
          ? "tw-w-full"
          : "tw-grid-cols-1 lg:tw-grid-cols-3 tw-inline-grid tw-gap-6"
      )}
    >
      <div
        className={cn(
          hideLiveMedia ? "tw-w-full" : "tw-col-span-2",
          " tw-ring-slate-100 lg:tw-ring-1 tw-rounded-md tw-bg-white tw-sm:rounded-lg"
        )}
      >
        {children}
      </div>
      {!hideLiveMedia && (
        <div className={"tw-ring-1 tw-ring-slate-100 tw-rounded-md tw-pt-4 "}>
          <div className={"mb-3 tw-p-4"}>
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
