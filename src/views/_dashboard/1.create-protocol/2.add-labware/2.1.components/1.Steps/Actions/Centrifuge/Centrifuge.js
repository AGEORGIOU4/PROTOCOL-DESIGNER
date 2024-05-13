import React, { useEffect, useState } from "react";
import {
  CCol,
  CForm,
  CCard,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CMultiSelect,
  CRow,
  CButton
} from "@coreui/react-pro";
import { Notes } from "../../Components/notes";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Maximize1 } from "iconsax-react";
import { options_rpm, options_Temperature, options_LabWares } from "./data";

export const CentrifugeForm = ({ onClose, onDelete, stepId, stepTitle }) => {
  // State declarations
  const [labware_items, setLabwareItems] = useState([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [selectedLabWare, setSelectedLabWare] = useState([]);
  const [defaultHour, setDefaultHour] = useState("");
  const [defaultTemperature, setDefaultTemperature] = useState("");
  const [defaultSpeed, setDefaultSpeed] = useState("");
  const [defaultMinute, setDefaultMinute] = useState("");
  const [defaultSecond, setDefaultSecond] = useState("");
  const [selectedRPM, setSelectedRPM] = useState("RPM");
  const [isFirstSelectionRPM, setIsFirstSelectionRPM] = useState(true);
  const [isFirstSelection, setIsFirstSelection] = useState(true);
  const [selectedTemperature, setSelectedTemperature] = useState("°C");
  const [checkboxStates, setCheckboxStates] = useState({
    pauseDelay: false,
    delay: false,
  });
  const [labwarePairs, setLabwarePairs] = useState([]);

  // Handlers for various user interactions
  const handleDefaultTemperatureChange = (e) => setDefaultTemperature(e.target.value);
  const handleDefaultSpeedChange = (e) => setDefaultSpeed(e.target.value);
  const handleDefaultHourChange = (e) => setDefaultHour(e.target.value);
  const handleDefaultMinuteChange = (e) => setDefaultMinute(e.target.value);
  const handleDefaultSecondChange = (e) => setDefaultSecond(e.target.value);

  const handleLabWareChange = (selectedOptions) => {
    setSelectedLabWare(selectedOptions);

    // Create a new list of pairs without the pair(s) that included the deselected labware
    const updatedPairs = labwarePairs.filter(
      (pair) =>
        selectedOptions.find(
          (option) => option.value === pair.left.id.replace("left-", ""),
        ) &&
        selectedOptions.find(
          (option) => option.value === pair.right.id.replace("right-", ""),
        ),
    );

    // If we now have an even number of selected options, we can create new pairs
    if (selectedOptions.length % 2 === 0) {
      const newPairs = [];
      for (let i = 0; i < selectedOptions.length; i += 2) {
        newPairs.push({
          left: {
            id: `left-${selectedOptions[i].value}`,
            content: selectedOptions[i].text,
          },
          right: {
            id: `right-${selectedOptions[i + 1].value}`,
            content: selectedOptions[i + 1].text,
          },
        });
      }
      setLabwarePairs(newPairs);
    } else {
      setLabwarePairs(updatedPairs); // Update with the filtered list if the selected options are not even
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const handleOnDragEnd = (result) => {
    // Exit if dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    // Copy the current pairs state
    let newPairs = [...labwarePairs];

    // Dropped in the same list, reorder
    if (source.droppableId === destination.droppableId) {
      const items = newPairs.map((pair) =>
        source.droppableId === "leftColumn" ? pair.left : pair.right,
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      // Map back to pairs
      newPairs = newPairs.map((pair, index) => ({
        ...pair,
        [source.droppableId === "leftColumn" ? "left" : "right"]: items[index],
      }));
    } else {
      // Dropped in a different list, swap items
      const sourceItems = newPairs.map((pair) =>
        source.droppableId === "leftColumn" ? pair.left : pair.right,
      );
      const destinationItems = newPairs.map((pair) =>
        destination.droppableId === "leftColumn" ? pair.left : pair.right,
      );
      const [sourceItem] = sourceItems.splice(source.index, 1);
      const [destinationItem] = destinationItems.splice(destination.index, 1);

      // Swap the items
      sourceItems.splice(source.index, 0, destinationItem);
      destinationItems.splice(destination.index, 0, sourceItem);

      // Map back to pairs
      newPairs = newPairs.map((pair, index) => ({
        left:
          source.droppableId === "leftColumn"
            ? sourceItems[index]
            : destinationItems[index],
        right:
          source.droppableId === "rightColumn"
            ? sourceItems[index]
            : destinationItems[index],
      }));
    }

    // Update the state with the new pairs
    setLabwarePairs(newPairs);
  };

  const handleLocalClose = () => onClose();

  const handleDropdownChange = (dropdownId, event) => {
    const value = event.target.value;
    switch (dropdownId) {
      case "temperature":
        setSelectedTemperature(value);
        setIsFirstSelection(false);
        break;
      case "rpm":
        setSelectedRPM(value);
        setIsFirstSelectionRPM(false);
        break;
      default:
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Collect data for JSON export
      const formData = {
        step: stepTitle,
        parameters: {
          labware: selectedLabWare.map(option => option.value),
          time: {
            hours: defaultHour,
            minutes: defaultMinute,
            seconds: defaultSecond
          },
          rpm: selectedRPM,
          temperature: selectedTemperature,
          labwarePairs: labwarePairs.map(pair => ({
            left: pair.left.content,
            right: pair.right.content
          }))
        }
      };

      // Log JSON to console or handle it as needed
      console.log(JSON.stringify(formData, null, 2));
    }
    setValidated(true);
  };

  const handleNotesClick = () => setIsNotesOpen(true);
  const closeNotes = () => setIsNotesOpen(false);

  useEffect(() => {
    let items = [];
    try {
      items = JSON.parse(localStorage.getItem("slots")); // Check memory
    } catch (e) {
      console.log(e);
    }

    let tmp_items = [];

    try {
      if (items.length > 1) {
        items?.map((item, index) => {
          if (index > 0) {
            tmp_items.push(item);
          }
        });

        const new_items = tmp_items.map((item) => ({
          value: JSON.stringify(item),
          text: item.name,
        }));

        console.log(new_items)
        setLabwareItems(new_items);
      }
    } catch (e) {
      console.log(e)
    }

  }, []);

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CForm
            className="row g-3 needs-validaiton"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            {/* Form Header */}
            <div className="modal-header-row">
              <CCol md={7}>
                <h5 className="modal-subtitle">Centrifuge</h5>
              </CCol>
            </div>

            {/* Labware Selection */}
            <CRow>
              <CCol md={3} className="mt-4">
                <CFormLabel htmlFor="labWareInput">Labware</CFormLabel>
                <CMultiSelect
                  id="labwareSelect"
                  options={labware_items}
                  value={selectedLabWare}
                  onChange={handleLabWareChange}
                  placeholder="Select Labware"
                  required
                />
              </CCol>
            </CRow>
            {selectedLabWare.length >= 2 && (
              <CRow className="mb-4">
                <CCol md={3}>
                  <DragDropContext
                    onDragEnd={(result) => handleOnDragEnd(result, "left")}
                  >
                    <Droppable droppableId="leftColumn">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {labwarePairs.map((pair, index) => (
                            <Draggable
                              key={pair.left.id}
                              draggableId={pair.left.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <CCard
                                    className={
                                      snapshot.isDragging
                                        ? "pair-cards dragging"
                                        : "pair-cards"
                                    }
                                  >
                                    {truncateText(pair.left.content, 20)}
                                    {snapshot.isDragging && (
                                      <Maximize1
                                        style={{ marginLeft: "20px" }}
                                      />
                                    )}
                                  </CCard>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CCol>

                {/* Static 'Paired With' column for each pair */}
                <CCol md={1} style={{ textAlign: "center" }}>
                  {labwarePairs.map((pair, index) => (
                    <div
                      key={index}
                      style={{ marginTop: index === 0 ? "45px" : "65px" }}
                    >
                      Paired With
                    </div>
                  ))}
                </CCol>

                <CCol md={3}>
                  <DragDropContext
                    onDragEnd={(result) => handleOnDragEnd(result, "right")}
                  >
                    <Droppable droppableId="rightColumn">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {labwarePairs.map((pair, index) => (
                            <Draggable
                              key={pair.right.id}
                              draggableId={pair.right.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <CCard
                                    className={
                                      snapshot.isDragging
                                        ? "pair-cards dragging"
                                        : "pair-cards"
                                    }
                                  >
                                    <span>
                                      {truncateText(pair.right.content, 20)}
                                    </span>
                                    {snapshot.isDragging && (
                                      <Maximize1
                                        style={{ marginLeft: "20px" }}
                                      />
                                    )}
                                  </CCard>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CCol>
              </CRow>
            )}

            <CRow className="mt-">
              <CCol md={1}>
                <CFormLabel htmlFor="temperatureInput">Temperature</CFormLabel>
                <CFormSelect
                  id="temperatureSelect"
                  required
                  onChange={(e) => handleDropdownChange("temperature", e)}
                  value={selectedTemperature}
                >
                  {isFirstSelection && (
                    <option value="°C" disabled>
                      °C
                    </option>
                  )}
                  {options_Temperature.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={1}>
                <div style={{ height: "30px" }}></div>
                <CFormInput
                  type="number"
                  id="defaultTemperature"
                  required
                  value={defaultTemperature}
                  onChange={handleDefaultHourChange}
                  placeholder=""
                />
              </CCol>
              <CCol md={1}>
                <CFormLabel htmlFor="speedInput">Speed</CFormLabel>
                <CFormSelect
                  id="temperatureSelect"
                  required
                  onChange={(e) => handleDropdownChange("rpm", e)}
                  value={selectedRPM}
                >
                  {isFirstSelectionRPM && (
                    <option value="RPM" disabled>
                      RPM
                    </option>
                  )}
                  {options_rpm.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={1}>
                <div style={{ height: "30px" }}></div>
                <CFormInput
                  type="number"
                  id="defaultSpeed"
                  required
                  value={defaultSpeed}
                  onChange={handleDefaultHourChange}
                  placeholder=""
                />
              </CCol>
              <CCol
                md={1}
                style={{
                  minWidth: "160px",
                  marginRight: "-20px",
                  marginLeft: "30px",
                }}
              >
                <CFormLabel htmlFor="timeInput">Time</CFormLabel>
                <CFormInput
                  type="text"
                  id="defaultHour"
                  required
                  value={defaultHour}
                  onChange={handleDefaultHourChange}
                  placeholder="Default (h)"
                />
              </CCol>
              <CCol md={1} style={{ minWidth: "160px", marginRight: "-20px" }}>
                <div style={{ height: "30px" }}></div>
                <CFormInput
                  type="text"
                  id="defaultMinute"
                  required
                  value={defaultMinute}
                  onChange={handleDefaultMinuteChange}
                  placeholder="Default (m)"
                />
              </CCol>
              <CCol md={1} style={{ minWidth: "160px", marginRight: "-20px" }}>
                <div style={{ height: "30px" }}></div>
                <CFormInput
                  type="text"
                  id="defaultSecond"
                  required
                  value={defaultSecond}
                  onChange={handleDefaultSecondChange}
                  placeholder="Default (s)"
                />
              </CCol>
            </CRow>

            {/* Form Buttons */}
            <CRow className="mt-3">
              <CCol
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "50px",
                }}
              >
                <CButton
                  className="dial-btn-left"
                  onClick={() =>
                    onDelete({ target: { id: stepId, value: stepTitle } })
                  }
                >
                  Delete
                </CButton>
                <CButton className="dial-btn-left" onClick={handleNotesClick}>
                  Notes
                </CButton>
              </CCol>
              <CCol
                md={6}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "50px",
                }}
              >
                <CButton className="dial-btn-close" onClick={handleLocalClose}>
                  Close
                </CButton>
                <CButton className="dial-btn-save" type="submit">
                  Save
                </CButton>
              </CCol>
            </CRow>

            {/* Notes Component */}
            <Notes isNotesOpen={isNotesOpen} onClose={closeNotes} />
          </CForm>
        </CCol>
      </CRow>
    </>
  );
};
