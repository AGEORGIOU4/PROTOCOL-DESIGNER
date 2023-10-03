import React, { useState } from 'react'
import { CListGroup, CListGroupItem, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilAperture, cilArrowRight, cilAvTimer, cilColorFill, cilMediaPause, cilMove } from '@coreui/icons'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { cilLink, cilSwapVertical, cilTemperature } from '@coreui/icons-pro'
import './styles.css'

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
    case 'Transfer':
    case 'Mix':
      return 'success';
    case 'Delay':
      return 'warning';
    case 'Magnet':
      return 'info';
    case 'Thermomix':
    case 'Temperature':
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
    case 'Temperature':
      return cilTemperature;
    case 'Magnet':
      return cilLink;
    case 'Thermomix':
      return cilSwapVertical;
    case 'Thermocycler':
      return cilAperture;
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
    case 'Thermomix':
      return '10';
    case 'Magnet':
      return '45';
    case 'Temperature':
      return '60';
    case 'Thermocycler':
      return '75';
  }
}

// MAIN COMPONENT
const LabwareSteps = () => {
  const [stepsList, setStepsList] = useState(["Transfer", "Mix", "Delay", "Thermomix", "Magnet", "Temperature", "Thermocycler"]);


  const [selectedSteps, setSelectedSteps] = useState([])

  const handleAddStep = (e) => {
    let text = e.target.innerText;
    text = text.substring(1)
    let obj = { id: e.target.id, value: text };
    setSelectedSteps(current => [...current, obj])
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

      <div>

        <CListGroup>
          <hr />
          <div style={{ textAlign: 'center', padding: '2px' }}>
            <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>STARTING DECK STATE</p>
          </div>
          <hr />

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
        <br />

        {/* ADD STEP */}
        <div style={{ padding: '10px 0' }}>
          <CDropdown style={{ width: '100%', userSelect: 'none' }}>
            <CDropdownToggle className='add-step-btn'><small>+ ADD STEP</small></CDropdownToggle>
            <CDropdownMenu className='dropdownMenu'>
              {stepsList?.map((item, index) => {
                let id = generateRandomNumber();
                return (
                  < CDropdownItem className='dropdownItem' id={id} value={item} onClick={(e) => handleAddStep(e)}>
                    <CIcon key={index} icon={getIcons(item)} /> {item}
                  </CDropdownItem>
                )
              })}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <hr />
        <div style={{ textAlign: 'center', padding: '2px' }}>
          <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>FINAL DECK STATE</p>
        </div>
        <hr />
        <br />
        <br />


      </div >

    </>
  )
}

export default React.memo(LabwareSteps)
