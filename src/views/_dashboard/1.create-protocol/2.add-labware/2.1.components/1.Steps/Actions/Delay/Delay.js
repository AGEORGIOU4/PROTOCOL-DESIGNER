import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CRow, CButton } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
export const DelayForm = ({ onClose, onDelete, stepId, stepTitle }) => {

    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [checkboxStates, setCheckboxStates] = useState({
        pauseDelay: false,
        delay: false
        // Add other checkboxes here in the format: id: false
    });

    const handleLocalClose = () => {
        onClose();
    };

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

    const handleNotesClick = () => {
        setIsNotesOpen(true)
    }

    const closeNotes = () => {
        setIsNotesOpen(false)
    }
    return (<>
        <CRow>
            <CCol md={12}>
                <CForm className="row g-3 needs-validaiton" noValidate validated={validated} onSubmit={handleSubmit}>
                    <div className='modal-header-row'>
                        <CCol md={7}>
                            <h5 className='modal-subtitle'>Delay</h5>
                        </CCol>
                    </div>
                    <CRow>
                        <CCol md={6} className='mt-4'>
                            <CFormCheck
                                id="pauseDelay"
                                label="Pause until told to resume"
                                onChange={handleCheckboxChange}
                                checked={checkboxStates.pauseDelay}
                            />
                        </CCol>
                        <CCol md={{ span: 4, offset: 1 }} className='pt-4' >
                            <CFormLabel htmlFor="messageDisplay">Message to Display</CFormLabel>
                        </CCol>
                    </CRow>
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
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                    </CRow>
                    {checkboxStates.delay && (
                        <CRow className="m-2">
                            <CCol md={1} style={{ minWidth: '160px', marginRight: '-20px' }} >
                                <CFormInput type='text' id="defaultHour" required placeholder='Default (h)' />
                            </CCol>
                            <CCol md={1} style={{ minWidth: '160px', marginRight: '-20px' }}>
                                <CFormInput type='text' id="defaultMinute" required placeholder='Default (m)' />
                            </CCol>
                            <CCol md={1} style={{ minWidth: '160px', marginRight: '-20px' }}>
                                <CFormInput type='text' id="defaultSecond" required placeholder='Default (s)' />
                            </CCol>
                        </CRow>
                    )}
                    {/* Buttons */}
                    <CRow className='mt-3'>
                        {/* Left Button Group: Delete and Notes */}
                        <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px' }}>
                            <CButton color="danger" onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                            <CButton color="secondary" onClick={handleNotesClick}>Notes</CButton>
                        </CCol>
                        {/* Right Button Group: Close and Save, aligned with the Message to Display input */}
                        <CCol md={{ span: 4, offset: 1 }} style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
                            <CButton color="secondary" onClick={handleLocalClose}>Close</CButton>
                            <CButton color="primary" type="submit">Save</CButton>
                        </CCol>
                    </CRow>

                    <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
                </CForm>
            </CCol>
        </CRow>
    </>)
}