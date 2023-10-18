import React, { useEffect } from 'react';
import { CButton, CCol, CForm, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CLoadingButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react-pro'
import { useState } from 'react'
import CIcon from '@coreui/icons-react';
import { cilReload, cilSave } from '@coreui/icons';
import { aluminium_blocks, reservoirs, tube_racks, well_plates } from '../Labware/data';
import { cidEyedropper } from '@coreui/icons-pro';
import WellPlateSelection from '../Labware/WellPlate/WellPlate';
import AddLabwareModal from '../Modal';
import TubeRackSelection from '../Labware/TubeRack/TubeRack';
import ReservoirSelection from '../Labware/Reservoir/Reservoir';
import AluminiumBlockSelection from '../Labware/AluminiumBlock/AluminiumBlock';

const disableInputFieldsOnSelect = (value, action) => {
  if (value == 'N/A') {
    document.getElementById("validationCustom02").disabled = false;
    document.getElementById("validationCustom03").disabled = false;
    document.getElementById("validationCustom04").disabled = false;
    document.getElementById("validationCustom05").disabled = false;
  } else {
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

export const Form = ({ selectedSlot, handleSubmitForm }) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [visible, setVisible] = useState(false);

  const [name, setName] = useState('')
  const [tubeRack, setTubeRack] = useState('')
  const [wellPlate, setWellPlate] = useState('')
  const [reservoir, setReservoir] = useState('')
  const [aluminiumBlock, setAluminiumBlock] = useState('')

  const [selectedLabwareName, setSelectedLabwareName] = useState('');

  useEffect(() => {
    setName(selectedSlot.name);
    setTubeRack(selectedSlot.tube_rack);
    setWellPlate(selectedSlot.well_plate);
    setReservoir(selectedSlot.reservoir);
    setAluminiumBlock(selectedSlot.aluminium_block);


    let value = '';
    let action = '';

    if (selectedSlot.tube_rack) {
      value = selectedSlot.tube_rack;
      action = 'tube_rack';
    }
    if (selectedSlot.well_plate) {
      value = selectedSlot.well_plate;
      action = 'well_plate';
    }
    if (selectedSlot.reservoir) {
      value = selectedSlot.reservoir;
      action = 'reservoir';
    }
    if (selectedSlot.aluminium_block) {
      value = selectedSlot.aluminium_block;
      action = 'aluminium_block';
    }

    disableInputFieldsOnSelect(value, action);

  }, [selectedSlot])

  const handleChangeName = (e) => {
    let text = e.target.value;
    setName(text);


    let item = {
      id: selectedSlot.id,
      name: text,
      tube_rack: selectedSlot.tube_rack,
      well_plate: selectedSlot.well_plate,
      reservoir: selectedSlot.reservoir,
      aluminium_block: selectedSlot.aluminium_block
    }

    if (text.length > 0) {
      handleSubmitForm(item);
    }

  }

  const handleChangeTubeRack = (e) => {
    setTubeRack(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "tube_rack");

    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: e.target.value,
      well_plate: "",
      reservoir: "",
      aluminium_block: ""
    }

    handleSubmitForm(item);
  }

  const handleChangeWellPlate = (e) => {
    setWellPlate(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "well_plate");

    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: "",
      well_plate: e.target.value,
      reservoir: "",
      aluminium_block: ""
    }

    handleSubmitForm(item);
  }

  const handleChangeReservoir = (e) => {
    setReservoir(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "reservoir");

    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: "",
      well_plate: "",
      reservoir: e.target.value,
      aluminium_block: ""
    }

    handleSubmitForm(item);
  }

  const handleChangeAluminiumBlock = (e) => {
    setAluminiumBlock(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "aluminium_block");

    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: "",
      well_plate: "",
      reservoir: "",
      aluminium_block: e.target.value
    }

    handleSubmitForm(item);
  }

  const handleReset = () => {
    disableInputFieldsOnSelect('default');

    setLoadingReset(true);
    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: '',
      well_plate: '',
      reservoir: '',
      aluminium_block: ''
    }

    setTubeRack('');
    setWellPlate('');
    setReservoir('');
    setAluminiumBlock('');

    setSelectedLabwareName('');

    handleSubmitForm(item);
    setLoadingReset(false)

  }

  const handleClose = () => {
    setVisible(false)
  }

  const handleSubmit = () => {
    setLoadingSave(true);

    let item = {
      id: selectedSlot.id,
      name: name,
      tube_rack: tubeRack,
      well_plate: wellPlate,
      reservoir: reservoir,
      aluminium_block: aluminiumBlock
    }

    setTimeout(() => {
      handleSubmitForm(item);
      setLoadingSave(false)
    }, 800)

  }

  const getSelectedLabware = () => {
    if (tubeRack) {
      setSelectedLabwareName(tubeRack);
    }
    if (wellPlate) {
      setSelectedLabwareName(wellPlate);
    }
    if (reservoir) {
      setSelectedLabwareName(reservoir);
    }
    if (aluminiumBlock) {
      setSelectedLabwareName(aluminiumBlock);
    }
  }

  const handleAddLiquids = () => {
    getSelectedLabware();
    setVisible(true)
  }

  return (
    <>
      <CCol md={12}>

        <CForm >

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom01">Slot Name</CFormLabel>
            <CFormInput type='text' id="validationCustom01" value={name || ''} onChange={handleChangeName} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom02">Tube Rack</CFormLabel>
            <CFormSelect options={tube_racks} id="validationCustom02" value={tubeRack || ''} onChange={(e) => handleChangeTubeRack(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom03">Well Plate</CFormLabel>
            <CFormSelect options={well_plates} id="validationCustom03" value={wellPlate || ''} onChange={(e) => handleChangeWellPlate(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom04">Reservoir</CFormLabel>
            <CFormSelect options={reservoirs} id="validationCustom04" value={reservoir || ''} onChange={(e) => handleChangeReservoir(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <CCol md={12}>
            <CFormLabel htmlFor="validationCustom05">Aluminium Block</CFormLabel>
            <CFormSelect options={aluminium_blocks} id="validationCustom05" value={aluminiumBlock || ''} onChange={(e) => handleChangeAluminiumBlock(e)} />
            <CFormFeedback valid>Looks good!</CFormFeedback>
          </CCol>

          <br />


          <CRow>
            <CCol md={4} style={{ textAlign: 'start' }}>
              <CLoadingButton loading={loadingReset} className='standard-btn' onClick={handleReset}><CIcon size='sm' icon={cilReload} /> RESET</CLoadingButton>
            </CCol>

            <CCol md={8} style={{ textAlign: 'end' }}>

              <CButton className='standard-btn' style={{ marginRight: '10px' }} onClick={handleAddLiquids}><CIcon size='sm' icon={cidEyedropper} /> ADD LIQUIDS</CButton>
              <CLoadingButton loading={loadingSave} className='standard-btn' onClick={handleSubmit}><CIcon size='sm' icon={cilSave} /> SAVE</CLoadingButton>
            </CCol>

          </CRow>
        </CForm>

      </CCol>

      <br />

      <AddLabwareModal visible={visible} setVisible={setVisible} handleClose={handleClose} title={name}>

        {tubeRack && React.Children.toArray(
          <TubeRackSelection name={selectedLabwareName} />
        )}

        {wellPlate && React.Children.toArray(
          <WellPlateSelection name={selectedLabwareName} />
        )}

        {reservoir && React.Children.toArray(
          <ReservoirSelection name={selectedLabwareName} />
        )}

        {aluminiumBlock && React.Children.toArray(
          <AluminiumBlockSelection name={selectedLabwareName} />
        )}



      </AddLabwareModal>
    </>
  )
}