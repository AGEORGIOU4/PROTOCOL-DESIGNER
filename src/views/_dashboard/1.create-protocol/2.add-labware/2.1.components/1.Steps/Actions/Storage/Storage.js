import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CTooltip, CFormInput, CFormLabel, CMultiSelect, CRow, CButton, CFormSwitch } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares } from './data';
import { ReactComponent as InfoCircleIcon } from 'src/assets/images/generic/infoCircle.svg';

export const StorageForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ pauseDelay: false, delay: false });


    // Handlers for various user interactions
    const handleCheckboxChange = (e) => {
        // Reset all checkboxes to false
        const resetStates = { fridge: false, freezer: false, roomTemperature: false };

        // Set the clicked checkbox to true
        setCheckboxStates({ ...resetStates, [e.target.id]: e.target.checked });
    };
    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);

    const handleLocalClose = () => onClose();
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };
    const handleNotesClick = () => setIsNotesOpen(true);
    const closeNotes = () => setIsNotesOpen(false);

    return (
        <>
            <CRow>
                <CCol md={12}>
                    <CForm className="row g-3 needs-validaiton" noValidate validated={validated} onSubmit={handleSubmit}>
                        {/* Form Header */}
                        <div className='modal-header-row'>
                            <CCol md={7}>
                                <h5 className='modal-subtitle'>Storage</h5>
                            </CCol>
                        </div>

                        {/* Labware Selection */}
                        <CRow>
                            <CCol md={3} className='mt-4'>
                                <CFormLabel htmlFor="labWareInput">Labware</CFormLabel>
                                <CMultiSelect
                                    id="labwareSelect"
                                    options={options_LabWares}
                                    value={selectedLabWare}
                                    onChange={handleLabWareChange}
                                    placeholder='Select Labware'
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md={3} className='mt-4'>
                                <CFormCheck
                                    id="fridge"
                                    label="Fridge +4°C"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.fridge}
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md={3} className='mt-2'>
                                <CFormCheck
                                    id="freezer"
                                    label="Freezer -20°C"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.freezer}
                                />
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md={3} className='mt-2'>
                                <CFormCheck
                                    id="roomTemperature"
                                    label="Room Temperature +25°C"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.roomTemperature}
                                />
                            </CCol>
                        </CRow>
                        {/* Form Buttons */}
                        <CRow className='mt-3'>
                            <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px' }}>
                                <CButton color="danger" onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                                <CButton color="secondary" onClick={handleNotesClick}>Notes</CButton>
                            </CCol>
                            <CCol md={{ span: 4, offset: 1 }} style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
                                <CButton color="secondary" onClick={handleLocalClose}>Close</CButton>
                                <CButton color="primary" type="submit">Save</CButton>
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
