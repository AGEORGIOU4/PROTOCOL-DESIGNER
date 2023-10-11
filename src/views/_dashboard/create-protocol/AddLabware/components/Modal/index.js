import { cilSave, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react-pro";
import { getIcons } from "../Steps/helpers";

const AddLabwareModal = ({ children, stepID, stepIndex, stepTitle, visible, handleClose }) => {
  // let titleToUpper = stepTitle.toUpperCase();
  let titleToUpper = stepTitle
  return (
    <>

      <CModal fullscreen backdrop={'static'} className="add-labware-modal" visible={visible} onClose={handleClose} >
        <CModalHeader style={{ background: '#585858' }} closeButton={false}>
          <CModalTitle id="StaticBackdropExampleLabel" style={{ color: 'white' }}><CIcon icon={getIcons(stepTitle)} /> {titleToUpper}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          {children}
        </CModalBody>
        <CModalFooter>
          <h6 className="modal-step-h">Step {stepIndex + 1} <span style={{ fontSize: '14px', fontWeight: '400' }}>({stepID})</span></h6>
          <CButton color="secondary" className="cancel-btn" onClick={handleClose}>
            <CIcon size="sm" icon={cilX} /> CLOSE
          </CButton>
          <CButton className='standard-btn' color="primary">
            <CIcon size="sm" icon={cilSave} /> SAVE
          </CButton>
        </CModalFooter>
      </CModal >
    </>
  )

}
export default AddLabwareModal;