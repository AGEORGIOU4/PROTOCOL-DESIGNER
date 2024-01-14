import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CFormInput, CFormLabel, CRow, CButton } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';

export const DelayForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State for managing notes visibility and form validation
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);

    // State for managing checkbox states
    const [checkboxStates, setCheckboxStates] = useState({
        pauseDelay: false,
        delay: false
    });

    // Handlers for various user interactions
    const handleCheckboxChange = (e) => {
        setCheckboxStates({
            ...checkboxStates,
            [e.target.id]: e.target.checked
        });
    };

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
    const handleLocalClose = () => onClose();

    return (
        <>
            <CRow>
                <CCol md={12}>
                    <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
                        {/* Form Header */}
                        <div className='modal-header-row'>
                            <CCol md={7}>
                                <h5 className='modal-subtitle'>Delay</h5>
                            </CCol>
                        </div>

                        {/* Checkbox for Pause Delay */}
                        <CRow>
                            <CCol md={6} className='mt-4'>
                                <CFormCheck
                                    id="pauseDelay"
                                    label="Pause until told to resume"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.pauseDelay}
                                />
                            </CCol>
                        </CRow>

                        {/* Checkbox for Delay and Message Input */}
                        <CRow>
                            <CCol md={6} >
                                <CFormCheck
                                    id="delay"
                                    label="Delay for an amount of time"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.delay}
                                />
                            </CCol>
                            <CCol md={{ span: 4, offset: 1 }} >
                                <CFormInput type='text' id="messageDisplay" required placeholder='Add a Message' />
                            </CCol>
                        </CRow>

                        {/* Conditional Inputs for Default Time */}
                        {checkboxStates.delay && (
                            <CRow className="m-2">
                                <CCol md={1} style={{ minWidth: '160px' }} >
                                    <CFormInput type='text' id="defaultHour" required placeholder='Default (h)' />
                                </CCol>
                                <CCol md={1} style={{ minWidth: '160px' }}>
                                    <CFormInput type='text' id="defaultMinute" required placeholder='Default (m)' />
                                </CCol>
                                <CCol md={1} style={{ minWidth: '160px' }}>
                                    <CFormInput type='text' id="defaultSecond" required placeholder='Default (s)' />
                                </CCol>
                            </CRow>
                        )}

                        {/* Control Buttons */}
                        <CRow className='mt-3'>
                            <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '50px' }}>
                                <CButton className='dial-btn-left' onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                                <CButton className='dial-btn-left' onClick={handleNotesClick}>Notes</CButton>
                            </CCol>
                            <CCol md={{ span: 4, offset: 1 }} style={{ display: 'flex', justifyContent: 'flex-end', gap: '50px' }}>
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
