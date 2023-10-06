import React, { useState } from 'react'
import { CCol, CNav, CNavItem, CNavLink, CRow, CTabContent, CTabPane } from '@coreui/react-pro';

import { Form } from './components/Form';
import Deck from './components/Deck';
import { Title } from './components/helpers';
import { Liquids } from './components/Liquids';
import CIcon from '@coreui/icons-react';
import { cilBeaker, cilDrop, cilList, cilSpeech } from '@coreui/icons';

const AddLabware = () => {
  const [selectedSlot, setSelectedSlot] = useState(1);
  const [activeKey, setActiveKey] = useState(1)

  const handleSelectedSlot = (selectedSlot) => {
    setSelectedSlot(selectedSlot);
  }

  return (
    <>
      <CRow >

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
              <Deck handleSelectedSlot={handleSelectedSlot} />
            </CCol>

            <CCol md={12}>
              <Form selectedSlot={selectedSlot} />
            </CCol>

          </CTabPane>

          <CTabPane className="p-3" visible={activeKey === 2}>
            <CCol md={12}>
              <Title title={"LIQUIDS"} />
              <Liquids selectedSlot={selectedSlot} />
            </CCol>

          </CTabPane>
        </CTabContent>




      </CRow>
    </>
  )
}

export default AddLabware
