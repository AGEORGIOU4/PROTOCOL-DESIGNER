import React, { useState } from 'react';
import { CCol, CForm, CTooltip, CFormInput, CFormLabel, CMultiSelect, CRow, CButton, CFormSwitch } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares } from './data';
import { ReactComponent as InfoCircleIcon } from 'src/assets/images/generic/infoCircle.svg';
import { useStateManager } from 'react-select';

export const CameraForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ pauseDelay: false, delay: false });
    const [isPhotoOn, setIsPhotoOn] = useState(false);
    const [isPhotoVideoOn, setIsPhotoVideoOn] = useState(false)
    const [isVideoOn, setIsVideoOn] = useState(false);
    const [checkboxValidationFailed, setCheckboxValidationFailed] = useState(false);

    const [photoQuantity, setPhotoQuantity] = useState('');
    const [videoDuration, setVideoDuration] = useState('');
    const [videoQuantity, setVideoQuantity] = useState('');
    const [timeLapse, setTimeLapse] = useState('');
    const [photoVideoQuantity, setPhotoVideoQuantity] = useState('');
    const [photoVideoTimeLapse, setPhotoVideoTimeLapse] = useState('');


    // Handlers for various user interactions
    const handleCheckboxChange = (e) => setCheckboxStates({ ...checkboxStates, [e.target.id]: e.target.checked });
    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);
    const handleToggleChange = (toggleId) => {
        if (toggleId === 'photo') {
            setIsPhotoOn(!isPhotoOn);
            setIsPhotoVideoOn(!isPhotoVideoOn)
            setPhotoVideoQuantity('')
            setPhotoVideoTimeLapse('')
            if (isVideoOn) setIsVideoOn(!isVideoOn);
        } else if (toggleId === 'video') {
            setIsVideoOn(!isVideoOn);
            setIsPhotoVideoOn(!isPhotoVideoOn)
            if (isPhotoOn) setIsPhotoOn(!isPhotoOn);
        }
        if (toggleId == 'photoVideo') setIsPhotoVideoOn(!isPhotoVideoOn)
    }


    const handleLocalClose = () => onClose();

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (selectedLabWare.length <= 0 || !form.checkValidity() || (!isPhotoOn && !isVideoOn)) {
            event.stopPropagation()
            setCheckboxValidationFailed(true);
            setValidated(false);
        } else {

            // Collecting data from the form
            const formData = {
                step: stepTitle,
                parameters: {
                    labware: selectedLabWare.map(option => option.value),
                    cameraSettings: {
                        photo: isPhotoOn ? {
                            quantity: photoQuantity,
                            timeLapse: timeLapse, // Time lapse for photo
                        } : null,
                        video: isVideoOn ? {
                            duration: videoDuration,
                            quantity: videoQuantity,
                            timeLapse: timeLapse
                        } : null,
                        photoVideo: isPhotoVideoOn ? {
                            quantity: photoVideoQuantity,
                            timeLapse: photoVideoTimeLapse // Time lapse for photoVideo
                        } : null
                    }
                }
            };
            setCheckboxValidationFailed(false);
            setValidated(true);
            console.log(JSON.stringify(formData, null, 2));
        }



        // Here, you would typically send formData to your server or handle it as needed
    };

    const handleNotesClick = () => setIsNotesOpen(true);
    const closeNotes = () => setIsNotesOpen(false);

    return (
        <>
            <CRow>
                <CCol md={12}>
                    <CForm className="row g-3 needs-validaiton" validated={validated} onSubmit={handleSubmit}>
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
                                        <CFormInput
                                            min="0"
                                            type='number'
                                            id="quantityPhoto"
                                            required
                                            value={photoQuantity}
                                            onChange={(e) => setPhotoQuantity(e.target.value)}
                                            placeholder='Picture Number' />
                                    </CCol>
                                )}

                                {/* Components specific to video toggle */}
                                {isVideoOn && (
                                    <>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='durationAction'>Duration</CFormLabel>
                                            <CFormInput
                                                min="0"
                                                type='number'
                                                id="duration"
                                                required
                                                value={videoDuration}
                                                onChange={(e) => setVideoDuration(e.target.value)}
                                                placeholder='Default (s)' />
                                        </CCol>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='quantityAction'>Quantity</CFormLabel>
                                            <CFormInput
                                                min="0"
                                                type='number'
                                                id="quantityVideo"
                                                required
                                                value={videoQuantity}
                                                onChange={(e) => setVideoQuantity(e.target.value)}
                                                placeholder='Video Number' />
                                        </CCol>
                                    </>
                                )}
                                <CCol md={2}>
                                    <CFormLabel htmlFor='timeLapseAction'>Time Lapse</CFormLabel>
                                    <CFormInput
                                        min="0"
                                        type='number'
                                        id="timeLapse"
                                        required
                                        value={timeLapse}
                                        onChange={(e) => setTimeLapse(e.target.value)}
                                        placeholder='Default (s)' />
                                </CCol>
                                <CCol md={1} style={{ marginLeft: "-56px" }}>
                                    <CTooltip style={{ marginBottom: '20px' }} content="In the time lapse setting, enter the number of seconds you want between each photo; this will be the interval at which the pictures are taken."
                                        placement='right'
                                        className="custom-tooltip">
                                        <InfoCircleIcon className="info-icon mt-2" />
                                    </CTooltip>
                                </CCol>
                                {isVideoOn && (
                                    <>
                                        <CRow>
                                            <CCol md={2} className='mt-3'>
                                                <CFormLabel htmlFor='photoVideoAction'>Photo</CFormLabel>
                                                <CFormSwitch
                                                    label={isPhotoVideoOn ? "Yes" : "No"}
                                                    id="formSwitchCheckPhotoVideo"
                                                    onChange={() => handleToggleChange('photoVideo')}
                                                    checked={isPhotoVideoOn}
                                                />
                                            </CCol>
                                        </CRow>
                                    </>
                                )}
                                {(isPhotoVideoOn && !isPhotoOn) && (<>

                                    <CRow>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='quantityAction'>Quantity</CFormLabel>
                                            <CFormInput
                                                min="0"
                                                type="number"
                                                id="pictureNumber"
                                                required
                                                value={photoVideoQuantity}
                                                onChange={(e) => setPhotoVideoQuantity(e.target.value)}
                                                placeholder='Picture Number' />
                                        </CCol>
                                        <CCol md={2}>
                                            <CFormLabel htmlFor='timeLapseActionVideoPhoto'>Time Lapse</CFormLabel>
                                            <CFormInput
                                                min="0"
                                                type='number'
                                                id="timeLapseVideoPhoto"
                                                required
                                                value={photoVideoTimeLapse}
                                                onChange={(e) => setPhotoVideoTimeLapse(e.target.value)}
                                                placeholder='Default (s)' />
                                        </CCol>
                                    </CRow>
                                </>)}

                            </CRow>
                        )}

                        {checkboxValidationFailed && (
                            <CRow className='mt-3'>
                                <CCol md={12}>
                                    <div className="alert alert-danger-custom" role="alert">
                                        At least Photo or Video must be on to save.
                                    </div>
                                </CCol>
                            </CRow>
                        )}

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
