import React from "react";
import { Link } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { cilCloudUpload, cilList, cilPlus } from "@coreui/icons";

const Dashboard = () => {
  return (
    <>
      <div className="min-vh-40 d-flex flex-row align-items-center ">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={12}>
              <CCardGroup>
                <CCard
                  className="p-4 text-white"
                  style={{
                    border: "10px solid white",
                    borderRight: "none",
                    boxShadow: "none",
                    background: "#6c757d",
                  }}
                >
                  <CCardBody>
                    <CForm>
                      <h1 className="text-white">Create</h1>
                      <p>
                        Create a new protocol. Use the graphical interface to
                        define your protocol's steps.
                      </p>
                      <Link to="/create-protocol">
                        <CButton
                          className="standard-btn"
                          style={{ width: "100%" }}
                        >
                          <CIcon size="sm" icon={cilPlus} /> CREATE NEW
                        </CButton>
                      </Link>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard
                  className="p-4 text-white"
                  style={{
                    border: "10px solid white",
                    borderRight: "none",
                    boxShadow: "none",
                    background: "#6c757d",
                  }}
                >
                  <CCardBody>
                    <h1 className="text-white">Import</h1>
                    <p>
                      Import an existing protocol. Use the graphical interface
                      to import a predefined protocol.
                    </p>
                    <CButton className="standard-btn" style={{ width: "100%" }}>
                      <CIcon size="sm" icon={cilCloudUpload} /> IMPORT
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  );
};

export default Dashboard;
