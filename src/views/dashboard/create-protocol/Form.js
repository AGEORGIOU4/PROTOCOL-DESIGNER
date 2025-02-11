import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow } from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_Services from 'src/_api/API_Services'


export const Form = () => {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false)
    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function fetchCategories() {
            const res_categories = await API_Services.RestApi('/categories/read', 'GET')
            if (res_categories && res_categories.debug.status === 'ok') {
                let tmp_categories = [];

                res_categories._data?.map((category, index) => {
                    tmp_categories[index] = { "label": category.name, "value": category.name }
                })
                setCategories(tmp_categories)
            }
        }
        fetchCategories();
    }, []);

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
                    <CFormInput autoComplete={'off'} type="text" id="validationCustom01" placeholder="Sample Protocol" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Category</CFormLabel>
                    <CFormSelect options={categories} required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom02">Author</CFormLabel>
                    <CFormInput autoComplete={'off'} type="text" id="validationCustom02" placeholder="Orinda Charisse" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom04">Organization</CFormLabel>
                    <CFormInput autoComplete={'off'} type="text" id="validationCustom04" placeholder="Efevre Tech Labs" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={12}>
                    <CFormLabel htmlFor="validationCustom03">Description</CFormLabel>
                    <CFormTextarea autoComplete={'off'} id="validationCustom03" required />
                    <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol xs={12}>
                    <CFormCheck
                        type="checkbox"
                        id="consentCheck"
                        checked={true}
                        label="I authorize Efevre Tech LTD to publish this protocol in the Protocol Library"
                        onChange={{}}
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