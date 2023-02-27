import React from "react";
import { UserSerializable } from "src/dbtypes/users/userSerializable";
import { emptyTrpcQueryResult } from "src/trpc/util";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";

export type UserContextValue = {
  user: UseTRPCQueryResult<UserSerializable, any>;
};

const UserContext = React.createContext<UserContextValue>({
  user: emptyTrpcQueryResult(),
});

export default UserContext;
