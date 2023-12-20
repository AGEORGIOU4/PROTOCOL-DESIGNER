import React, { useState } from 'react';
import { CCol, CForm, CTooltip, CFormInput, CFormLabel, CMultiSelect, CRow, CButton, CFormSwitch } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares } from './data';
import { ReactComponent as InfoCircleIcon } from 'src/assets/images/generic/infoCircle.svg';

export const CameraForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ pauseDelay: false, delay: false });
    const [isPhotoOn, setIsPhotoOn] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(false);

    // Handlers for various user interactions
    const handleCheckboxChange = (e) => setCheckboxStates({ ...checkboxStates, [e.target.id]: e.target.checked });
    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);
    const handleToggleChange = (toggleId) => {
        if (toggleId === 'photo') {
            setIsPhotoOn(!isPhotoOn);
            if (isVideoOn) setIsVideoOn(!isVideoOn);
        } else if (toggleId === 'video') {
            setIsVideoOn(!isVideoOn);
            if (isPhotoOn) setIsPhotoOn(!isPhotoOn);
        }
    }


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
                                <h5 className='modal-subtitle'>Camera</h5>
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

                        {/* Magnet Action Switch */}
                        <CRow className='mt-3'>
                            <CCol md={2}>
                                <CFormLabel htmlFor='photoAction'>Photo</CFormLabel>
                                <CFormSwitch
                                    label={isPhotoOn ? "Yes" : "No"}
                                    id="formSwitchCheckPhoto"
                                    onChange={() => handleToggleChange('photo')}
                                    checked={isPhotoOn}
                                />
                            </CCol>
                            <CCol md={2}>
                                <CFormLabel htmlFor='magnetAction'>Video</CFormLabel>
                                <CFormSwitch

                                    label={isVideoOn ? "Yes" : "No"}
                                    id="formSwitchCheckVideo"
                                    onChange={() => handleToggleChange('video')}
                                    checked={isVideoOn}
                                />

                            </CCol>
                        </CRow>


                        {(isPhotoOn || isVideoOn) && (
                            <CRow className='mt-4 mb-2'>
                                {/* Common components for both photo and video */}


                                {/* Components specific to photo toggle */}
                                {isPhotoOn && (
                                    <CCol md={2}>
                                        <CFormLabel htmlFor='quantityAction'>Quantity</CFormLabel>
                                        <CFormInput min="0" type='number' id="quantityPhoto" required placeholder='Picture Number' />
                                    </CCol>
                                )}

                                {/* Components specific to video toggle */}
                                {isVideoOn && (
                                    <>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='durationAction'>Duration</CFormLabel>
                                            <CFormInput min="0" type='number' id="duration" required placeholder='Default (s)' />
                                        </CCol>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='quantityAction'>Quantity</CFormLabel>
                                            <CFormInput min="0" type='number' id="quantityVideo" required placeholder='Video Number' />
                                        </CCol>
                                    </>
                                )}
                                <CCol md={2}>
                                    <CFormLabel htmlFor='timeLapseAction'>Time Lapse</CFormLabel>
                                    <CFormInput min="0" type='number' id="timeLapse" required placeholder='Default (s)' />
                                </CCol>
                                <CCol md={1} style={{ marginLeft: "-56px" }}>
                                    <CTooltip style={{ marginBottom: '20px' }} content="In the time lapse setting, enter the number of seconds you want between each photo; this will be the interval at which the pictures are taken."
                                        placement='right'
                                        className="custom-tooltip">
                                        <InfoCircleIcon className="info-icon mt-2" />
                                    </CTooltip>
                                </CCol>
                            </CRow>
                        )}

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
