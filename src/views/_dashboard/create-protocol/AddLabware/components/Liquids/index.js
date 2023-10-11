import React from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import Select from 'react-select';
import { colourStyles } from '../Liquids/data'
import { TwitterPicker } from 'react-color';
import CIcon from '@coreui/icons-react';
import { cilPlus } from '@coreui/icons';

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


export const Liquids = (selectedSlot) => {
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

  const handleAddLiquid = (e) => {


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
      <CRow>
        {/* LIQUIDS */}
        <CCol md={12}>

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
              <CButton className='standard-btn' onClick={handleAddLiquid}><CIcon size='sm' icon={cilPlus} /> ADD LIQUID</CButton>
            </CCol>

            <br />
            <br />


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

            <CCol md={4} style={{ userSelect: 'none', marginBottom: '11px' }}>
              <CFormLabel htmlFor="validationCustom04" >Mixtures</CFormLabel>
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
              <CFormLabel htmlFor="validationCustom04"></CFormLabel>
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


      <br />
    </>
  )
}