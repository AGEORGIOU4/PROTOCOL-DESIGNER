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
import TubeRackSource from "../../../3.Form/Plates/TubeRack/TubeRackSource";
import TubeRackDestination from "../../../3.Form/Plates/TubeRack/TubeRackDestination";
import WellPlateSelection from "../../../3.Form/Plates/WellPlate/WellPlate";
import ReservoirSelection from "../../../3.Form/Plates/Reservoir/Reservoir";
import AluminiumBlockSelection from "../../../3.Form/Plates/AluminiumBlock/AluminiumBlock";
import { Notes } from "../../Components/notes";
import { useTubeRackContext } from "src/context/TubeRackContext";

export const TransferForm = ({ onClose, onDelete, stepId, stepTitle }) => {
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
  const [volumePer, setVolumePer] = useState(0)

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [liquidVolume, setLiquidVolume] = useState("");

  const [isDestination, setIsDestination] = useState(false);
  const [isSourceReady, setSourceReady] = useState(false)


  const { selectedSlot, setSelectedSlot, sourceSlots } = useTubeRackContext();

  const [isNotesOpen, setIsNotesOpen] = useState(false);

  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem("slots")); // Check memory
    } catch (e) {
      console.log(e);
    }

    let tmp_items = [];

    try {
      if (items.length > 1) {
        items?.map((item, index) => {
          if (index > 0) {
            tmp_items.push(item);
          }
        });

        const new_items = tmp_items.map((item) => ({
          value: JSON.stringify(item),
          label: item.name,
        }));


        const jsonfyValue = JSON.parse(new_items[0].value);

        jsonfyValue.liquids.selected.forEach(liquid => {
          if (liquid.wells.length > 0) {
            // Transform each well string into an object with id and volume
            liquid.wells = liquid.wells.map(well => ({
              id: well,
              volume: liquid.volume
            }));
          }
        });
        // debugger
        setSourceItems(new_items);
        setSelectedSource(new_items[0]);
        setSelectedDestination(new_items);
        setSelectedSlot(jsonfyValue);
        handleTypeOfLabware(JSON.parse(new_items[0].value));
      }
    } catch (e) {
      console.log(e)
    }

  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(false);
    } else {
      const formData = {
        stepTitle: stepTitle,
        source: selectedSource,
        destination: selectedDestination,
        tubeRackSelect: tubeRackSelect,
        wellPlateSelect: wellPlateSelect,
        reservoirSelect: reservoirSelect,
        aluminiumBlockSelect: aluminiumBlockSelect,
        selectedLabware: {
          name: selectedLabwareName,
          type: selectedLabwareType
        },
        liquid: {
          name: selectedLiquid,
          volume: liquidVolume
        }
      };

      console.log(JSON.stringify(formData, null, 2));

    }
    setValidated(true);
  };


  const handleTypeOfLabware = (selected) => {
    if (selected.labware_type == "tube_rack") {
      setTubeRackSelect(selected.labware_name);
      setWellPlateSelect("");
      setReservoirSelect("");
      setAluminiumBlockSelect("");
    }

    if (selected.labware_type == "well_plate") {
      setTubeRackSelect("");
      setWellPlateSelect(selected.labware_name);
      setReservoirSelect("");
      setAluminiumBlockSelect("");
    }

    if (selected.labware_type == "reservoir") {
      setTubeRackSelect("");
      setWellPlateSelect("");
      setReservoirSelect(selected.labware_name);
      setAluminiumBlockSelect("");
    }

    if (selected.labware_type == "aluminium_block") {
      setTubeRackSelect("");
      setWellPlateSelect("");
      setReservoirSelect("");
      setAluminiumBlockSelect(selected.labware_name);
    }
  };

  const handleChangeSource = (e) => {
    const selected = JSON.parse(e.target.value);
    setSelectedSlot(selected); // Update context
    setSelectedSource(e.target.value);
    handleTypeOfLabware(selected);
  };

  const handleChangeDestination = (e) => {
    const selected = JSON.parse(e.target.value);
    setSelectedSlot(selected); // Update context
    setSelectedDestination(e.target.value)
    handleTypeOfLabware(selected);
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

  const handleAddLiquids = (fromDestination) => {
    getSelectedLabware(); // Ensure the selected labware name and type are up-to-date.
    if (volumePer <= 0)
      alert("Please select Volume Per Above")
    setIsDestination(fromDestination); // Set whether the modal is being opened for destination.
    // debugger
    // Assume `setSourceReady` logic is correct and sets the flag based on whether the source is prepared.
    const items = JSON.parse(localStorage.getItem('tubeTransfer'));
    if (items) {
      let foundItem = items.find(item => item.stepId === stepId);
      let isSourcePrepared
      if (!foundItem) {
        foundItem = items[items.length - 1];
        isSourcePrepared = foundItem && foundItem.destination.length > 0;
      } else {
        isSourcePrepared = foundItem && foundItem.source.length > 0;
      }
      setSourceReady(isSourcePrepared);
      console.log(Object.keys(sourceSlots).length > 0)
      // Only set the modal to visible if not fromDestination or if the source is prepared.
      if (!fromDestination || (isSourcePrepared && Object.keys(sourceSlots).length > 0)) {
        setVisible(true);
      } else {
        // Optional: Provide feedback to the user why they can't proceed.
        alert("Please configure the source first.");
      }
    } else if (!isDestination) {
      setVisible(true)
    }

  };


  const handleChangeSelectedLiquid = (e, color) => {
    setSelectedLiquid(e);
  };

  const handleChangeLiquidVolume = (e) => {
    setLiquidVolume(e.target.value);
  };

  const handleChangeVolumePer = (e) => {
    setVolumePer(e.target.value)
  }

  const handleNotesClick = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);
  const handleLocalClose = () => onClose();

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
                <CFormInput type="number" id="validationCustom02" value={volumePer} onChange={handleChangeVolumePer} required />
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
                onClick={() => handleAddLiquids(false)}
                id="validationCustom04"
                required
              />

              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom05">Destination</CFormLabel>
              <CFormSelect
                options={sourceItems}
                id="validationCustom05"
                value={selectedDestination || ""}
                onChange={(e) => handleChangeDestination(e)}
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={1}>
              <CFormLabel htmlFor="validationCustom06">Wells</CFormLabel>
              <CFormInput
                style={{ caretColor: "transparent" }}
                onClick={() => handleAddLiquids(true)}
                id="validationCustom06"
                required
              />
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
            {/* Control Buttons */}
            <CRow className="mt-3">
              <CCol
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "50px",
                }}
              >
                <CButton
                  className="dial-btn-left"
                  onClick={() =>
                    onDelete({ target: { id: stepId, value: stepTitle } })
                  }
                >
                  Delete
                </CButton>
                <CButton className="dial-btn-left" onClick={handleNotesClick}>
                  Notes
                </CButton>
              </CCol>
              <CCol
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "50px",
                }}
              >
                <CButton className="dial-btn-close" onClick={handleLocalClose}>
                  Close
                </CButton>
                <CButton className="dial-btn-save" type="submit">
                  Save
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCol>
      </CRow>

      <br />



      {/* Notes Component */}
      <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />

      <AddLabwareModal
        visible={visible}
        handleClose={handleClose}
        title={selectedLabwareName}
        footerText={selectedLabwareName}
        showFooter={false}
        fullView={true}
      >
        {(tubeRackSelect && !isDestination) &&
          React.Children.toArray(
            <>
              <TubeRackSource
                stepId={stepId}
                volumePer={volumePer}
                selectedLabware={selectedLabwareName}
                liquidVolume={liquidVolume}
                handleClose={handleClose}
              />
            </>,
          )}
        {(tubeRackSelect && isDestination && isSourceReady) &&
          React.Children.toArray(
            <>
              <TubeRackDestination
                stepId={stepId}
                volumePer={volumePer}
                selectedLabware={selectedLabwareName}
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
