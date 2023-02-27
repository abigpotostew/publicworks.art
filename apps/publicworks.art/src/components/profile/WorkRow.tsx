// @flow
import * as React from "react";
import { WorkSerializable } from "../../dbtypes/works/workSerializable";
import { FC } from "react";
import Link from "next/link";
import { FlexBox } from "../layout/FlexBoxCenter";
import { Pill } from "../content/Pill";
import { PillSmall } from "../content/PillSmall";
import styles from "./UserProfile.module.scss";
import { useNumMinted } from "../../hooks/useNumMinted";
import SpinnerLoading from "../loading/Loader";
import {
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Form,
  Row,
  SplitButton,
} from "react-bootstrap";
import { useLastMintedToken } from "../../hooks/useLastMintedToken";
import { relativeTimeFromDates } from "../../util/date-fmt/format";
import { ButtonPW } from "../button/Button";
import { trpcNextPW } from "../../server/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateWork } from "../../hooks/work/useInvalidateWork";
import useUserContext from "../../context/user/useUserContext";
import ModalStore from "../../modal/ModalStore";
interface Props {
  work: WorkSerializable;
  onChange: () => void;
}

function EditButtonDropdown({ work }: { work: WorkSerializable }) {
  return (
    <Dropdown as={ButtonGroup}>
      <Link href={`/create/${work.id}`} passHref={true} legacyBehavior>
        <ButtonPW variant={"outline-secondary"}>Edit</ButtonPW>
      </Link>
      <Dropdown.Toggle split variant="outline-secondary" />
      <Dropdown.Menu>
        <Dropdown.Item
          disabled={!!work.sg721}
          onClick={() => ModalStore.open("DeleteWorkModal", { work })}
        >
          Delete
        </Dropdown.Item>
        {/*<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>*/}
        {/*<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>*/}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export const WorkRow: FC<Props> = ({ work, onChange }: Props) => {
  const numMinted = useNumMinted(work.slug);
  const lastMintedToken = useLastMintedToken(work.slug);
  const { user } = useUserContext();
  const collectionSize = work.maxTokens;
  const published = !!work.sg721;
  const status = published ? "Published" : "Draft";
  const hidden = work.hidden ? "Hidden" : "visible";
  const { invalidateWork: invalidate } = useInvalidateWork();

  const utils = trpcNextPW.useContext();

  const editWorkMutation = trpcNextPW.works.editWork.useMutation();
  const setHiddenMutation = useMutation(
    async (hidden: boolean) => {
      console.log("setting hidden to", hidden);
      await editWorkMutation.mutateAsync({ id: work.id, hidden });
    },
    {
      onSuccess: () => {
        try {
          console.log("invalidating work");
          onChange();
        } catch (e) {
          console.log("error invalidating", e);
        }
      },
    }
  );

  const onHide = (hidden: boolean) => {
    setHiddenMutation.mutate(hidden);
  };

  return (
    <div
      className={
        "d-flex flex-row flex-nowrap justify-content-between align-items-center"
      }
    >
      <div>
        {/*Name flex*/}
        <FlexBox>
          <Link
            className={styles.workTitleLink}
            href={`/work/${work.slug}`}
            passHref={true}
          >
            {work.name}
          </Link>

          <PillSmall
            className={"ms-2 text-muted"}
            color={published ? "green" : "yellow"}
          >
            {status}
          </PillSmall>
        </FlexBox>
        <div className={"mt-1"}>
          <FlexBox>
            <div className={"fs-7"}>
              {numMinted.isLoading ? <SpinnerLoading /> : numMinted.data} /{" "}
              {collectionSize} Minted
            </div>
            <div className={"fs-7 ms-2"}>
              Last Mint:{" "}
              {lastMintedToken?.data?.createdDate
                ? relativeTimeFromDates(
                    new Date(lastMintedToken?.data?.createdDate)
                  )
                : "NA"}
            </div>
          </FlexBox>
        </div>
        <>
          <Form.Check
            className={"mt-2"}
            type="switch"
            id="custom-switch"
            label="Hidden"
            defaultChecked={!!work.hidden}
            disabled={!user.data || setHiddenMutation.isLoading}
            onChange={(e) => {
              onHide(e.target.checked);
            }}
          />
        </>
      </div>

      <div>
        <EditButtonDropdown work={work} />
      </div>
    </div>
  );
};
