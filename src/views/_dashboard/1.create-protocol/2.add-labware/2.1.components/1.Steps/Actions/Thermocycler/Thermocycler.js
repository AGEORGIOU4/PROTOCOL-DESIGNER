import React, { useState } from 'react';
import { AddCircle } from 'iconsax-react';
import { CCol, CForm, CTooltip, CFormInput, CFormLabel, CFormSelect, CMultiSelect, CRow, CButton, CFormSwitch, CFormCheck, CCloseButton } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares, options_Temperature } from './data';
import { ReactComponent as InfoCircleIcon } from 'src/assets/images/generic/infoCircle.svg';
import { useStateManager } from 'react-select';

export const ThemrocyclerForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ themorcyclerState: false, themorcyclerProfile: false });
    const [checkToggleStates, setToggleStates] = useState({ thermoBlock: false, lid: false, lidPosition: false });
    const [selectTemperature, setTemperatures] = useState({ thermoBlock: '°C', lid: '°C' })
    const [isFirstSelection, setIsFirstSelection] = useState({ thermoBlock: true, lid: true });


    // Handlers for various user interactions
    const handleCheckboxChange = (e) => {
        const { id, checked } = e.target;

        // Update the state depending on which checkbox was changed
        if (id === "themorcyclerState") {
            setCheckboxStates({ themorcyclerState: checked, themorcyclerProfile: !checked });
        } else if (id === "themorcyclerProfile") {
            setCheckboxStates({ themorcyclerState: !checked, themorcyclerProfile: checked });
        }
    };

    const handleTogglesChange = (e) => setToggleStates({ ...checkToggleStates, [e.target.id]: e.target.checked })
    const handleDropdownChange = (e) => {
        const { id, value } = e.target;
        setTemperatures({ ...selectTemperature, [id]: value });
        setIsFirstSelection({ ...isFirstSelection, [id]: false });
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
                                <h5 className='modal-subtitle'>Thermocycler</h5>
                            </CCol>
                        </div>

                        {/* Labware Selection */}
                        {!checkboxStates.themorcyclerProfile && (<>
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

                        </>)}
                        <CRow className='mt-4'>
                            <CCol md={3}>
                                <CFormCheck
                                    id="themorcyclerState"
                                    label="Change Thermocycler State"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.themorcyclerState}
                                />
                            </CCol>
                        </CRow>

                        <CRow className='mt-2'>
                            <CCol md={3}>
                                <CFormCheck
                                    id="themorcyclerProfile"
                                    label="Program a Thermocycler Profile"
                                    onChange={handleCheckboxChange}
                                    checked={checkboxStates.themorcyclerProfile}
                                />
                            </CCol>
                        </CRow>
                        {checkboxStates.themorcyclerState && (
                            <>
                                <CRow className='mt-2'>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="ThermocyclerBlockToggle">Thermocycler Block</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.thermoBlock ? "Active" : "Deactivate"}
                                            id="thermoBlock"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.thermoBlock}
                                        />
                                        {checkToggleStates.thermoBlock && (
                                            <>
                                                <CCol md={5}>
                                                    <CFormSelect
                                                        id="thermoBlock" // Make sure the id matches the state key
                                                        required
                                                        onChange={handleDropdownChange}
                                                        value={selectTemperature.thermoBlock}
                                                    >
                                                        {isFirstSelection.thermoBlock && (
                                                            <option value="°C" disabled>Default (°C)</option>
                                                        )}
                                                        {options_Temperature.map(option => (
                                                            <option key={option.id} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                </CCol>
                                            </>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="LidToggle">Lid</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.lid ? "Active" : "Deactivate"}
                                            id="lid"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.lid}
                                        />
                                        {checkToggleStates.lid && (
                                            <>
                                                <CCol md={5}>
                                                    <CFormSelect
                                                        id="lid"
                                                        required
                                                        onChange={handleDropdownChange}
                                                        value={selectTemperature.lid}
                                                    >
                                                        {isFirstSelection.lid && (
                                                            <option value="°C" disabled>Default (°C)</option>
                                                        )}
                                                        {options_Temperature.map(option => (
                                                            <option key={option.id} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                </CCol>
                                            </>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="LidPositionToggle">Lid Position</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.lidPosition ? "Open" : "Closed"}
                                            id="lidPosition"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.lidPosition}
                                        />
                                    </CCol>
                                </CRow>
                            </>
                        )}


                        {checkboxStates.themorcyclerProfile && (
                            <>
                                <CRow className='mt-2'>
                                    <CCol md={5}>
                                        <CFormLabel htmlFor="profileSettings">Profile Settings</CFormLabel>
                                    </CCol>
                                </CRow>

                                <CRow className='mt-2'>
                                    <CCol md={4}>
                                        <CCol md={8}>
                                            <CFormLabel htmlFor='volumeProfileSetting'>Volume</CFormLabel>
                                            <CFormInput
                                                type='number'
                                                id="volumeProfileInput"
                                                min="0"
                                                required
                                                placeholder='Default (μL)'
                                            />
                                        </CCol>
                                    </CCol>

                                    <CCol md={4}>
                                        <CCol md={8}>
                                            <CFormLabel htmlFor='lidTemperatureProfileSetting'>Lid Temperature</CFormLabel>
                                            <CFormInput
                                                type='number'
                                                id="lidTemperatureProfileInput"
                                                min="0"
                                                required
                                                placeholder='Default (°C)'
                                            />
                                        </CCol>
                                    </CCol>

                                    <CCol md={4}>
                                        <CFormLabel htmlFor='lidPositionProfileSetting'>Lid Position</CFormLabel>
                                        <div>Closed</div>
                                    </CCol>
                                </CRow>

                                <CRow className='mt-4'>
                                    <CCol md={5}>
                                        <CFormLabel htmlFor="profileSettings">Profile Steps</CFormLabel>
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol md={2}>
                                        <CButton className='profile-btn-steps'>
                                            <AddCircle size="24" style={{ marginTop: "-2px" }} /> Step</CButton>
                                    </CCol>
                                    <CCol md={2}>
                                        <CButton className='profile-btn-steps'>
                                            <AddCircle size="24" style={{ marginTop: "-2px" }} /> Cycle</CButton>
                                    </CCol>
                                </CRow>

                                <CRow className='mt-4'>
                                    <CCol md={5}>
                                        <CFormLabel htmlFor="endingHold">Ending Hold</CFormLabel>
                                    </CCol>
                                </CRow>

                                <CRow className='mt-2'>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="ThermocyclerBlockToggle">Thermocycler Block</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.thermoBlock ? "Active" : "Deactivate"}
                                            id="thermoBlock"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.thermoBlock}
                                        />
                                        {checkToggleStates.thermoBlock && (
                                            <>
                                                <CCol md={5}>
                                                    <CFormSelect
                                                        id="thermoBlock" // Make sure the id matches the state key
                                                        required
                                                        onChange={handleDropdownChange}
                                                        value={selectTemperature.thermoBlock}
                                                    >
                                                        {isFirstSelection.thermoBlock && (
                                                            <option value="°C" disabled>Default (°C)</option>
                                                        )}
                                                        {options_Temperature.map(option => (
                                                            <option key={option.id} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                </CCol>
                                            </>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="LidToggle">Lid</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.lid ? "Active" : "Deactivate"}
                                            id="lid"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.lid}
                                        />
                                        {checkToggleStates.lid && (
                                            <>
                                                <CCol md={5}>
                                                    <CFormSelect
                                                        id="lid"
                                                        required
                                                        onChange={handleDropdownChange}
                                                        value={selectTemperature.lid}
                                                    >
                                                        {isFirstSelection.lid && (
                                                            <option value="°C" disabled>Default (°C)</option>
                                                        )}
                                                        {options_Temperature.map(option => (
                                                            <option key={option.id} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </CFormSelect>
                                                </CCol>
                                            </>
                                        )}
                                    </CCol>
                                    <CCol md={4}>
                                        <CFormLabel htmlFor="LidPositionToggle">Lid Position</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.lidPosition ? "Open" : "Closed"}
                                            id="lidPosition"
                                            onChange={handleTogglesChange}
                                            checked={checkToggleStates.lidPosition}
                                        />
                                    </CCol>
                                </CRow>
                            </>)}

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
