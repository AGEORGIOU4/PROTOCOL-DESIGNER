import React, { useEffect, useState } from "react";
import {
  CCol,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
} from "@coreui/react-pro";

import { Form } from "./2.1.components/3.Form";
import Deck from "./2.1.components/2.Deck";
import CIcon from "@coreui/icons-react";
import { cilBeaker, cilDrop } from "@coreui/icons";
import LabwareSteps from "./2.1.components/1.Steps";
import { TitleBar } from "src/_common/helpers";
import AddLabwareModal from "./2.1.components/5.Modal";
import WellSetup from "./2.1.components/2.Deck/WellSetup";

const AddLabware = () => {
  const [activeKey, setActiveKey] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [newLabwareSelection, setNewLabwareSelection] = useState("");

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  };

  const handleDblClick = () => {
    // setOpenModal(true);
  };

  const handleSubmitForm = (newData) => {
    setNewLabwareSelection(newData);
  };

  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem("slots")); // Check memory
    } catch (e) {
      console.log(e);
    }
    console.log("Deck items:", items);
  }, []);

  return (
    <>
      <LabwareSteps
        active={
          newLabwareSelection.tube_rack ||
            newLabwareSelection.well_plate ||
            newLabwareSelection.aluminium_block ||
            newLabwareSelection.reservoir
            ? true
            : false
        }
      />
      <div className="wrapper flex-column ">
        <CRow>
          <TitleBar title={"LABWARE SETUP"} />
          <Form
            selectedSlot={selectedSlot}
            handleSubmitForm={handleSubmitForm}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </CRow>

        <CRow>

          <CCol md={6}>
            <Deck
              handleSelectedSlot={handleSelectedSlot}
              handleDblClick={handleDblClick}
              newLabwareSelection={newLabwareSelection}
            />
          </CCol>

          <CCol md={6}>

            <WellSetup
              selectedSlot={selectedSlot}
            />

          </CCol>

        </CRow>
      </div >
    </>
  );
};

export default AddLabware;
