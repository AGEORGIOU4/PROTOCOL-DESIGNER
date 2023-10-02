import React, { useState } from 'react'
import {
  CListGroup,
  CListGroupItem,
  CSidebar,
  CButton,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {

  cilArrowRight,
  cilAvTimer,

  cilColorFill,

  cilMediaPause,

} from '@coreui/icons'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const getIcons = (action) => {
  switch (action) {
    case 'Transfer':
      return cilArrowRight;
    case 'Mix':
      return cilColorFill;
    case 'Pause':
      return cilMediaPause;
  }
}

const getDuration = (action) => {
  switch (action) {
    case 'Transfer':
      return '30';
    case 'Mix':
      return '15';
    case 'Pause':
      return '22';
  }
}

const LabwareSteps = () => {
  // const defaultList = [
  //   { id: 1, action: 'Transfer', icon: cilArrowRight, duration: '30' },
  //   { id: 2, action: 'Mix', icon: cilColorFill, duration: '15' },
  //   { id: 3, action: 'Pause', icon: cilMediaPause, duration: '22' },
  // ];

  const defaultList = ["Transfer", "Mix", "Pause"]
  // React state to track order of items
  const [itemList, setItemList] = useState(defaultList);

  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    var updatedList = [...itemList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setItemList(updatedList);
  };

  return (
    <>

      <CSidebar
        colorScheme="light"
        position="fixed"
        visible={true}
        size='lg'

      >
        <div className='card-steps'>

          <CListGroup flush>

            <CListGroupItem className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
              <strong>TIMELINE</strong>
            </CListGroupItem>

            <hr />
            <div style={{ textAlign: 'center', padding: '2px' }}>
              <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>STARTING DECK STATE</p>
            </div>
            <hr />

            <div >
              <DragDropContext onDragEnd={handleDrop}>
                <Droppable droppableId="list-container">
                  {(provided) => (
                    <div
                      className="list-container"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {itemList.map((item, index) => (

                        <>

                          <Draggable key={item} draggableId={item} index={index}>
                            {(provided) => (
                              <div
                                className="item-container"
                                ref={provided.innerRef}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                              >

                                <CListGroupItem href="#" className="border-start-4 border-start-success">
                                  <div>
                                    <strong>Step {index + 1}</strong>
                                  </div>
                                  <small className="text-medium-emphasis me-3">
                                    <CIcon icon={getIcons(item)} /> {item}
                                  </small>
                                  <br></br>
                                  <small className="text-medium-emphasis">
                                    <CIcon icon={cilAvTimer} /> {getDuration(item)} minutes
                                  </small>
                                </CListGroupItem>

                              </div>
                            )}
                          </Draggable>
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

          <div style={{ padding: '10px 0' }}>
            <CButton className='add-labware-btn' ><small>+ ADD STEP</small></CButton>
          </div>

          <hr />
          <div style={{ textAlign: 'center', padding: '2px' }}>
            <p style={{ marginBottom: '10px', fontSize: 'small', fontWeight: '600' }}>FINAL DECK STATE</p>
          </div>
          <hr />
          <br />
          <br />
        </div>

      </CSidebar>

    </>
  )
}

export default React.memo(LabwareSteps)
