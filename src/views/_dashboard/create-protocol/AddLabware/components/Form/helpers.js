import React from 'react';
import { CCol, CFormFeedback, CFormInput, CFormLabel, CRow } from '@coreui/react-pro'
import Select from 'react-select';
import { colourStyles } from '../Liquids/data';

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
  return (
    <>
      <CRow>

        <CCol md={8}>
          <CFormLabel htmlFor="validationCustom04">Select Liquid</CFormLabel>
          <Select
            isMulti={false}
            closeMenuOnSelect={true}
            options={JSON.parse(localStorage.getItem('liquids')) || []}
            styles={colourStyles}
            isSearchable={false}
            onChange={handleChangeSelectedLiquid}
          />
        </CCol>

        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
          <CFormInput autoComplete={'off'} type="number" id="validationCustom03" placeholder="" required value={liquidVolume} onChange={handleChangeLiquidVolume} />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom02">Liquid Color</CFormLabel>
          <CFormInput disabled value={selectedLiquid.color || '#EFEFEF'} type='color' style={{ width: '100%', background: 'white' }} />
        </CCol>

      </CRow>

      <br />
    </>
  )
}