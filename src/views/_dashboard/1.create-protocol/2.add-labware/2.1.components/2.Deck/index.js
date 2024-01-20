import { cilCopy, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CImage, CRow } from "@coreui/react-pro";
import React, { useEffect, useState } from "react";
import { truncateText } from "src/_common/helpers";
import { getSlotBtnClassName, getSlotLabwareImage } from "./helpers";
import { cidDrop } from "@coreui/icons-pro";

const DECK_TOTAL_COLUMNS = 3;

const Deck = ({ handleSelectedSlot, newLabwareSelection }) => {
  const [isSelected, setIsSelected] = useState();

  const [deckSlots1D, setDeckSlots1D] = useState([]);
  const [deckSlots2D, setDeckSlots2D] = useState([]);

  let preset = [];

  // Set up Slots and select the 1st
  useEffect(() => {
    const interval = setInterval(() => {
      let items = [];
      try {
        items = JSON.parse(localStorage.getItem("slots")); // Check memory
      } catch (e) {
        console.log(e);
      }

      if (items) {
        preset = items;
      } else {
        // Default Preset
        preset.push({
          id: 0,
          name: "+",
          labware_name: "",
          labware_type: "",
          liquids: { selected: [] },
        });
      }

      let subarrayLength = DECK_TOTAL_COLUMNS;
      let subarrays = [];
      for (let i = 0; i < preset.length; i += subarrayLength) {
        subarrays.push(preset.slice(i, i + subarrayLength));
      }
      setDeckSlots1D([preset]);
      setDeckSlots2D(subarrays);
    }, 500); // Change the interval time as needed (in milliseconds)

    // Cleanup function to clear the interval when component unmounts or on dependency change
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // On Select New Labware Event
    handleEdit();
  }, [newLabwareSelection]);

  const handleSelect = (item) => {
    if (item.id == 0) {
      handleCreate();
    } else {
      setIsSelected(item.id);
      handleSelectedSlot(item);
    }
  };

  const handleCreate = () => {
    let id = 0;
    let name = "Slot " + id;
    let labware_name = "";
    let labware_type = "";
    let liquids = { selected: [] };

    deckSlots1D?.map((row, index_row) => {
      if (index_row === deckSlots1D.length - 1) {
        row?.map((col, index_col) => {
          if (index_col === row.length - 1) {
            id = col.id + 1;
            name = "Slot " + id;
            labware_name = "";
            labware_type = "";
            liquids = { selected: [] };
            deckSlots1D[index_row].push({
              id,
              name,
              labware_name,
              labware_type,
              liquids: liquids,
            });
          }
        });
      }
    });

    let item = {
      id: id,
      name: name,
      labware_name: labware_name,
      labware_type: labware_type,
      liquids: { selected: [] },
    };

    splitBoard();

    handleSelect(item);
  };

  const handleDuplicate = (item) => {
    let id = 0;
    let name = "Slot " + id;
    let labware_name = "";
    let labware_type = "";
    let liquids = { selected: [] };

    labware_name = item.labware_name;
    labware_type = item.labware_type;
    liquids = item.liquids;

    deckSlots1D?.map((row, index_row) => {
      if (index_row === deckSlots1D.length - 1) {
        row?.map((col, index_col) => {
          if (index_col === row.length - 1) {
            id = col.id + 1;
            name = "Slot " + id;
            labware_name = labware_name;
            labware_type = labware_type;
            liquids = liquids;

            deckSlots1D[index_row].push({
              id,
              name,
              labware_name,
              labware_type,
              liquids: liquids,
            });
          }
        });
      }
    });
    splitBoard();
  };

  const handleEdit = () => {
    if (deckSlots1D.length > 0) {
      let tmp_arr = deckSlots1D;
      let index = tmp_arr[0].findIndex(
        (item) => item.id == newLabwareSelection.id,
      );
      tmp_arr[0][index] = newLabwareSelection;
      setDeckSlots1D(tmp_arr);

      splitBoard();
    }
  };

  const handleDelete = (id, name) => {
    if (confirm("Are you sure you want to delete " + name + "?")) {
      deleteSlot(id);
    }
    // PromptWithConfirm('Are you sure you want to delete ' + name + '?', 'warning', () => deleteSlot(id))
  };

  const deleteSlot = (id) => {
    const tmp_delete = [...deckSlots1D];
    tmp_delete?.map((array, index_1) => {
      array?.map((item, index_2) => {
        if (item.id === id) {
          tmp_delete[index_1].splice([index_2], 1);
          setDeckSlots1D(tmp_delete);
        }
      });
    });
    splitBoard();

    if (isSelected == id) {
      handleSelect("");
    }
  };

  const splitBoard = () => {
    let array = deckSlots1D[0];

    let subarrayLength = DECK_TOTAL_COLUMNS;

    let subarrays = [];
    for (let i = 0; i < array.length; i += subarrayLength) {
      subarrays.push(array.slice(i, i + subarrayLength));
    }

    setDeckSlots2D(subarrays);
  };

  //  LOCAL STORAGE MANAGEMENT - Update Storage
  useEffect(() => {
    try {
      if (deckSlots1D[0]) {
        localStorage.setItem("slots", JSON.stringify(deckSlots1D[0]));
      }
    } catch (e) {
      console.log(e);
    }
  }, [deckSlots2D]);

  return (
    <>
      <div
        style={{ display: "flex", alignItems: "center", margin: "10px 0 20px" }}
      >
        <CCol md={8}>
          <strong>Please create a slot and add a labware</strong>
        </CCol>
      </div>

      {React.Children.toArray(
        deckSlots2D?.map((rows, index) => {
          //iterate through row array
          return (
            <CRow key={index} style={{ margin: "20px" }}>
              {React.Children.toArray(
                rows?.map((item, index) => {
                  let labwareSelection = item.labware_name;
                  let flag = false;

                  try {
                    if (item.liquids.selected.length > 0) {
                      flag = true;
                    }
                  } catch (error) {
                    console.log(
                      "Error accessing 'address' attribute:",
                      error.message,
                    );
                  }

                  return (
                    <>
                      {/* Slot */}
                      <CCol key={index} md={4}>
                        <div
                          key={item.id}
                          style={{}}
                          onClick={(e) => handleSelect(item)}
                          id={item.id}
                          className={getSlotBtnClassName(item.id, isSelected)}
                        >
                          {flag && (
                            <CIcon
                              icon={cidDrop}
                              className="float-end"
                              size="xxl"
                              style={{
                                visibility: item.id == 0 ? "hidden" : "visible",
                                background: "rgba(0,0,0,0.7)",
                                position: "relative",
                                color: "#9013FE",
                                borderRadius: "0px 12px 0 12px",
                                margin: "2px 2px -35px 0",
                              }}
                            />
                          )}

                          <CImage
                            src={
                              "/labware/" +
                              getSlotLabwareImage(
                                item.id === 0 ? "create" : labwareSelection,
                              )
                            }
                            className="add-labware-slot-btn-img"
                          ></CImage>
                          {item.id != 0 && (
                            <div
                              style={{
                                textAlign: "end",
                                marginTop: "-35px",
                                background: "rgba(0,0,0,0.7)",
                                position: "relative",
                                borderRadius: "0 0 11px 11px",
                              }}
                            >
                              <span
                                className="float-start"
                                style={{
                                  fontSize: "small",
                                  whiteSpace: "nowrap",
                                  display: item.id == 0 ? "none" : "block",
                                  padding: "6px 10px",
                                }}
                              >
                                {truncateText(item.name, 17)}
                              </span>
                              <CButton
                                key={"d_" + item.name}
                                id={"d_" + item.name}
                                className="modal-action-btn"
                                variant="ghost"
                                size="sm"
                                color="light"
                                style={{
                                  marginTop: "5px",
                                  visibility:
                                    item.id == 0 ? "hidden" : "visible",
                                }}
                                onClick={() => handleDuplicate(item)}
                              >
                                <CIcon icon={cilCopy} />
                              </CButton>

                              <CButton
                                key={item.name}
                                id={item.name}
                                className="modal-action-btn"
                                variant="ghost"
                                size="sm"
                                color="danger"
                                style={{
                                  marginTop: "5px",
                                  visibility:
                                    item.id == 0 ? "hidden" : "visible",
                                }}
                                onClick={() => handleDelete(item.id, item.name)}
                              >
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          )}
                        </div>

                        <br />
                        <br />
                      </CCol>
                    </>
                  );
                }),
              )}
            </CRow>
          );
        }),
      )}
    </>
  );
};

export default Deck;
