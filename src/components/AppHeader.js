import React from "react";
import {
  CButton,
  CContainer,
  CHeader,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router";
import { cisChevronLeftAlt } from "@coreui/icons-pro";

const AppHeader = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <CHeader position="fixed">
      <CContainer fluid>
        <CButton
          onClick={goBack}
          variant="ghost"
          className="go-back-btn float-end"
        >
          <CIcon icon={cisChevronLeftAlt} />
        </CButton>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
