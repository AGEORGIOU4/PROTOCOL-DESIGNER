import React, { useEffect, useState } from 'react'
import { CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react-pro';

import { Form } from './2.1.components/3.Form';
import Deck from './2.1.components/2.Deck';
import { Liquids } from './2.1.components/4.Liquids';
import CIcon from '@coreui/icons-react';
import { cilBeaker, cilDrop } from '@coreui/icons';
import LabwareSteps from './2.1.components/1.Steps';

const AddLabware = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState("");

  const [newLabwareSelection, setNewLabwareSelection] = useState("");

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }

  const handleSubmitForm = (newData) => {
    setNewLabwareSelection(newData);

  }

  useEffect(() => {
    let items = []
    try {
      items = JSON.parse(localStorage.getItem('slots')); // Check memory
    } catch (e) {
      console.log(e)
    }
    console.log(items)
  }, [])

  return (
    <>
      <LabwareSteps active={(newLabwareSelection.tube_rack || newLabwareSelection.well_plate || newLabwareSelection.aluminium_block || newLabwareSelection.reservoir) ? true : false} />

      <div className="wrapper flex-column ">
        <CRow>

          <CNav layout='justified' variant="underline">

            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 1}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveKey(1)
                }}
              >
                <CIcon icon={cilBeaker} /> Labware
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink
                href="#"
                active={activeKey === 2}
                onClick={(e) => {
                  e.preventDefault()
                  setActiveKey(2)
                }}
              >
                <CIcon icon={cilDrop} /> Liquids
              </CNavLink>
            </CNavItem>

          </CNav>

          <CTabContent>
            <CTabPane className="p-3" visible={activeKey === 1}>

              <CRow>
                <CCol md={6}>
                  <Deck handleSelectedSlot={handleSelectedSlot} newLabwareSelection={newLabwareSelection} />
                </CCol>

                <CCol md={6}>
                  <Form selectedSlot={selectedSlot} handleSubmitForm={handleSubmitForm} />
                </CCol>
              </CRow>

            </CTabPane>

            <CTabPane className="p-3" visible={activeKey === 2}>
              <CCol md={12}>
                <Liquids />
              </CCol>

            </CTabPane>
          </CTabContent>

        </CRow>
      </div>
    </>
  )
}

export default AddLabware
