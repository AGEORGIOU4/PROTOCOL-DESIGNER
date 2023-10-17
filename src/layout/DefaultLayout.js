import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
import LabwareSteps from 'src/views/_dashboard/create-protocol/AddLabware/components/Steps';


const DefaultLayout = () => {
  const currentHash = window.location.hash;

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
