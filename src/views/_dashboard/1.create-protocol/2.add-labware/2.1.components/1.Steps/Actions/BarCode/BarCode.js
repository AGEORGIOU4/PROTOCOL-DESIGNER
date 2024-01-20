import React, { useState } from "react";
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

export const BarCodeForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ pauseDelay: false, delay: false });
    const [checkboxValidationFailed, setCheckboxValidationFailed] = useState(false);



  // Handlers for various user interactions
  const handleCheckboxChange = (e) => {
    // Reset all checkboxes to false
    const resetStates = {
      fridge: false,
      freezer: false,
      roomTemperature: false,
    };

        // Set the clicked checkbox to true
        setCheckboxStates({ ...resetStates, [e.target.id]: e.target.checked });
        setSelectedLabWare([]);

    };
    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);

    const handleLocalClose = () => onClose();
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        // Check if all checkboxes are false
        const allCheckboxesFalse = Object.values(checkboxStates).every(state => !state);
        if (allCheckboxesFalse || !form.checkValidity() || selectedLabWare.length <= 0) {
            // Prevent form submission and mark form as invalid
            event.stopPropagation();
            setCheckboxValidationFailed(true);
            setValidated(false);
        } else {
            // Form is valid, you can process the form data
            setValidated(true);
            setCheckboxValidationFailed(false);
            let activeLabwareType = Object.keys(checkboxStates).find(key => checkboxStates[key]);

            const formData = {
                step: stepTitle,
                parameters: {
                    labwareType: activeLabwareType,
                    selectedLabWare: selectedLabWare.map(option => option.value),
                }
            };

            console.log(JSON.stringify(formData, null, 2));
        }
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
                <h5 className="modal-subtitle">Barcode</h5>
              </CCol>
            </div>

            {/* Spacer*/}
            <CCol md={2}></CCol>

                        {/* Microplate Checkbox and MultiSelect */}
                        <CRow className="align-items-end" >
                            <CCol md={3} className='mt-4'>
                                <CFormCheck
                                    id="microplate"
                                    label="Read Microplate"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.microplate}
                                />
                            </CCol>
                            {checkboxStates.microplate && (
                                <CCol md={3}>
                                    <CMultiSelect
                                        id="labwareSelect"
                                        options={options_LabWares}
                                        value={selectedLabWare}
                                        onChange={handleLabWareChange}
                                        placeholder='Select Labware'
                                    />
                                </CCol>
                            )}
                        </CRow>
                        {/* QR Code and MultiSelect */}
                        <CRow className="align-items-end">
                            <CCol md={3} className='mt-3'>
                                <CFormCheck
                                    id="qrCode"
                                    label="Read QR Code on Cryovials"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.qrCode}
                                />
                            </CCol>
                            {checkboxStates.qrCode && (
                                <CCol md={3}>
                                    <CMultiSelect
                                        id="labwareSelect"
                                        options={options_LabWares}
                                        value={selectedLabWare}
                                        onChange={handleLabWareChange}
                                        placeholder='Select Labware'
                                    />
                                </CCol>
                            )}
                        </CRow>

                        {/* Specimen Tube Checkbox and MultiSelect */}
                        <CRow className="align-items-end">
                            <CCol md={3} className='mt-3'>
                                <CFormCheck
                                    id="specimenTube"
                                    label="Read Specimen Tube"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.specimenTube}
                                />
                            </CCol>
                            {checkboxStates.specimenTube && (
                                <CCol md={3}>
                                    <CMultiSelect
                                        id="labwareSelect"
                                        options={options_LabWares}
                                        value={selectedLabWare}
                                        onChange={handleLabWareChange}
                                        placeholder='Select Labware'
                                    />
                                </CCol>
                            )}
                            {/* ... your existing JSX ... */}

                            {checkboxValidationFailed && (
                                <CRow className='mt-3'>
                                    <CCol md={12}>
                                        <div className="alert alert-danger-custom" role="alert">
                                            At least one checkbox is required to be checked to save.
                                        </div>
                                    </CCol>
                                </CRow>
                            )}

                        </CRow>
                        {/* Form Buttons */}
                        <CRow className='mt-3'>
                            <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '50px' }}>
                                <CButton className='dial-btn-left' onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                                <CButton className='dial-btn-left' onClick={handleNotesClick}>Notes</CButton>
                            </CCol>
                            <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '50px' }}>
                                <CButton className='dial-btn-close' onClick={handleLocalClose}>Close</CButton>
                                <CButton className='dial-btn-save' type="submit">Save</CButton>
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
