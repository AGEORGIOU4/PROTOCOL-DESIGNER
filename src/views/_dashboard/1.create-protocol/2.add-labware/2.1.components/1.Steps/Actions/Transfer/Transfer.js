import React, { useEffect } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react-pro";
import { useState } from "react";
import { options_ChangeTip, options_Pipettes } from "./data";
import CIcon from "@coreui/icons-react";
import { cidEyedropper } from "@coreui/icons-pro";
import AddLabwareModal from "../../../5.Modal";
import { AddLiquids } from "../../../3.Form/helpers";
import TubeRackSelection from "../../../3.Form/Plates/TubeRack/TubeRack";
import WellPlateSelection from "../../../3.Form/Plates/WellPlate/WellPlate";
import ReservoirSelection from "../../../3.Form/Plates/Reservoir/Reservoir";
import AluminiumBlockSelection from "../../../3.Form/Plates/AluminiumBlock/AluminiumBlock";

export const TransferForm = () => {
  const [visible, setVisible] = useState(false);

  const [sourceItems, setSourceItems] = useState([]);
  const [validated, setValidated] = useState(false);

  const [selectedSource, setSelectedSource] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");

  const [tubeRackSelect, setTubeRackSelect] = useState("");
  const [wellPlateSelect, setWellPlateSelect] = useState("");
  const [reservoirSelect, setReservoirSelect] = useState("");
  const [aluminiumBlockSelect, setAluminiumBlockSelect] = useState("");

  const [selectedLabwareName, setSelectedLabwareName] = useState("");
  const [selectedLabwareType, setSelectedLabwareType] = useState("");

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [liquidVolume, setLiquidVolume] = useState("");

  let selectedSlot = "";

  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem("slots")); // Check memory
    } catch (e) {
      console.log(e);
    }

    let tmp_items = [];

    if (items) {
      items?.map((item, index) => {
        if (index > 0) {
          tmp_items.push(item);
        }
      });

      const new_items = tmp_items.map((item) => ({
        value: JSON.stringify(item),
        label: item.name,
      }));
      setSourceItems(new_items);
      setSelectedSource(new_items[0]);
      selectedSlot = JSON.parse(new_items[0].value);
      console.log(selectedSlot);
    }

    handleTypeOfLabware();
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handleTypeOfLabware = () => {
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
  };

  const handleChangeSource = (e) => {
    setSelectedSource(e.target.value);
    selectedSlot = JSON.parse(e.target.value);

    handleTypeOfLabware();
  };

  const handleClose = () => {
    setVisible(false);
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
      <CRow>
        <CCol md={12}>
          <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <div className="modal-header-row">
              <CCol md={7} style={{ paddingTop: "12px" }}>
                <h5 className="modal-subtitle">TRANSFER</h5>
              </CCol>
            </div>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom01">Pipette</CFormLabel>
              <CFormSelect
                options={options_Pipettes}
                id="validationCustom01"
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={1}>
              <CFormLabel htmlFor="validationCustom02">Volume Per</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type="number" id="validationCustom02" required />
                <CInputGroupText id="basic-addon2">μL</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <div className="modal-header-row">
              <CCol md={7} style={{ padding: "0" }}>
                <h5 className="modal-subtitle">ASPIRATE</h5>
              </CCol>
              <CCol md={5} style={{ paddingLeft: "8px" }}>
                <h5 className="modal-subtitle">DISPENSE</h5>
              </CCol>
            </div>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom03">Source</CFormLabel>
              <CFormSelect
                options={sourceItems}
                id="validationCustom03"
                value={selectedSource || ""}
                onChange={(e) => handleChangeSource(e)}
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={1}>
              <CFormLabel htmlFor="validationCustom04">Wells</CFormLabel>
              <CFormInput
                style={{ caretColor: "transparent" }}
                onClick={handleAddLiquids}
                id="validationCustom04"
                required
              />

              {/* <CButton className='standard-btn' style={{ marginRight: '10px' }} disabled={tubeRack || wellPlate || reservoir || aluminiumBlock ? false : true} onClick={handleAddLiquids}><CIcon size='sm' icon={cidEyedropper} /> ADD LIQUIDS</CButton> */}

              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom05">Destination</CFormLabel>
              <CFormSelect
                options={sourceItems}
                id="validationCustom05"
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom06">Wells</CFormLabel>
              <CFormInput type="number" id="validationCustom06" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormCheck id="flexCheckDefault" label="Mix Before" />
            </CCol>

            {/* SPACER */}
            <CCol md={5}></CCol>

            <CCol md={2}>
              <CFormCheck id="flexCheckDefault" label="Mix After" />
            </CCol>

            <div className="modal-header-row">
              <CCol md={7} style={{ paddingTop: "12px" }}>
                <h5 className="modal-subtitle">STERILITY</h5>
              </CCol>
            </div>

            <CCol md={6}>
              <CFormLabel htmlFor="validationCustom05">Change Tip</CFormLabel>
              <CFormSelect
                options={options_ChangeTip}
                id="validationCustom05"
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="validationPath">Path</CFormLabel>
              {/* Missing Icons from Figma as one entity please */}
            </CCol>
          </CForm>
        </CCol>
      </CRow>

      <br />

      <AddLabwareModal
        visible={visible}
        handleClose={handleClose}
        title={selectedLabwareName}
        footerText={selectedLabwareName}
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
