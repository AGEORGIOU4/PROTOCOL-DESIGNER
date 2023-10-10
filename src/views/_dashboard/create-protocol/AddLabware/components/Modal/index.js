import { cilSave, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react-pro";

const AddLabwareModal = ({ children, title, step, visible, setVisible }) => {
  let title2 = title.toUpperCase();
  return (
    <>

      <CModal fullscreen backdrop={'static'} className="add-labware-modal" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel" >{title2}</CModalTitle>
        </CModalHeader>
        <CModalBody>

          {children}
        </CModalBody>
        <CModalFooter>
          <h6 className="modal-step-h">{step}</h6>
          <CButton color="secondary" className="cancel-btn" onClick={() => setVisible(false)}>
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