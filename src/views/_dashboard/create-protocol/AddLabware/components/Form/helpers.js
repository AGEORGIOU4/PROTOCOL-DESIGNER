import React, { useEffect, useState } from 'react';
import { CCol, CFormFeedback, CFormInput, CFormLabel, CRow } from '@coreui/react-pro'
import { colourStyles } from '../Liquids/data';
import CreatableSelect from 'react-select/creatable'
import { GetRandomColor } from 'src/_common/helpers';

export const disableInputFieldsOnSelect = (value, action) => {
  if (value == '' && action == '') {
    document.getElementById("validationCustom01").disabled = true;
    document.getElementById("validationCustom02").disabled = true;
    document.getElementById("validationCustom03").disabled = true;
    document.getElementById("validationCustom04").disabled = true;
    document.getElementById("validationCustom05").disabled = true;
  } else if (value == '') { // When 'select' is selected open fields again
    document.getElementById("validationCustom01").disabled = false;
    document.getElementById("validationCustom02").disabled = false;
    document.getElementById("validationCustom03").disabled = false;
    document.getElementById("validationCustom04").disabled = false;
    document.getElementById("validationCustom05").disabled = false;
  } else {
    document.getElementById("validationCustom01").disabled = false;
    switch (action) {
      case 'tube_rack':
        document.getElementById("validationCustom02").disabled = false;
        document.getElementById("validationCustom03").disabled = true;
        document.getElementById("validationCustom04").disabled = true;
        document.getElementById("validationCustom05").disabled = true;
        break;
      case 'well_plate':
        document.getElementById("validationCustom02").disabled = true;
        document.getElementById("validationCustom03").disabled = false;
        document.getElementById("validationCustom04").disabled = true;
        document.getElementById("validationCustom05").disabled = true;
        break;
      case 'reservoir':
        document.getElementById("validationCustom02").disabled = true;
        document.getElementById("validationCustom03").disabled = true;
        document.getElementById("validationCustom04").disabled = false;
        document.getElementById("validationCustom05").disabled = true;
        break;
      case 'aluminium_block':
        document.getElementById("validationCustom02").disabled = true;
        document.getElementById("validationCustom03").disabled = true;
        document.getElementById("validationCustom04").disabled = true;
        document.getElementById("validationCustom05").disabled = false;
        break;
      default:
        document.getElementById("validationCustom02").disabled = false;
        document.getElementById("validationCustom03").disabled = false;
        document.getElementById("validationCustom04").disabled = false;
        document.getElementById("validationCustom05").disabled = false;
        break;
    }
  }
}

export const AddLiquids = ({ selectedLiquid, handleChangeSelectedLiquid, liquidVolume, handleChangeLiquidVolume }) => {
  const [selectedColor, setSelectedColor] = useState(GetRandomColor());
  const [liquidOptions, setLiquidOptions] = useState([])

  let items = JSON.parse(localStorage.getItem('liquids'))

  useEffect(() => {

    if (items) {
      setLiquidOptions(items);
    }
  }, []);

  const handleCreateLiquid = (e) => {
    let initialLiquids = JSON.parse(localStorage.getItem('liquids')) || [];
    let value = e;
    let id_iterator = Math.floor(Math.random() * 999999);
    let liquid = { id: id_iterator, value: value, label: value, text: value, color: selectedColor }

    initialLiquids.push(liquid)
    localStorage.setItem('liquids', JSON.stringify(initialLiquids));

    setLiquidOptions(initialLiquids);
    setSelectedColor(GetRandomColor())
  }


  return (
    <>
      <CRow>

        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom02">Liquid Color</CFormLabel>
          <CFormInput value={selectedColor} onChange={(e) => { setSelectedColor(e.target.value) }} type='color' style={{ width: '100%', background: 'white' }} />
        </CCol>

        <CCol md={8}>
          <CFormLabel htmlFor="validationCustom04">Select liquid or create new by typing and press ENTER</CFormLabel>
          <CreatableSelect
            onChange={(e) => {
              let item = e;
              setSelectedColor(item.color)
              handleChangeSelectedLiquid(e, selectedColor)
            }
            }
            onCreateOption={(e) => { handleCreateLiquid(e) }}
            styles={colourStyles}
            options={liquidOptions}
            className="form-multi-select-selection-tags"
          />

        </CCol>


        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
          <CFormInput autoComplete={'off'} type="number" id="validationCustom03" placeholder="" required value={liquidVolume} onChange={handleChangeLiquidVolume} />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>


      </CRow>

      <br />
    </>
  )
}
