import { useState, useMemo, useRef } from "react";
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

  console.log({ attributes, traits });

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
      <div>
        {error && (
          <>
            <div>
              <i aria-hidden className="fas fa-exclamation-triangle" />
              <span>
                <strong>An error occurred when uploading your project</strong>
                <p>{error}</p>
              </span>
            </div>
            {/*<Spacing size="regular" />*/}
          </>
        )}

        {filesRecord ? (
          <div>
            <div>
              <h5>Files</h5>
              <span>
                <i aria-hidden className="fas fa-file-archive" /> {file?.name}
              </span>
            </div>
            {/*<Spacing size="3x-small" />*/}
            <div className={styles.filesListContainer + " overflow-scroll"}>
              <div className={"overflow-scroll mh-100"}>
                {fileList?.map((f, index) => (
                  <div key={index}>{f}</div>
                ))}
              </div>
            </div>
            {/*<FileList files={fileList} />*/}
            {/*<Spacing size="2x-small" />*/}
            {/*<ButtonFile*/}
            {/*  state={"default"}*/}
            {/*  accepted={["application/zip", "application/x-zip-compressed"]}*/}
            {/*  onFile={updateFile}*/}
            {/*  size="small"*/}
            {/*  style={{*/}
            {/*    alignSelf: "flex-start",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  update .zip*/}
            {/*</ButtonFile>*/}

            {/*<Spacing size="2x-large" />*/}

            <div>
              <h5>Testing</h5>
              <p>You need to verify that:</p>
              <ul>
                <li>
                  a same hash will <strong>always</strong> generate the same
                  output
                </li>
                <li>
                  different hashes generate <strong>different</strong> outputs
                </li>
              </ul>

              {/*<HashTest*/}
              {/*  autoGenerate={false}*/}
              {/*  value={hash}*/}
              {/*  onHashUpdate={(hash) => setHash(hash)}*/}
              {/*  onRetry={() => {*/}
              {/*    artworkIframeRef.current?.reloadIframe();*/}
              {/*  }}*/}
              {/*/>*/}
            </div>

            {/*<Spacing size="2x-large" />*/}

            <div>
              <h5>Features</h5>
              {/*<Spacing size="small" />*/}
              <RawProperties properties={attributes} />
              <RawProperties properties={traits} />
            </div>
          </div>
        ) : (
          <div>
            <DropZone
              // textDefault="Drag 'n' drop your ZIP file here"
              accept={"zip"}
              onUpload={async (files: File[]) => {
                setFile(files && files.length > 0 ? files[0] : null);
              }}
            />
            <Button
              color="secondary"
              disabled={!file}
              onClick={() => uploadFile()}
            >
              start tests
            </Button>
          </div>
        )}
      </div>

      <div>
        <div>
          <div>
            <div>
              <SandboxPreview
                hash={hash}
                ref={artworkIframeRef}
                record={filesRecord || undefined}
                textWaiting="Waiting for content to be reachable"
                onUrlUpdate={setUrl}
                onLoaded={iframeLoaded}
              />
            </div>
          </div>
        </div>

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
    </section>
  );
}
