import React from "react";
import CIcon from "@coreui/icons-react";
import { cilFile } from "@coreui/icons";
import { CNavItem, CNavTitle } from "@coreui/react-pro";

const _nav = [
  {
    component: CNavItem,
    name: "File",
    to: "/protocol-designer",
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info-gradient',
    //   text: 'NEW',
    // },
  },

  {
    component: CNavTitle,
    name: "Theme",
  }
];

export default _nav;
