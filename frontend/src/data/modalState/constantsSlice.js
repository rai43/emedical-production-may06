import { produce } from "solid-js/store";
import { modalState, setModalState } from ".";

export const openConstantsModal = (modalParams) => {
  // title, size, bodyType = "", extraObject = {}
  setModalState(
    produce((state) => {
      state.isOpen = true;
      state.title = modalParams.title;
      state.size = modalParams.size || "md";
      state.bodyType = modalParams.bodyType || "";
      state.extraObject = modalParams.extraObject || {};
    })
  );

};
