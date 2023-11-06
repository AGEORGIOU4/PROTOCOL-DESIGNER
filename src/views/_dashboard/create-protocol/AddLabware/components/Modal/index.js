import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react-pro";
import { getIcons } from "../Steps/helpers";

const AddLabwareModal = ({ children, header = true, title = '', footerText = '', stepID = '', stepIndex = '', visible, handleClose }) => {
  // let titleToUpper = stepTitle.toUpperCase();
  let titleToUpper = title;
  return (
    <>

      <CModal fullscreen backdrop={'static'} className="add-labware-modal" visible={visible} onClose={handleClose} >
        {header &&
          <CModalHeader style={{ background: '#585858' }} closeButton={false}>
            <CModalTitle id="StaticBackdropExampleLabel" style={{ color: 'white' }}><CIcon icon={getIcons(title)} /> {titleToUpper}</CModalTitle>
            <CButton color="secondary" className="cancel-btn" onClick={handleClose}>
              <CIcon size="sm" icon={cilX} /> CLOSE
            </CButton>
          </CModalHeader>
        }
        <CModalBody>

          {children}

        </CModalBody>

      </CModal >
    </>
  )

}
export default AddLabwareModal;