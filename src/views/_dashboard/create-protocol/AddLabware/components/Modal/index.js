import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react-pro";

const AddLabwareModal = ({ children, title, visible, setVisible }) => {
  return (
    <>

      <CModal fullscreen backdrop={'static'} className="add-labware-modal" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle id="StaticBackdropExampleLabel">Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {children}

          <h1>Hello, world!</h1>
          <p>This is my first web page.</p>
          <p>It contains a
            <strong>main heading</strong> and <em> paragraph </em>.
          </p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary">Save changes</CButton>
        </CModalFooter>
      </CModal >
    </>
  )

}
export default AddLabwareModal;