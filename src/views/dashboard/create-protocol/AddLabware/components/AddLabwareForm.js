import React from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CMultiSelect, CRow } from '@coreui/react-pro'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useState } from 'react'
import Select from 'react-select';
import { colourStyles } from './Liquids/data'
import { TwitterPicker } from 'react-color';

const options = [
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


export const AddLabwareForm = (selectedSlot) => {
  const [validated, setValidated] = useState(false)

  const [name, setName] = useState('')
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

  const handleAddLiquid = (e) => {
    // { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },

    let liquid = { value: liquidName, label: liquidName, color: liquidColor }
    let options = liquidOptions;
    options.push(liquid)
    setLiquidOptions(options)
    setSelectedLiquids(options[0])
    setLiquidName('')
  }


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
      <h2 style={{ paddingTop: '0px' }}>Labware for {selectedSlot.selectedSlot}</h2>


      <hr />

      <CRow>
        <CCol md={3}>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom01">Protocol Name</CFormLabel>
              <CFormInput type="text" id="validationCustom01" placeholder="" required />
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
              <CFormLabel htmlFor="validationCustom04">Well Plate</CFormLabel>
              <CFormSelect options={options} id="validationCustom04" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom05">Reservoir</CFormLabel>
              <CFormSelect options={options} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom06">Aluminium Block</CFormLabel>
              <CFormSelect options={options} id="validationCustom06" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

          </CForm>

        </CCol>


        {/* LIQUIDS */}
        <CCol md={9}>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>

            <CCol md={8}>
              <CFormLabel htmlFor="validationCustom02">Liquid Name</CFormLabel>
              <CFormInput autoComplete={'off'} type="text" id="validationCustom02" placeholder="" required value={liquidName} onChange={(e) => { setLiquidName(e.target.value) }} />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
              <CFormInput autoComplete={'off'} type="number" id="validationCustom03" placeholder="" required value={liquidVolume} onChange={(e) => { setLiquidVolume(e.target.value) }} />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom04">Liquid Color</CFormLabel>
              <TwitterPicker
                className='color-picker'
                color={liquidColor}
                onChangeComplete={(color) => setLiquidColor(color.hex)}
                triangle={'hide'}
              />
            </CCol>

            <CCol md={12}>
              <CButton className='add-labware-btn' onClick={handleAddLiquid}><small>+ ADD LIQUID</small></CButton>
            </CCol>

            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom04">Select Liquids</CFormLabel>
              <Select
                closeMenuOnSelect={false}
                defaultValue={selectedLiquids}
                isMulti
                options={liquidOptions}
                styles={colourStyles}
                className='custom-select'

              />
            </CCol>

            <br />
            <br />
            <br />
            <br />
            <br />

            <CCol md={4} style={{ userSelect: 'none' }}>
              <CFormCheck
                type="checkbox"
                id="mixtureCheckbox"
                label="Enable Mixture"
                required
                checked={mixtureDisabled}
                onChange={(e) => { setMixtureDisabled(e.target.checked) }}
              />
            </CCol>

            <CCol md={8}>
              <CFormInput type="text" id="validationCustom11" placeholder="Mixture name" disabled={mixtureDisabled ? false : true} />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>


            <CCol md={12}>
              <CFormLabel htmlFor="validationCustom04">Select Liquids</CFormLabel>
              <Select
                isDisabled={mixtureDisabled ? false : true}
                closeMenuOnSelect={false}
                defaultValue={selectedLiquids}
                isMulti
                options={liquidOptions}
                styles={colourStyles}
              />
            </CCol>


          </CForm>
        </CCol>




      </CRow>

      <CCol md={12}>
        <CButton color="primary" className='mt-3 form-btn' style={{ padding: '20px !important', borderRadius: '0 !important' }} type="submit">
          <CIcon icon={cilPlus} /> Create
        </CButton>
      </CCol>
    </>
  )
}