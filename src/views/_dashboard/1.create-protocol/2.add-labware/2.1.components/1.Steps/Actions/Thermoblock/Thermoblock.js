import React, { useEffect, useState } from "react";
import {
  CCol,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CMultiSelect,
  CFormSelect,
  CRow,
  CButton,
  CFormSwitch,
} from "@coreui/react-pro";
import { Notes } from "../../Components/notes";
import { options_rpm, options_Temperature, options_LabWares } from "./data";
export const ThermoBlockForm = ({ onClose, onDelete, stepId, stepTitle }) => {
  const [labware_items, setLabwareItems] = useState([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedLabWare, setSelectedLabWare] = useState([]);
  const [selectedRPM, setSelectedRPM] = useState("RPM");
  const [selectedTemperature, setSelectedTemperature] = useState("°C");
  const [isFirstSelection, setIsFirstSelection] = useState(true);
  const [isFirstSelectionRPM, setIsFirstSelectionRPM] = useState(true);
  const [timerHour, setTimerHour] = useState('');
  const [timerMinute, setTimerMinute] = useState('');
  const [timerSecond, setTimerSecond] = useState('');


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

  const handleTimerHourChange = (e) => setTimerHour(e.target.value);
  const handleTimerMinuteChange = (e) => setTimerMinute(e.target.value);
  const handleTimerSecondChange = (e) => setTimerSecond(e.target.value);



  const [checkboxStates, setCheckboxStates] = useState({
    pauseDelay: false,
    delay: false,
    // Add other checkboxes here in the format: id: false
  });

  // State to track the toggle switch
  const [isShakeSpeedOn, setIsShakeSpeedOn] = useState(false);

  // Handler for toggle switch change
  const handleShakeSpeedToggle = () => {
    setIsShakeSpeedOn(!isShakeSpeedOn);
  };

  const handleLocalClose = () => {
    onClose();
  };

  const handleCheckboxChange = (e) => {
    setCheckboxStates({
      ...checkboxStates,
      [e.target.id]: e.target.checked,
    });
  };

  const handleLabWareChange = (selectedOptions) => {
    setSelectedLabWare(selectedOptions);
  };

  const handleDropdownChange = (dropdownId, event) => {
    const value = event.target.value;
    switch (dropdownId) {
      case "temperature":
        setSelectedTemperature(value);
        setIsFirstSelection(false);
        break;
      case "rpm":
        setSelectedRPM(value);
        setIsFirstSelectionRPM(false);
        break;
      default:
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(false);
    } else {
      // Construct the formData JSON object
      const formData = {
        stepTitle: stepTitle,
        parameters: {
          labware: selectedLabWare.map(option => option.value),
          temperature: selectedTemperature,
          shakeSpeed: isShakeSpeedOn,
          rpm: isShakeSpeedOn ? selectedRPM : null,
          timer: checkboxStates.timer ? {
            hour: timerHour,
            minute: timerMinute,
            second: timerSecond
          } : null
        }
      };

      console.log(JSON.stringify(formData, null, 2));

    }
    setValidated(true);
  };


  const handleNotesClick = () => {
    setIsNotesOpen(true);
  };

  const closeNotes = () => {
    setIsNotesOpen(false);
  };
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
            <div className="modal-header-row">
              <CCol md={7}>
                <h5 className="modal-subtitle">Thermoblock</h5>
              </CCol>
            </div>
            <CRow>
              <CCol md={3} className="mt-4">
                <CFormLabel htmlFor="labWareInput">Labware</CFormLabel>
                <CMultiSelect
                  id="labwareSelect"
                  options={labware_items}
                  value={selectedLabWare}
                  onChange={handleLabWareChange}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={2}>
                <CFormLabel htmlFor="temperatureInput">Temperature</CFormLabel>
                <CFormSelect
                  id="temperatureSelect"
                  required
                  onChange={(e) => handleDropdownChange("temperature", e)}
                  value={selectedTemperature}
                >
                  {isFirstSelection && (
                    <option value="°C" disabled>
                    </option>
                  )}
                  {options_Temperature.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="shakeSpeedInput">Shake Speed</CFormLabel>
                <CFormSwitch
                  className="mt-2"
                  label={isShakeSpeedOn ? "On" : "Off"}
                  id="formSwitchCheckDefaultNormal"
                  onChange={handleShakeSpeedToggle}
                  checked={isShakeSpeedOn}
                />
              </CCol>
              <CCol md={2}>
                <div style={{ height: "38px" }}></div>
                <CFormSelect
                  style={{ marginLeft: "-130px" }}
                  id="temperatureSelect"
                  required
                  onChange={(e) => handleDropdownChange("rpm", e)}
                  value={selectedRPM}
                >
                  {isFirstSelectionRPM && (
                    <option value="RPM" disabled>
                      Default (RPM)
                    </option>
                  )}
                  {options_rpm.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol md={2}>
                <CFormCheck
                  id="timer"
                  label="Set Timer"
                  onChange={handleCheckboxChange}
                  checked={checkboxStates.timer}
                />
              </CCol>
            </CRow>
            {checkboxStates.timer && (
              <CRow className="mt-3 mb-3">
                <CCol
                  md={1}
                  style={{ minWidth: "160px", marginRight: "-20px" }}
                >
                  <CFormInput
                    type="text"
                    id="defaultHour"
                    required
                    placeholder="Default (h)"
                    value={timerHour}
                    onChange={handleTimerHourChange}
                  />
                </CCol>
                <CCol
                  md={1}
                  style={{ minWidth: "160px", marginRight: "-20px" }}
                >
                  <CFormInput
                    type="text"
                    id="defaultMinute"
                    required
                    placeholder="Default (m)"
                    value={timerMinute}
                    onChange={handleTimerMinuteChange}
                  />
                </CCol>
                <CCol
                  md={1}
                  style={{ minWidth: "160px", marginRight: "-20px" }}
                >
                  <CFormInput
                    type="text"
                    id="defaultSecond"
                    required
                    placeholder="Default (s)"
                    value={timerSecond}
                    onChange={handleTimerSecondChange}
                  />
                </CCol>
              </CRow>
            )}
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
                <CButton className="dial-btn-save" type="submit">
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
