import React, { useEffect } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CInputGroup, CInputGroupText, CModalHeader, CModalTitle, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';

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


            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom01">Pipette</CFormLabel>
              <CFormSelect options={[]} id="validationCustom01" required />
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

            <CModalHeader closeButton={false} style={{ padding: '0 8px 16px 8px' }}>
              <CModalTitle id="StaticBackdropExampleLabel">ASPIRATE</CModalTitle>
              <CModalTitle id="StaticBackdropExampleLabel">DISPENSE</CModalTitle>
            </CModalHeader>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom03">Source</CFormLabel>
              <CFormSelect options={[]} id="validationCustom03" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom04">Wells</CFormLabel>
              <CFormInput type='number' id="validationCustom04" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={4}>
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
              <CFormLabel htmlFor="validationCustom07">Flow Rate</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom07" required />
                <CInputGroupText id="basic-addon2">μL/s</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom08">Tip Position</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom08" required />
                <CInputGroupText id="basic-addon2">mm</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}></CCol>


            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom09">Flow Rate</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom09" required />
                <CInputGroupText id="basic-addon2">μL/s</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CFormLabel htmlFor="validationCustom10">Tip Position</CFormLabel>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom10" required />
                <CInputGroupText id="basic-addon2">mm</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}></CCol>

            <CCol md={2}>
              <CFormCheck id="flexCheckDefault" label="Mix" />
            </CCol>

            <CCol md={2}>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom09" required />
                <CInputGroupText id="basic-addon2">μL</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={2}>
              <CInputGroup className="mb-3">
                <CFormInput type='number' id="validationCustom10" required />
                <CInputGroupText id="basic-addon2">x</CInputGroupText>
              </CInputGroup>
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CModalHeader closeButton={false} style={{ padding: '0 8px 16px 8px' }}>
              <CModalTitle id="StaticBackdropExampleLabel">STERILITY & MOTION</CModalTitle>
            </CModalHeader>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom05">Destination</CFormLabel>
              <CFormSelect options={[]} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>






          </CForm>


        </CCol>

      </CRow>


      <br />
    </>
  )
}