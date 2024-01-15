import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CRow, CButton, CFormLabel } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { Notes } from '../../Components/notes';
import { labwareOptions } from './data'


export const TrashForm = ({ onClose, onDelete, stepId, stepTitle }) => {
    // State declarations
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [validated, setValidated] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    // This will now hold the labware items and needs to be in a state to update the component when items are deleted.
    const [currentLabwareOptions, setCurrentLabwareOptions] = useState(labwareOptions);

    const [selectedLabware, setSelectedLabware] = useState(new Set());

    const toggleLabwareSelection = (id) => {
        setSelectedLabware((prevSelected) => {
            const newSelection = new Set(prevSelected);
            if (newSelection.has(id)) {
                newSelection.delete(id);
            } else {
                newSelection.add(id);
            }
            return newSelection;
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedLabware(new Set(currentLabwareOptions.map((item) => item.id)));
        } else {
            setSelectedLabware(new Set());
        }
    };

    const deleteButtonLabel = () => {
        if (selectedLabware.size === 0) {
            return ''; // No button if none selected
        }
        return selectedLabware.size === labwareOptions.length ? 'Delete All' : 'Delete';
    };

    const onDeleteSelection = (selectedItems) => {
        if (selectedItems === 'all') {
            // Clear all items from the state to remove them from the UI
            setCurrentLabwareOptions([]);
        } else {
            // Remove only the selected items from the state
            setCurrentLabwareOptions(currentLabwareOptions.filter(item => !selectedItems.includes(item.id)));
        }
        // Clear the selection after deleting
        setSelectedLabware(new Set());
    };

    const handleDelete = () => {
        // If 'Delete All' is selected, we might want to handle it differently
        if (selectedLabware.size === labwareOptions.length) {
            // Call onDelete with a parameter that indicates all items should be deleted
            onDeleteSelection('all');
        } else {
            // Call onDelete with an array of selected IDs
            onDeleteSelection(Array.from(selectedLabware));
        }
        // Clear the selection after deleting
        setSelectedLabware(new Set());
    };

    const handleLocalClose = () => onClose();

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    const handleNotesClick = () => setIsNotesOpen(true);

    const closeNotes = () => setIsNotesOpen(false);

    return (
        <>

            <CRow>
                <CCol md={12}>
                    <CForm className="row g-3 needs-validaiton" noValidate validated={validated} onSubmit={handleSubmit}>
                        {/* Form Header */}
                        <div className='modal-header-row'>
                            <CCol md={7}>
                                <h5 className='modal-subtitle'>Trash</h5>
                            </CCol>
                        </div>

                        {/* Labware Selection */}
                        <CCol md={12}>
                            {currentLabwareOptions.length > 0 ? (
                                <CFormCheck
                                    label="Select All"
                                    onChange={handleSelectAll}
                                    checked={selectedLabware.size === currentLabwareOptions.length}
                                    id="selectAll"
                                />
                            ) : (
                                <div className="text-muted">None left</div>
                            )}

                            {
                                currentLabwareOptions.map((option, index) => (
                                    <div key={option.id} className="d-flex justify-content-between align-items-center">
                                        <CFormCheck
                                            label={option.name}
                                            onChange={() => toggleLabwareSelection(option.id)}
                                            checked={selectedLabware.has(option.id)}
                                            id={`labware-${option.id}`}
                                        />
                                        {/* Render the Delete/Delete All button at the far right next to the last checkbox */}
                                        {index === currentLabwareOptions.length - 1 && selectedLabware.size > 0 && (
                                            <div className="ms-auto">
                                                <CButton className="delete-btn-trash" onClick={handleDelete}>
                                                    {deleteButtonLabel()}
                                                    <CIcon icon={cilTrash} className="ms-2" />
                                                </CButton>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }


                        </CCol>

                        {/* Form Buttons */}
                        <CRow className='mt-3'>
                            <CCol md={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '100px' }}>
                                <CButton color="danger" onClick={() => onDelete({ target: { id: stepId, value: stepTitle } })}>Delete</CButton>
                                <CButton color="secondary" onClick={handleNotesClick}>Notes</CButton>
                            </CCol>
                            <CCol md={{ span: 4, offset: 1 }} style={{ display: 'flex', justifyContent: 'flex-end', gap: '100px' }}>
                                <CButton color="secondary" onClick={handleLocalClose}>Close</CButton>
                                <CButton color="primary" type="submit">Save</CButton>
                            </CCol>
                        </CRow>

                        {/* Notes Component */}
                        <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
                    </CForm>
                </CCol >
            </CRow >

        </>
    );
};
