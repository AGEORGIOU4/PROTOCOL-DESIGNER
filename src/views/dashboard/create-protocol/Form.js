import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormTextarea, CRow } from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const Form = () => {
    const [validated, setValidated] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            navigate('/add-labware')
        }

        setValidated(true)

    }

    return (

        <CCol xs={6}>
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
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom04">Organization</CFormLabel>
                    <CFormInput type="text" id="validationCustom04" placeholder="Efevre" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom03">Description</CFormLabel>
                    <CFormTextarea id="validationCustom03" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                    <CFormCheck
                        type="checkbox"
                        id="invalidCheck"
                        label="I authorize Efevre Tech LTD to publish this protocol in the Protocol Library"
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
        </CCol>

    )
}