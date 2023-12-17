import React from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import { options_ChangeTip, options_Pipettes } from './data';
import CIcon from '@coreui/icons-react';

export const TransferForm = () => {
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
                <h5 className='modal-subtitle'>TRANSFER</h5>
              </CCol>
            </div>


            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom01">Pipette</CFormLabel>
              <CFormSelect options={options_Pipettes} id="validationCustom01" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom02">Volume Per Well</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom02" required />
                <CInputGroupText id="basic-addon2">μL</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <div className='modal-header-row' >
              <CCol md={7} style={{ padding: '0' }}>
                <h5 className='modal-subtitle'>ASPIRATE</h5>
              </CCol>
              <CCol md={5} style={{ paddingLeft: '8px' }}>
                <h5 className='modal-subtitle'>DISPENSE</h5>
              </CCol>
            </div>

            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom03">Source</CFormLabel>
              <CFormSelect options={[]} id="validationCustom03" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom04">Wells</CFormLabel>
              <CFormInput type='number' id="validationCustom04" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* SPACER */}
            <CCol md={2}></CCol>

            <CCol md={3}>
              <CFormLabel htmlFor="validationCustom05">Destination</CFormLabel>
              <CFormSelect options={[]} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom06">Wells</CFormLabel>
              <CFormInput type='number' id="validationCustom06" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormCheck id="flexCheckDefault" label="Mix Before" />
            </CCol>

            {/* SPACER */}
            <CCol md={5}></CCol>

            <CCol md={2}>
              <CFormCheck id="flexCheckDefault" label="Mix After" />
            </CCol>

            <div className='modal-header-row' >
              <CCol md={7} style={{ paddingTop: '12px' }}>
                <h5 className='modal-subtitle'>STERILITY</h5>
              </CCol>
            </div>

            <CCol md={6}>
              <CFormLabel htmlFor="validationCustom05">Change Tip</CFormLabel>
              <CFormSelect options={options_ChangeTip} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="validationPath">Path</CFormLabel>
              {/* Missing Icons from Figma as one entity please */}
            </CCol>




          </CForm>


        </CCol>

      </CRow>


      <br />
    </>
  )
}