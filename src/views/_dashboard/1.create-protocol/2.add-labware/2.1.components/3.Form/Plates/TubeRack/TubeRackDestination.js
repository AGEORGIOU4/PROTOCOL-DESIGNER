import "./styles.css";
import DragSelect from "dragselect";
import React, {
    useRef,
    useState,
    useEffect,
} from "react";
import {
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
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
import { updateWellsForGlobalStepTracking, updateDestinationWells, updateTubeTransferVisuals } from "./helpers/utils"



export default function TubeRackDestination({ stepId, volumePer, selectedLabware, handleClose }) {
    // Utilizing context to manage and access state related to tube racks.
    const { selectedSlot, sourceSlots, setSelectedSlot } = useTubeRackContext();

    // State for tracking total selected items and whether an error popup should be shown.
    const [totalSelected, setTotalSelected] = useState([])
    const totalSelectedRef = useRef(totalSelected);

    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorPopupMessage, setErrorPopupMessage] = useState('');

    const selectionFrameRef = useRef(null);
    const dsRef = useRef(null);

    const settings = {
        draggability: false,
        multiSelectMode: true,
        selectables: document.getElementsByClassName("tr_selectables"),
    };




    function getFoundItemFromStorage(stepId) {
        let foundItem;
        let found = false
        let items = JSON.parse(localStorage.getItem('tubeTransfer'));
        if (items) {
            foundItem = items.find(item => item.stepId === stepId);
            let currentSelectedLabwareName;
            if (selectedSlot.destinationLabwareName)
                currentSelectedLabwareName = selectedSlot.destinationLabwareName
            else if (selectedSlot.sourceLabwareName)
                currentSelectedLabwareName = selectedSlot.sourceLabwareName
            else
                currentSelectedLabwareName = selectedSlot.name

            if (foundItem.sourceLabwareName === currentSelectedLabwareName) {
                foundItem.destinationLabwareName = currentSelectedLabwareName
                foundItem["liquids"] = {}
                foundItem.liquids["selected"] = foundItem.source
                foundItem.destination = foundItem.source
                found = foundItem.destination.length <= 0;

                // Update the local storage with the new items array
                localStorage.setItem('tubeTransfer', JSON.stringify(items));

                return { foundItem, found }
            } else {
                const stepsStatus = JSON.parse(localStorage.getItem('stepsStatus'))
                const currentStep = stepsStatus.findIndex(step => step.StepId === stepId)
                let stepToInheriteFrom;
                if (currentStep != -1) {
                    stepToInheriteFrom = stepsStatus[stepsStatus.length - 2]
                } else {
                    stepToInheriteFrom = currentStep
                }
                console.log(stepToInheriteFrom)

                const currentTubeTransterIndex = items.findIndex(item => item.stepId === stepId)



                foundItem = items[currentTubeTransterIndex];
                if (stepToInheriteFrom) {
                    foundItem.destinationLabwareName = currentSelectedLabwareName
                    foundItem["liquids"] = {}
                    foundItem.liquids["selected"] = stepToInheriteFrom[currentSelectedLabwareName].destinationWells
                    foundItem.destination = stepToInheriteFrom[currentSelectedLabwareName].destinationWells
                    foundItem.stepId = stepId
                    found = true
                    // Update the local storage with the new items array
                    localStorage.setItem('tubeTransfer', JSON.stringify(items));
                } else {
                    found = false
                }





                if (!found) {

                    const originalSource = JSON.parse(localStorage.getItem('slots'))
                    for (let i = originalSource.length - 1; i >= 0; i--) {
                        if (originalSource[i].name === selectedSlot.name || selectedSlot.sourceLabwareName) {
                            foundItem = originalSource[i]
                            foundItem.stepId = stepId
                            found = false
                            break
                        }
                    }
                }

                return { foundItem, found };
            }
        }
    }
    // Effect for initializing and managing the destination configuration based on localStorage data
    useEffect(() => {
        const destination = getFoundItemFromStorage(stepId).foundItem;
        // Ensuring 'tubeTransfer' is retrieved correctly
        const items = JSON.parse(localStorage.getItem('tubeTransfer')) || [];

        const currentStep = items.find(item => item.stepId === destination.stepId);

        if (currentStep.sourceLabwareName === selectedSlot.name || selectedSlot.sourceLabwareName) {
            currentStep.destination = currentStep.source
        } else {
            const stepsStatus = JSON.parse(localStorage.getItem('stepsStatus'));
            const prevStep = stepsStatus[stepsStatus.length - 1][selectedSlot.name || selectedSlot.sourceLabwareName]
            if (prevStep.destinationWells.length > 0)
                currentStep.destination = prevStep.destinationWells
            else {
                const slots = JSON.parse(localStorage.getItem("slots"))
                slots.map(slot => {
                    if (slot.name === selectedSlot.name || selectedSlot.sourceLabwareName)
                        currentStep.destination = slot.liquids.selected
                })
            }
        }
        currentStep.destinationLabwareName = selectedSlot.name || selectedSlot.sourceLabwareName
        localStorage.setItem('tubeTransfer', JSON.stringify(items));

    }, []);

    function currentWell(wellId) {
        const { foundItem } = getFoundItemFromStorage(stepId);
        const liquidsOrSource = foundItem.liquids?.selected?.length ? foundItem.liquids.selected : foundItem.destination;

        for (const liquidGroup of liquidsOrSource) {
            const foundWell = liquidGroup.wells.find(well => well === wellId || well.id === wellId);
            if (foundWell) {
                return {
                    liquid: liquidGroup.liquid,
                    volume: foundWell.volume || liquidGroup.volume
                };
            }
        }
        return null; // Or however you wish to handle not finding a well
    }


    useEffect(() => {
        debugger
        const { foundItem } = getFoundItemFromStorage(stepId);
        setSelectedSlot(foundItem);


        // Determine which array to iterate over: `foundItem.liquids.selected` or `foundItem.source`
        const liquidsOrSource = foundItem.liquids?.selected?.length ? foundItem.liquids.selected : foundItem.source;

        // Ensure that the array exists and is not empty before attempting to map over it
        if (liquidsOrSource && liquidsOrSource.length) {
            liquidsOrSource.forEach((selection) => {
                const tmp_arr = selection.wells;
                const tmp_color = selection.color;

                for (let i = 0; i < tmp_arr.length; i++) {
                    const tempWellId = typeof tmp_arr[i] === 'object' && tmp_arr[i] !== null && 'id' in tmp_arr[i] ? tmp_arr[i].id : tmp_arr[i];
                    try {
                        const wellElement = document.getElementById(tempWellId);
                        if (wellElement) {
                            wellElement.style.background = tmp_color;
                        }
                    } catch (e) {
                        // Handle any errors here, e.g., logging to console or a no-op
                    }
                }
            });
        }
    }, [stepId]); // Assuming stepId is a dependency and should trigger re-execution of useEffect when it changes


    useEffect(() => {
        if (!dsRef.current) {
            dsRef.current = new DragSelect({
                ...settings,
                area: selectionFrameRef.current,
                selectables: selectionFrameRef.current.querySelectorAll('.tr_selectables')
            });

            const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))
            if (stepStatus) {
                const currentStep = stepStatus.find(step => step.StepId === stepId)

                if (currentStep && currentStep.sourceOptions.destinationWells) {
                    const wellDetailsArray = Object.values(currentStep.sourceOptions.destinationWells);
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
                    const currentSelectionIds = callback_object.items.map(item => item.id);
                    // First, filter out any wells not in the current selection
                    let updatedTotalSelected = totalSelectedRef.current.map(group => ({
                        ...group,
                        wells: group.wells.filter(well => currentSelectionIds.includes(well.id))
                    })).filter(group => group.wells.length > 0);


                    callback_object.items.forEach(item => {
                        const wellId = item.id;
                        let matchedLiquid
                        // Check if the well is already included in the updated selection
                        if (!updatedTotalSelected.some(group =>
                            group.wells.some(well => (well.id && well.id === wellId) || (well === wellId))
                        )) {
                            const liquidsOrSource = selectedSlot.liquids?.selected?.length ? selectedSlot.liquids.selected : selectedSlot.source;
                            if (liquidsOrSource && liquidsOrSource.length) {
                                matchedLiquid = liquidsOrSource.find(liquid =>
                                    liquid.wells.some(well => (well.id && well.id === wellId) || well === wellId)
                                );

                                // Use matchedLiquid here
                                // Example: if (matchedLiquid) { /* Logic using matchedLiquid */ }
                            } else {
                                matchedLiquid = undefined
                            }
                            if (matchedLiquid) {
                                // If a matching liquid is found, proceed as before
                                const newWell = { id: wellId, volume: matchedLiquid.volume };
                                const liquidGroupIndex = updatedTotalSelected.findIndex(group =>
                                    group.liquid === matchedLiquid.liquid && group.volume === matchedLiquid.volume
                                );

                                if (liquidGroupIndex !== -1) {
                                    updatedTotalSelected[liquidGroupIndex].wells.push(newWell);
                                } else {
                                    updatedTotalSelected.push({
                                        wells: [newWell],
                                        liquid: matchedLiquid.liquid,
                                        color: matchedLiquid.color,
                                        volume: matchedLiquid.volume
                                    });
                                }
                            } else {
                                // If not found, add to a new "undefined" group
                                const newWell = { id: wellId, volume: 0 }; // Assuming you're using a fixed volume for new wells
                                const undefinedGroupIndex = updatedTotalSelected.findIndex(group => group.liquid === "");

                                if (undefinedGroupIndex !== -1) {
                                    updatedTotalSelected[undefinedGroupIndex].wells.push(newWell);
                                } else {
                                    updatedTotalSelected.push({
                                        wells: [newWell],
                                        liquid: "",
                                        color: "#000000", // black color for undefined group
                                        volume: "0"
                                    });
                                }
                            }
                        }
                    });
                    // Update the state with the new or updated selection
                    setTotalSelected(updatedTotalSelected);
                }
            });
        }
        return () => {
            if (dsRef.current) {
                dsRef.current.unsubscribe("DS:end");
                dsRef.current.stop();
                dsRef.current = null;
            }
        };
    }, []);

    // Handle volume submission
    const handleVolumeSubmit = () => {
        // Assume destinationLength is defined based on the destination wells selected
        const totalDestination = totalSelected.reduce((total, item) => {
            return total + item.wells.length;
        }, 0);

        const destinationLength = totalDestination;
        const sourceLength = Object.keys(sourceSlots).length
        let isValidSelection = false;
        // Logic to determine if the selection is valid based on your criteria
        switch (true) {
            case (sourceLength === 1 && destinationLength > 1): // One to many
            case (sourceLength > 1 && destinationLength === 1): // Many to one
            case (sourceLength === destinationLength): // Many to Many (N to N)
                isValidSelection = true;
                break;
            default:
                isValidSelection = false;
        }

        if (!isValidSelection) {
            // If the selection is invalid, show the error popup and stop further execution
            setErrorPopupMessage("Invalid selection. Selection must be 1 to many, many to 1, or N to N.");
            setShowErrorPopup(true);
            return; // Stop execution if the selection is invalid
        }

        const { foundItem, found } = getFoundItemFromStorage(stepId)

        updateDestinationWells(sourceSlots, foundItem, totalSelected, selectedSlot, stepId)
        updateTubeTransferVisuals(stepId, false)

        handleClose();
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
        const well = currentWell(wellId)

        if (well) {
            // Render the well with the tooltip using the updated data
            return (
                <CTooltip
                    key={wellId}
                    content={
                        <>
                            <div style={{ textAlign: "left" }}>
                                <p>Liquid: {well.liquid}</p>
                                <p>Volume: {well.volume}ul</p>
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

                <br style={{ userSelect: "none" }} />

                <h6 style={{ userSelect: "none" }}>Selected: </h6>




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

            {/* Error Popup */}
            <CModal visible={showErrorPopup} onClose={() => setShowErrorPopup(false)}>
                <CModalHeader>
                    <CModalTitle>Error</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {errorPopupMessage}
                </CModalBody>
            </CModal>

        </>
    );
}
