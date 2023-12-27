import React, { useState, useEffect } from 'react';
import { AddCircle, CloseCircle } from 'iconsax-react';
import { CCol, CForm, CFormInput, CFormLabel, CFormSelect, CMultiSelect, CRow, CButton, CFormSwitch, CFormCheck, CCloseButton } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares, options_Temperature } from './data';
import { v4 as uuidv4 } from 'uuid';


export const ThemrocyclerForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ themorcyclerState: false, themorcyclerProfile: false });
    const [checkToggleStates, setToggleStates] = useState({ thermoBlock: false, lid: false, lidPosition: false });
    const [selectTemperature, setTemperatures] = useState({ thermoBlock: '°C', lid: '°C' })
    const [isFirstSelection, setIsFirstSelection] = useState({ thermoBlock: true, lid: true });
    const [removedStepId, setRemovedStepId] = useState(null);

    const [inputValues, setInputValues] = useState({});

    const [addStep, setAddStep] = useState([])
    const [isButtonClicked, setIsButtonClicked] = useState(false);


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

    const handleInputChange = (uniqueId, inputName, value) => {
        console.log(`Input Changed - ID: ${uniqueId}, Field: ${inputName}, Value: ${value}`);
        setInputValues(prevValues => {
            const updatedValues = {
                ...prevValues,
                [uniqueId]: {
                    ...prevValues[uniqueId] || {},
                    [inputName]: value
                }
            };
            console.log('Updated inputValues in handleInputChange', updatedValues);
            return updatedValues;
        });
    };

    useEffect(() => {
        console.log("UseEffect")
        console.log(inputValues);
    }, [inputValues]);



    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);


    function updateStepChildren(children, newStepNumber) {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            let newProps = { ...child.props };

            if (child.props.id && child.props.id.startsWith('nameStepInput')) {
                newProps.id = `nameStepInput${newStepNumber}`;
            }

            if (child.type === CFormLabel && child.props.htmlFor && child.props.htmlFor.startsWith('nameStepInput')) {
                return React.cloneElement(child, {
                    children: `${newStepNumber}.`
                });
            }

            if (child.props.children) {
                newProps.children = updateStepChildren(child.props.children, newStepNumber);
            }

            return React.cloneElement(child, newProps);
        });
    }

    const handleStepRemoval = uniqueIdToRemove => {
        setAddStep(prevSteps => {
            // Debugging: Log current steps and inputValues
            console.log("Current Steps", prevSteps);
            console.log("Current inputValues", inputValues);

            // Mapping of unique IDs to step numbers
            const idToStepNumberMap = prevSteps.reduce((acc, step, index) => {
                acc[step.id] = index + 1;
                return acc;
            }, {});

            // Filter out the step to be removed
            const newSteps = prevSteps.filter(step => step.id !== uniqueIdToRemove);

            // Determine the number of the step to be removed
            const stepNumberToRemove = idToStepNumberMap[uniqueIdToRemove];

            // Update the input values for remaining steps
            setInputValues(prevInputValues => {
                const updatedInputValues = { ...prevInputValues };
                debugger
                delete updatedInputValues[uniqueIdToRemove];

                Object.keys(updatedInputValues).forEach(key => {
                    const currentStepNumber = idToStepNumberMap[key];
                    if (currentStepNumber > stepNumberToRemove) {
                        const newKey = prevSteps[currentStepNumber - 2].id;
                        updatedInputValues[newKey] = updatedInputValues[key];
                        delete updatedInputValues[key];
                    }
                });

                return updatedInputValues;
            });

            // Update the step number for remaining steps
            return newSteps.map((step, index) => {
                const newStepNumber = index + 1;
                // Update necessary attributes to reflect the new step number
                const updatedComponent = React.cloneElement(step.component, {
                    ...step.component.props,
                    key: `step-${newStepNumber}`,
                    children: React.cloneElement(step.component.props.children, {
                        ...step.component.props.children.props,
                        children: updateStepChildren(step.component.props.children.props.children, newStepNumber)
                    }),
                });

                return { ...step, component: updatedComponent };
            });
        });
    };


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


    const addStepComponent = () => {
        const uniqueId = uuidv4(); // Use unique ID for key identification, not for display

        const stepNumber = addStep.length + 1;
        setIsButtonClicked(stepNumber > 0);
        const isNotFirstStep = addStep.length > 0;
        const newStep = (
            <>
                <CRow className={isNotFirstStep ? "mt-2" : ""}>
                    <CCol md={3}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CFormLabel htmlFor={`nameStepInput${uniqueId}`} style={{ marginRight: '10px' }}>{stepNumber}.</CFormLabel>
                            <CFormInput
                                type="text"
                                id={`nameStepInput${uniqueId}`}
                                value={inputValues[uniqueId]?.name || ''}
                                onChange={(e) => handleInputChange(uniqueId, 'name', e.target.value)}
                                required
                                placeholder='Enter Name'
                            />

                        </div>
                    </CCol>
                    <CCol md={3}>
                        <CFormInput type="number" min="0" id={`temperatureStepInput${uniqueId}`} onChange={(e) => handleInputChange(uniqueId, "temperature", e.target.value)} required placeholder='Default (°C)' />
                    </CCol>
                    <CCol md={2}>
                        <CFormInput type="number" min="0" id={`timeMinutesStepInput${uniqueId}`} onChange={(e) => handleInputChange(uniqueId, "timeMinutes", e.target.value)} required placeholder='Default (m)' />
                    </CCol>

                    <CCol md={2}>
                        <CFormInput type="number" min="0" id={`timeSecondsStepInput${uniqueId}`} onChange={(e) => handleInputChange(uniqueId, e.target.value)} required placeholder='Default (s)' />
                    </CCol>
                    <CCol md={2} style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }}>
                        <CloseCircle size="32" style={{ cursor: 'pointer' }} onClick={() => handleStepRemoval(uniqueId)} color="#414141" />
                    </CCol>
                </CRow>
            </>
        )
        setAddStep(prevSteps => {
            const newSteps = [...prevSteps, { id: uniqueId, component: newStep }];
            return newSteps;
        });

    }
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
                                        id="labWareInput"
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
                                        <CFormLabel htmlFor="ThermocyclerBlockToggle1">Thermocycler Block</CFormLabel>
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
                                        <CFormLabel htmlFor="LidPositionToggle1">Lid Position</CFormLabel>
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
                                                id="volumeProfileSetting"
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
                                                id="lidTemperatureProfileSetting"
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
                                        <CFormLabel htmlFor="profileSettingsSteps">Profile Steps</CFormLabel>
                                    </CCol>
                                </CRow>

                                <CRow>
                                    <CCol md={3}>
                                        <CFormLabel htmlFor="nameStep">Name</CFormLabel>
                                    </CCol>
                                    <CCol md={3}>
                                        <CFormLabel htmlFor="temperatureStep"> Temperature</CFormLabel>
                                    </CCol>
                                    <CCol md={2}>
                                        <CFormLabel htmlFor="timeStep">Time</CFormLabel>
                                    </CCol>
                                </CRow>

                                {addStep.map(step => step.component)}


                                <CRow className={`mt-4 ${isButtonClicked ? 'justify-end-force' : 'justify-start-force'}`}>
                                    <CCol md={2} className={`${isButtonClicked ? 'col-center-content' : ''}`}>
                                        <CButton className='profile-btn-steps' onClick={addStepComponent}>
                                            <AddCircle size="24" style={{ marginTop: "-2px" }} /> Step</CButton>
                                    </CCol>
                                    <CCol md={2} className={`${isButtonClicked ? 'col-center-content' : ''}`}>
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
                                        <CFormLabel htmlFor="ThermocyclerBlockToggle2">Thermocycler Block</CFormLabel>
                                        <CFormSwitch
                                            label={checkToggleStates.thermoBlock ? "Active" : "Deactivate"}
                                            id="ThermocyclerBlockToggle2"
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
                                        <CFormLabel htmlFor="LidPositionToggle2">Lid Position</CFormLabel>
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
            </CRow >
        </>
    );
};
