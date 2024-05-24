import React, { useEffect } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CLoadingButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CMultiSelect,
  CRow,
} from "@coreui/react-pro";
import { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilReload, cilSave } from "@coreui/icons";
import {
  aluminium_blocks,
  reservoirs,
  tube_racks,
  well_plates,
} from "./Plates/data";
import { cidEyedropper } from "@coreui/icons-pro";
import WellPlateSelection from "./Plates/WellPlate/WellPlate";
import AddLabwareModal from "../5.Modal";
import TubeRackSelection from "./Plates/TubeRack/TubeRack";
import ReservoirSelection from "./Plates/Reservoir/Reservoir";
import AluminiumBlockSelection from "./Plates/AluminiumBlock/AluminiumBlock";
import { AddLiquids, disableInputFieldsOnSelect } from "./helpers";

export const Form = ({ selectedSlot, handleSubmitForm, setOpenModal, openModal }) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [tubeRackSelect, setTubeRackSelect] = useState("");
  const [wellPlateSelect, setWellPlateSelect] = useState("");
  const [reservoirSelect, setReservoirSelect] = useState("");
  const [aluminiumBlockSelect, setAluminiumBlockSelect] = useState("");

  const [selectedLabwareName, setSelectedLabwareName] = useState("");
  const [selectedLabwareType, setSelectedLabwareType] = useState("");

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [liquidVolume, setLiquidVolume] = useState("");


  useEffect(() => {
    if (openModal) {
      handleAddLiquids()
    }

  }, [openModal])

  useEffect(() => {
    setName(selectedSlot.name);

    setTubeRackSelect("");
    setWellPlateSelect("");
    setReservoirSelect("");
    setAluminiumBlockSelect("");

    if (selectedSlot.labware_type == "tube_rack") {
      setTubeRackSelect(selectedSlot.labware_name);
      setWellPlateSelect("");
      setReservoirSelect("");
      setAluminiumBlockSelect("");
    }

    if (selectedSlot.labware_type == "well_plate") {
      setTubeRackSelect("");
      setWellPlateSelect(selectedSlot.labware_name);
      setReservoirSelect("");
      setAluminiumBlockSelect("");
    }

    if (selectedSlot.labware_type == "reservoir") {
      setTubeRackSelect("");
      setWellPlateSelect("");
      setReservoirSelect(selectedSlot.labware_name);
      setAluminiumBlockSelect("");
    }

    if (selectedSlot.labware_type == "aluminium_block") {
      setTubeRackSelect("");
      setWellPlateSelect("");
      setReservoirSelect("");
      setAluminiumBlockSelect(selectedSlot.labware_name);
    }

    let action = selectedSlot.labware_type;

    disableInputFieldsOnSelect(selectedSlot, action);
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

  const handleChangeAluminiumBlock = (e) => {
    setAluminiumBlockSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "aluminium_block");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "aluminium_block",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };

  const handleReset = () => {
    disableInputFieldsOnSelect("default");

    setLoadingReset(true);
    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: "",
      labware_type: "",
      liquids: { selected: [] },
    };

    setTubeRackSelect("");
    setWellPlateSelect("");
    setReservoirSelect("");
    setAluminiumBlockSelect("");

    setSelectedLabwareName("");
    setSelectedLabwareType("");

    handleSubmitForm(item);
    setLoadingReset(false);
  };

  const handleClose = () => {
    setSelectedLiquid("");
    setLiquidVolume("");
    setVisible(false);
    setOpenModal(false)

    window.location.reload();
  };

  const getSelectedLabware = () => {
    if (tubeRackSelect) {
      setSelectedLabwareName(tubeRackSelect);
      setSelectedLabwareType("tube_rack");
    }
    if (wellPlateSelect) {
      setSelectedLabwareName(wellPlateSelect);
      setSelectedLabwareType("well_plate");
    }
    if (reservoirSelect) {
      setSelectedLabwareName(reservoirSelect);
      setSelectedLabwareType("reservoir");
    }
    if (aluminiumBlockSelect) {
      setSelectedLabwareName(aluminiumBlockSelect);
      setSelectedLabwareType("aluminium_block");
    }

    if (selectedLabwareName == "N/A") {
      setSelectedLabwareName("");
      setSelectedLabwareType("");
    }
  };

  const handleAddLiquids = () => {
    console.log("handle add")
    getSelectedLabware();
    setVisible(true);
  };

  const handleChangeSelectedLiquid = (e, color) => {
    setSelectedLiquid(e);
  };

  const handleChangeLiquidVolume = (e) => {
    setLiquidVolume(e.target.value);
  };

  return (
    <>
      <CCol md={12}>
        <CForm>
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom01">Slot Name</CFormLabel>
            <CFormInput
              type="text"
              id="validationCustom01"
              value={name || ""}
              onChange={handleChangeName}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <br />
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom02">Tube Rack</CFormLabel>
            <CFormSelect
              options={tube_racks}
              id="validationCustom02"
              value={tubeRackSelect || ""}
              onChange={(e) => handleChangeTubeRack(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <br />
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom03">Well Plate</CFormLabel>
            <CFormSelect
              options={well_plates}
              id="validationCustom03"
              value={wellPlateSelect || ""}
              onChange={(e) => handleChangeWellPlate(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <br />
          <CCol md4={12}>
            <CFormLabel htmlFor="validationCustom04">Reservoir</CFormLabel>
            <CFormSelect
              options={reservoirs}
              id="validationCustom04"
              value={reservoirSelect || ""}
              onChange={(e) => handleChangeReservoir(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <br />
          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">
              Aluminium Block
            </CFormLabel>
            <CFormSelect
              options={aluminium_blocks}
              id="validationCustom05"
              value={aluminiumBlockSelect || ""}
              onChange={(e) => handleChangeAluminiumBlock(e)}
            />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>
          <br />
          <CRow>
            <CCol md={4} style={{ textAlign: "start" }}>
              <CLoadingButton
                disabled={selectedSlot ? false : true}
                loading={loadingReset}
                className="standard-btn"
                onClick={handleReset}
              >
                <CIcon size="sm" icon={cilReload} /> RESET
              </CLoadingButton>
            </CCol>

            <CCol md={8} style={{ textAlign: "end" }}>
              <CButton
                className="standard-btn"
                style={{ marginRight: "10px" }}
                disabled={
                  tubeRackSelect ||
                    wellPlateSelect ||
                    reservoirSelect ||
                    aluminiumBlockSelect
                    ? false
                    : true
                }
                onClick={handleAddLiquids}
              >
                <CIcon size="sm" icon={cidEyedropper} /> ADD LIQUIDS
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>

      <br />

      <AddLabwareModal
        visible={visible}
        handleClose={handleClose}
        title={name}
        footerText={selectedLabwareName}
        fullView={true}
      >
        {tubeRackSelect &&
          React.Children.toArray(
            <>
              <AddLiquids
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleChangeSelectedLiquid={handleChangeSelectedLiquid}
                handleChangeLiquidVolume={handleChangeLiquidVolume}
              />
              <TubeRackSelection
                selectedSlot={selectedSlot}
                selectedLabware={selectedLabwareName}
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleClose={handleClose}
              />
            </>,
          )}

        {wellPlateSelect &&
          React.Children.toArray(
            <>
              <AddLiquids
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleChangeSelectedLiquid={handleChangeSelectedLiquid}
                handleChangeLiquidVolume={handleChangeLiquidVolume}
              />
              <WellPlateSelection
                selectedSlot={selectedSlot}
                selectedLabware={selectedLabwareName}
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleClose={handleClose}
              />
            </>,
          )}

        {reservoirSelect &&
          React.Children.toArray(
            <>
              <AddLiquids
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleChangeSelectedLiquid={handleChangeSelectedLiquid}
                handleChangeLiquidVolume={handleChangeLiquidVolume}
              />
              <ReservoirSelection
                selectedSlot={selectedSlot}
                selectedLabware={selectedLabwareName}
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleClose={handleClose}
              />
            </>,
          )}

        {aluminiumBlockSelect &&
          React.Children.toArray(
            <>
              <AddLiquids
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleChangeSelectedLiquid={handleChangeSelectedLiquid}
                handleChangeLiquidVolume={handleChangeLiquidVolume}
              />
              <AluminiumBlockSelection
                selectedSlot={selectedSlot}
                selectedLabware={selectedLabwareName}
                selectedLiquid={selectedLiquid}
                liquidVolume={liquidVolume}
                handleClose={handleClose}
              />
            </>,
          )}
      </AddLabwareModal>
    </>
  );
};
