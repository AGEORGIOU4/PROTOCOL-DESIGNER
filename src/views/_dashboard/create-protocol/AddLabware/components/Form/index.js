import React, { useEffect } from 'react';
import { CButton, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect } from '@coreui/react-pro'
import { useState } from 'react'
import CIcon from '@coreui/icons-react';
import { cilPlus, cilSave } from '@coreui/icons';
import { aluminium_blocks, reservoirs, tube_racks, well_plates } from '../Labware/data';

export const Form = ({ selectedSlot, handleSubmit }) => {
  const [validated, setValidated] = useState(false)


  const [slotName, setSlotName] = useState('')
  const [tubeRack, setTubeRack] = useState('')
  const [wellPlate, setWellPlate] = useState('')
  const [reservoir, setReservoir] = useState('')
  const [aluminiumBlock, setAluminiumBlock] = useState('')


  useEffect(() => {
    console.log(selectedSlot)
    setSlotName(selectedSlot.name);
    setTubeRack(selectedSlot.tube_rack);
    setWellPlate(selectedSlot.well_plate);
    setReservoir(selectedSlot.reservoir);
    setAluminiumBlock(selectedSlot.aluminium_block);

  }, [selectedSlot])

  const handleChangeTubeRack = (e) => {
    setTubeRack(e.target.value);

    // if (e.target.value != 0) {
    //   document.getElementById("validationCustom03").disabled = true;
    //   document.getElementById("validationCustom04").disabled = true;
    //   document.getElementById("validationCustom05").disabled = true;
    // } else {
    //   document.getElementById("validationCustom03").disabled = false;
    //   document.getElementById("validationCustom04").disabled = false;
    //   document.getElementById("validationCustom05").disabled = false;
    // }
  }

  const handleChangeWellPlate = (e) => {
    setWellPlate(e.target.value);

  }

  const handleChangeReservoir = (e) => {
    setReservoir(e.target.value);
  }

  const handleChangeAluminiumBlock = (e) => {
    setAluminiumBlock(e.target.value);
  }

  const handleSubmitForm = () => {
    let item = {
      name: slotName,
      tube_rack: tubeRack,
      well_plate: wellPlate,
      reservoir: reservoir,
      aluminium_block: aluminiumBlock

    }
    handleSubmit(item);
  }


  return (
    <>

      <CCol md={12}>
        <CForm >

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom01">Slot Name</CFormLabel>
            <CFormInput type='text' id="validationCustom01" value={slotName} onChange={(e) => setSlotName(e.target.value)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom02">Tube Rack</CFormLabel>
            <CFormSelect options={tube_racks} id="validationCustom02" value={tubeRack} onChange={(e) => handleChangeTubeRack(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom03">Well Plate</CFormLabel>
            <CFormSelect options={well_plates} id="validationCustom03" value={wellPlate} onChange={(e) => handleChangeWellPlate(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom04">Reservoir</CFormLabel>
            <CFormSelect options={reservoirs} id="validationCustom04" value={reservoir} onChange={(e) => handleChangeReservoir(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">Aluminium Block</CFormLabel>
            <CFormSelect options={aluminium_blocks} id="validationCustom05" value={aluminiumBlock} onChange={(e) => handleChangeAluminiumBlock(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <br />

        </CForm>

        <CCol md={12} style={{ textAlign: 'end' }}>
          <CButton className='standard-btn'><CIcon size='sm' icon={cilPlus} /> ADD LABWARE</CButton> <CButton className='standard-btn' onClick={handleSubmitForm}><CIcon size='sm' icon={cilSave} /> SAVE</CButton>
        </CCol>


      </CCol>




      <br />
    </>
  )
}