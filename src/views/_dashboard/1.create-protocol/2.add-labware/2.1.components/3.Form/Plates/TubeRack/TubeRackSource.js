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
import { updateWellsForGlobalStepTracking } from "./helpers/utils"


export default function TubeRackSource({ stepId, volumePer, selectedLabware, handleClose }) {

    const { selectedSlot, updateVolume, setSelectedSlot, sourceSlots } = useTubeRackContext();

    const [selectedWellsElement, setSelectedWellsElement] = useState([]);

    const [submitted, setSubmitted] = useState(false);

    const selectionFrameRef = useRef(null);
    const dsRef = useRef(null);


    const settings = {
        draggability: false,
        multiSelectMode: true,
        selectables: document.getElementsByClassName("tr_selectables"),
    };


    useEffect(() => {
        let foundItem;
        let items;
        items = JSON.parse(localStorage.getItem('tubeTransfer'));
        if (items) {
            foundItem = items.find((item) => item.stepId === stepId)
            if (!foundItem) {
                const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))

                const previousStep = stepStatus[stepStatus.length - 1][selectedSlot.name || selectedSlot.sourceLabwareName]

                foundItem = {}
                foundItem["liquids"] = {}
                foundItem.liquids["selected"] = previousStep.destinationWells
                foundItem["stepId"] = stepId
                foundItem["sourceLabwareName"] = selectedSlot.name || selectedSlot.sourceLabwareName
                foundItem.source = previousStep.destinationWells
                foundItem.destination = []
                items.push(foundItem)
                localStorage.setItem('tubeTransfer', JSON.stringify(items))
                setSelectedSlot(foundItem)
            } else {
                foundItem["liquids"] = {}
                foundItem.source = foundItem.source
                foundItem.liquids["selected"] = foundItem.source
                foundItem.destination = []
                foundItem["sourceLabwareName"] = selectedSlot.name || selectedSlot.sourceLabwareName
                localStorage.setItem('tubeTransfer', JSON.stringify(items))
                setSelectedSlot(foundItem)
            }
        } else {
            items = JSON.parse(localStorage.getItem("slots"));
            foundItem = items?.find((item) => item.id === selectedSlot.id);
            const initializeTubeTransferStep = {
                stepId: stepId,
                source: foundItem.liquids.selected,
                destination: [],
                sourceLabwareName: selectedSlot.name
            }
            initializeTubeTransferStep.source = initializeTubeTransferStep.source.filter(item => item.wells.length > 0);
            const tubeArray = []
            tubeArray.push(initializeTubeTransferStep)
            setSelectedSlot(foundItem)
            localStorage.setItem('tubeTransfer', JSON.stringify(tubeArray))
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
                selectables: selectionFrameRef.current.querySelectorAll('.tr_selectables'),
            });
            const stepStatus = JSON.parse(localStorage.getItem("stepsStatus"))
            if (stepStatus) {
                const currentStep = stepStatus.find(step => step.StepId === stepId)

                if (currentStep) {
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
            if (dsRef.current) {
                dsRef.current.unsubscribe("DS:end");
                dsRef.current.stop();
                dsRef.current = null;
            }
        };
    }, []);




    useEffect(() => {
        if (submitted) {
            const stepsStatus = JSON.parse(localStorage.getItem('stepsStatus'))
            if (!stepsStatus) {
                const slots = JSON.parse(localStorage.getItem("slots"))
                const filteredSlots = slots.filter(slot => slot.name !== selectedSlot.sourceLabwareName && slot.name !== "+")

                const stepsStatusObject = filteredSlots.reduce((acc, slot) => {
                    acc[slot.name] = { sourceWells: slot.liquids.selected, destinationWells: [] };
                    return acc;
                }, {});
                stepsStatusObject[selectedSlot.sourceLabwareName] = { sourceWells: selectedSlot.source, destinationWells: [] }
                stepsStatusObject["StepId"] = stepId
                stepsStatusObject["sourceOptions"] = { sourceWells: sourceSlots, sourceTubeRack: selectedSlot.sourceLabwareName }
                stepsStatusObject[selectedSlot.sourceLabwareName].sourceWells = updateWellsForGlobalStepTracking(stepsStatusObject[selectedSlot.sourceLabwareName].sourceWells, sourceSlots, true)
                const stepStatusArr = []

                stepStatusArr.push(stepsStatusObject)
                localStorage.setItem('stepsStatus', JSON.stringify(stepStatusArr))

            } else {
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
                    currentLabware[selectedSlot.sourceLabwareName] = { sourceWells: selectedSlot.source, destinationWells: [] }
                    stepToAppend = currentLabware
                    stepsStatus.map((step) => {
                        if (step.StepId === stepId) {
                            step = currentLabware
                            step.sourceOptions = { sourceWells: sourceSlots, sourceTubeRack: selectedSlot.sourceLabwareName }
                            step[selectedSlot.sourceLabwareName].sourceWells = updateWellsForGlobalStepTracking(step[selectedSlot.sourceLabwareName].sourceWells, sourceSlots, true)
                        }
                    })
                }

                localStorage.setItem('stepsStatus', JSON.stringify(stepsStatus))

            }
            setSubmitted(false)
            handleClose()
        }
    })

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
