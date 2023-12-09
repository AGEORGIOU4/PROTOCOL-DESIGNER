import React from 'react';
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormLabel, CFormTextarea, CFormInput } from '@coreui/react-pro';

export const Notes = ({ isNotesOpen, onClose }) => {
    return (
        <CModal className='custom-overlay' visible={isNotesOpen} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <CModalTitle>Step Notes</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormLabel htmlFor="stepName">Step Name</CFormLabel>
                <CFormInput
                    type="text"
                    id="noteStepName"
                    value="mix"
                />
                <CFormTextarea id="stepNotes" label="Step Notes:" />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Cancel</CButton>
                <CButton color="primary">Save</CButton>
            </CModalFooter>
        </CModal>
    );
};


