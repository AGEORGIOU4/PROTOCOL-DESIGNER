import React, { useState } from 'react'
import { CCard, CCardBody, CCol, CListGroupItem, CRow } from '@coreui/react-pro';
import Deck from './components/Deck';
import { AddLabwareForm } from './components/AddLabwareForm';
import LabwareSteps from '../LabwareSteps';

const AddLabware = () => {
  const [selectedSlot, setSelectedSlot] = useState(1);

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }
  return (
    <>
      <CRow >

        <CCol md={12}>
          <CListGroupItem style={{ padding: '20px' }} className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
            <strong>DECK</strong>
          </CListGroupItem>
          <Deck handleSelectedSlot={handleSelectedSlot} />
        </CCol>

        <CCol md={12}>
          <CListGroupItem style={{ padding: '20px' }} className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
            <strong>LABWARE</strong>
          </CListGroupItem>
          <AddLabwareForm selectedSlot={selectedSlot} />
        </CCol>

        <CCol md={12} >
          <CListGroupItem style={{ padding: '20px' }} className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
            <strong>TIMELINE</strong>
          </CListGroupItem>
          <LabwareSteps />
        </CCol>

      </CRow>

    </>
  )
}

export default AddLabware
