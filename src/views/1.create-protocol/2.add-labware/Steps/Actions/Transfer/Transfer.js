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
  CFormSwitch,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react-pro";
import { useState } from "react";
import { options_ChangeTip, options_LiquidDetection, options_LiquidType, options_Pipettes, options_PressureDetection } from "./data";
import CIcon from "@coreui/icons-react";
import { cidEyedropper } from "@coreui/icons-pro";
import AddLabwareModal from "../../../Modal";
import { AddLiquids } from "../../../Form/helpers";
import TubeRackSelection from "../../../Form/Plates/TubeRack/TubeRack";
import TubeRackSource from "../../../Form/Plates/TubeRack/TubeRackSource";
import TubeRackDestination from "../../../Form/Plates/TubeRack/TubeRackDestination";
import WellPlateSelection from "../../../Form/Plates/WellPlate/WellPlate";
import ReservoirSelection from "../../../Form/Plates/Reservoir/Reservoir";
import AluminiumBlockSelection from "../../../Form/Plates/AluminiumBlock/AluminiumBlock";
import { Notes } from "../../Components/notes";
import { useTubeRackContext } from "src/context/TubeRackContext";
import { cilInfo, cilSettings } from "@coreui/icons";

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

  const [selectedDestinationSlot, setSelectedDestinationSlot] = useState("")
  const [selectedSourceSlot, setSelectedSourceSlot] = useState("")

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [selectPipette, setSelectedPipette] = useState(options_Pipettes[0].value)
  const [liquidVolume, setLiquidVolume] = useState("");

  const [isDestination, setIsDestination] = useState(false);
  const [isSourceReady, setSourceReady] = useState(false)

  const [selectedChangeTip, setSelectedChangeTip] = useState(options_ChangeTip[0].value)

  const [checkboxStates, setCheckboxStates] = useState({
    mixBefore: false,
    mixAfter: false,
  });


  const { selectedSlot, setSelectedSlot, sourceSlots, setSourceSlots } = useTubeRackContext();

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
        setSelectedDestinationSlot(new_items[0])
        setSelectedSourceSlot(new_items[0])
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
      const items = JSON.parse(localStorage.getItem('tubeTransfer'));
      const currentStep = items.find(item => item.stepId === stepId);
      if (!currentStep.source || !currentStep.destination) {
        form.checkValidity() === false
        event.stopPropagation()
        setValidated(false)
      }
      const formData = {
        stepTitle: stepTitle,
        pipette: selectPipette,
        source: currentStep.source,
        destination: currentStep.destination,
        sourceTransfer: sourceSlots,
        sourceTubeRackSelect: selectedSourceSlot,
        destinationTubeRackSelect: selectedDestinationSlot,
        mixBefore: checkboxStates.mixBefore,
        mixAfter: checkboxStates.mixAfter,
        changeTip: selectedChangeTip,
      };
      debugger

      console.log(JSON.stringify(formData, null, 2));

      const stepStates = JSON.parse(localStorage.getItem('stepStates'))
      if (!stepStates) {

      }

    }
    setValidated(true);
  };

  const handleOnChangeSelectedChangeTip = (e) => {
    setSelectedChangeTip(e.target.value)
  }

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
    setSelectedSourceSlot(selected)
    setSelectedSlot(selected); // Update context
    setSelectedSource(e.target.value);
    handleTypeOfLabware(selected);
  };

  const handleChangePipette = (e) => {
    setSelectedPipette(e.target.value)
  }

  const handleChangeDestination = (e) => {
    const selected = JSON.parse(e.target.value);
    setSelectedDestinationSlot(selected)
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

  const handleCheckboxChange = (e) => {
    const { id } = e.target;


    setCheckboxStates(currentState => ({
      ...currentState,
      [id]: !currentState[id],
    }));
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



  const [isPressureAIEnabled, setIsPressureAIEnabled] = useState(false);

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

            {/* TODO */}
            <CCol md={5}>
              <CFormLabel htmlFor="validationCustom01" style={{ width: "100%" }}>
                <p>
                  Volume (μL)
                </p>
              </CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type="number" id="validationCustom02" value={volumePer} onChange={handleChangeVolumePer} required />
                <CInputGroupText id="basic-addon2">μL</CInputGroupText>
              </CInputGroup>

              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>


            {/* SPACER */}
            <CCol md={2}></CCol>

            {/* TODO */}
            <CCol md={5}>
              <CFormLabel htmlFor="validationCustom02" style={{ width: "100%" }}>
                <p>
                  Tips
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>

                </p>
              </CFormLabel>
              <CFormSelect
                options={options_Pipettes}
                id="validationCustom01"
                onChange={handleChangePipette}
                required
              />
            </CCol>

            {/* Aspirate, Dispense */}
            <CCol
              md={5}
              style={{
                borderBottom: `2px solid black`,
              }}
            >
              <h5
                className="modal-subtitle"
                style={{ color: "black" }}
              >
                ASPIRATE
              </h5>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol
              md={5}
              style={{
                borderBottom: `2px solid black`,
              }}
            >
              <h5
                className="modal-subtitle"
                style={{ color: "black" }}
              >
                DISPENSE
              </h5>

            </CCol>


            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>
                Source
                <span className="float-end">
                  <CIcon
                    size="sm"
                    icon={cilInfo}
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </CFormLabel>
              <CFormSelect
                options={sourceItems}
                id="validationCustom03"
                value={selectedSource || ""}
                onChange={(e) => handleChangeSource(e)}
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom04" style={{ width: "100%" }}>Wells
                <span className="float-end">
                  <CIcon
                    size="sm"
                    icon={cilInfo}
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </CFormLabel>
              <CFormInput
                style={{ caretColor: "transparent" }}
                onClick={() => handleAddLiquids(false)}
                placeholder="Select Wells"
                id="validationCustom04"
              />

              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom05" style={{ width: "100%" }}>Destination
                <span className="float-end">
                  <CIcon
                    size="sm"
                    icon={cilInfo}
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </CFormLabel>
              <CFormSelect
                options={sourceItems}
                id="validationCustom05"
                value={selectedDestination || ""}
                onChange={(e) => handleChangeDestination(e)}
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom06" style={{ width: "100%" }}>Wells
                <span className="float-end">
                  <CIcon
                    size="sm"
                    icon={cilInfo}
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </CFormLabel>
              <CFormInput
                style={{ caretColor: "transparent" }}
                onClick={() => handleAddLiquids(true)}
                placeholder="Select Wells"
                id="validationCustom06"
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={5}>


              <input style={{ marginRight: "10px" }} type="checkbox" id="mixBefore1" name="mixBefore1" />
              <label for="mixBefore1">Mix Before Aspiration</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="delay1" name="delay1" />
              <label for="delay1">Air Gap</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="touchTip1" name="touchTip1" />
              <label for="touchTip1">Delay Before</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="airGap1" name="airGap1" />
              <label for="airGap1">Delay After</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="puncture1" name="puncture" />
              <label for="puncture1">Slow Aspirate</label>

            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol md={5}>

              <input style={{ marginRight: "10px" }} type="checkbox" id="mixBefore1" name="mixBefore1" />
              <label for="mixBefore1">Mix After Dispense</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="delay1" name="delay1" />
              <label for="delay1">Air Gap</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="touchTip1" name="touchTip1" />
              <label for="touchTip1">Delay Before</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="airGap1" name="airGap1" />
              <label for="airGap1">Delay After</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="puncture1" name="puncture" />
              <label for="puncture1">Slow Dispense</label>
              <br />
              <input style={{ marginRight: "10px" }} type="checkbox" id="puncture1" name="puncture" />
              <label for="puncture1">Blowout</label>

            </CCol>


            <CCol>
              <CFormLabel htmlFor="validationCustom010" style={{ width: "100%" }}>
                Change tip
              </CFormLabel>
              <CFormSelect
                options={options_ChangeTip}
                id="validationCustom010"
                value={selectedSource || ""}
                required
              />
            </CCol>




            <div className="modal-header-row">
              <CCol md={12} style={{ paddingTop: "12px", }}>
                <h5 className="modal-subtitle">PIPETTING SETTINGS</h5>
                <span className="float-end">
                  <CIcon
                    size="sm"
                    icon={cilSettings}
                    style={{
                      color: "black",
                      cursor: "pointer",
                    }}
                  />
                </span>
              </CCol>
            </div>


            <CRow className="align-items-center">
              <CCol>
                <p className="mb-0">Pressure Monitored Pipetting AI</p>
              </CCol>
              <CCol xs="auto">
                <CFormSwitch
                  id="pressurePipettingAI"
                  label=""
                  checked={isPressureAIEnabled}
                  onChange={() => setIsPressureAIEnabled(!isPressureAIEnabled)}
                />
              </CCol>
            </CRow>


            <div style={{ marginBottom: "20px" }}></div>
            <CRow>
              <CCol md={5}>
                <CFormLabel htmlFor="validationCustom05">Liquid Type</CFormLabel>
                <CFormSelect
                  options={options_LiquidType}
                  id="validationCustom05"
                  // onChange={handleOnChangeSelectedChangeTip}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
            </CRow>

            <div style={{ marginBottom: "10px" }}></div>

            <CRow>
              <CCol md={5}>
                <CFormLabel htmlFor="validationCustom06">Liquid Detection</CFormLabel>
                <CFormSelect
                  options={options_LiquidDetection}
                  id="validationCustom06"
                  // onChange={handleOnChangeSelectedChangeTip}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
            </CRow>

            <div style={{ marginBottom: "10px" }}></div>

            <CRow>
              <CCol md={5}>
                <CFormLabel htmlFor="validationCustom07">Pressure Detection Mode</CFormLabel>
                <CFormSelect
                  options={options_PressureDetection}
                  id="validationCustom07"
                  // onChange={handleOnChangeSelectedChangeTip}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
            </CRow>

            {/* Aspirate, Dispense */}
            <CCol
              md={5}
              style={{
                borderBottom: `2px solid black`,
              }}
            >
              <h5
                className="modal-subtitle"
                style={{ color: "black" }}
              >
                ASPIRATE
              </h5>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol
              md={5}
              style={{
                borderBottom: `2px solid black`,
              }}
            >
              <h5
                className="modal-subtitle"
                style={{ color: "black" }}
              >
                DISPENSE
              </h5>

            </CCol>

            <div style={{ marginBottom: "10px" }}></div>

            <CRow>

              <CCol md={3} style={{ marginBottom: "10px" }}>
                <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>Aspirate Position

                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <CCol md={2}>
                <CFormLabel htmlFor="validationCustom03"
                  style={{ width: "100%" }}>Offset
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>


              {/* SPACER */}
              <CCol md={2}></CCol>

              <CCol md={3}>
                <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>Dispense Mode
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>

                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <CCol md={2}>
                <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>Offset
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <div style={{ marginBottom: "10px" }}></div>

              <CCol md={5}>
                <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>Sensitivity
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              {/* SPACER */}
              <CCol md={2}></CCol>

              <CCol md={5}>
                <CFormLabel htmlFor="validationCustom03" style={{ width: "100%" }}>Sensitivity
                  <span className="float-end">
                    <CIcon
                      size="sm"
                      icon={cilInfo}
                      style={{
                        color: "black",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </CFormLabel>
                <CFormSelect
                  options={sourceItems}
                  id="validationCustom03"
                  value={selectedSource || ""}
                  onChange={(e) => handleChangeSource(e)}
                  required
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>



              <div style={{ marginBottom: "10px" }}></div>

            </CRow>

            <p>Allow Empty Cavity
              <label class="switch" style={{ marginLeft: "10px" }}>
                <input type="checkbox" />
                <span class="slider round"></span>
              </label>
            </p>

          </CForm>
        </CCol >


      </CRow >

      <br />
      {/* Buttons */}
      <CRow className="mt-3" style={{ position: 'sticky', bottom: 0 }}>
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
          <CButton disabled className="dial-btn-save" type="submit">
            Save
          </CButton>
        </CCol>
      </CRow>


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
