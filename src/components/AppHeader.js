import React from 'react'
import { CContainer, CHeader, CHeaderBrand } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  return (
    <CHeader position="sticky" className="bg-primary mb-4">
      <CContainer fluid>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
