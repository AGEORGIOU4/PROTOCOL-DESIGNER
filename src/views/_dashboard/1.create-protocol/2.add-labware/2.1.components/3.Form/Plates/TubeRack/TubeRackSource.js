import "./styles.css";
import DragSelect from "dragselect";
import React, {
    useRef,
    useState,
    useEffect
} from "react";
import {
    CButton,
    CCol,
    CRow,
    CTooltip,
} from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { tube_racks } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";
import { useTubeRackContext } from "src/context/TubeRackContext";
import { updateWellsForGlobalStepTracking, cleanWells, updateDestinationWells, updateTubeTransferVisuals } from "./helpers/utils"
import { forEach, includes } from "lodash";

// Component for handling the source tube rack configuration and selection in the lab environment.
export default function TubeRackSource({ stepId, volumePer, selectedLabware, handleClose }) {
    // Context to manage state related to tube racks across the app
    const { selectedSlot, updateVolume, setSelectedSlot, sourceSlots } = useTubeRackContext();

    // State to manage selected wells and their details
    const [selectedWellsElement, setSelectedWellsElement] = useState([]);
    const [submitted, setSubmitted] = useState(false); // Tracks whether the current transaction has been submitted

    const selectionFrameRef = useRef(null); // Ref for the container that allows drag selection
    const dsRef = useRef(null); // Ref for the DragSelect instance

    // Settings for the DragSelect interaction
    const settings = {
        draggability: false,
        multiSelectMode: true,
        selectables: document.getElementsByClassName("tr_selectables"),
    };


    // First effect: Initialize and manage the state based on localStorage
    useEffect(() => {
        // Initialization and setup of initial states from stored data or default setups
        let foundItem;
        let items = JSON.parse(localStorage.getItem('tubeTransfer'));
        // This useEffect is used to render the display of the source

        // This use Effect is used to render the display of the source
        if (items) {
            foundItem = items.find((item) => item.stepId === stepId)
            if (!foundItem) {
                // Logic to handle a situation where no matching item is found in the storage
                const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))
                const previousStep = stepStatus[stepStatus.length - 1][selectedSlot.name || selectedSlot.sourceLabwareName]

                foundItem = {
                    liquids: { selected: previousStep.destinationWells },
                    stepId: stepId,
                    sourceLabwareName: selectedSlot.name || selectedSlot.sourceLabwareName,
                    source: cleanWells(previousStep.destinationWells),
                    destination: []
                };
                items.push(foundItem);
                localStorage.setItem('tubeTransfer', JSON.stringify(items))
                setSelectedSlot(foundItem)
            } else {
                // Updates found item with the appropriate selections based on current state
                foundItem.liquids = {};

                const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))
                if (selectedSlot.name !== foundItem.sourceLabwareName && selectedSlot.sourceLabwareName !== foundItem.sourceLabwareName) {
                    // Update logic based on current selections and storage state
                    if (stepStatus) {
                        let previousStep = stepStatus.find(step => step.StepId === stepId)
                        if (!previousStep) {
                            previousStep = stepStatus[stepStatus.length - 1]
                        }
                        const labwareOfPreviousStep = previousStep[selectedSlot.name || selectedSlot.sourceLabwareName].sourceWells

                        foundItem.liquids["selected"] = labwareOfPreviousStep
                        foundItem.source = labwareOfPreviousStep
                    } else {

                        const items = JSON.parse(localStorage.getItem("slots"));
                        const slot = items.find(item => item.name === selectedSlot.name || selectedSlot.sourceLabwareName)
                        foundItem.liquids.selected = slot.liquids.selected;
                        foundItem.source = cleanWells(slot.liquids.selected)
                    }
                }
                else {

                    foundItem.source = foundItem.source
                    foundItem.liquids.selected = foundItem.source;
                }

                // foundItem.destination = []
                foundItem["sourceLabwareName"] = selectedSlot.name || selectedSlot.sourceLabwareName
                localStorage.setItem('tubeTransfer', JSON.stringify(items))
                setSelectedSlot(foundItem)
            }
        } else {
            // Initialize new tube transfer if none exist
            items = JSON.parse(localStorage.getItem("slots"));
            foundItem = items?.find((item) => item.id === selectedSlot.id);
            const initializeTubeTransferStep = {
                stepId: stepId,
                source: cleanWells(foundItem.liquids.selected),
                destination: [],
                sourceLabwareName: selectedSlot.name
            }
            initializeTubeTransferStep.source = initializeTubeTransferStep.source.filter(item => item.wells.length > 0);
            const tubeArray = [initializeTubeTransferStep];
            setSelectedSlot(foundItem)
            localStorage.setItem('tubeTransfer', JSON.stringify(tubeArray))
        }

        // Set background color of selected wells to represent selected state visually
        if (foundItem) {
            foundItem.liquids.selected?.map((selections, index) => {
                if (selections.wells.length > 0) {
                    let tmp_arr = selections.wells;
                    let tmp_color = selections.color;
                    for (let i = 0; i < tmp_arr.length; i++) {
                        let tempWellId = typeof tmp_arr[i] === 'object' && tmp_arr[i] !== null && 'id' in tmp_arr[i] ? tmp_arr[i].id : tmp_arr[i];
                        try {
                            document.getElementById(tempWellId).style.background = tmp_color;
                        } catch (e) { }
                    }
                }
            });

        }
    }, []);

    // Second useEffect: Set up the DragSelect functionality and handle selection
    useEffect(() => {
        if (!dsRef.current) {
            dsRef.current = new DragSelect({
                ...settings,
                area: selectionFrameRef.current,
                selectables: selectionFrameRef.current.querySelectorAll('.tr_selectables'),
            });
            const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))
            if (stepStatus) {
                const currentStep = stepStatus.find(step => step.StepId === stepId)

                if (currentStep) {
                    // Identifying already selected wells from the current step's status
                    const wellDetailsArray = Object.values(currentStep.sourceOptions.sourceWells);
                    const alreadySelectedWells = wellDetailsArray.map(well => well.id);
                    const elementsToSelect = alreadySelectedWells
                        .map(id => document.getElementById(id))
                        .filter(el => el != null); // Ensure the element exists

                    if (elementsToSelect.length > 0) {
                        // Now, elementsToSelect is an array of DOM elements
                        dsRef.current.setSelection(elementsToSelect);
                    }

                }
            }
            dsRef.current.subscribe("DS:end", (callback_object) => {
                if (callback_object.items) {
                    // Handle the selection of wells after drag select operation
                    const wellsFiltered = callback_object.items.reduce((filtered, item) => {
                        const wellId = item.id;
                        let volume = 0;
                        let liquidName = ""
                        const liquidsOrSource = selectedSlot.liquids?.selected?.length ? selectedSlot.liquids.selected : selectedSlot.source;
                        const liquidContainingWell = liquidsOrSource.find(liquid =>
                            liquid.wells.some(well => (well.id && well.id === wellId) || well === wellId)
                        );
                        if (liquidContainingWell) {

                            const specificWell = liquidContainingWell.wells.find(well => (well.id && well.id === wellId) || well === wellId);
                            if (specificWell.id) {
                                volume = specificWell.volume;
                                liquidName = liquidContainingWell.liquid;
                            } else
                                if (specificWell) {
                                    volume = liquidContainingWell.volume
                                    liquidName = liquidContainingWell.liquid;
                                }
                        }
                        if (volume > 0) {
                            filtered.push({ id: wellId, volume });
                        }

                        return filtered;
                    }, []);
                    if (wellsFiltered.length > 0) {
                        // Sort selected ASC
                        setSelectedWellsElement(wellsFiltered);

                    } else {
                        // No wells with volume selected
                        setSelectedWellsElement([]);

                    }
                }
            });
        }
        return () => {
            // Clean up on component unmount
            if (dsRef.current) {
                dsRef.current.unsubscribe("DS:end");
                dsRef.current.stop();
                dsRef.current = null;
            }
        };
    }, []);



    // Third useEffect: Handle submission states and updates to step status and selections
    useEffect(() => {
        if (submitted) {
            // Process submission and update relevant states and storage
            const cleanSourceWells = selectedSlot.source.filter(source => source.wells.length > 0)
            const stepsStatus = JSON.parse(localStorage.getItem('stepsStatus'))
            if (!stepsStatus) {
                // If no stepsStatus is found, initialize from slots and create a new step status entry
                const slots = JSON.parse(localStorage.getItem("slots"))
                const filteredSlots = slots.filter(slot => slot.name !== selectedSlot.sourceLabwareName && slot.name !== "+")

                const stepsStatusObject = filteredSlots.reduce((acc, slot) => {
                    acc[slot.name] = { sourceWells: slot.liquids.selected, destinationWells: [] };
                    return acc;
                }, {});

                stepsStatusObject[selectedSlot.sourceLabwareName] = { sourceWells: cleanSourceWells, destinationWells: [] }
                stepsStatusObject["StepId"] = stepId
                stepsStatusObject["sourceOptions"] = { sourceWells: sourceSlots, sourceTubeRack: selectedSlot.sourceLabwareName }
                stepsStatusObject[selectedSlot.sourceLabwareName].sourceWells = updateWellsForGlobalStepTracking(stepsStatusObject[selectedSlot.sourceLabwareName].sourceWells, sourceSlots, true)
                const stepStatusArr = [stepsStatusObject];
                localStorage.setItem('stepsStatus', JSON.stringify(stepStatusArr))

            } else {
                // Update existing stepsStatus with current state and selections
                const currentLabware = stepsStatus.find(step => step.StepId === stepId)
                let stepToAppend;
                if (!currentLabware) {
                    const currentStepStatus = JSON.parse(JSON.stringify(stepsStatus[stepsStatus.length - 1]));
                    currentStepStatus.StepId = stepId
                    if (Object.keys(currentStepStatus).includes(selectedSlot.sourceLabwareName)) {
                        // currentStepStatus[selectedSlot.sourceLabwareName] = { sourceWells: selectedSlot.source, destinationWells: [] }
                        stepToAppend = currentStepStatus
                        stepToAppend.sourceOptions = { sourceWells: sourceSlots, sourceTubeRack: selectedSlot.sourceLabwareName }
                        stepToAppend[selectedSlot.sourceLabwareName].sourceWells = updateWellsForGlobalStepTracking(stepToAppend[selectedSlot.sourceLabwareName].sourceWells, sourceSlots, true)
                        for (const [key, value] of Object.entries(stepToAppend)) {
                            if (key !== "StepId" && key !== "sourceOptions") {
                                stepToAppend[key].destinationWells = []
                            }
                        }

                    }
                    if (stepToAppend)
                        stepsStatus.push(stepToAppend)
                } else {
                    // Update the current labware details in the stepsStatus
                    if (currentLabware[selectedSlot.sourceLabwareName].destinationWells) {
                        currentLabware[selectedSlot.sourceLabwareName].sourceWells = cleanSourceWells
                    } else {
                        currentLabware[selectedSlot.sourceLabwareName] = { sourceWells: cleanSourceWells, destinationWells: [] }
                    }

                    stepToAppend = currentLabware
                    stepsStatus.map((step) => {
                        if (step.StepId === stepId) {
                            step = currentLabware
                            if (step.sourceOptions.destinationWells) {
                                step.sourceOptions.sourceWells = sourceSlots
                                step.sourceTubeRack = selectedSlot.sourceLabwareName
                            } else {
                                step.sourceOptions = { sourceWells: sourceSlots, sourceTubeRack: selectedSlot.sourceLabwareName }
                            }

                            step[selectedSlot.sourceLabwareName].sourceWells = updateWellsForGlobalStepTracking(step[selectedSlot.sourceLabwareName].sourceWells, sourceSlots, true)
                        }
                    })
                }

                const tubeTransferItems = JSON.parse(localStorage.getItem("tubeTransfer"))
                const foundTubeTransferItems = tubeTransferItems.find(tube => tube.stepId === stepId)
                localStorage.setItem('stepsStatus', JSON.stringify(stepsStatus))
                const startingIndex = stepsStatus.findIndex(step => step.StepId === stepId)
                const destinationWellOptions = stepsStatus[startingIndex].sourceOptions.destinationWells
                if (destinationWellOptions) {
                    const matchedWells = []
                    const wellIds = Object.values(destinationWellOptions).map(well => well.id);
                    const findItemsInDestinationOfTubeTransfer = foundTubeTransferItems.destination;

                    // Process the wells to find matches and update visuals and selections accordingly
                    findItemsInDestinationOfTubeTransfer.forEach(item => {
                        const filteredWells = item.wells.filter(well => {
                            const index = wellIds.indexOf(well);
                            if (index !== -1) {
                                // Remove found well from wellIds
                                wellIds.splice(index, 1);
                                return true;
                            }
                            return false;
                        });
                        // debugger

                        // Check if filteredWells has any elements, if yes, push the entire item or just filteredWells based on your requirement
                        if (filteredWells.length > 0) {
                            const wellsObjects = filteredWells.map(wellId => ({ id: wellId, volume: item.volume }))
                            matchedWells.push({ ...item, wells: wellsObjects }); // This modifies the wells to only include matched wells
                            // If you want to keep the entire item and just know which wells matched, you could alternatively push:
                            // matchedWells.push({ ...item, matchedWells: filteredWells });
                        }
                    });
                    if (wellIds.length > 0) {
                        const wellsObjects = wellIds.map(wellId => ({ id: wellId, volume: 0 }));
                        matchedWells.push({
                            wells: wellsObjects,
                            color: "",
                            liquid: "",
                            volume: 0,
                        })
                    }

                    updateDestinationWells(sourceSlots, foundTubeTransferItems, matchedWells, foundTubeTransferItems, stepId)

                }
                // tubeTransferItems the tubeTransferForDisplay

                if (startingIndex + 1 !== stepsStatus.length) {
                    const editedTubeRack = stepsStatus[startingIndex].sourceOptions.sourceTubeRack
                    const editedTubeRackOptions = stepsStatus[startingIndex].sourceOptions
                    const tubeRacksToUpdate = []
                    for (let i = startingIndex; i < stepsStatus.length - 1; i++) {
                        const sourceTubeRack = stepsStatus[i + 1].sourceOptions.sourceTubeRack
                        const sourceWells = stepsStatus[i + 1].sourceOptions.sourceWells
                        const destinationTubeRack = stepsStatus[i + 1].sourceOptions.destinationTubeRack
                        const destinationWells = stepsStatus[i + 1].sourceOptions.destinationWells
                        debugger
                        if (sourceTubeRack === editedTubeRack) {
                            console.log("Found to edit in the source")
                            const wellKeys = Object.keys(sourceWells);
                            stepsStatus[i + 1].sourceWells = stepsStatus[i - 1].sourceWells
                            debugger
                            stepsStatus[i + 1].sourceWells.forEach(well => {
                                const newLiquid = well.liquid

                                wellKeys.forEach(key => {
                                    if (well.wells.includes(key)) {
                                        const oldLiquid = sourceWells[key].liquid

                                        if (newLiquid !== oldLiquid) {
                                            sourceWells[key].liquid = newLiquid
                                        }

                                    }

                                })

                            })

                            if (!tubeRacksToUpdate.includes(sourceTubeRack))
                                tubeRacksToUpdate.push(sourceTubeRack)

                        } else if (destinationTubeRack === editedTubeRack) {
                            console.log("Found to edit in the destination")
                        }
                    }

                    // localStorage.setItem('stepsStatus', JSON.stringify(stepsStatus))

                }

                // When Edited the source the TubeTransfer from localStorage will clear the old ones so will generate the new ones on click
                // TubeTransfer is used only for display puproses and not any data struture logic therefore is okay to removed and generated again
                // The true state is kept at the "stepsStatus"
                debugger
                updateTubeTransferVisuals(stepId, true)



            }
            setSubmitted(false)
            handleClose()
        }
    })

    // Function to handle volume submission for the selected wells
    const handleVolumeSubmit = () => {
        const inputVolumeNumber = parseFloat(volumePer);
        // Prepare updates array for selected wells
        const updates = selectedWellsElement.map(well => ({
            wellId: well.id,
            newVolume: Math.max(well.volume - inputVolumeNumber, 0),
            toTransfer: inputVolumeNumber
        }));
        // Call updateVolume with the updates array
        updateVolume(updates);
        setSubmitted(true);
    };

    var rows = tube_racks[0].rows;
    var rows2 = tube_racks[0].rows2;
    var cols = tube_racks[0].cols;
    var cols2 = tube_racks[0].cols2;
    var squared = false;

    // Set Selected Labware
    const item = tube_racks.filter((item) => item.label === selectedLabware);

    rows = item[0].rows;
    rows2 = item[0].rows2;
    cols = item[0].cols;
    cols2 = item[0].cols2;
    squared = item[0].squared;

    // Set Up GRID
    const elems = [];
    let row_index = 0;

    const renderWell = (wellId, squared) => {
        let liquidName = "";
        let volume = "";
        let liquidContainingWell;
        liquidContainingWell = selectedSlot.liquids.selected.find(source =>
            source.wells.some(well => (well.id && well.id === wellId) || well === wellId)
        );

        if (liquidContainingWell) {
            // Find the specific well object to get its volume
            const specificWell = liquidContainingWell.wells.find(well => (well.id && well.id === wellId) || well === wellId);
            if (specificWell) {
                volume = specificWell.volume || liquidContainingWell.volume;
                liquidName = liquidContainingWell.liquid;
            }
        }


        if (liquidName) {
            // Render the well with the tooltip using the updated data
            return (
                <CTooltip
                    key={wellId}
                    content={
                        <>
                            <div style={{ textAlign: "left" }}>
                                <p>Liquid: {liquidName}</p>
                                <p>Volume: {volume}ul</p>
                            </div>
                        </>
                    }
                    placement="bottom"
                >
                    <CCol
                        id={wellId}
                        className="tr_selectables"
                        style={{ borderRadius: squared ? "0" : "100%" }}
                    />
                </CTooltip>
            );
        } else {
            // Render a well without tooltip if it has no liquid
            return (
                <CCol
                    key={wellId}
                    id={wellId}
                    className="tr_selectables"
                    style={{ borderRadius: squared ? "0" : "100%" }}
                />
            );
        }
    };


    while (row_index < rows) {
        const row = Array.from({ length: cols }).map((_, col_index) => {
            const wellId = GetLetter(row_index) + (parseInt(col_index) + 1);
            return renderWell(wellId, squared);
        });
        elems.push(row);
        row_index++;
    }

    // Function to render wells with updated tooltip





    // Set Up GRID 2
    const elems2 = [];



    return (
        <>
            <div
                style={{ display: selectedLabware.name != "N/A" ? "block" : "none" }}
            >
                <div
                    ref={selectionFrameRef}
                    className="tr_selection-frame"
                // onMouseUp={(e) => console.log(e)}
                >
                    {/*  LABEL HEADERS */}
                    <CRow className="tr_label-row">
                        {React.Children.toArray(
                            elems?.map((row, index) => {
                                if (index === 0) {
                                    return row?.map((col, index) => {
                                        return (
                                            <CCol className="tr_label-col">
                                                <span>{index + 1}</span>
                                            </CCol>
                                        );
                                    });
                                }
                            }),
                        )}

                        {/*  LABEL HEADERS 2 */}
                        {React.Children.toArray(
                            elems2?.map((row, index) => {
                                if (index === 0) {
                                    return row?.map((col, index) => {
                                        return (
                                            <CCol
                                                style={{ display: rows2 ? "grid" : "none" }}
                                                className="tr_label-col"
                                            >
                                                <span>{index + 3}</span>
                                            </CCol>
                                        );
                                    });
                                }
                            }),
                        )}
                    </CRow>

                    {/*  SLOTS */}
                    <CRow className={rows && cols < 17 ? "tr_wells_grid" : ""}>
                        <CCol style={{ display: "grid" }}>
                            {React.Children.toArray(
                                elems?.map((row, index) => {
                                    return (
                                        <>
                                            <CRow className={"tr_rowGrid"} key={index}>
                                                <span
                                                    key={index}
                                                    style={{
                                                        userSelect: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "50px",
                                                    }}
                                                >
                                                    {GetLetter(index)}
                                                </span>
                                                {row}
                                            </CRow>
                                        </>
                                    );
                                }),
                            )}
                        </CCol>

                        <CCol
                            style={{ display: rows2 ? "grid" : "none", marginLeft: "22px" }}
                        >
                            {React.Children.toArray(
                                elems2?.map((row, index) => {
                                    return (
                                        <>
                                            <CRow className={"tr_rowGrid"}>
                                                {row}
                                                <span
                                                    style={{
                                                        userSelect: "none",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "0px",
                                                    }}
                                                >
                                                    {GetLetter(index)}
                                                </span>
                                            </CRow>
                                        </>
                                    );
                                }),
                            )}
                        </CCol>
                    </CRow>
                </div>


                <hr />
                <div>
                    <CButton
                        className="standard-btn float-end"
                        color="primary"
                        onClick={handleVolumeSubmit}
                    >
                        <CIcon size="sm" icon={cilSave} /> Transfer TO
                    </CButton>
                </div>

                <span
                    style={{ fontSize: "24px", marginTop: "26px", userSelect: "none" }}
                >
                    <strong>{selectedLabware}</strong>
                </span>
            </div>

        </>
    );
}
