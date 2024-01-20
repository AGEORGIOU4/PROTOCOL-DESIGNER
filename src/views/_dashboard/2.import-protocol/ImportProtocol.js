import React, { useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CRow,
} from "@coreui/react-pro";
import { cilCloudUpload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const Form = () => {
  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <CCol md={12}>
        <CFormInput
          type="file"
          id="validationTextarea"
          aria-label="file example"
          required
        />
        <CFormFeedback invalid>No file chosen</CFormFeedback>
      </CCol>

      <CCol xs={12}>
        <CButton color="primary" className="mt-3 basic-btn" type="submit">
          <CIcon icon={cilCloudUpload} /> Import
        </CButton>
      </CCol>
    </CForm>
  );
};

const Validation = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <Form />
      </CCol>
    </CRow>
  );
};
const ImportProtocol = () => {
  return (
    <>
      <div className="min-vh-60 d-flex flex-row align-items-center">
        <Validation />
      </div>
    </>
  );
};

export default ImportProtocol;
