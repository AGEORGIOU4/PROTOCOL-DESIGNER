import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CRow, CButton } from '@coreui/react-pro';
import defaultFlow from 'src/assets/images/wellOrder/defaultFlow.svg'
import {WellOrder} from './wellOrder'
import {useModal} from 'src/contexts/ModalContext'

export const AspireDispense = ({  flowRate,
  onFlowRateChange}) => {
    const [currentSVG, setCurrentSVG] = useState(defaultFlow); // Start with the default SVG
    const [isComponentOpen, setIsComponentOpen] = useState(false); // To track if the new component is open
    const { openModal, closeModal } = useModal();
    const handleSvgClick = () => {
        debugger
        openModal();
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
      
      {/* Aspirate Section */}
     
        
      <CCol md={2}>
        <CFormLabel htmlFor="flowRateAspirate">Flow Rate</CFormLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <CFormInput
            type="text"
            id="flowRateAspirate"
            placeholder="Default (μL/s)"
            value={flowRate}
            onChange={onFlowRateChange}
            />
            <CFormCheck id="flowRateDelay" label="Delay"/>
        </div>
      </CCol>
      <CCol md={2} >
        <CFormLabel htmlFor='tipPosition'>Tip Position</CFormLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CFormInput
          type="text"
          id="tipPosition"
          placeholder="Default (mm)"
        />
        <CFormInput
        type='number'
        id="tipPositionNumber"
        placeholder='Number of (s)'/>
        </div>
      </CCol>
      <CCol md={2}>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <CFormLabel htmlFor='wellOrder'>Well Order</CFormLabel>
        <img 
        src={currentSVG} 
        alt="Clickable icon" 
        onClick={handleSvgClick} 
        style={{ cursor: 'pointer', alignSelf: 'flex-start' }}  // Add alignSelf if you want to center the icon
        />
        {/* If you have more form elements related to the Well Order, they would go here. */}
    </div>
      </CCol>

      <CCol md={2} className='flow-rate-col'>
        <CFormLabel htmlFor='flowRate'>Flow Rate</CFormLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CFormInput
          type="text"
          id="tipPosition"
          placeholder="Default (μL/s)"
        />
        <CFormCheck id="flowRateDelayDispense" label="Delay"/>
        <CFormCheck id="flowRateTouchTipDispense" label="Touch Tip"/>
        <CFormCheck id="flowRateBlowoutDispense" label="Blowout"/>
        </div>
      </CCol>
   
    </CRow>
  

    </>
  );
};
