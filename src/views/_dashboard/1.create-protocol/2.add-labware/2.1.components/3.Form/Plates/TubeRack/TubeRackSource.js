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


export default function TubeRackSource({ stepId, volumePer, selectedLabware, handleClose }) {

    const { selectedSlot, updateVolume, setSelectedSlot } = useTubeRackContext();

    const [selectedWellsElement, setSelectedWellsElement] = useState([]);

    const selectionFrameRef = useRef(null);
    const dsRef = useRef(null);


    const settings = {
        draggability: false,
        multiSelectMode: true,
        selectables: document.getElementsByClassName("tr_selectables"),
    };

    function getFoundItemFromStorage(stepId, selectedSlotId) {
        let foundItem;
        let items = JSON.parse(localStorage.getItem('tubeTransfer')) || [];

        if (items.length > 0) {
            foundItem = items.find(item => item.stepId === stepId);

            if (!foundItem) {
                // Assuming you want to create a new item based on the last item in the array
                // Deep copy the last item to avoid mutating the original object in the array
                foundItem = JSON.parse(JSON.stringify(items[items.length - 1]));
                foundItem["liquids"] = {};
                // Assuming destination is an array and checking its existence before assigning
                foundItem.liquids["selected"] = foundItem.destination && foundItem.destination.length ? foundItem.destination : undefined;
            } else {
                // Initialize liquids object for the found item
                foundItem["liquids"] = {};

                // Check the condition of the destination's length and existence of selectedSlot.liquids
                if (foundItem.destination && foundItem.destination.length <= 0) {
                    if (selectedSlot.liquids) {
                        foundItem.source = selectedSlot.liquids.selected;
                    } else {
                        foundItem.source = selectedSlot.source;
                    }
                }

                // Safely assign selectedSlot.liquids.selected if it exists
                if (selectedSlot.liquids && selectedSlot.liquids.selected) {
                    foundItem.liquids["selected"] = selectedSlot.liquids.selected;
                }
            }
        } else {
            // Fallback to fetching items from "slots" in local storage if "tubeTransfer" is empty or non-existent
            items = JSON.parse(localStorage.getItem("slots")) || [];
            foundItem = items.find(item => item.id === selectedSlotId);
        }

        return foundItem;
    }



    useEffect(() => {
        let foundItem;
        let items;

        items = JSON.parse(localStorage.getItem('tubeTransfer'));
        if (items) {
            foundItem = items.find((item) => item.stepId === stepId)
            if (!foundItem) {
                foundItem = items[items.length - 1];
                foundItem["liquids"] = {}
                foundItem.liquids["selected"] = foundItem.destination
            } else {
                foundItem["liquids"] = {}
                // if (foundItem.destination.length <= 0) foundItem.source = selectedSlot.liquids.selected
                foundItem.liquids["selected"] = foundItem.source
                setSelectedSlot(foundItem)
            }
        } else {
            items = JSON.parse(localStorage.getItem("slots"));
            foundItem = items?.find((item) => item.id === selectedSlot.id);
            const initializeTubeTransferStep = [{
                stepId: stepId,
                source: foundItem.liquids.selected,
                destination: [],
                labware_name: selectedSlot.name
            }]
            setSelectedSlot(foundItem)
            localStorage.setItem('tubeTransfer', JSON.stringify(initializeTubeTransferStep))
        }

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


    useEffect(() => {
        if (!dsRef.current) {
            dsRef.current = new DragSelect({
                ...settings,
                area: selectionFrameRef.current,
                selectables: selectionFrameRef.current.querySelectorAll('.tr_selectables')
            });

            dsRef.current.subscribe("DS:end", (callback_object) => {
                if (callback_object.items) {
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
                            }
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
            if (dsRef.current) {
                dsRef.current.unsubscribe("DS:end");
                dsRef.current.stop();
                dsRef.current = null;
            }
        };
    }, []);


    // Handle volume submission
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
        const items = JSON.parse(localStorage.getItem('tubeTransfer'));
        const foundItem = getFoundItemFromStorage(stepId, selectedSlot.id);
        if (!items.find(item => item.stepId === stepId)) {
            foundItem.source = foundItem.destination
            foundItem.destination = []
            foundItem.stepId = stepId
            foundItem.labware_name = selectedSlot.name
            const items = JSON.parse(localStorage.getItem('tubeTransfer'));
            items.push(foundItem)
            localStorage.setItem('tubeTransfer', JSON.stringify(items))
        }
        handleClose()

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
        if (foundItem.destination?.length > 0) {
            liquidContainingWell = foundItem.destination.find(destination =>
                destination.wells.some(well => (well.id && well.id === wellId) || well === wellId)
            );
        } else if (foundItem.source) {
            liquidContainingWell = foundItem.source.find(source =>
                source.wells.some(well => (well.id && well.id === wellId) || well === wellId)
            );
        } else if (Array.isArray(foundItem.liquids.selected)) { // Ensure that foundItem.liquids.selected is an array
            liquidContainingWell = foundItem.liquids.selected.find(source =>
                source.wells.some(well => (well.id && well.id === wellId) || well === wellId)
            );
        }



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

        </>
    );
}
