import React, { useState, useMemo, useRef } from "react";
import { RawTokenProperties, SandboxFiles } from "../../types/Sandbox";
import { generateTxHash } from "src/generateHash";
import { processZipSandbox } from "src/util/sandbox";
import { DropZone } from "src/components/DropZone";
import {
  ArtworkIframeRef,
  SandboxPreview,
} from "src/components/sandbox/SandboxPreview";
import { Button } from "react-bootstrap";
import { RawProperties } from "src/components/nft/RawProperties";
import styles from "./Sandbox.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FlexBox,
  FlexBoxCenter,
  FlexBoxCenterStretch,
} from "../layout/FlexBoxCenter";
import { TooltipInfo } from "../TooltipInfo";

export function Sandbox() {
  const artworkIframeRef = useRef<ArtworkIframeRef>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string>(generateTxHash());
  const [filesRecord, setFilesRecord] = useState<SandboxFiles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<RawTokenProperties | null>(null);
  const [traits, setTraits] = useState<RawTokenProperties | null>(null);

  const fileList = useMemo<string[] | null>(
    () => (filesRecord ? Object.keys(filesRecord) : null),
    [filesRecord]
  );

  const processFile = async (file: File) => {
    try {
      const record = await processZipSandbox(file);
      setFilesRecord(record);
    } catch (err) {
      // todo: process error
      console.error(err);
    }
  };

  const uploadFile = async () => {
    if (file) {
      processFile(file);
    }
  };

  const updateFile = async (file: File | null) => {
    if (file) {
      setFile(file);
      processFile(file);
    }
  };

  const iframeLoaded = (depth = false) => {
    console.log("hello iframeLoaded");
    if (artworkIframeRef.current) {
      console.log("in here hello iframeLoaded");
      const iframe = artworkIframeRef.current.getHtmlIframe();
      if (iframe) {
        const fetchAttributes = () => {
          let attributes = null;
          let traits = null;
          // @ts-ignore
          if (iframe.contentWindow?.attributes) {
            // @ts-ignore
            attributes = iframe.contentWindow?.attributes;
          }
          // @ts-ignore
          if (iframe.contentWindow?.traits) {
            // @ts-ignore
            // process the raw features
            traits = iframe.contentWindow?.traits;
          }
          setAttributes(attributes);
          setTraits(traits);
          console.log("set attributes", attributes);
          console.log("set traits", traits);
          return [!!traits, !!attributes];
        };
        const [tra, attr] = fetchAttributes();
        console.log("tra", tra, "attr", attr);
        if (!attr && !depth) {
          console.log("attributes not found, reloading");
          setTimeout(() => iframeLoaded(true), 500);
        }
      }
    }
  };

  return (
    <section>
      {/*<FlexBoxCenter></FlexBoxCenter>*/}
      <FlexBoxCenterStretch>
        <div>
          {filesRecord ? (
            <div>
              <div>
                <h5>Files</h5>
                <span>
                  <i aria-hidden className="fas fa-file-archive" /> {file?.name}
                </span>
              </div>
              <div className={styles.filesListContainer + " overflow-scroll"}>
                <div className={"overflow-scroll mh-100"}>
                  {fileList?.map((f, index) => (
                    <div key={index}>{f}</div>
                  ))}
                </div>
              </div>

              <div className={"mt-2"}>
                <h5>Testing</h5>
                <p>Your work must pass these conditions:</p>
                <ul>
                  <li>
                    the same hash will <strong>always</strong> generate the same
                    output
                  </li>
                  <li>
                    different hashes generate <strong>different</strong> outputs
                  </li>
                </ul>
              </div>

              <div>
                <h5>Attributes</h5>
                {!attributes || Object.keys(attributes).length === 0 ? (
                  <ul>
                    No attributes. (Attributes are optional but recommended)
                  </ul>
                ) : (
                  <RawProperties properties={attributes} />
                )}
                <FlexBox>
                  {" "}
                  <h5 className={"me-1"}>Traits</h5>
                  <TooltipInfo>Traits are optional</TooltipInfo>
                </FlexBox>

                {!traits || Object.keys(traits).length === 0 ? (
                  <ul>No traits. (Traits are optional)</ul>
                ) : (
                  <RawProperties properties={traits} />
                )}
              </div>
            </div>
          ) : (
            <div>
              <DropZone
                accept={"zip"}
                onUpload={async (files: File[]) => {
                  setFile(files && files.length > 0 ? files[0] : null);
                }}
              >
                <>
                  <FontAwesomeIcon
                    icon={"file-import"}
                    width={24}
                    className={"Margin-R-1"}
                  />
                  <>drop your ZIP file here, or click to select it</>
                </>
              </DropZone>
              <Button
                color="secondary"
                disabled={!file}
                onClick={() => uploadFile()}
              >
                start tests
              </Button>
              {error && (
                <>
                  <div>
                    <i aria-hidden className="fas fa-exclamation-triangle" />
                    <span>
                      <strong>
                        An error occurred when uploading your project
                      </strong>
                      <p>{error}</p>
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/*//sandbox preview*/}
        <div className={"ms-auto w-100 h-100 " + styles.border2px}>
          <SandboxPreview
            hash={hash}
            ref={artworkIframeRef}
            record={filesRecord || undefined}
            textWaiting="Waiting for content to be reachable"
            onUrlUpdate={setUrl}
            onLoaded={iframeLoaded}
          />

          {url && (
            <Button
              variant={"secondary"}
              onClick={() => setHash(generateTxHash())}
            >
              test new hash
            </Button>
          )}
          {url && (
            <Button
              // @ts-ignore
              href={url}
              target="_blank"
            >
              open live
            </Button>
          )}
        </div>
      </FlexBoxCenterStretch>
    </section>
  );
}
