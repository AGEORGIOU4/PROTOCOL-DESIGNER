import React, { useEffect } from 'react';
import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import Select from 'react-select';
import { colourStyles } from '../Liquids/data'
import { SketchPicker } from 'react-color';
import CIcon from '@coreui/icons-react';
import { cilDrop, cilEyedropper, cilPlus, cilTrash } from '@coreui/icons';
import { TitleBar } from 'src/_common/helpers';
import { cidDrop, cisCircle } from '@coreui/icons-pro';

const colorCodes = [
  "#D0021B", "#F5A623", "#F8E71C", "#8B572A",
  "#7ED321", "#417505", "#BD10E0", "#9013FE",
  "#4A90E2", "#50E3C2", "#B8E986", "#000000"
];

const items = JSON.parse(localStorage.getItem('liquids'))
let id_iterator = Math.floor(Math.random() * 999999);

export const Liquids = () => {
  const [validated, setValidated] = useState(false)

  const [liquidOptions, setLiquidOptions] = useState(items || [])
  const [liquidName, setLiquidName] = useState()
  const [liquidColor, setLiquidColor] = useState('#9900EF')

  const [mixtureDisabled, setMixtureDisabled] = useState(false)
  const [selectedLiquids, setSelectedLiquids] = useState([])


  useEffect(() => {
    setLiquidName("Liquid " + id_iterator)
  }, [])

  const handleAddLiquid = (e) => {
    id_iterator = Math.floor(Math.random() * 999999);

    let options = liquidOptions;
    let liquid = { id: id_iterator, value: liquidName, label: liquidName, text: liquidName, color: liquidColor }

    options.push(liquid)
    setLiquidOptions(options)
    localStorage.setItem('liquids', JSON.stringify(options));

    setLiquidName("Liquid " + id_iterator)
  }

  const handleDeleteLiquid = (e) => {
    if (confirm("Do you want to delete this liquid?")) {
      let id = e.target.id;
      setLiquidOptions(current => current.filter(option => { return option.id != id }));

      let items = JSON.parse(localStorage.getItem('liquids')) || [];
      let new_arr = items.filter(option => { return option.id != id });
      localStorage.setItem('liquids', JSON.stringify(new_arr));
    }

  }

  const handleClearLiquids = () => {
    if (confirm("Are you sure you want to delete all liquids?")) {
      setLiquidOptions([]);
      localStorage.clear()
    }

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

              <CRow>

                <CCol md={10}>
                  <CFormLabel htmlFor="validationCustom02">Liquid Name</CFormLabel>
                  <CFormInput autoComplete={'off'} type="text" id="validationCustom02" placeholder="" required value={liquidName || ""} onChange={(e) => { setLiquidName(e.target.value) }} />
                  <CFormFeedback valid>Looks good!</CFormFeedback>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="validationCustom02">Liquid Color</CFormLabel>
                  <CFormInput disabled type='color' style={{ width: '100%', background: 'white' }} value={liquidColor} />
                </CCol>

              </CRow>

              <br />

              <CCol md={12} style={{ userSelect: 'none', marginBottom: '11px' }}>
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

              <CCol md={12}>
                <CFormLabel htmlFor="validationCustom04"></CFormLabel>
                <CFormInput type="text" id="validationCustom11" placeholder="Mixture name" disabled={mixtureDisabled ? false : true} />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>

              <br />

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

              <CRow>
                <CCol md={4} style={{ display: 'flex', alignItems: 'center' }}>
                  <CIcon icon={cilTrash}></CIcon> <strong> Click to delete a liquid </strong>
                </CCol>
                <CCol md={8}>
                  <CButton className='standard-btn float-end' style={{ margin: '20px 0' }} onClick={handleClearLiquids}><CIcon size='sm' icon={cilTrash} /> CLEAR LIST</CButton>
                </CCol>
              </CRow>

              <CCol md={12}>
                <div style={{ width: '100%', padding: '20px', textAlign: 'center', border: '5px dashed #f1f1f1' }}>


                  {
                    React.Children.toArray(
                      liquidOptions?.map((liquid, index) => {
                        return (
                          <>
                            <CButton id={liquid.id} key={index} style={{ background: 'white', border: '3px solid #585858', borderRadius: '50px', fontSize: 'small', fontWeight: '400', width: '18%', padding: '20px', margin: '10px 6px' }} onClick={handleDeleteLiquid}>
                              <CIcon icon={cisCircle} style={{ color: liquid.color }} /> {liquid.value}
                            </CButton>
                          </>

                        )
                      })
                    )
                  }
                </div >
              </CCol>

            </CCol>

            <CCol md={4}>

              <CCol md={12}>
                <CFormLabel htmlFor="validationCustom04">Choose Color</CFormLabel>
                <SketchPicker

                  color={liquidColor}
                  width='96%'
                  disableAlpha
                  presetColors={colorCodes}
                  onChangeComplete={(color) => setLiquidColor(color.hex)}
                />
                <br />
                <CButton className='standard-btn' style={{ width: '100%' }} onClick={handleAddLiquid}><CIcon size='sm' icon={cilPlus} /> ADD LIQUID</CButton>
              </CCol>


            </CCol>

          </CForm>
        </CCol>

      </CRow>

    </>
  )
}