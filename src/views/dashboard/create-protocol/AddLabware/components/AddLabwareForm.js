import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CMultiSelect, CRow } from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import Colors from 'src/views/theme/colors/Colors'

const colors = [
  { label: 'Red', value: 'red', text: 'Red', color: 'Red' },
  { label: 'Blue', value: 'blue', text: 'Blue', color: 'Blue' },
  { label: 'Green', value: 'green', text: 'Green', color: 'Green' },
  { label: 'Yellow', value: 'yellow', text: 'Yellow', color: 'Yellow' },
  { label: 'Purple', value: 'purple', text: 'Purple', color: 'Purple' },
  { label: 'Orange', value: 'orange', text: 'Orange', color: 'Orange' },
  { label: 'Black', value: 'black', text: 'Black', color: 'Black' },
  { label: 'White', value: 'white', text: 'White', color: 'White' },
]

const options = [
  {
    value: 1,
    text: 'Water',
    color: 'red'
    // selected: true,
    // disabled: true,
  },
  {
    value: 2,
    text: 'Oil',
    color: 'purple'
  },
  {
    value: 3,
    text: 'Cryogenic liquid',
    color: 'blue'
  },
  {
    value: 4,
    text: 'Petrol',
    color: 'grey'
  },
  {
    value: 5,
    text: 'Kean',
    color: 'orange'
  },
  {
    value: 6,
    text: 'Lux',
    color: 'green'
  },

]


export const AddLabwareForm = (selectedSlot) => {
  const [validated, setValidated] = useState(false)
  const [mixtureDisabled, setMixtureDisabled] = useState(false)

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
      <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

        <CCol md={12}>
          <h2>Slot {selectedSlot.selectedSlot} Labware</h2>
        </CCol>
        <CCol md={12}>
          <CFormLabel htmlFor="validationCustom01">Labware Name</CFormLabel>
          <CFormInput type="text" id="validationCustom01" placeholder="" required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>


        <CCol md={6}>
          <CFormLabel htmlFor="validationCustom02">Liquid Name</CFormLabel>
          <CFormInput type="text" id="validationCustom02" placeholder="" required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

        <CCol md={3}>
          <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
          <CFormInput type="number" id="validationCustom03" placeholder="" required />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

        <CCol md={3}>
          <CFormLabel htmlFor="validationCustom04">Color</CFormLabel>
          <CMultiSelect multiple={false} id="validationCustom04" placeholder="" required options={colors}
            optionsTemplate={
              (option) => (
                <div className="flex dot-div">
                  <span className="dot" style={{ backgroundColor: option.color }}></span> {option.text}
                </div>
              )
            } />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

        <hr />
        <CCol md={12} style={{ userSelect: 'none' }}>
          <CFormCheck

            type="checkbox"
            id="mixtureCheckbox"
            label="Enable Mixture"
            required
            checked={mixtureDisabled}
            onChange={(e) => { setMixtureDisabled(e.target.checked) }}
          />
        </CCol>

        <CCol md={12}>
          <CMultiSelect
            placeholder='Select multiple liquids for mixture'
            // allowCreateOptions
            disabled={mixtureDisabled ? false : true}
            clearSearchOnSelect id="validationCustom10" options={options}
            optionsTemplate={
              (option) => (
                <div className="flex dot-div">
                  <span className="dot" style={{ backgroundColor: option.color }}></span> {option.text}
                </div>
              )
            }
          ></CMultiSelect>
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

        <CCol md={12}>
          <CFormLabel htmlFor="validationCustom11">Mixture Title</CFormLabel>
          <CFormInput type="text" id="validationCustom11" placeholder="My Mixture" disabled={mixtureDisabled ? false : true} />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>


        <CCol xs={12}>
          <CButton color="primary" className='mt-3 basic-btn' type="submit">
            <CIcon icon={cilPlus} /> Create
          </CButton>
        </CCol>
      </CForm>
    </>
  )
}