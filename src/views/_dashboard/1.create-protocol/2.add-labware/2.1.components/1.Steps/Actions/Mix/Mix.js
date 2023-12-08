import React from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import { options_ChangeTip, options_Pipettes } from './data';

export const MixForm = () => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }


  return (
    <>
      <CRow>
        <CCol md={12}>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
            <div className='modal-header-row' >
              <CCol md={7} style={{ paddingTop: '12px' }}>
                <h5 className='modal-subtitle'>Mix</h5>
              </CCol>
            </div>

            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom01">Pipette</CFormLabel>
              <CFormSelect options={options_Pipettes} id="validationCustom01" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

          </CForm>


        </CCol>

      </CRow>


      <br />
    </>
  )
}