import React, { useState } from 'react';
import { AddCircle, CloseCircle } from 'iconsax-react';
import { CCol, CForm, CFormInput, CFormLabel, CFormSelect, CMultiSelect, CRow, CButton, CFormSwitch, CFormCheck, CCloseButton } from '@coreui/react-pro';
import { Notes } from '../../Components/notes';
import { options_LabWares, options_Temperature } from './data';
import { ReactComponent as ArrowSvg } from 'src/assets/images/generic/grouping.svg';
import { v4 as uuidv4 } from 'uuid';
import { ConnectionStep } from '../../Components/connectionStep'


export const ThemrocyclerForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectedLabWare, setSelectedLabWare] = useState([]);
    const [checkboxStates, setCheckboxStates] = useState({ themorcyclerState: false, themorcyclerProfile: false });
    const [checkToggleStates, setToggleStates] = useState({ thermoBlock: false, lid: false, lidPosition: false });
    const [selectTemperature, setTemperatures] = useState({ thermoBlock: '°C', lid: '°C' })
    const [isFirstSelection, setIsFirstSelection] = useState({ thermoBlock: true, lid: true });
    const [addStep, setAddStep] = useState([]);
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

    const handleInputChange = (stepUniqueId, inputName, value) => {
        setAddStep(prevSteps => prevSteps.map(stepOrCycle => {
            // If this is a regular step
            if (!stepOrCycle.isCycle && stepOrCycle.uniqueId === stepUniqueId) {
                return { ...stepOrCycle, [inputName]: value };
            }
            // If this is a cycle, check its steps
            if (stepOrCycle.isCycle) {
                const updatedCycleSteps = stepOrCycle.cycleSteps.map(cycleStep => {
                    if (cycleStep.uniqueId === stepUniqueId) {
                        return { ...cycleStep, [inputName]: value };
                    }
                    return cycleStep;
                });
                return { ...stepOrCycle, cycleSteps: updatedCycleSteps };
            }
            return stepOrCycle;
        }));
    };



    const handleLabWareChange = (selectedOptions) => setSelectedLabWare(selectedOptions);
    const handleStepRemoval = (uniqueIdToRemove) => {
        setAddStep(prevSteps => prevSteps.reduce((acc, item) => {
            // If this is a regular step, check if it's the one to remove
            if (!item.isCycle && item.uniqueId !== uniqueIdToRemove) {
                acc.push(item);
            }
            // If this is a cycle, filter out the step from the cycleSteps
            if (item.isCycle) {
                const updatedCycleSteps = item.cycleSteps.filter(cycleStep => cycleStep.uniqueId !== uniqueIdToRemove);
                // Only keep the cycle if it still has steps after removal
                if (updatedCycleSteps.length > 0) {
                    acc.push({ ...item, cycleSteps: updatedCycleSteps });
                }
            }
            return acc;
        }, []));
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
        const uniqueId = uuidv4();
        setIsButtonClicked(true);

        setAddStep(prevSteps => {
            let isNotFirstStep = false
            if (prevSteps.length > 0)
                isNotFirstStep = true

            const newStep = { name: '', temperature: '', timeMinutes: '', timeSeconds: '', uniqueId, isNotFirstStep: isNotFirstStep };
            return [...prevSteps, newStep];
        });
    };

    const addStepToCycle = (cycleUniqueId) => {
        setAddStep(prevSteps => prevSteps.map(stepOrCycle => {
            if (stepOrCycle.uniqueId === cycleUniqueId && stepOrCycle.isCycle) {
                const newCycleStep = {
                    name: '',
                    temperature: '',
                    timeMinutes: '',
                    timeSeconds: '',
                    uniqueId: uuidv4(),
                    isFirstStep: stepOrCycle.cycleSteps.length === 0 // True if it's the first step, false otherwise
                };
                const newCycleSteps = [...stepOrCycle.cycleSteps, newCycleStep];
                return { ...stepOrCycle, cycleSteps: newCycleSteps };
            }
            return stepOrCycle;
        }));
    };



    const addCycleComponent = () => {
        const uniqueId = uuidv4();
        setIsButtonClicked(true);

        setAddStep(prevSteps => {
            const newCycle = {
                isCycle: true,
                uniqueId: uniqueId,
                cycleSteps: [
                    { name: '', temperature: '', timeMinutes: '', timeSeconds: '', uniqueId: uniqueId, isFirstStep: true, cycleNumbers: null },
                ],
            };

            return [...prevSteps, newCycle];
        });
    };


    return (
        <>
            <CRow style={{ overflow: 'auto', maxHeight: '100vh' }}>
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
                                {addStep.length > 0 && (
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
                                )}

                                {addStep.map((stepOrCycle, index) => {
                                    if (stepOrCycle.isCycle) {
                                        // Render the cycle header first, not inside the map of cycleSteps
                                        const shouldShowArrows = stepOrCycle.cycleSteps.length > 1;
                                        return (
                                            <React.Fragment key={stepOrCycle.uniqueId}>
                                                <CRow key={stepOrCycle.uniqueId} className='mt-3'>
                                                    <CCol>
                                                        <CFormLabel htmlFor={`cycleLabel${stepOrCycle.uniqueId}`} style={{ marginRight: '10px' }}>
                                                            {`${index + 1}. Cycle`}
                                                        </CFormLabel>
                                                    </CCol>
                                                </CRow>

                                                {/* Now map over each step in the cycle */}
                                                {stepOrCycle.cycleSteps.map((cycleStep, stepIndex, cycleStepsArray) => {
                                                    const isLastStep = stepIndex === cycleStepsArray.length - 1;
                                                    const variant = () => {
                                                        if (stepIndex === 0) return 'first'
                                                        if (stepIndex === cycleStepsArray.length - 1) return 'last'
                                                        return null
                                                    }

                                                    return (
                                                        <>
                                                            <CRow key={cycleStep.uniqueId} className="pt-2">

                                                                {/* Step Name */}
                                                                <CCol md={2}>
                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <CFormLabel htmlFor={`nameStepInput${stepOrCycle.uniqueId}`} style={{ marginRight: '10px' }}>{index + 1}.{stepIndex + 1}</CFormLabel>
                                                                        <CFormInput
                                                                            type="text"
                                                                            id={`nameCycleStepInput${cycleStep.uniqueId}`}
                                                                            value={cycleStep.name}
                                                                            onChange={(e) => handleInputChange(cycleStep.uniqueId, 'name', e.target.value)}
                                                                            required
                                                                            placeholder='Enter Name'
                                                                        />
                                                                    </div>
                                                                </CCol>

                                                                {/* Step Temperature */}
                                                                <CCol md={2}>
                                                                    <CFormInput
                                                                        type="number"
                                                                        min="0"
                                                                        id={`temperatureCycleStepInput${cycleStep.uniqueId}`}
                                                                        value={cycleStep.temperature}
                                                                        onChange={(e) => handleInputChange(cycleStep.uniqueId, "temperature", e.target.value)}
                                                                        required
                                                                        placeholder='Default (°C)'
                                                                    />
                                                                </CCol>
                                                                <CCol md={2}>
                                                                    <CFormInput
                                                                        type="number"
                                                                        min="0"
                                                                        id={`timeMinutesStepInput${stepOrCycle.uniqueId}`}
                                                                        value={cycleStep.timeMinutes}
                                                                        onChange={(e) => handleInputChange(cycleStep.uniqueId, "timeMinutes", e.target.value)}
                                                                        required
                                                                        placeholder='Default (m)'
                                                                    />
                                                                </CCol>
                                                                <CCol md={2}>
                                                                    <CFormInput
                                                                        type="number"
                                                                        min="0"
                                                                        id={`timeSecondsStepInput${stepOrCycle.uniqueId}`}
                                                                        value={cycleStep.timeSeconds}
                                                                        onChange={(e) => handleInputChange(cycleStep.uniqueId, "timeSeconds", e.target.value)}
                                                                        required
                                                                        placeholder='Default (s)'
                                                                    />
                                                                </CCol>

                                                                <CCol md={2} style={{ display: "flex", justifyContent: 'flex-start', alignItems: "center" }}>
                                                                    <CloseCircle size="32" style={{ cursor: 'pointer' }} onClick={() => handleStepRemoval(cycleStep.uniqueId)} color="#414141" />
                                                                    {cycleStepsArray.length > 1 && <div style={{ width: 28, height: '100%' }}><ConnectionStep variant={variant()} /></div>}
                                                                </CCol>
                                                                {cycleStep.isFirstStep && (
                                                                    <CCol md={1} style={{ display: "flex", justifyContent: 'flex-start', alignItems: "center" }}>
                                                                        <CFormInput
                                                                            type="number"
                                                                            min="0"
                                                                            id={`cycles${stepOrCycle.uniqueId}`}
                                                                            value={cycleStep.cycleNumbers}
                                                                            onChange={(e) => handleInputChange(cycleStep.uniqueId, "cycleNumbers", e.target.value)}
                                                                            required
                                                                            placeholder='Cycles'
                                                                        />
                                                                    </CCol>
                                                                )}
                                                            </CRow>
                                                        </>
                                                    )
                                                })}

                                                {/* Button to add a new step to this cycle */}
                                                <CRow className={`mt-4 ${isButtonClicked ? 'justify-end-force' : 'justify-start-force'}`}>
                                                    <CCol md={2} className={`${isButtonClicked ? 'col-center-content' : ''}`}>
                                                        <CButton className='profile-btn-steps' onClick={() => addStepToCycle(stepOrCycle.uniqueId)}>
                                                            <AddCircle size="24" style={{ marginTop: "-2px" }} /> Step
                                                        </CButton>
                                                    </CCol>
                                                </CRow>
                                            </React.Fragment>
                                        );
                                    } else {
                                        return (

                                            <CRow key={stepOrCycle.uniqueId} className={stepOrCycle.isNotFirstStep ? "mt-2" : ""}>
                                                <CCol md={3}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CFormLabel htmlFor={`nameStepInput${stepOrCycle.uniqueId}`} style={{ marginRight: '10px' }}>{index + 1}.</CFormLabel>
                                                        <CFormInput
                                                            type="text"
                                                            id={`nameStepInput${stepOrCycle.uniqueId}`}
                                                            value={stepOrCycle.name}
                                                            onChange={(e) => handleInputChange(stepOrCycle.uniqueId, 'name', e.target.value)}
                                                            required
                                                            placeholder='Enter Name'
                                                        />
                                                    </div>
                                                </CCol>
                                                <CCol md={3}>
                                                    <CFormInput
                                                        type="number"
                                                        min="0"
                                                        id={`temperatureStepInput${stepOrCycle.uniqueId}`}
                                                        value={stepOrCycle.temperature}
                                                        onChange={(e) => handleInputChange(stepOrCycle.uniqueId, "temperature", e.target.value)}
                                                        required
                                                        placeholder='Default (°C)'
                                                    />
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormInput
                                                        type="number"
                                                        min="0"
                                                        id={`timeMinutesStepInput${stepOrCycle.uniqueId}`}
                                                        value={stepOrCycle.timeMinutes}
                                                        onChange={(e) => handleInputChange(stepOrCycle.uniqueId, "timeMinutes", e.target.value)}
                                                        required
                                                        placeholder='Default (m)'
                                                    />
                                                </CCol>
                                                <CCol md={2}>
                                                    <CFormInput
                                                        type="number"
                                                        min="0"
                                                        id={`timeSecondsStepInput${stepOrCycle.uniqueId}`}
                                                        value={stepOrCycle.timeSeconds}
                                                        onChange={(e) => handleInputChange(stepOrCycle.uniqueId, "timeSeconds", e.target.value)}
                                                        required
                                                        placeholder='Default (s)'
                                                    />
                                                </CCol>
                                                <CCol md={2} style={{ display: "flex", justifyContent: 'flex-end', alignItems: "center" }}>
                                                    <CloseCircle size="32" style={{ cursor: 'pointer' }} onClick={() => handleStepRemoval(stepOrCycle.uniqueId)} color="#414141" />
                                                </CCol>
                                            </CRow>
                                        )
                                    }
                                })}

                                < CRow className={`mt-4 ${isButtonClicked ? 'justify-end-force' : 'justify-start-force'}`}>
                                    <CCol md={2} className={`${isButtonClicked ? 'col-center-content' : ''}`}>
                                        <CButton className='profile-btn-steps' onClick={addStepComponent}>
                                            <AddCircle size="24" style={{ marginTop: "-2px" }} /> Step</CButton>
                                    </CCol>
                                    <CCol md={2} className={`${isButtonClicked ? 'col-center-content' : ''}`}>
                                        <CButton className='profile-btn-steps' onClick={addCycleComponent}>
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
                </CCol >
            </CRow >
        </>
    );
};
