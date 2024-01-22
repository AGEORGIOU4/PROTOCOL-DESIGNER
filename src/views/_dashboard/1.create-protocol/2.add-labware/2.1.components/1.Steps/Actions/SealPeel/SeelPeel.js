import React, { useState } from "react";
import {
  CCol,
  CForm,
  CFormCheck,
  CFormLabel,
  CMultiSelect,
  CRow,
  CButton,
} from "@coreui/react-pro";
import { Notes } from "../../Components/notes";
import { options_LabWares } from "./data";


export const SeelPeelForm = ({ onClose, onDelete, stepId, stepTitle }) => {
  // State declarations
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedLabWare, setSelectedLabWare] = useState([]);
  const [checkboxValidationFailed, setCheckboxValidationFailed] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({
    pauseDelay: false,
    delay: false,
  });

  // Handlers for various user interactions
  const handleCheckboxChange = (e) =>
    setCheckboxStates({ ...checkboxStates, [e.target.id]: e.target.checked });
  const handleLabWareChange = (selectedOptions) =>
    setSelectedLabWare(selectedOptions);

  const handleLocalClose = () => onClose();
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!checkboxStates.seal && !checkboxStates.peel)
      setCheckboxValidationFailed(true);

    if (checkboxStates.seal || checkboxStates.peel)
      setCheckboxValidationFailed(false)
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(false);
    } else {
      const formData = {
        stepTitle: stepTitle,
        parameters: {
          labware: selectedLabWare.map(option => option.value),
          actions: {
            seal: checkboxStates.seal,
            peel: checkboxStates.peel
          }
        }
      };

      console.log(JSON.stringify(formData, null, 2));

    }
    setValidated(true);
  };

  const handleNotesClick = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);

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
                <h5 className="modal-subtitle">Seal - Peel</h5>
              </CCol>
            </div>

            {/* Labware Selection */}
            <CRow>
              <CCol md={3} className="mt-4">
                <CFormLabel htmlFor="labWareInput">Labware</CFormLabel>
                <CMultiSelect
                  id="labwareSelect"
                  options={options_LabWares}
                  value={selectedLabWare}
                  onChange={handleLabWareChange}
                  placeholder="Select Labware"
                  required
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={3} className="mt-4">
                <CFormCheck
                  id="seal"
                  label="Seal"
                  onChange={handleCheckboxChange}
                  checked={checkboxStates.seal}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md={3} className="mt-2">
                <CFormCheck
                  id="peel"
                  label="Peel"
                  onChange={handleCheckboxChange}
                  checked={checkboxStates.peel}
                />
              </CCol>
            </CRow>
            {checkboxValidationFailed && (
              <CRow className='mt-3'>
                <CCol md={12}>
                  <div className="alert alert-danger-custom" role="alert">
                    At least Seal or Peel must ticke on to save.
                  </div>
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
