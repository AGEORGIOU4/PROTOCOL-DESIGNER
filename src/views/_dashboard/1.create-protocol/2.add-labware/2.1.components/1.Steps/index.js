import React, { useEffect, useState } from "react";
import {
  CListGroup,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSidebar,
  CButton,
} from "@coreui/react-pro";
import CIcon from "@coreui/icons-react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./styles.css";
import AddLabwareModal from "../5.Modal";
import { generateStepID, getIcons } from "./helpers";
import { PromptWithConfirm } from "src/_common/alerts/swal";
import { DraggableStep } from "./DraggableStep";
import { cilPlus } from "@coreui/icons";
import { TransferForm } from "./Actions/Transfer/Transfer";
import { TitleBar } from "src/_common/helpers";
import { MixForm } from "./Actions/Mix/Mix";
import { DelayForm } from "./Actions/Delay/Delay";
import { ThermoBlockForm } from "./Actions/Thermoblock/Thermoblock";
import { MagnetForm } from "./Actions/Magnet/Manget";
import { SeelPeelForm } from "./Actions/SealPeel/SeelPeel";
import { StorageForm } from "./Actions/Storage/Storage";
import { BarCodeForm } from "./Actions/BarCode/BarCode";
import { CameraForm } from "./Actions/Camera/Camera";
import { TrashForm } from "./Actions/Trash/Trash";
import { ThermocyclerForm } from "./Actions/Thermocycler/Thermocycler";
import { CentrifugeForm } from "./Actions/Centrifuge/Centrifuge";

var STEP_ID = -1;
var STEP_INDEX = -1;
var STEP_TITLE = "";

