import React, { useState } from 'react'
import { CCol, CRow } from '@coreui/react-pro';
import Deck from './components/Deck';
import { AddLabwareForm } from './components/AddLabwareForm';

const AddLabware = () => {
  const [selectedSlot, setSelectedSlot] = useState(1);

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }
  return (
    <>
      <CRow>
        <CCol md={6} className='flex-box'>
          <Deck handleSelectedSlot={handleSelectedSlot} />
        </CCol>
        <CCol md={6}>
          <AddLabwareForm selectedSlot={selectedSlot} />
        </CCol>
      </CRow>
    </>
  )
}

export default AddLabware
