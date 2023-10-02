import React, { useState } from 'react'
import { CCol, CRow } from '@coreui/react-pro';
import Deck from './components/Deck';
import { AddLabwareForm } from './components/AddLabwareForm';

const AddLabware = () => {
  const [selectedSlot, setSelectedSlot] = useState(0);

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }
  return (
    <>
      <div className='card-steps'>

        <CRow>
          <CCol md={9}>
            <AddLabwareForm selectedSlot={selectedSlot} />
          </CCol>
          <CCol md={3} className='flex-box'>
            <Deck handleSelectedSlot={handleSelectedSlot} />
          </CCol>

        </CRow>

      </div>
    </>
  )
}

export default AddLabware
