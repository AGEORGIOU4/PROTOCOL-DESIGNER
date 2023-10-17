import React, { useState } from 'react'
import { CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react-pro';

import { Form } from './components/Form';
import Deck from './components/Deck';
import { Liquids } from './components/Liquids';
import CIcon from '@coreui/icons-react';
import { cilBeaker, cilDrop, cilList, cilSpeech } from '@coreui/icons';
import LabwareSteps from './components/Steps';
import { TitleBar } from 'src/_common/helpers';

const AddLabware = () => {
  const [activeKey, setActiveKey] = useState(1)
  const [selectedSlot, setSelectedSlot] = useState("");

  const [newLabwareSelection, setNewLabwareSelection] = useState("");


  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }

  const handleSubmit = (newData) => {
    setNewLabwareSelection(newData);
  }

  return (
    <>
      <LabwareSteps />

      <div className="wrapper flex-column ">
        <CRow>

          <CNav layout='fill' variant="underline">
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

              <CCol md={12}>
                <Deck handleSelectedSlot={handleSelectedSlot} newLabwareSelection={newLabwareSelection} />
              </CCol>

              <CCol md={12}>
                <Form selectedSlot={selectedSlot} handleSubmit={handleSubmit} />
              </CCol>

            </CTabPane>

            <CTabPane className="p-3" visible={activeKey === 2}>
              <CCol md={12}>
                <TitleBar title={"LIQUIDS"} />
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
