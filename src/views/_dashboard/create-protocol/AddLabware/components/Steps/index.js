import React, { useState } from 'react'
import { CListGroup, CListGroupItem, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CSidebar, CButton } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilAperture, cilArrowRight, cilAvTimer, cilColorFill, cilMediaPause, cilMove, cilTrash } from '@coreui/icons'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { cil3dRotate, cilLink, cilSwapVertical, cilTemperature } from '@coreui/icons-pro'
import './styles.css'
import { Title } from '../helpers'
import AddLabwareModal from '../Modal'


// HELPER FUNCTIONS
const CustomDraggable = ({ item, value, index }) => {
  return (
    <>
      <Draggable key={item} draggableId={item} index={index}>
        {(provided) => (
          <div
            key={index}
            className="item-container"
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >

            <CListGroupItem href="#" className={`border-start-4 border-start-${getColor(value)}`}>
              <div>

                <strong>Step {index + 1}</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={getIcons(value)} /> {value}
              </small>
              <br></br>
              <small className="text-medium-emphasis">
                <CIcon icon={cilAvTimer} /> {getDuration(value)} minutes
              </small>

              <CIcon icon={cilMove} className='float-end'></CIcon>
            </CListGroupItem>

          </div>
        )}


      </Draggable>
    </>
  )
}

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 99999); // Generates a random number between 0 and 99999
};

const getColor = (action) => {
  switch (action) {
    case 'Delay':
      return 'warning';
    case 'Trash':
      return 'danger';
    default:
      return 'success'
  }
}

const getIcons = (action) => {
  switch (action) {
    case 'Transfer':
      return cilArrowRight;
    case 'Mix':
      return cilColorFill;
    case 'Delay':
      return cilMediaPause;
    case 'Thermoblock':
      return cilTemperature;
    case 'Magnet':
      return cilLink;
    case 'Heater Shaker':
      return cilSwapVertical;
    case 'PCR':
      return cil3dRotate;
    case 'Centrifuge':
      return cilAperture;
    case 'Trash':
      return cilTrash;
  }
}

const getDuration = (action) => {
  switch (action) {
    case 'Transfer':
      return '30';
    case 'Mix':
      return '15';
    case 'Delay':
      return '22';
    case 'Heater Shaker':
      return '10';
    case 'Magnet':
      return '45';
    case 'Thermoblock':
      return '60';
    case 'PCR':
      return '75';
    case 'Centrifuge':
      return '65';
    case 'Trash':
      return '5';
  }
}

// MAIN COMPONENT
const LabwareSteps = () => {
  const [stepsList, setStepsList] = useState(["Transfer", "Mix", "Delay", "Heater Shaker", "Centrifuge", "Magnet", "Thermoblock", "PCR", "Trash"]);
  const [selectedSteps, setSelectedSteps] = useState([])

  const [visible, setVisible] = useState(false)

  const handleAddStep = (e) => {
    let text = e.target.innerText;
    text = text.substring(1)
    let obj = { id: e.target.id, value: text };
    setSelectedSteps(current => [...current, obj])

    setVisible(true);
  }

  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...selectedSteps];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    setSelectedSteps(updatedList);
  };

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

        {/* <hr />
        <div style={{ textAlign: 'center', padding: '2px' }}>
          <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>STARTING DECK STATE</p>
        </div>
        <hr /> */}

        <CButton style={{ background: '#fff', border: '1px solid #585858', color: '#585858', borderRadius: '0', padding: '20px', fontSize: 'small', fontWeight: '700', margin: '0px 0 0 0' }}>
          STARTING DECK STATE
        </CButton>

        {/* ADD STEP */}
        <div style={{ padding: '6px 0 ' }}>
          <CDropdown style={{ width: '100%', userSelect: 'none' }}>
            <CDropdownToggle className='add-labware-btn'><small>+ ADD STEP</small></CDropdownToggle>
            <CDropdownMenu className='dropdownMenu'>
              {stepsList?.map((item, index) => {
                let id = generateRandomNumber();
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
                    {selectedSteps?.map((item, index) => (
                      <>
                        <CustomDraggable key={item.id} item={item.id} value={item.value} index={index} />
                      </>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CListGroup>

        {/* <hr />
        <div style={{ textAlign: 'center', padding: '2px' }}>
          <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>FINAL DECK STATE</p>
        </div>
        <hr /> */}

        <CButton style={{ background: '#fff', border: '1px solid #585858', color: '#585858', borderRadius: '0', padding: '20px', fontSize: 'small', fontWeight: '700', margin: '6px 0' }}>
          FINAL DECK STATE
        </CButton>

      </CSidebar >

      <AddLabwareModal visible={visible} setVisible={setVisible} />

    </>
  )
}

export default LabwareSteps
