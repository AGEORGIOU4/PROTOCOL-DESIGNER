import React, { useEffect, useState } from "react";
import { CCol, CRow } from "@coreui/react-pro";

import { Form } from "./Form";
import LabwareSteps from "./Steps";
import { TitleBar } from "src/_common/helpers";
import WellSetup from "./Deck/WellSetup";
import Deck from "./Deck";

const AddLabware = () => {
  const [selectedSlot, setSelectedSlot] = useState("");
  const [newLabwareSelection, setNewLabwareSelection] = useState("");

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
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
          />
        </CRow>

        <hr />

        <CRow>

          <CCol md={6}>
            <Deck
              handleSelectedSlot={handleSelectedSlot}
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
