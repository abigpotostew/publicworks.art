import { proxy } from "valtio";
import { WorkSerializable } from "@publicworks/db-typeorm/serializable";

/**
 * Types
 */
interface ModalData {
  work?: WorkSerializable;
}

interface State {
  open: boolean;
  view?: "DeleteWorkModal" | "LoginModal";

  data?: ModalData;
}

/**
 * State
 */
const state = proxy<State>({
  open: false,
});

/**
 * Store / Actions
 */
const ModalStore = {
  state,

  open(view: State["view"], data: State["data"]) {
    state.view = view;
    state.data = data;
    state.open = true;
  },

  close() {
    state.open = false;
  },
};

export default ModalStore;
