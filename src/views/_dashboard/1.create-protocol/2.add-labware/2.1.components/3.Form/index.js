import React, { useEffect } from "react";
import {
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CLoadingButton,
  CRow,
} from "@coreui/react-pro";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilReload } from "@coreui/icons";
import { aluminium_blocks, reservoirs, tube_racks, well_plates } from "./Plates/data";
import WellPlateSelection from "./Plates/WellPlate/WellPlate";
import AddLabwareModal from "../5.Modal";
import TubeRackSelection from "./Plates/TubeRack/TubeRack";
import ReservoirSelection from "./Plates/Reservoir/Reservoir";
import AluminiumBlockSelection from "./Plates/AluminiumBlock/AluminiumBlock";
import { AddLiquids, disableInputFieldsOnSelect } from "./helpers";

export const Form = ({ selectedSlot, handleSubmitForm }) => {

  const [name, setName] = useState("");
  const [tubeRackSelect, setTubeRackSelect] = useState("");
  const [wellPlateSelect, setWellPlateSelect] = useState("");
  const [reservoirSelect, setReservoirSelect] = useState("");

  useEffect(() => {
    setName(selectedSlot.name);

    setTubeRackSelect("");
    setWellPlateSelect("");
    setReservoirSelect("");


    if (selectedSlot.labware_type == "tube_rack") {
      setTubeRackSelect(selectedSlot.labware_name);
      setWellPlateSelect("");
      setReservoirSelect("");

    }

    if (selectedSlot.labware_type == "well_plate") {
      setTubeRackSelect("");
      setWellPlateSelect(selectedSlot.labware_name);
      setReservoirSelect("");

    }

    if (selectedSlot.labware_type == "reservoir") {
      setTubeRackSelect("");
      setWellPlateSelect("");
      setReservoirSelect(selectedSlot.labware_name);
    }

  }, [selectedSlot]);

  const handleChangeName = (e) => {
    let text = e.target.value;
    setName(text);

    let item = {
      id: selectedSlot.id,
      name: text,
      labware_name: selectedSlot.labware_name,
      labware_type: selectedSlot.labware_type,
      liquids: selectedSlot.liquids,
    };

    if (text.length > 0) {
      handleSubmitForm(item);
    }
  };

  const handleChangeTubeRack = (e) => {
    setTubeRackSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "tube_rack");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "tube_rack",
      liquids: selectedSlot.liquids,
    };
    handleSubmitForm(item);
  };

  const handleChangeWellPlate = (e) => {
    setWellPlateSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "well_plate");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "well_plate",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };

  const handleChangeReservoir = (e) => {
    setReservoirSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "reservoir");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "reservoir",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };

  return (
    <>

      <CForm>
        <CRow>
          <CCol md={3}>
            <CFormLabel htmlFor="validationCustom01">Slot Name</CFormLabel>
            <CFormInput
              type="text"
              id="validationCustom01"
              value={name || ""}
              onChange={handleChangeName}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="validationCustom02">Tube Rack</CFormLabel>
            <CFormSelect
              options={tube_racks}
              id="validationCustom02"
              value={tubeRackSelect || ""}
              onChange={(e) => handleChangeTubeRack(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="validationCustom03">Well Plate</CFormLabel>
            <CFormSelect
              options={well_plates}
              id="validationCustom03"
              value={wellPlateSelect || ""}
              onChange={(e) => handleChangeWellPlate(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={3}>
            <CFormLabel htmlFor="validationCustom04">Reservoir</CFormLabel>
            <CFormSelect
              options={reservoirs}
              id="validationCustom04"
              value={reservoirSelect || ""}
              onChange={(e) => handleChangeReservoir(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>


        </CRow>

      </CForm>

    </>
  );
};
