import ReservoirSelection from "./Reservoir/Reservoir"
import WellPlateSelection from "./WellPlate/WellPlate"

const { CContainer, CRow, CCol } = require("@coreui/react-pro")



const LabwareSelection = () => {
  let params = new URLSearchParams(window.location.hash);
  let category = params.get('category');




  return (
    <>
      <CContainer style={{ textAlign: 'center', width: 'auto' }}>
        <CRow>
          <CCol md={12}>
            <WellPlateSelection />
          </CCol>
        </CRow>

        <br />
        <br />
        <br />
        <hr />
        <br />
        <br />
        <br />

        <CRow>



          <CCol md={12}>
            <ReservoirSelection />
          </CCol>
        </CRow>

      </CContainer >
    </>
  )
}

export default LabwareSelection