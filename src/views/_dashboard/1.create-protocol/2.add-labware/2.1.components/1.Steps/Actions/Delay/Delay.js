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
                        <CCol md={4} className='m-2'>
                            <CFormCheck
                                id="pauseDelay"
                                label="Pause until told to resume"
                                onChange={handleCheckboxChange}
                                checked={checkboxStates.pauseDelay}
                            />
                        </CCol>
                        <CCol md={4} className='mt-3'>
                            <CFormLabel htmlFor="messageDisplay">Message to Display</CFormLabel>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol md={4} className='m-2'>
                            <CFormCheck
                                id="delay"
                                label="Delay for an amount of time"
                                onChange={handleCheckboxChange}
                                checked={checkboxStates.delay}
                            />
                        </CCol>
                        <CCol md={4}>

                            <CFormInput type='text' id="messageDisplay" required placeholder='Add a Message' />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                        </CCol>
                    </CRow>
                    <CRow>
                        <Ccol md={4}>
                        <CFormInput type='text' id="messageDisplay" required placeholder='Default (h)' />
                        <CFormInput type='text' id="messageDisplay" required placeholder='Default (h)' />
                        <CFormInput type='text' id="messageDisplay" required placeholder='Add a Message' />
                        </Ccol>
                    </CRow>
                    {/* Buttons */}
                    <CRow className="m-1">
                        <CCol xs={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                            <CButton color="danger" className="me-2" onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                            <CButton color="secondary" className="me-2" onClick={handleNotesClick}>Notes</CButton>
                        </CCol>
                        <CCol xs={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <CButton color="secondary" className="me-2" onClick={handleLocalClose}>Close</CButton>
                            <CButton color="primary" type="submit">Save</CButton>
                        </CCol>
                    </CRow>
                    <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
                </CForm>
            </CCol>
        </CRow>
    </>)
}