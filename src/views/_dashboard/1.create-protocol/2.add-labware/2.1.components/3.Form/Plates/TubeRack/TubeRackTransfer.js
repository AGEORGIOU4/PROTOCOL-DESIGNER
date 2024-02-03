import "./styles.css";
import DragSelect from "dragselect";
import React, {
    useRef,
    useState,
    useEffect,
    createRef,
    useReducer,
} from "react";
import {
    CButton,
    CCol,
    CFormTextarea,
    CRow,
    CTooltip,
    CFormInput
} from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { tube_racks } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";
import { useTubeRackContext } from "src/context/TubeRackContext";


export default function TubeRackTransfer({ selectedLabware, selectedLiquid, liquidVolume, handleClose }) {


    const [selectedWells, setSelectedWells] = useState("");
    const [selectedWellsElement, setSelectedWellsElement] = useState([]);
    const [isVolumeModalOpen, setIsVolumeModalOpen] = useState(false);
    const [inputVolume, setInputVolume] = useState(0)
    const selectionFrameRef = useRef(null);
    const { selectedSlot, updateVolume } = useTubeRackContext();

    const dsRef = useRef(null);


    const settings = {
        draggability: false,
        multiSelectMode: true,
        selectables: document.getElementsByClassName("tr_selectables"),
    };


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
                        let liquidName = '';


                        // Find the liquid that contains the well with the given wellId
                        const liquidContainingWell = selectedSlot.liquids.selected.find(liquid =>
                            liquid.wells.some(well => well.id === wellId)
                        );

                        if (liquidContainingWell) {


                            // Find the specific well object to get its volume
                            const specificWell = liquidContainingWell.wells.find(well => well.id === wellId);
                            if (specificWell) {
                                volume = specificWell.volume; // Use the volume from the specific well
                                liquidName = liquidContainingWell.liquid; // Assuming liquid name is stored here
                            }
                        }


                        // If volume is greater than 0, include this well
                        if (volume > 0) {
                            filtered.push({ id: wellId, volume });
                        }

                        return filtered;
                    }, []);  // Initialize the filtered array

                    console.log(wellsFiltered);

                    if (wellsFiltered.length > 0) {
                        // Sort selected ASC
                        const strAscending = wellsFiltered.sort((a, b) => a.id > b.id ? 1 : -1);
                        let tmp_arr = strAscending.map(item => item.id);
                        setSelectedWells(tmp_arr);
                        setSelectedWellsElement(wellsFiltered);
                        setIsVolumeModalOpen(true);
                    } else {
                        // No wells with volume selected
                        setSelectedWells([]);
                        setSelectedWellsElement([]);
                        setIsVolumeModalOpen(false);
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
        const inputVolumeNumber = parseFloat(inputVolume);

        // Prepare updates array for selected wells
        const updates = selectedWellsElement.map(well => ({
            wellId: well.id,
            newVolume: Math.max(well.volume - inputVolumeNumber, 0) // Assuming you subtract the input volume
        }));

        // Call updateVolume with the updates array
        updateVolume(updates);
        console.log(selectedSlot)
        // Close the volume modal
        setIsVolumeModalOpen(false);
    };


    // Define the volume input modal
    const VolumeInputModal = () => (
        <div className="volume-modal" style={{ display: isVolumeModalOpen ? "block" : "none" }}>
            <div className="volume-content">
                <h5>Enter Volume</h5>
                <CFormInput type="number" value={inputVolume} onChange={(e) => {
                    setInputVolume(e.target.value)
                }} />
                <CButton onClick={handleVolumeSubmit}>Submit</CButton>
            </div>
        </div>
    );

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

        const liquidContainingWell = selectedSlot.liquids.selected.find(liquid =>
            liquid.wells.some(well => well.id === wellId)
        );
        if (liquidContainingWell) {
            // Find the specific well object to get its volume
            const specificWell = liquidContainingWell.wells.find(well => well.id === wellId);
            if (specificWell) {
                volume = specificWell.volume; // Use the volume from the specific well
                liquidName = liquidContainingWell.liquid; // Assuming liquid name is stored here
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


    useEffect(() => {
        let items = JSON.parse(localStorage.getItem("slots")); // Check memory
        const foundItem = items?.find((item) => item.id === selectedSlot.id);
        if (foundItem) {
            foundItem.liquids.selected?.map((selections, index) => {
                let tmp_arr = selections.wells;
                let tmp_color = selections.color;
                for (let i = 0; i < tmp_arr.length; i++) {
                    try {
                        document.getElementById(tmp_arr[i]).style.background = tmp_color;
                    } catch (e) { }
                }
            });
        }
    }, []);

    const handleSave = () => {
        selectedWellsElement?.map((item, index) => {
            document.getElementById(item.id).style.background =
                selectedLiquid.color;
        });
        // 1. Get items and find specific slot
        let items = JSON.parse(localStorage.getItem("slots")); // Check memory
        let tmp_selectedSlot = items?.find((item) => item.id === selectedSlot.id);

        if (tmp_selectedSlot?.liquids.selected.length > 0) {
            // Check 2. (Check if any selection well belongs to exisτing array)

            let selected_wells_array = tmp_selectedSlot.liquids.selected;

            selected_wells_array?.map((item, index) => {
                const filteredArray = item.wells.filter(
                    (item) => !selectedWells.includes(item),
                );
                tmp_selectedSlot.liquids.selected[index].wells = filteredArray;
            });
            tmp_selectedSlot?.liquids.selected.push({
                wells: selectedWells,
                liquid: selectedLiquid.text,
                color: selectedLiquid.color,
                volume: liquidVolume,
            });
        } else {
            // First Entry
            tmp_selectedSlot?.liquids.selected.push({
                wells: selectedWells,
                liquid: selectedLiquid.text,
                color: selectedLiquid.color,
                volume: liquidVolume,
            });
        }

        // 3. Find slot's index and update it on memory
        const foundIndex = items?.findIndex(
            (item) => item.id === selectedSlot.id,
        );
        if (foundIndex !== -1) {
            items[foundIndex] = tmp_selectedSlot;
            localStorage.setItem("slots", JSON.stringify(items));
        }

        handleClose();

    };

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

                <CFormTextarea
                    disabled
                    defaultValue={selectedWells}
                    rows={1}
                ></CFormTextarea>

                <VolumeInputModal />

                <hr />
                <div>
                    <CButton
                        className="standard-btn float-end"
                        color="primary"
                        onClick={handleSave}
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
