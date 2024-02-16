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



export default function TubeRackDestination({ stepId, volumePer, selectedLabware, handleClose }) {

    const { selectedSlot, updateVolume, sourceSlots } = useTubeRackContext();

    const [selectedWellsElement, setSelectedWellsElement] = useState([]);
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

    function getFoundItemFromStorage(stepId, selectedSlotId) {
        let foundItem;
        let items = JSON.parse(localStorage.getItem('tubeTransfer'));
        foundItem = items.find(item => item.stepId === stepId);
        foundItem.liquids = foundItem.liquids || {};
        if (foundItem.destination.length > 0)
            foundItem.liquids.selected = foundItem.destination;
        else
            foundItem.liquids.selected = foundItem.source;
        return foundItem;
    }


    useEffect(() => {
        const foundItem = getFoundItemFromStorage(stepId, selectedSlot)
        foundItem.liquids.selected?.map((selections, index) => {

            let tmp_arr = selections.wells;
            let tmp_color = selections.color;


            for (let i = 0; i < tmp_arr.length; i++) {
                let tempWellId = typeof tmp_arr[i] === 'object' && tmp_arr[i] !== null && 'id' in tmp_arr[i] ? tmp_arr[i].id : tmp_arr[i];
                try {
                    document.getElementById(tempWellId).style.background = tmp_color;
                } catch (e) { }
            }
        });
    }, []);


    useEffect(() => {
        totalSelectedRef.current = totalSelected;
        console.log(totalSelected)
    }, [totalSelected]);


    useEffect(() => {
        if (!dsRef.current) {
            dsRef.current = new DragSelect({
                ...settings,
                area: selectionFrameRef.current,
                selectables: selectionFrameRef.current.querySelectorAll('.tr_selectables')
            });

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
                        // Check if the well is already included in the updated selection
                        if (!updatedTotalSelected.some(group => group.wells.some(well => well.id === wellId))) {
                            let matchedLiquid = selectedSlot.liquids.selected.find(liquid =>
                                liquid.wells.some(well => well.id === wellId)
                            );

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
            case (sourceLength > 1 && destinationLength > 1): // Many to Many (N to N)
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
        let volumeToAdd
        // Continue with volume submission if the selection is valid
        for (let key in sourceSlots) {
            if (sourceSlots.hasOwnProperty(key)) {
                volumeToAdd = sourceSlots[key].volume
                break
            }
        }
        const items = JSON.parse(localStorage.getItem("tubeTransfer"))
        const itemIndex = items.findIndex(item => item.stepId === stepId);

        const foundItem = items.find(item => item.stepId === stepId);
        foundItem.liquids = foundItem.liquids || {};
        foundItem.liquids.selected = foundItem.source;
        let sourceNamesSet = new Set();

        // Collect unique liquid names from sourceSlots
        for (let key in sourceSlots) {
            sourceNamesSet.add(sourceSlots[key].liquid);
        }

        // Convert the set to a string, separated by slashes
        let sourceNames = Array.from(sourceNamesSet).join("/");

        const updatedDestinationSource = totalSelected.map(item => {
            // Split existing item liquids into an array, filter out empty strings
            let existingLiquids = item.liquid.split("/").filter(name => name);

            item.volume = Number(item.volume) + volumeToAdd
            item.wells.forEach(well => well.volume = Number(well.volume) + volumeToAdd);
            // Create a set for existing liquids to ensure uniqueness
            let liquidSet = new Set(existingLiquids);

            // Add sourceNames to the set if not already present
            sourceNames.split("/").forEach(name => {
                if (name && !liquidSet.has(name)) {
                    liquidSet.add(name);
                }
            });

            // Join the updated set of liquid names
            let updatedLiquid = Array.from(liquidSet).join("/");

            // Update the item's liquid property
            return {
                ...item,
                liquid: updatedLiquid
            };
        });

        // Assuming 'items' is your initial object and 'updatedDestinationSource' is the object with updates.

        // Step 0: Initialize 'destination' as a deep copy of 'liquids.selected' from 'source'
        items[0].destination = JSON.parse(JSON.stringify(items[0].liquids.selected));

        // Step 1: Remove the updated wells from their original groups in 'destination'
        items[0].destination.forEach(destinationItem => {
            destinationItem.wells = destinationItem.wells.filter(wellId => {
                // Check if the wellId is being updated
                const isWellUpdated = updatedDestinationSource.some(update => update.wells.some(updatedWell => typeof wellId === 'string' && wellId === updatedWell.id));
                return !isWellUpdated; // Keep the well in the original group if it's not updated
            });
        });

        // Step 2: Add the updated wells to new or existing groups in 'destination'
        updatedDestinationSource.forEach(update => {
            update.wells.forEach(updatedWell => {
                const wellId = updatedWell.id;
                const updateLiquidName = update.liquid;
                let targetGroup = items[0].destination.find(destinationItem => destinationItem.liquid === updateLiquidName);

                if (!targetGroup) {
                    targetGroup = {
                        wells: [{ id: wellId, volume: updatedWell.volume.toString() }],
                        liquid: updateLiquidName,
                        color: update.color,
                        volume: updatedWell.volume.toString()
                    };
                    items[0].destination.push(targetGroup);
                } else {

                    const existingWell = targetGroup.wells.find(w => typeof w !== 'string' && w.id === wellId);
                    if (!existingWell) {
                        targetGroup.wells.push({ id: wellId, volume: updatedWell.volume.toString() });
                        // Optionally update the group's volume if needed
                        targetGroup.volume = (parseInt(targetGroup.volume) + updatedWell.volume).toString();
                    }
                }
            });
        });

        localStorage.setItem('tubeTransfer', JSON.stringify(items));



        handleClose(); // Close the modal or take other closing actions
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
        const foundItem = getFoundItemFromStorage(stepId, selectedSlot.id);
        if (foundItem) {

            liquidContainingWell = foundItem.liquids.selected?.find(selected =>
                selected.wells.some(well =>
                    (well.id && well.id === wellId) || well === wellId
                )
            );
        }

        if (liquidContainingWell) {
            const sourceSlotWell = sourceSlots[wellId];
            // Find the specific well object to get its volume
            const specificWell = liquidContainingWell.wells.find(well => (well.id && well.id === wellId) || well === wellId);
            if (specificWell) {
                const sourceVolume = sourceSlotWell?.volume || 0;
                if (specificWell.volume)
                    volume = Number(specificWell.volume) - sourceVolume
                else
                    volume = liquidContainingWell.volume - sourceVolume
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
