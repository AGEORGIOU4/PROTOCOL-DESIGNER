import React, { useEffect, useState } from "react";
import {
  CCol,
  CForm,
  CFormCheck,
  CTooltip,
  CFormInput,
  CFormLabel,
  CMultiSelect,
  CRow,
  CButton,
  CFormSwitch,
} from "@coreui/react-pro";
import { Notes } from "../../Components/notes";
import { options_LabWares } from "./data";
import { ReactComponent as InfoCircleIcon } from "src/assets/images/generic/infoCircle.svg";

export const MagnetForm = ({ onClose, onDelete, stepId, stepTitle }) => {
  // State declarations
  const [labware_items, setLabwareItems] = useState([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedLabWare, setSelectedLabWare] = useState([]);
  const [defaultHour, setDefaultHour] = useState("");
  const [defaultMinute, setDefaultMinute] = useState("");
  const [defaultSecond, setDefaultSecond] = useState("");
  const [checkboxStates, setCheckboxStates] = useState({
    pauseDelay: false,
    delay: false,
  });
  const [isMagnetOn, setIsMagnetOn] = useState(false);
  const [isPrecipitationTime, setIsPrecipititationTime] = useState(false);

  // Handlers for various user interactions
  const handleDefaultHourChange = (e) => setDefaultHour(e.target.value);
  const handleDefaultMinuteChange = (e) => setDefaultMinute(e.target.value);
  const handleDefaultSecondChange = (e) => setDefaultSecond(e.target.value);
  const handleCheckboxChange = (e) => setCheckboxStates({ ...checkboxStates, [e.target.id]: e.target.checked });
  const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);
  const handleToggleChange = (toggleId) => {
    if (toggleId === 'magnet') setIsMagnetOn(!isMagnetOn);
    else if (toggleId === 'precipitationTime') setIsPrecipititationTime(!isPrecipitationTime);
  };
  const handleLocalClose = () => onClose();
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {

      const formData = {
        step: stepTitle,
        parameters: {

          labware_ids: selectedLabWare.map(option => option.value),
          manget_action: isMagnetOn,
          perception_action: isPrecipitationTime,
          perception_hour: defaultHour,
          perception_minute: defaultMinute,
          perception_second: defaultSecond,
          deactivate_perception_action: checkboxStates.deactivePrecipitation,
        }
      }
      console.log(JSON.stringify(formData, null, 2));
    }
    setValidated(true)
  };


  const handleNotesClick = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);


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
          text: item.name,
        }));

        console.log(new_items)
        setLabwareItems(new_items);
      }
    } catch (e) {
      console.log(e)
    }

  }, []);

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CForm
            className="row g-3 needs-validaiton"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            {/* Form Header */}
            <div className="modal-header-row">
              <CCol md={7}>
                <h5 className="modal-subtitle">Magnet</h5>
              </CCol>
            </div>

            {/* Labware Selection */}
            <CRow>
              <CCol md={3} className="mt-4">
                <CFormLabel htmlFor="labWareInput">Labware</CFormLabel>
                <CMultiSelect
                  id="labwareSelect"
                  options={labware_items}
                  value={selectedLabWare}
                  onChange={handleLabWareChange}
                  placeholder="Select Labware"
                  required
                />
              </CCol>
            </CRow>

            {/* Magnet Action Switch */}
            <CRow className="mt-3">
              <CCol md={2}>
                <CFormLabel htmlFor="magnetAction">Magnet Action</CFormLabel>
                <CFormSwitch
                  className="mt-2"
                  label={isMagnetOn ? "On Magnet" : "Off Magnet"}
                  id="formSwitchCheckMagnet"
                  onChange={() => handleToggleChange("magnet")}
                  checked={isMagnetOn}
                />
              </CCol>

              {/* Conditional Rendering for Precipitation Time */}
              {isMagnetOn && (
                <>
                  <CRow>
                    <CCol
                      md={2}
                      className="d-flex align-items-center"
                      style={{ minWidth: "263px" }}
                    >
                      <CFormSwitch
                        className="mt-2 me-2"
                        label="Precipitation Time"
                        id="formSwitchCheckDefaultNormal"
                        onChange={() => handleToggleChange("precipitationTime")}
                        checked={isPrecipitationTime}
                      />
                      <CTooltip
                        content="In this help information text box there will be a suggested precipitation time for each selected bead. The user will have the option to either follow it or insert a custom precipitation time of desire."
                        placement="right"
                        className="custom-tooltip"
                      >
                        <InfoCircleIcon className="info-icon mt-2" />
                      </CTooltip>
                    </CCol>

                    {/* Input Fields for Precipitation Time */}
                    {isPrecipitationTime && (
                      <>
                        <CCol
                          md={1}
                          style={{
                            minWidth: "160px",
                            marginRight: "5px",
                            marginLeft: "5px",
                          }}
                        >
                          <CFormInput
                            type="text"
                            id="defaultHour"
                            required
                            placeholder="Default (h)"
                            value={defaultHour}
                            onChange={handleDefaultHourChange}
                          />
                        </CCol>
                        <CCol
                          md={1}
                          style={{
                            minWidth: "160px",
                            marginRight: "5px",
                            marginLeft: "5px",
                          }}
                        >
                          <CFormInput
                            type="text"
                            id="defaultMinute"
                            required
                            placeholder="Default (m)"
                            value={defaultMinute}
                            onChange={handleDefaultMinuteChange}
                          />
                        </CCol>
                        <CCol
                          md={1}
                          style={{
                            minWidth: "160px",
                            marginRight: "5px",
                            marginLeft: "5px",
                          }}
                        >
                          <CFormInput
                            type="text"
                            id="defaultSecond"
                            required
                            placeholder="Default (s)"
                            value={defaultSecond}
                            onChange={handleDefaultSecondChange}
                          />
                        </CCol>
                      </>
                    )}
                  </CRow>
                </>
              )}
            </CRow>

            {/* Conditional Rendering for Deactivation Checkbox */}
            {isMagnetOn && (defaultHour || defaultMinute || defaultSecond) && (
              <CRow className="mt-3">
                <CCol md={4}>
                  <CFormCheck
                    id="deactivePrecipitation"
                    label="Deactivate after precipitation time is over."
                    onChange={handleCheckboxChange}
                    checked={checkboxStates.deactivePrecipitation}
                  />
                </CCol>
              </CRow>
            )}

            {/* Form Buttons */}
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

            {/* Notes Component */}
            <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};
