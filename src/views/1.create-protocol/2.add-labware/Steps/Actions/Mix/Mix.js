import React, { useEffect, useState } from "react";
import {
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CButton,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilSettings } from "@coreui/icons";
import {
  options_ChangeTip,
  options_Pipettes,
  options_LabWares,
  options_Wells,
  options_Blowout,
} from "./data";
import { Notes } from "../../Components/notes";
import defaultFlow from "src/assets/images/wellOrder/defaultFlow.svg";

export const MixForm = ({ onClose, onDelete, stepId, stepTitle }) => {
  const [validated, setValidated] = useState(false);
  const [selectedPipette, setSelectedPipette] = useState("");
  const [labware_items, setLabwareItems] = useState([]);
  const [selectedLabWare, setSelectedLabWare] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [activeHeader, setActiveHeader] = useState("");
  const [showComponent, setShowComponent] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [currentSVG, setCurrentSVG] = useState(defaultFlow);
  const [isAspireDispenseActive, setIsAspireDispenseActive] = useState(false);
  const [mixVolume, setMixVolume] = useState("");
  const [repetitions, setRepetitions] = useState("");
  const [flowRateAspirate, setFlowRateAspirate] = useState("");
  const [tipPosition, setTipPosition] = useState("");
  const [tipPositionNumber, setTipPositionNumber] = useState("");
  const [flowRateDispense, setFlowRateDispense] = useState("");
  const [touchTip, setTouchTip] = useState("");
  const [blowout, setBlowout] = useState("");

  const handleMixVolumeChange = (e) => setMixVolume(e.target.value);
  const handleRepetitionsChange = (e) => setRepetitions(e.target.value);
  const handleFlowRateAspirateChange = (e) => setFlowRateAspirate(e.target.value);
  const handleTipPositionChange = (e) => setTipPosition(e.target.value);
  const handleTipPositionNumberChange = (e) => setTipPositionNumber(e.target.value);
  const handleFlowRateDispenseChange = (e) => setFlowRateDispense(e.target.value);
  const handleTouchTipChange = (e) => setTouchTip(e.target.value);
  const handleBlowoutChange = (e) => setBlowout(e.target.value);

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

        new_items.push({
          value: "Trash",
          label: "Trash",
        })


        console.log(new_items)
        setLabwareItems(new_items);
      }
    } catch (e) {
      console.log(e)
    }

  }, []);


  const handleSvgClick = () => {
    setCurrentSVG(currentSVG === defaultFlow ? defaultFlow : defaultFlow);
  };
  const [checkboxStates, setCheckboxStates] = useState({
    flowRateDelay: false,
    flowRateTouchTipDispense: false,
    flowRateBlowoutDispense: false,
    flowRateTouchTipDispenseInput: false,
    // Add other checkboxes here in the format: id: false
  });

  const handleLocalClose = () => {
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setCheckboxStates({
      ...checkboxStates,
      [e.target.id]: e.target.checked,
    });
  };

  const handleNotesClick = () => {
    setIsNotesOpen(true);
  };

  const closeNotes = () => {
    setIsNotesOpen(false);
  };

  const handleIconClick = () => {
    setIsAspireDispenseActive(!isAspireDispenseActive);
    setShowComponent(!isAspireDispenseActive);
  };

  const isActive = () => isAspireDispenseActive;

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(false);

    } else {

      const formData = {
        step: stepTitle,
        parameters: {
          pipette: selectedPipette,
          mixVolume: mixVolume,
          repetitions: repetitions,
          labware: selectedLabWare,
          wells: selectedColumn,
          aspirate: {
            flowRate: flowRateAspirate,
            tipPosition: tipPosition,
            tipPositionNumber: tipPositionNumber,
            wellOrder: currentSVG
          },
          dispense: {
            flowRate: flowRateDispense,
            touchTip: touchTip,
            blowout: blowout
          },
          changeTip: form.querySelector('#validationCustom05').value
        }
      };

      console.log(JSON.stringify(formData, null, 2));
    }
    setValidated(true);
  };

  const handlePipetteChange = (event) => {
    setSelectedPipette(event.target.value);
  };

  const handleLabWareChange = (event) => {
    setSelectedLabWare(event.target.value);
  };

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
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
            {/* Mix Section */}
            <div className="modal-header-row">
              <CCol md={7}>
                <h5 className="modal-subtitle">Mix</h5>
              </CCol>
            </div>

            {/* Pipette, Mix Volume, Repetitions Row */}

            <CCol md={2}>
              <CFormLabel htmlFor="pipetteSelect">Pipette</CFormLabel>
              <CFormSelect
                id="pipetteSelect"
                required
                onChange={handlePipetteChange}
                value={selectedPipette}
                options={
                  selectedPipette === ""
                    ? [
                      {
                        value: "",
                        label: "Select Pipette",
                        disabled: true,
                        hidden: true,
                      },
                      ...options_Pipettes,
                    ]
                    : options_Pipettes
                }
              />

            </CCol>
            <CCol md={2}>
              <CFormLabel htmlFor="mixVolumeInput">
                Mix Volume (μL)
              </CFormLabel>
              <CFormInput
                type="number"
                id="mixVolumeInput"
                required
                placeholder="Add Volume"
                value={mixVolume}
                onChange={handleMixVolumeChange}
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={2}>
              <CFormLabel htmlFor="repetitionsInput">Repetitions</CFormLabel>
              <CFormInput
                type="number"
                id="repetitionsInput"
                required
                placeholder="Add Repetitions"
                value={repetitions}
                onChange={handleRepetitionsChange}
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>


            {/* Labware Row */}
            <CRow className="pt-3">
              <CCol md={2}>
                <CFormLabel htmlFor="labwareSelect">Labware</CFormLabel>
                <CFormSelect
                  id="labwareSelect"
                  required
                  onChange={handleLabWareChange}
                  value={selectedLabWare}
                  options={labware_items}
                />
              </CCol>

              {/* Column Row */}
              <CCol md={2}>
                <CFormLabel htmlFor="wellSelect">Wells</CFormLabel>
                <CFormSelect
                  id="wellSelect"
                  required
                  onChange={handleColumnChange}
                  value={selectedColumn}
                  options={
                    selectedColumn === ""
                      ? [
                        {
                          value: "",
                          label: "Select Well",
                          disabled: true,
                          hidden: true,
                        },
                        ...options_Wells,
                      ]
                      : options_Wells
                  }
                />
              </CCol>
            </CRow>

            {/* Aspirate, Dispense */}
            <CRow>
              <div className="modal-header-row">
                <CCol
                  md={5}
                  style={{
                    padding: "0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `2px solid ${isActive() ? "#01AAB1" : "black"}`,
                  }}
                >
                  <h5
                    className="modal-subtitle"
                    style={{ color: isActive() ? "#01AAB1" : "black" }}
                  >
                    ASPIRATE
                  </h5>
                  <CIcon
                    size="sm"
                    icon={cilSettings}
                    onClick={() => handleIconClick("ASPIRATE")}
                    style={{
                      color: isActive("ASPIRATE") ? "#01AAB1" : "black",
                      cursor: "pointer",
                    }}
                  />
                </CCol>
                <CCol
                  md={5}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: `2px solid ${isActive() ? "#01AAB1" : "black"}`,
                  }}
                >
                  <h5
                    className="modal-subtitle"
                    style={{ color: isActive() ? "#01AAB1" : "black" }}
                  >
                    DISPENSE
                  </h5>
                  <CIcon
                    size="sm"
                    icon={cilSettings}
                    onClick={() => handleIconClick("DISPENSE")}
                    style={{
                      color: isActive("DISPENSE") ? "#01AAB1" : "black",
                      cursor: "pointer",
                    }}
                  />
                </CCol>
              </div>
            </CRow>

            <CCol md={2}>
              <CFormLabel htmlFor="flowRateAspirate">Flow Rate</CFormLabel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {isActive() && (
                  <>
                    <CFormInput
                      type="text"
                      id="flowRateAspirate"
                      placeholder="Default (μL/s)"
                      value={flowRateAspirate}
                      onChange={handleFlowRateAspirateChange}
                    />
                  </>
                )}
                <CFormCheck
                  id="flowRateDelay"
                  label="Delay"
                  onChange={handleCheckboxChange}
                  checked={checkboxStates.flowRateDelay}
                />
              </div>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="tipPosition">Tip Position</CFormLabel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {isActive() && (
                  <>
                    <CFormInput
                      type="text"
                      id="tipPosition"
                      placeholder="Default (mm)"
                      value={tipPosition}
                      onChange={handleTipPositionChange}
                    />
                    {checkboxStates.flowRateDelay && (
                      <CFormInput
                        type="number"
                        id="tipPositionNumber"
                        placeholder="Number of (s)"
                        value={tipPositionNumber}
                        onChange={handleTipPositionNumberChange}
                      />
                    )}
                  </>
                )}
              </div>
            </CCol>
            <CCol md={2}>
              {isActive() && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <CFormLabel htmlFor="wellOrder">Well Order</CFormLabel>
                  <img
                    src={currentSVG}
                    alt="Clickable icon"
                    onClick={handleSvgClick}
                    style={{ cursor: "pointer", alignSelf: "flex-start" }} // Add alignSelf if you want to center the icon
                  />
                  {/* If you have more form elements related to the Well Order, they would go here. */}
                </div>
              )}
            </CCol>

            <CCol md={2} className="flow-rate-col">
              <CFormLabel htmlFor="flowRate">Flow Rate</CFormLabel>
              {isActive() && (
                <CFormInput
                  style={{ width: "none" }}
                  type="text"
                  placeholder="Default (μL/s)"
                  value={flowRateDispense}
                  onChange={handleFlowRateDispenseChange}
                ></CFormInput>
              )}
              <div className="row g-2" style={{ marginTop: "4px" }}>
                <div className="col-6">
                  <CFormCheck
                    id="flowRateDelayDispense"
                    label="Delay"
                    onChange={handleCheckboxChange}
                    checked={checkboxStates.flowRateDelayDispense}
                  />
                </div>
                <div
                  className="col-6"
                  style={{
                    minHeight: "58px",
                    opacity: checkboxStates.flowRateDelayDispense ? 1 : 0,
                  }}
                >
                  <CFormInput
                    type="number"
                    id="flowRateDelayDispenseInput"
                    placeholder="Number of (s)"
                    value={touchTip}
                    onChange={handleTouchTipChange}
                  />
                </div>
                <div className="col-6">
                  <CFormCheck
                    id="flowRateTouchTipDispense"
                    label="Touch Tip"
                    onChange={handleCheckboxChange}
                    checked={checkboxStates.flowRateTouchTipDispense}
                  />
                </div>
                <div
                  className="col-6"
                  style={{
                    minHeight: "58px",
                    opacity: checkboxStates.flowRateTouchTipDispense ? 1 : 0,
                  }}
                >
                  <CFormInput
                    type="number"
                    id="flowRateTouchTipDispenseInput"
                    placeholder="Number of tips"
                    value={blowout}
                    onChange={handleBlowoutChange}
                  />
                </div>
                <div className="col-6">
                  <CFormCheck
                    id="flowRateBlowoutDispense"
                    label="Blowout"
                    onChange={handleCheckboxChange}
                    checked={checkboxStates.flowRateBlowoutDispense}
                  />
                </div>
                <div
                  className="col-6"
                  style={{
                    minHeight: "58px",
                    opacity: checkboxStates.flowRateBlowoutDispense ? 1 : 0,
                  }}
                >
                  <CFormSelect
                    id="flowRateBlowoutDispenseInput"
                    required
                    onChange={handleColumnChange}
                    value={selectedColumn}
                    options={
                      selectedColumn === ""
                        ? [
                          {
                            value: "",
                            label: "Select Blowout",
                            disabled: true,
                            hidden: true,
                          },
                          ...options_Blowout,
                        ]
                        : options_Blowout
                    }
                  />
                </div>
              </div>
            </CCol>


            {/* SPACER */}
            <CCol md={5}></CCol>

            <div className="modal-header-row">
              <CCol md={7} style={{ paddingTop: "12px" }}>
                <h5 className="modal-subtitle">STERILITY</h5>
              </CCol>
            </div>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom05">Change Tip</CFormLabel>
              <CFormSelect
                options={options_ChangeTip}
                id="validationCustom05"
                required
              />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* Buttons */}
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
                <CButton disabled className="dial-btn-save" type="submit">
                  Save
                </CButton>
              </CCol>
            </CRow>

            <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};
