import React from "react";
import { UserSerializable } from "src/dbtypes/users/userSerializable";
import { UseTRPCQueryResult } from "@trpc/react/shared";
import { emptyTrpcQueryResult } from "src/trpc/util";

export type UserContextValue = {
  user: UseTRPCQueryResult<UserSerializable, any>;
};

const UserContext = React.createContext<UserContextValue>({
  user: emptyTrpcQueryResult(),
});

export default UserContext;
