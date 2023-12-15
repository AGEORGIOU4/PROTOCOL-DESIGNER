import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CTooltip, CFormInput, CFormLabel, CMultiSelect, CFormSelect, CRow, CButton, CFormSwitch } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_rpm, options_Temperature, options_LabWares } from './data'
import { ReactComponent as InfoCircleIcon } from 'src/assets/images/generic/infoCircle.svg';

export const MagnetForm = ({ onClose, onDelete, stepId, stepTitle }) => {

    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [selectedRPM, setSelectedRPM] = useState('RPM')
    const [selectedTemperature, setSelectedTemperature] = useState('°C');
    const [isFirstSelection, setIsFirstSelection] = useState(true);
    const [isFirstSelectionRPM, setIsFirstSelectionRPM] = useState(true)

    const [checkboxStates, setCheckboxStates] = useState({
        pauseDelay: false,
        delay: false
        // Add other checkboxes here in the format: id: false
    });

    // State to track the toggle switch
    const [isShakeSpeedOn, setIsShakeSpeedOn] = useState(false);
    const [isMagnetOn, setIsMagnetOn] = useState(false)
    const [isPrecipitationTime, setIsPrecipititationTime] = useState(false)

    // Handler for toggle switch change


    const handleLocalClose = () => {
        onClose();
    };

    const handleCheckboxChange = (e) => {
        setCheckboxStates({
            ...checkboxStates,
            [e.target.id]: e.target.checked
        });
    };

    const handleLabWareChange = (selectedOptions) => {
        setSelectedLabWare(selectedOptions);
    };


    const handleDropdownChange = (dropdownId, event) => {
        const value = event.target.value;
        switch (dropdownId) {
            case 'temperature':
                setSelectedTemperature(value);
                setIsFirstSelection(false);
                break;
            default:

        }
    }

    const handleToggleChange = (dropdownId) => {
        switch (dropdownId) {
            case 'magnet':
                setIsMagnetOn(!isMagnetOn)
                break;
            case 'precipitationTime':
                setIsPrecipititationTime(!isPrecipitationTime)
                break;
            default:

        }
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
                            <h5 className='modal-subtitle'>Manget</h5>
                        </CCol>
                    </div>
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
                    <CRow className='mt-3'>
                        <CCol md={2}>
                            <CFormLabel htmlFor='magnetAction'>Magnet Action</CFormLabel>
                            <CFormSwitch
                                className='mt-2'
                                label={isMagnetOn ? "On Magnet" : "Off Magnet"}
                                id="formSwitchCheckMagnet"
                                onChange={() => handleToggleChange('magnet')}
                                checked={isMagnetOn}
                            />
                        </CCol>
                        <CRow>
                            <CCol md={2} className="d-flex align-items-center">
                                <CFormSwitch
                                    className='mt-2 me-2' // Added margin-right for spacing
                                    label="Precipitation Time"
                                    id="formSwitchCheckDefaultNormal"
                                    onChange={() => handleToggleChange('precipitationTime')}
                                    checked={isPrecipitationTime}
                                />
                                <CTooltip content="In this help information text box there will be a suggested precipitation time for each selected bead. The user will have the option to either follow it or insert a custom precipitation time of desire."
                                    placement='right'
                                    className="custom-tooltip">
                                    <InfoCircleIcon className="info-icon mt-2" />
                                </CTooltip>

                            </CCol>
                        </CRow>
                        <CCol md={2}>
                            <div style={{ height: '38px' }}>
                            </div>
                            <CFormSelect
                                style={{ marginLeft: "-130px" }}
                                id="temperatureSelect"
                                required
                                onChange={(e) => handleDropdownChange('rpm', e)}
                                value={selectedRPM}
                            >
                                {isFirstSelectionRPM && (
                                    <option value="RPM" disabled>
                                        Default (RPM)
                                    </option>
                                )}
                                {options_rpm.map(option => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </CFormSelect>
                        </CCol>
                    </CRow>
                    <CRow className='mt-3'>
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
