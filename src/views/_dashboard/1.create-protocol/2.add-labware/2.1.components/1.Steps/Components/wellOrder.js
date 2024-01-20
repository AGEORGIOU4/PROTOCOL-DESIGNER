import React from "react";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
} from "@coreui/react-pro";
import { useModal } from "src/contexts/ModalContext";

export const WellOrder = () => {
  const { isModalOpen, closeModal } = useModal();
  console.log(isModalOpen);

  return (
    <CModal
      visible={isModalOpen}
      onClose={closeModal}
      size="lg"
      backdrop={true}
    >
      <CModalHeader onClose={closeModal}>
        <CModalTitle>Well Order Settings</CModalTitle>
      </CModalHeader>
      <CModalBody>{/* Content of your Well Order settings */}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={closeModal}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  );
};
