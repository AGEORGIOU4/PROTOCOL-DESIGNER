import React, { useState } from 'react'
import { CListGroup, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CSidebar, CButton } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import './styles.css'
import { Title } from '../helpers'
import AddLabwareModal from '../Modal'
import { generateStepID, getIcons } from './helpers'
import { PromptWithConfirm } from 'src/_common/alerts/swal'
import { DraggableStep } from './components/DraggableStep'
import { cilPlus } from '@coreui/icons'
import { TransferForm } from '../Modal/Steps/Transfer'

const RenderStepForm = (modalTitle) => {
  console.log(modalTitle)
  switch (modalTitle) {
    case 'Transfer':
      return <TransferForm />

    default:
      break;
  }
}

const LabwareSteps = () => {
  const [resetFlag, setResetFlag] = useState(true)

  const [stepsList, setStepsList] = useState(["Transfer", "Mix", "Delay", "Heater Shaker", "Centrifuge", "Magnet", "Thermoblock", "PCR", "Trash"]);
  const [selectedSteps, setSelectedSteps] = useState([])

  const [modalID, setModalID] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const [visible, setVisible] = useState(false)

  //Drag and Drop
  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...selectedSteps];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    setSelectedSteps(updatedList);
  }

  // Operations
  const handleReset = (flag) => {
    if (flag) {
      setModalID("");
      setModalTitle("");
      setVisible(false);
    }
  }

  const handleAddStep = (e) => {
    let id = e.target.id;
    let title = e.target.innerText;

    title = title.substring(1)

    let obj = { id: e.target.id, value: title };
    setSelectedSteps(current => [...current, obj])

    setModalID(id);
    setModalTitle(title);
    setVisible(true);
  }

  const handleViewStep = (e) => {
    let id = e.target.id;
    let title = e.target.value;

    setModalID(id);
    setModalTitle(title);
    setVisible(true);
  }

  const handleDeleteStep = (e) => {
    let id = e.target.id;
    let title = e.target.value;

    PromptWithConfirm('Are you sure you want to delete ' + title + ' Step ' + id + '?', 'warning', () => deleteSlot(id))
  }

  const deleteSlot = (id) => {
    const tmp_delete = selectedSteps;

    tmp_delete?.map((item, index) => {
      if (item.id === id) {
        tmp_delete.splice(index, 1)

        if (item.id === modalID) {
          handleReset(true)
        }
      }
    })

    setSelectedSteps(tmp_delete)
    setResetFlag(!resetFlag)
  }

  return (
    <>
      <CSidebar
        colorScheme="light"
        placement="start"
        position='fixed'
        visible={true}
        style={{ padding: '0 6px 6px 6px ', overflowY: 'scroll', zIndex: '1056' }}
      >

        <Title title={"TIMELINE"} />

        <CButton style={{ background: '#fff', border: '1px solid #585858', color: '#585858', borderRadius: '0', padding: '20px', fontSize: 'small', fontWeight: '700', margin: '0 0 0 0' }}>
          STARTING DECK STATE
        </CButton>

        {/* ADD STEP */}
        <div style={{ padding: '6px 0' }}>
          <CDropdown style={{ width: '100%', userSelect: 'none' }}>
            <CDropdownToggle className='standard-btn'><CIcon size='sm' icon={cilPlus} /> ADD STEP</CDropdownToggle>
            <CDropdownMenu className='dropdownMenu'>
              {stepsList?.map((item, index) => {
                let id = generateStepID();
                return (
                  < CDropdownItem key={item} className='dropdownItem' id={id} value={item} onClick={(e) => handleAddStep(e)}>
                    <CIcon key={index} icon={getIcons(item)} /> {item}
                  </CDropdownItem>
                )
              })}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <CListGroup>
          {/* SELECTED STEPS LIST */}
          <div >
            <DragDropContext onDragEnd={handleDrop}>
              <Droppable droppableId="list-container">
                {(provided) => (
                  <div
                    className="list-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {selectedSteps?.map((item, index) => {
                      return (
                        <>
                          <DraggableStep key={item.id} id={item.id} value={item.value} index={index} handleViewStep={(e) => handleViewStep(e)} handleDeleteStep={(e) => handleDeleteStep(e)} />
                        </>
                      )
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CListGroup>

        <CButton style={{ background: '#fff', border: '1px solid #585858', color: '#585858', borderRadius: '0', padding: '20px', fontSize: 'small', fontWeight: '700', margin: '6px 0' }}>
          FINAL DECK STATE
        </CButton>

      </CSidebar >

      <AddLabwareModal visible={visible} setVisible={setVisible} title={modalTitle} step={modalID}>
        {RenderStepForm(modalTitle)}
      </AddLabwareModal>

    </>
  )
}

export default LabwareSteps
