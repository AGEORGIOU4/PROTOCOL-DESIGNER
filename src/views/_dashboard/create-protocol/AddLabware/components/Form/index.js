import React, { useEffect } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react-pro'
import { useState } from 'react'

const options = [
  {
    value: 0,
    text: '',
    color: '',
    label: ''
    // selected: true,
    // disabled: true,
  },
  {
    value: 1,
    text: 'Water',
    color: 'red',
    label: 'Water'
    // selected: true,
    // disabled: true,
  },
  {
    value: 2,
    text: 'Oil',
    color: 'purple',
    label: 'Oil'
  },
  {
    value: 3,
    text: 'Cryogenic liquid',
    color: 'blue',
    label: 'Cryogenic liquid'
  },
  {
    value: 4,
    text: 'Petrol',
    color: 'grey',
    label: 'Petrol'
  },
  {
    value: 5,
    text: 'Kean',
    color: 'orange',
    label: 'Kean'
  },
  {
    value: 6,
    text: 'Lux',
    color: 'green',
    label: 'Lux'
  },

]


export const Form = (selectedSlot) => {
  const [validated, setValidated] = useState(false)

  const [slotName, setSlotName] = useState('Slot ' + selectedSlot.selectedSlot)
  const [tubeRack, setTubeRack] = useState('')
  const [wellPlate, setWellPlate] = useState('')
  const [reservoir, setReservoir] = useState('')
  const [aluminiumBlock, setAluminiumBlock] = useState('')

  const [liquidOptions, setLiquidOptions] = useState([])
  const [selectedLiquids, setSelectedLiquids] = useState([])
  const [liquidName, setLiquidName] = useState('')
  const [liquidVolume, setLiquidVolume] = useState('0')
  const [liquidColor, setLiquidColor] = useState('#9900EF')
  const [mixtureDisabled, setMixtureDisabled] = useState(false)

  const handleSubmit = (event) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
  }

  useEffect(() => {
    setSlotName('Slot ' + selectedSlot.selectedSlot)
  }, [selectedSlot])

  const handleChangeWellPlate = (e) => {
    setWellPlate(e.target.value);

    if (e.target.value != 0) {
      document.getElementById("validationCustom02").disabled = true;
      document.getElementById("validationCustom03").disabled = true;
      document.getElementById("validationCustom05").disabled = true;
      document.getElementById("validationCustom06").disabled = true;
    } else {
      document.getElementById("validationCustom02").disabled = false;
      document.getElementById("validationCustom03").disabled = false;
      document.getElementById("validationCustom05").disabled = false;
      document.getElementById("validationCustom06").disabled = false;
    }
  }

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom01">Slot Name</CFormLabel>
              <CFormInput type='text' id="validationCustom01" value={slotName} onChange={(e) => setSlotName(e.target.value)} required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom02">Tube Rack</CFormLabel>
              <CFormSelect options={options} id="validationCustom02" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom03">Well Plate</CFormLabel>
              <CFormSelect options={options} id="validationCustom03" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom04">Reservoir</CFormLabel>
              <CFormSelect options={options} id="validationCustom04" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom05">Aluminium Block</CFormLabel>
              <CFormSelect options={options} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <br />

            <CCol md={12} style={{ textAlign: 'end' }}>
              <CButton className='add-labware-btn'><small>+ ADD LABWARE</small></CButton>
            </CCol>
          </CForm>

        </CCol>

      </CRow>


      <br />
    </>
  )
}