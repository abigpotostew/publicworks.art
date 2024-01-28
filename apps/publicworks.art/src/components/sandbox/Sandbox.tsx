import React, { useState, useMemo, useRef } from "react";
import { RawTokenProperties, SandboxFiles } from "../../types/Sandbox";
import { generateTxHash } from "src/generateHash";
import { processZipSandbox } from "src/util/sandbox";
import { DropZone } from "src/components/DropZone";
import {
  ArtworkIframeRef,
  SandboxPreview,
} from "src/components/sandbox/SandboxPreview";
import { Button, Form } from "react-bootstrap";
import { RawProperties } from "src/components/nft/RawProperties";
import styles from "./Sandbox.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FlexBox,
  FlexBoxCenter,
  FlexBoxCenterStretch,
} from "../layout/FlexBoxCenter";
import { TooltipInfo } from "../tooltip/TooltipInfo";
import SpinnerLoading from "../loading/Loader";
import { cs } from "date-fns/locale";
import { validAttributes } from "@publicworks/shared-utils/attributes";
import Link from "next/link";
import { ButtonPW } from "../button/Button";
import { cn } from "../../lib/css/cs";

export function Sandbox() {
  const artworkIframeRef = useRef<ArtworkIframeRef>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHashState] = useState<string>(generateTxHash());
  const [filesRecord, setFilesRecord] = useState<SandboxFiles | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<RawTokenProperties | null>(null);
  const [previewReady, setPreviewReady] = useState<boolean>(false);
  const [traits, setTraits] = useState<RawTokenProperties | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [cssSelector, setCssSelector] = useState<string>("");
  const hasAttributes = !!attributes && Object.keys(attributes).length > 0;
  const hasTraits = !!traits && Object.keys(traits).length > 0;
  const fileList = useMemo<string[] | null>(
    () => (filesRecord ? Object.keys(filesRecord) : null),
    [filesRecord]
  );

  const restart = () => {
    setError(null);
    setFile(null);
    setFilesRecord(null);
    setUrl(null);
    setTraits(null);
    setAttributes(null);
    setPreviewReady(false);
    setImgUrl(null);
    setCssSelector("");
  };
  const setHash = (hash: string) => {
    setImgUrl(null);
    setTraits(null);
    setAttributes(null);
    setPreviewReady(false);
    setHashState(hash);
  };

  const processFile = async (file: File) => {
    try {
      const record = await processZipSandbox(file);
      setFilesRecord(record);
    } catch (err) {
      // todo: process error
      setError((err as any)?.toString());
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
    if (artworkIframeRef.current) {
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
        const fetchPreviewReady = () => {
          // @ts-ignore
          const pr = !!iframe.contentWindow?.previewReady;
          setPreviewReady(pr);
          return pr;
        };
        if (!fetchPreviewReady()) {
          console.log("preview ready yet, reloading");
          setTimeout(() => iframeLoaded(true), 500);
          return;
        } else {
          const [tra, attr] = fetchAttributes();
          console.log("traits", tra, "attributes", attr);

          if (!attr && !tra) {
            console.log("no attributes, FAILED!");
            setError(
              "No attributes found. Please add attributes to your artwork before marking preview ready with `setPreviewReady()`"
            );
          }

          const captureImg = (selector: string) => {
            const el = iframe?.contentDocument?.querySelector(selector);
            // const el = iframe?.querySelector(selector);
            if (!el || !("toDataURL" in el)) {
              return null;
            }
            // @ts-ignore
            return el.toDataURL("image/png");
          };
          if (cssSelector) {
            const img = captureImg(cssSelector);
            setImgUrl(img);
          }
        }
      }
    }
  };

  const allConditionsMet = previewReady && hasAttributes && imgUrl;

  return (
    <section>
      {/*<FlexBoxCenter></FlexBoxCenter>*/}
      <FlexBoxCenterStretch>
        <div>
          {filesRecord ? (
            <div>
              <a href={"#"} onClick={() => restart()}>
                <div>
                  <FontAwesomeIcon icon={"backward"} width={18} /> Restart
                </div>
              </a>

              <div className={"mt-6"}>
                <h5>CSS Selector</h5>
                <span>{cssSelector ? cssSelector : "not specified"}</span>
              </div>

              <div className={"mt-6 mb-3"}>
                <h5>Files</h5>
                <span>
                  <i aria-hidden className="fas fa-file-archive" /> {file?.name}
                </span>
              </div>
              <div
                className={styles.filesListContainer + " overflow-scroll p-2"}
              >
                <div className={"overflow-scroll mh-100"}>
                  {fileList?.map((f, index) => (
                    <div key={index}>{f}</div>
                  ))}
                </div>
              </div>

              <div className={"mt-6"}>
                <h5>Testing</h5>
                <p>Your work must pass these conditions:</p>
                <ul>
                  <li>
                    the same hash will <strong>always</strong> generate the same
                    output and be resolution agnostic
                  </li>
                  <li>
                    different hashes generate <strong>different</strong> outputs
                  </li>
                </ul>
              </div>

              <div className={"mt-6"}>
                <h5>
                  Preview Ready{" "}
                  {previewReady ? (
                    <FontAwesomeIcon icon={"check"} width={18} />
                  ) : (
                    <SpinnerLoading />
                  )}
                </h5>
                {previewReady && <p>Your sketch has marked Preview Ready</p>}
                {!previewReady && (
                  <p>
                    <FontAwesomeIcon icon={"xmark"} width={18} /> Waiting for
                    Preview Ready to be set.
                  </p>
                )}
                <div className={"mt-6"}>
                  <h5>
                    Attributes{" "}
                    {hasAttributes ? (
                      <FontAwesomeIcon icon={"check"} width={18} />
                    ) : previewReady ? (
                      <FontAwesomeIcon icon={"minus"} width={18} />
                    ) : (
                      <SpinnerLoading />
                    )}
                  </h5>
                  {!hasAttributes ? (
                    <ul>
                      No attributes. (Attributes are optional but recommended)
                    </ul>
                  ) : (
                    <RawProperties properties={attributes} />
                  )}
                </div>
                <div className={"mt-6"}>
                  <h5 className={""}>
                    Traits{" "}
                    {hasTraits ? (
                      <FontAwesomeIcon icon={"check"} width={18} />
                    ) : previewReady ? (
                      <FontAwesomeIcon icon={"minus"} width={18} />
                    ) : (
                      <SpinnerLoading />
                    )}
                  </h5>

                  {!traits || Object.keys(traits).length === 0 ? (
                    <ul>No traits. (Traits are optional)</ul>
                  ) : (
                    <RawProperties properties={traits} />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <DropZone
                accept={"zip"}
                onUpload={async (files: File[]) => {
                  setError(null);
                  setFile(files && files.length > 0 ? files[0] : null);
                }}
              >
                <span>
                  <FontAwesomeIcon
                    icon={"file-import"}
                    width={24}
                    className={"Margin-R-1"}
                  />
                  <>drop your ZIP file here, or click to select</>
                </span>
                {file && (
                  <div className={"mt-2 overflow-hidden"}>
                    File: {file ? file.name : ""}
                  </div>
                )}
                {!file && (
                  <div className={"mt-2 overflow-hidden"}>
                    Waiting for file...
                  </div>
                )}
              </DropZone>

              <Form.Group className={"mt-3"} controlId="cssSelector">
                <Form.Label>
                  CSS Selector{" "}
                  <TooltipInfo>
                    Required canvas CSS selector targeting your sketch canvas.
                    Used to test the image preview.
                  </TooltipInfo>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={cssSelector}
                  placeholder={""}
                  onChange={(e) => setCssSelector(e.target.value)}
                  name="cssSelector"
                />
              </Form.Group>

              <Button
                className={"mt-3"}
                color="secondary"
                disabled={!file || !!error}
                onClick={() => uploadFile()}
              >
                Start test
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
        <div>
          <div className={"ms-auto w-100 p-8 pt-0 " + styles.border2px}>
            <h5 className={"mt-4"}>Live Preview</h5>
            {file ? (
              <SandboxPreview
                hash={hash}
                ref={artworkIframeRef}
                record={filesRecord || undefined}
                textWaiting="Waiting for content to be reachable"
                onUrlUpdate={setUrl}
                onLoaded={iframeLoaded}
              />
            ) : (
              <div className={"w-100 mb-2 " + styles.height30rem}></div>
            )}

            <div className={"pt-4"}>
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
                  className={"ms-2"}
                  // @ts-ignore
                  href={url}
                  target="_blank"
                >
                  open live
                </Button>
              )}
            </div>
          </div>
          <div className={cn(styles.border2px, "p-8 pt-0")}>
            <h5 className={"mt-4"}>Image Preview</h5>
            {file && !cssSelector && (
              <div>
                No CSS selector specified. Image preview will not be captured.
              </div>
            )}
            {imgUrl && <img src={imgUrl} className={"w-100 "} />}
          </div>
          {allConditionsMet && (
            <div className={"mt-5"}>
              Your works meets all testing parameters!{" "}
              <Link href={"/create"}>
                <Button className={""}>Create Work</Button>
              </Link>
            </div>
          )}
        </div>
      </FlexBoxCenterStretch>
    </section>
  );
}
