import React, { useEffect, useRef, useState } from 'react';
import { CCol, CFormFeedback, CFormInput, CFormLabel, CRow } from '@coreui/react-pro'
import { colourStyles } from '../4.Liquids/data';
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


const createOption = (id, value, color) => ({
  id: id,
  value: value,
  label: value,
  text: value,
  color: color
});


export const AddLiquids = ({ selectedLiquid, handleChangeSelectedLiquid, liquidVolume, handleChangeLiquidVolume }) => {
  const [selectedColor, setSelectedColor] = useState(GetRandomColor());
  let items = JSON.parse(localStorage.getItem('liquids'))

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(items);
  const [value, setValue] = useState(null);
  const volumeRef = useRef(null);

  const handleCreate = (e) => {
    setIsLoading(true);
    let initialLiquids = JSON.parse(localStorage.getItem('liquids')) || [];
    let id = Math.floor(Math.random() * 999999);
    let liquid = { id: id, value: e, label: e, text: e, color: selectedColor }
    initialLiquids.push(liquid)
    localStorage.setItem('liquids', JSON.stringify(initialLiquids));

    setTimeout(() => {
      const newOption = createOption(id, e, selectedColor);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
      setSelectedColor(newOption.color);
      handleChangeSelectedLiquid(newOption, selectedColor);
      volumeRef.current.focus();
    }, 500);

  }

  const handleSelect = (e) => {
    setValue(e)
    setSelectedColor(e.color);
    handleChangeSelectedLiquid(e, selectedColor);
    volumeRef.current.focus();
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
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            onCreateOption={handleCreate}
            onChange={handleSelect}
            options={options}
            value={value}
            className="form-multi-select-selection-tags"
            styles={colourStyles}
          />

        </CCol>

        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
          <CFormInput ref={volumeRef} autoComplete={'off'} type="number" id="validationCustom03" placeholder="" required value={liquidVolume} onChange={handleChangeLiquidVolume} />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

      </CRow>

      <br />
    </>
  )
}
