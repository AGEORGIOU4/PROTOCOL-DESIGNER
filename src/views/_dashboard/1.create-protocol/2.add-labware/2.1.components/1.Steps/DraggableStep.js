import { cilAvTimer, cilMove, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CListGroupItem } from "@coreui/react-pro";
import { Draggable } from "react-beautiful-dnd";
import { getColor, getDuration, getIcons } from "./helpers";
import { cidPencil } from "@coreui/icons-pro";

export const DraggableStep = ({
  id,
  value,
  index,
  handleViewStep,
  handleDeleteStep,
}) => {
  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <div
            key={index}
            className="id-container"
            ref={provided.innerRef}
            {...provided.dragHandleProps}
            {...provided.draggableProps}
          >
            <CListGroupItem
              href="#"
              id={id}
              title={value}
              className={`border-start-4 border-start-${getColor(value)}`}
              style={{ paddingRight: "8px", cursor: "pointer" }}
              onClick={(e) => handleViewStep(e)}
            >
              <CIcon
                icon={cilMove}
                className="float-end"
                style={{ margin: "5px 8px", cursor: "grab" }}
              />

              <div style={{ pointerEvents: "none" }}>
                <strong>
                  {" "}
                  <CIcon icon={getIcons(value)} /> {value}
                </strong>
              </div>
              <small
                className="text-medium-emphasis me-3"
                style={{ pointerEvents: "none" }}
              >
                Step {index + 1} ({id})
              </small>
              <br style={{ pointerEvents: "none" }}></br>
              <small
                className="text-medium-emphasis"
                style={{ pointerEvents: "none" }}
              >
                <CIcon icon={cilAvTimer} /> {getDuration(value)} minutes
              </small>

              <CButton
                id={id}
                value={value}
                size="sm"
                className="float-end modal-action-btn"
                variant="outline"
                color="danger"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStep(e);
                }}
              >
                <CIcon icon={cilTrash} style={{ pointerEvents: "none" }} />
              </CButton>
            </CListGroupItem>
          </div>
        )}
      </Draggable>
    </>
  );
};
