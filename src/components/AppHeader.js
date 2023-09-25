import React from 'react'
import { CContainer, CHeader, CHeaderBrand, CLink, CNavItem, CNavLink } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { logo } from 'src/assets/brand/logo'
import { NavLink } from 'react-router-dom'

const AppHeader = () => {
  return (
    <CHeader position="sticky" className="bg-primary mb-4">
      <CContainer fluid>
        <CLink href='/' style={{ textDecoration: 'none' }}><h5 className='text-white' ><strong>PROTOCOL DESIGNER</strong></h5></CLink>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
