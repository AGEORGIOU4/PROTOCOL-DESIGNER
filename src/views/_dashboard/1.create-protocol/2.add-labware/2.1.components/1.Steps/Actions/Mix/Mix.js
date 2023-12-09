import React, { useState } from 'react';
import { CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CRow, CButton } from '@coreui/react-pro';
import CIcon from '@coreui/icons-react'
import { cilPencil } from '@coreui/icons'
import { options_ChangeTip, options_Pipettes, options_LabWares, options_Columns } from './data';
import { AspireDispense } from '../../Components/aspireDispense';
import { Notes } from '../../Components/notes'

export const MixForm = () => {
  const [validated, setValidated] = useState(false);
  const [selectedPipette, setSelectedPipette] = useState('');
  const [selectedLabWare, setSelectedLabWare] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('')
  const [activeHeader, setActiveHeader] = useState('');
  const [showComponent, setShowComponent] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleNotesClick = () => {
    setIsNotesOpen(true)
  }

  const closeNotes = () => {
    setIsNotesOpen(false)
  }

  const handleIconClick = (header) => {
    // If the same header is clicked again, close the component and reset the state
    if (header === activeHeader) {
      setShowComponent(false);
      setActiveHeader('');
    } else if (activeHeader === "DISPENSE" || activeHeader === "ASPIRATE") {
      // If a different header is clicked, show the component with the new header
      setShowComponent(false);
      setActiveHeader('');
    } else {
      setShowComponent(true);
      setActiveHeader(header);
    }
  };


  const isActive = (header) => activeHeader === header;

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  const handlePipetteChange = (event) => {
    setSelectedPipette(event.target.value);
  };

  const handleLabWareChange = (event) => {
    setSelectedLabWare(event.target.value);
  };

  const handleColumnChange = (event) => {
    setSelectedColumn(event.target.value);
  }

  const handleDelete = () => {
    console.log("Delete action triggered");
  };

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CForm className="row g-3 needs-validation" noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Mix Section */}
            <div className='modal-header-row'>
              <CCol md={7}>
                <h5 className='modal-subtitle'>Mix</h5>
              </CCol>
            </div>

            {/* Pipette, Mix Volume, Repetitions Row */}
            <CRow>
              <CCol md={2}>
                <CFormLabel htmlFor="pipetteSelect">Pipette</CFormLabel>
                <CFormSelect
                  id="pipetteSelect"
                  required
                  onChange={handlePipetteChange}
                  value={selectedPipette}
                  options={
                    selectedPipette === ''
                      ? [{ value: '', label: 'Select Pipette', disabled: true, hidden: true }, ...options_Pipettes]
                      : options_Pipettes
                  }
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="mixVolumeInput">Mix Volume (μL)</CFormLabel>
                <CFormInput type='number' id="mixVolumeInput" required placeholder='Add Volume' />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
              <CCol md={2}>
                <CFormLabel htmlFor="repetitionsInput">Repetitions</CFormLabel>
                <CFormInput type='number' id="repetitionsInput" required placeholder='Add Repetitions' />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
            </CRow>

            {/* Labware Row */}
            <CRow className="pt-3">
              <CCol md={2}>
                <CFormLabel htmlFor="labwareSelect">Labware</CFormLabel>
                <CFormSelect
                  id="labwareSelect"
                  required
                  onChange={handleLabWareChange}
                  value={selectedLabWare}
                  options={
                    selectedLabWare === ''
                      ? [{ value: '', label: 'Select Labware', disabled: true, hidden: true }, ...options_LabWares]
                      : options_LabWares
                  }
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>


              {/* Column Row */}
              <CCol md={2}>
                <CFormLabel htmlFor="columnsSelect">Columns</CFormLabel>
                <CFormSelect
                  id="columnsSelect"
                  required
                  onChange={handleColumnChange}
                  value={selectedColumn}
                  options={
                    selectedColumn === ''
                      ? [{ value: '', label: 'Select Column', disabled: true, hidden: true }, ...options_Columns]
                      : options_Columns
                  }
                />
                <CFormFeedback valid>Looks good!</CFormFeedback>
              </CCol>
            </CRow>


            {/* Aspirate, Dispense */}
            <CRow>
              <div className='modal-header-row'>
                <CCol md={5}
                  style={{
                    padding: '0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `2px solid ${isActive('ASPIRATE') ? '#01AAB1' : 'black'}`,
                  }}
                >
                  <h5
                    className='modal-subtitle'
                    style={{ color: isActive('ASPIRATE') ? '#01AAB1' : 'black' }}
                  >
                    ASPIRATE
                  </h5>
                  <CIcon
                    size='sm'
                    icon={cilPencil}
                    onClick={() => handleIconClick('ASPIRATE')}
                    style={{ color: isActive('ASPIRATE') ? '#01AAB1' : 'black', cursor: "pointer" }}
                  />
                </CCol>
                <CCol md={5}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: `2px solid ${isActive('DISPENSE') ? '#01AAB1' : 'black'}`,
                  }}
                >
                  <h5
                    className='modal-subtitle'
                    style={{ color: isActive('DISPENSE') ? '#01AAB1' : 'black' }}
                  >
                    DISPENSE
                  </h5>
                  <CIcon
                    size='sm'
                    icon={cilPencil}
                    onClick={() => handleIconClick('DISPENSE')}
                    style={{ color: isActive('DISPENSE') ? '#01AAB1' : 'black', cursor: "pointer" }}
                  />
                </CCol>
              </div>
            </CRow>
            {showComponent && <AspireDispense />}

            {/* SPACER */}
            <CCol md={5}></CCol>

            <div className='modal-header-row' >
              <CCol md={7} style={{ paddingTop: '12px' }}>
                <h5 className='modal-subtitle'>STERILITY</h5>
              </CCol>
            </div>

            <CCol md={4}>
              <CFormLabel htmlFor="validationCustom05">Change Tip</CFormLabel>
              <CFormSelect options={options_ChangeTip} id="validationCustom05" required />
              <CFormFeedback valid>Looks good!</CFormFeedback>
            </CCol>

            {/* Buttons */}
            <CRow className="mt-4">
              <CCol xs={6} style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                <CButton color="danger" className="me-2" onClick={handleDelete}>Delete</CButton>
                <CButton color="secondary" className="me-2" onClick={handleNotesClick}>Notes</CButton>
              </CCol>
              <CCol xs={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <CButton color="secondary" className="me-2" onClick={() => { }}>Close</CButton>
                <CButton color="primary" type="submit">Save</CButton>
              </CCol>
            </CRow>
            <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};
