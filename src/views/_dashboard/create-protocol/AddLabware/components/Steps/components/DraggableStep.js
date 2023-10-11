import { cilAvTimer, cilMove, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CListGroupItem } from '@coreui/react-pro'
import { Draggable } from 'react-beautiful-dnd'
import { getColor, getDuration, getIcons } from '../helpers'

export const DraggableStep = ({ id, value, index, handleViewStep, handleDeleteStep }) => {
  return (
    <>
      <Draggable draggableId={id} index={index} >
        {(provided) => (
          <div
            key={index}
            className="id-container"
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >

            <CListGroupItem href="#" className={`border-start-4 border-start-${getColor(value)}`} style={{ paddingRight: '8px' }}>

              <CIcon icon={cilMove} className='float-end' style={{ margin: '4px 8px' }} />
              <div>
                <strong> <CIcon icon={getIcons(value)} /> {value}</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                Step {index} ({id})
              </small>
              <br></br>
              <small className="text-medium-emphasis">
                <CIcon icon={cilAvTimer} /> {getDuration(value)} minutes
              </small>

              <CButton
                id={id}
                value={value}
                size='sm'
                className='float-end modal-action-btn'
                variant='outline'
                color='primary'
                onClick={(e) => handleViewStep(e)}>
                <CIcon icon={cilPencil} style={{ pointerEvents: 'none' }} />
              </CButton>

              <CButton
                id={id}
                value={value}
                size='sm'
                className='float-end modal-action-btn'
                variant='outline'
                color='danger'
                onClick={(e) => { e.stopPropagation(); handleDeleteStep(e) }}>
                <CIcon icon={cilTrash} style={{ pointerEvents: 'none' }} />
              </CButton>

            </CListGroupItem>

          </div>
        )}
      </Draggable>
    </>
  )
}