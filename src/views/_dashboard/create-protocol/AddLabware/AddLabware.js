import React, { useState } from 'react'
import { CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react-pro';

import { Form } from './components/Form';
import Deck from './components/Deck';
import { Liquids } from './components/Liquids';
import CIcon from '@coreui/icons-react';
import { cilBeaker, cilDrop } from '@coreui/icons';
import LabwareSteps from './components/Steps';
import { TitleBar } from 'src/_common/helpers';

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

  console.log(JSON.parse(localStorage.getItem('slots')));

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
