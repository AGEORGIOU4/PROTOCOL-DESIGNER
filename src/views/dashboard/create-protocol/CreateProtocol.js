import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,

  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow
} from '@coreui/react-pro'
import { DocsExample } from 'src/components'
import { cilPlus, cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'


const Form = () => {
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
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Protocol Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" placeholder="Sample Protocol" required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Author</CFormLabel>
        <CFormInput type="text" id="validationCustom02" placeholder="Orinda Charisse" required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CFormCheck
          type="checkbox"
          id="invalidCheck"
          label="I authorize Efevre Tech LTD to use this protocol commercially"
          required
        />
        <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" className='mt-3 basic-btn' type="submit">
          <CIcon icon={cilPlus} /> Create
        </CButton>
      </CCol>
    </CForm>
  )
}

const Validation = () => {
  return (
    <CRow>
      <CCol xs={6}>
        <Form />
      </CCol>
    </CRow>
  )
}
const CreateProtocol = () => {
  return (
    <>
      <div className="min-vh-60 d-flex flex-row align-items-center">
        <Validation />
      </div>
    </>
  )
}

export default CreateProtocol
