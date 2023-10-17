import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload, cilList, cilLockLocked, cilPlus, cilUser } from '@coreui/icons'

const Dashboard = () => {
  return (
    <>
      <div className="min-vh-40 d-flex flex-row align-items-center ">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CCardGroup>
                <CCard className="p-4 bg-light" >
                  <CCardBody>
                    <CForm>
                      <h1>Create</h1>
                      <p>
                        Create a new protocol. Use the graphical interface to define your protocol's steps.
                      </p>
                      <Link to="/create-protocol">
                        <CButton color="primary" className="mt-3 basic-btn float-end" active tabIndex={-1}>
                          <CIcon icon={cilPlus} /> Create New
                        </CButton>
                      </Link>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="bg-dark p-4 text-white">
                  <CCardBody>
                    <div>
                      <h1 className='text-white'>Import</h1>
                      <p>
                        Import an existing protocol. Use the graphical interface to import a predefined protocol.
                      </p>
                      <Link to="/">
                        <CButton color="primary" className="mt-3 basic-btn float-end" active tabIndex={-1}>
                          <CIcon icon={cilCloudUpload} /> Import
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
                <CCard className="p-4 bg-light" >
                  <CCardBody>
                    <CForm>
                      <h1>Labware</h1>
                      <p>
                        Check out existing labware and learn the definitions, capacity, usages
                      </p>
                      <Link to="/labware-collection">
                        <CButton color="primary" className="mt-3 basic-btn float-end" active tabIndex={-1}>
                          <CIcon icon={cilList} /> Collection
                        </CButton>
                      </Link>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>

    </>
  )
}

export default Dashboard
