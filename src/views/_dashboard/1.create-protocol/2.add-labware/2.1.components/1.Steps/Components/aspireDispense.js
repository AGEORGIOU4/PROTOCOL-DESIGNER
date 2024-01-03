import React, { useState } from 'react';
import { CCol, CFormCheck, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react-pro';
import defaultFlow from 'src/assets/images/wellOrder/defaultFlow.svg'
import { options_Blowout } from '../Actions/Mix/data'

export const AspireDispense = ({ flowRate,
  onFlowRateChange }) => {
  const [currentSVG, setCurrentSVG] = useState(defaultFlow); // Start with the default SVG
  const [isComponentOpen, setIsComponentOpen] = useState(false); // To track if the new component is open
  const [selectedColumn, setSelectedColumn] = useState('')
  const [checkboxStates, setCheckboxStates] = useState({
    flowRateDelay: false,
    flowRateTouchTipDispense: false,
    flowRateBlowoutDispense: false,
    flowRateTouchTipDispenseInput: false
    // Add other checkboxes here in the format: id: false
  });

  const handleCheckboxChange = (e) => {
    setCheckboxStates({
      ...checkboxStates,
      [e.target.id]: e.target.checked
    });
  };

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  }

  const handleSvgClick = () => {
    setCurrentSVG(currentSVG === defaultFlow ? defaultFlow : defaultFlow);
  };

  const handleClose = () => {
    setIsComponentOpen(false);
    // Optionally reset the SVG to default when modal closes
    setCurrentSVG(defaultFlow);
  };
  return (
    <>
      <CRow>
        <CCol md={4} className='flow-rate-col'>
          <CFormLabel htmlFor='flowRate'>Flow Rate</CFormLabel>
          <CFormInput style={{ width: 'none' }} type="text" placeholder='Default (μL/s)'></CFormInput>
          <div className="row g-2" style={{ marginTop: '4px' }}>
            <div className="col-6">

              <CFormCheck
                id="flowRateDelayDispense"
                label="Delay"
                onChange={handleCheckboxChange}
                checked={checkboxStates.flowRateDelayDispense}
              />
            </div>
            <div className="col-6" style={{ minHeight: '58px', opacity: checkboxStates.flowRateDelayDispense ? 1 : 0 }}>
              <CFormInput
                type='number'
                id="flowRateDelayDispenseInput"
                placeholder='Number of (s)'
              />
            </div>
            <div className="col-6">
              <CFormCheck id="flowRateTouchTipDispense"
                label="Touch Tip"
                onChange={handleCheckboxChange}
                checked={checkboxStates.flowRateTouchTipDispense}
              />
            </div>
            <div className="col-6" style={{ minHeight: '58px', opacity: checkboxStates.flowRateTouchTipDispense ? 1 : 0 }}>
              <CFormInput
                type='number'
                id="flowRateTouchTipDispenseInput"
                placeholder='Number of tips'
              />
            </div>
            <div className="col-6">
              <CFormCheck id="flowRateBlowoutDispense"
                label="Blowout"
                onChange={handleCheckboxChange}
                checked={checkboxStates.flowRateBlowoutDispense}
              />
            </div>
            <div className="col-6" style={{ minHeight: '58px', opacity: checkboxStates.flowRateBlowoutDispense ? 1 : 0 }}>
              <CFormSelect
                id="flowRateBlowoutDispenseInput"
                required
                onChange={handleColumnChange}
                value={selectedColumn}
                options={
                  selectedColumn === ''
                    ? [{ value: '', label: 'Select Blowout', disabled: true, hidden: true }, ...options_Blowout]
                    : options_Blowout
                }
              />
            </div>
          </div>
        </CCol>
      </CRow>
    </>
  );
};
