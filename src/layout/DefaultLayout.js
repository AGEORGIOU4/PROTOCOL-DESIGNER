import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'


const DefaultLayout = () => {

  return (
    <>
      {/* <AppSidebar /> */}
      {/* {currentHash.includes('add-labware') && <LabwareSteps />} */}

      <div className="wrapper d-flex flex-column min-vh-100 ">
        <div className="body flex-grow-1 px-3">
          {/* <AppHeader /> */}
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
      {/* <AppAside /> */}
    </>
  )
}

export default DefaultLayout
