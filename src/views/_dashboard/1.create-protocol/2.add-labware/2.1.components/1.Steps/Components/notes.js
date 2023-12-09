import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton } from '@coreui/react-pro';

export const Notes = ({ isNotesOpen, onClose }) => {
    return (
        <CModal className='custom-overlay' visible={isNotesOpen} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <CModalTitle>Step Notes</CModalTitle>
            </CModalHeader>
            <CModalBody>
                {/* Content of the modal goes here, e.g., form fields for step name and notes */}
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Cancel</CButton>
                <CButton color="primary">Save</CButton>
            </CModalFooter>
        </CModal>
    );
};