const RenderStepForm = (
  modalTitle,
  handleClose,
  handleDeleteStep,
  stepId,
  stepTitle,
) => {
  switch (modalTitle) {
    case "Transfer":
      return (
        <TransferForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Mix":
      return (
        <MixForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Delay":
      return (
        <DelayForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Thermoblock":
      return (
        <ThermoBlockForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Magnet":
      return (
        <MagnetForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Seal - Peel":
      return (
        <SeelPeelForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Storage":
      return (
        <StorageForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Barcode":
      return (
        <BarCodeForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Camera":
      return (
        <CameraForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Trash":
      return (
        <TrashForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Thermocycler":
      return (
        <ThermocyclerForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    case "Centrifuge":
      return (
        <CentrifugeForm
          onClose={handleClose}
          onDelete={handleDeleteStep}
          stepId={stepId}
          stepTitle={stepTitle}
        />
      );
    default:
      break;
  }
};

const LabwareSteps = ({ active }) => {
  const [resetFlag, setResetFlag] = useState(true);

  const [stepsList, setStepsList] = useState([
    "Transfer",
    "Mix",
    "Delay",
    "Centrifuge",
    "Magnet",
    "Camera",
    "Seal - Peel",
    "Storage",
    "Trash",
    "Barcode",
    "Thermocycler",
    "Thermoblock",
    "Trash",
  ]);
  const [selectedSteps, setSelectedSteps] = useState(JSON.parse(localStorage.getItem("steps")) || []);

  // States for Modal
  const [stepID, setStepID] = useState(STEP_ID);
  const [stepIndex, setStepIndex] = useState(STEP_INDEX);
  const [stepTitle, setStepTitle] = useState(STEP_TITLE);

  const [visible, setVisible] = useState(false);

  const arrangeIndex = (sourceIndex, destinationIndex) => {
    if (sourceIndex === STEP_INDEX) {
      // Check 1: Check if dropped item is on current step (Modal Step) and replace
      STEP_INDEX = destinationIndex;
      setStepIndex(STEP_INDEX);
    } else if (destinationIndex === STEP_INDEX) {
      // Check 2: check if dropped item drops on current step (Modal step)
      if (sourceIndex > STEP_INDEX) {
        // Check 2.1: check if dropped item comes from greater index and add to current index +1
        STEP_INDEX += 1;
        setStepIndex(STEP_INDEX);
      }
      if (sourceIndex < STEP_INDEX) {
        // Check 2.2: check if dropped item comes from lower index and subtract from current index -1
        STEP_INDEX -= 1;
        setStepIndex(STEP_INDEX);
      }
    } else if (destinationIndex < STEP_INDEX && sourceIndex > STEP_INDEX) {
      // Check 3: Check if dropped item source is greater that current index and destination is less. Increment position of current index
      STEP_INDEX += 1;
      setStepIndex(STEP_INDEX);
    } else if (sourceIndex < STEP_INDEX && destinationIndex > STEP_INDEX) {
      // Check 4: Check if dropped item source is less that current index and destination is greater. Dercement position of current index
      STEP_INDEX -= 1;
      setStepIndex(STEP_INDEX);
    }
  };

  // Drag and Drop
  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return;
    var updatedList = [...selectedSteps];
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);

    setSelectedSteps(updatedList);

    arrangeIndex(droppedItem.source.index, droppedItem.destination.index);
  };

  const handleClose = () => {
    handleReset(true);
  };

  // Operations
  const handleReset = (flag) => {
    if (flag) {
      // Close current modal if deleted
      setVisible(false);
    }

    setTimeout(() => {
      STEP_ID = -1;
      setStepID(STEP_ID);

      STEP_INDEX = -1;
      setStepIndex(STEP_INDEX);

      STEP_TITLE = "";
      setStepTitle(STEP_TITLE);
    }, 120);
  };

  const handleAddStep = (e) => {
    STEP_ID = e.target.id;
    STEP_TITLE = e.target.innerText;

    STEP_TITLE = STEP_TITLE.substring(1);

    let obj = { id: STEP_ID, value: STEP_TITLE };
    setSelectedSteps((current) => [...current, obj]);

    STEP_INDEX = selectedSteps.length;

    setStepID(STEP_ID);
    setStepIndex(STEP_INDEX);
    setStepTitle(STEP_TITLE);

    setVisible(true);
  };

  const handleViewStep = (e) => {
    console.log(e.target.id)
    STEP_ID = e.target.id;
    STEP_TITLE = e.target.title;

    STEP_INDEX = selectedSteps.findIndex((element) => element.id === STEP_ID);

    setStepID(STEP_ID);
    setStepIndex(STEP_INDEX);
    setStepTitle(STEP_TITLE);

    setVisible(true);
  };

  const handleDeleteStep = (e) => {
    let id = e.target.id;
    let title = e.target.value;

    if (
      confirm("Are you sure you want to delete " + title + " Step " + id + "?")
    ) {
      deleteStep(id);
    }
  };

  const deleteStep = (id) => {
    const tmp_delete = selectedSteps;

    tmp_delete?.map((item, index) => {
      if (item.id === id) {
        tmp_delete.splice(index, 1);

        if (item.id === stepID) {
          handleReset(true);
        }

        if (index < STEP_INDEX) {
          STEP_INDEX -= 1;
          setStepIndex(STEP_INDEX);
        }
      }
    });

    setSelectedSteps(tmp_delete);
    setResetFlag(!resetFlag);
  };

  //  LOCAL STORAGE MANAGEMENT - Update Storage
  useEffect(() => {
    try {
      if (selectedSteps) {
        localStorage.setItem("steps", JSON.stringify(selectedSteps));
        console.log("Steps:", selectedSteps)
      }
    } catch (e) {
      console.log(e);
    }
  }, [selectedSteps, resetFlag]);

  //  LOCAL STORAGE MANAGEMENT - Get Storage
  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem("steps")); // Check memory
      console.log("Steps:", items)
    } catch (e) {
      console.log(e);
    }


  }, []);

  return (
    <>
      <CSidebar
        colorScheme="light"
        placement="start"
        position="fixed"
        size="xl"
        visible={true}
        style={{
          padding: "0 6px 6px 6px ",
          overflowY: "scroll",
          zIndex: "1056",
        }}
      >
        <TitleBar title={"TIMELINE"} />

        <CButton
          style={{
            background: "#fff",
            border: "1px solid #585858",
            color: "#585858",
            borderRadius: "0",
            padding: "20px",
            fontSize: "small",
            fontWeight: "700",
            margin: "0",
          }}
        >
          STARTING STATE
        </CButton>

        {/* ADD STEP */}
        <div style={{ padding: "4px 0" }}>
          <CDropdown style={{ width: "100%", userSelect: "none" }}>
            <CDropdownToggle
              // disabled={active ? false : true}
              className="standard-btn"
            >
              <CIcon size="sm" icon={cilPlus} /> ADD STEP
            </CDropdownToggle>
            <CDropdownMenu className="dropdownMenu">
              {React.Children.toArray(
                stepsList?.map((item, index) => {
                  let id = generateStepID();
                  return (
                    <CDropdownItem
                      key={item}
                      className="dropdownItem"
                      id={id}
                      value={item}
                      onClick={(e) => handleAddStep(e)}
                    >
                      <CIcon key={index} icon={getIcons(item)} /> {item}
                    </CDropdownItem>
                  );
                }),
              )}
            </CDropdownMenu>
          </CDropdown>
        </div>

        <CListGroup>
          {/* SELECTED STEPS LIST */}
          <div>
            <DragDropContext onDragEnd={handleDrop}>
              <Droppable droppableId="list-container">
                {(provided) => (
                  <div
                    className="list-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {React.Children.toArray(
                      selectedSteps?.map((item, index) => {
                        return (
                          <>
                            <DraggableStep
                              key={item.id}
                              id={item.id}
                              value={item.value}
                              index={index}
                              handleViewStep={(e) => handleViewStep(e)}
                              handleDeleteStep={(e) => handleDeleteStep(e)}
                              STEP_ID={STEP_ID}
                            />
                          </>
                        );
                      }),
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </CListGroup>

        {/* <CButton style={{ background: '#fff', border: '1px solid #585858', color: '#585858', borderRadius: '0', padding: '20px', fontSize: 'small', fontWeight: '700', margin: '0' }}>
          FINAL DECK STATE
        </CButton> */}
      </CSidebar>

      <AddLabwareModal
        visible={visible}
        setVisible={setVisible}
        title={stepTitle}
        stepID={stepID}
        stepIndex={stepIndex}
        handleClose={handleClose}
        showFooter={true}
      >
        {RenderStepForm(
          stepTitle,
          handleClose,
          handleDeleteStep,
          stepID,
          stepTitle,
        )}
      </AddLabwareModal>
    </>
  );
};

export default LabwareSteps;
