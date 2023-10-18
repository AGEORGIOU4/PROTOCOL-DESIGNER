import { cilSave, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react-pro";
import { getIcons } from "../Steps/helpers";

const AddLabwareModal = ({ children, header = true, title = '', stepID = '', stepIndex = '', visible, handleClose }) => {
  // let titleToUpper = stepTitle.toUpperCase();
  let titleToUpper = title;
  return (
    <>

      <CModal fullscreen backdrop={'static'} className="add-labware-modal" visible={visible} onClose={handleClose} >
        {header &&
          <CModalHeader style={{ background: '#585858' }} closeButton={true}>
            <CModalTitle id="StaticBackdropExampleLabel" style={{ color: 'white' }}><CIcon icon={getIcons(title)} /> {titleToUpper}</CModalTitle>
          </CModalHeader>
        }
        <CModalBody>

          {children}

        </CModalBody>

        <CModalFooter>
          <h6 className="modal-step-h"> {stepIndex ? 'Step ' + stepIndex + 1 : ''} <span style={{ fontSize: '14px', fontWeight: '400' }}>{stepID ? (stepID) : ''}</span></h6>
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