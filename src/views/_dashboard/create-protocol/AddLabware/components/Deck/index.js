import { cilOptions, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImage, CRow } from "@coreui/react-pro"
import React, { useEffect, useState } from "react";
import { truncateText } from "src/_common/helpers";
import { getSlotBtnClassName, getSlotLabwareImage } from "./helpers";

const DECK_TOTAL_COLUMNS = 3;

const Deck = ({ handleSelectedSlot, newLabwareSelection }) => {
  const [isSelected, setIsSelected] = useState();
  const [deckSlots, setDeckSlots] = useState([]);
  const [deckGrid, setDeckGrid] = useState([]);

  // Set up Slots and select the 1st
  useEffect(() => {
    let preset = [];
    for (let i = 0; i <= 0; i++) {

      preset.push({ id: 0, name: '+', tube_rack: "", well_plate: "", reservoir: "", aluminium_block: "" });
    }

    let subarrayLength = DECK_TOTAL_COLUMNS;

    let subarrays = [];
    for (let i = 0; i < preset.length; i += subarrayLength) {
      subarrays.push(preset.slice(i, i + subarrayLength));
    }

    setDeckSlots([preset])
    setDeckGrid(subarrays)

    /*     let item = preset.filter((item => item.id == 1));
        item = item[0];
    
        handleSelect(item) */
  }, [])

  useEffect(() => { // On Select New Labware Event
    handleEdit()

  }, [newLabwareSelection])

  const handleSelect = (item) => {
    if (item.id == 0) {
      handleCreate()
    } else {
      setIsSelected(item.id);
      handleSelectedSlot(item)
    }
  };

  const handleCreate = () => {
    let id = 0;
    let name = 'Slot ' + id;
    let tube_rack = '';
    let well_plate = '';
    let reservoir = '';
    let aluminium_block = '';

    deckSlots?.map((row, index_row) => {
      if (index_row === (deckSlots.length - 1)) {
        row?.map((col, index_col) => {
          if (index_col === (row.length - 1)) {
            id = col.id + 1;
            name = 'Slot ' + id;
            tube_rack = '';
            well_plate = '';
            reservoir = '';
            aluminium_block = '';
            deckSlots[index_row].push({ id, name, tube_rack, well_plate, reservoir, aluminium_block })
          }
        })
      }
    })

    let item = { id: id, name: name, tube_rack: tube_rack, well_plate: well_plate, reservoir: reservoir, aluminium_block: aluminium_block };

    splitBoard();

    handleSelect(item)
  };

  const handleEdit = () => {
    if (deckSlots.length > 0) {
      let tmp_arr = deckSlots;
      let index = tmp_arr[0].findIndex(item => item.id == newLabwareSelection.id);
      tmp_arr[0][index] = newLabwareSelection;
      setDeckSlots(tmp_arr)

      splitBoard();
    }
  };

  const handleDelete = (id, name) => {
    if (confirm('Are you sure you want to delete ' + name + '?')) {
      deleteSlot(id)
    }
    // PromptWithConfirm('Are you sure you want to delete ' + name + '?', 'warning', () => deleteSlot(id))
  }

  const deleteSlot = (id) => {
    const tmp_delete = [...deckSlots];
    tmp_delete?.map((array, index_1) => {
      array?.map((item, index_2) => {
        if (item.id === id) {
          tmp_delete[index_1].splice([index_2], 1)
          setDeckSlots(tmp_delete)
        }
      })
    })
    splitBoard();

    if (isSelected == id) {
      handleSelect('');
    }
  }

  const splitBoard = () => {
    let array = deckSlots[0];

    let subarrayLength = DECK_TOTAL_COLUMNS;

    let subarrays = [];
    for (let i = 0; i < array.length; i += subarrayLength) {
      subarrays.push(array.slice(i, i + subarrayLength));
    }

    setDeckGrid(subarrays)
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0 20px' }}>
        <CCol md={8}>
          <strong>Please create a slot and add a labware</strong>
        </CCol>
        {/* <CCol md={4}>
          <CButton className="standard-btn float-end" onClick={handleCreate}><CIcon size='sm' icon={cilPlus} /> CREATE SLOT</CButton>
        </CCol> */}
      </div>

      {React.Children.toArray(
        deckGrid?.map((rows, index) => { //iterate through row array
          return (
            <CRow key={index} style={{ margin: '20px' }}>
              {React.Children.toArray(
                rows?.map((item, index) => {
                  let labwareSelection = item.tube_rack || item.well_plate || item.reservoir || item.aluminium_block;
                  return (
                    <>
                      {/* Slot */}
                      <CCol key={index} md={4}>
                        <CButton key={item.id}
                          style={{}}
                          onClick={() => handleSelect(item)} id={item.id}
                          className={getSlotBtnClassName(item.id, isSelected)} >

                          <CImage src={'/labware/' + getSlotLabwareImage(item.id === 0 ? 'create' : labwareSelection)} className="add-labware-slot-btn-img">
                          </CImage>

                          {/* {item.id == 0 && <CRow>
                            <small style={{ padding: '20px', alignItems: 'center' }}>{truncateText(item.name, 46)}</small>
                          </CRow>
                          } */}

                        </CButton>

                        <>
                          <CRow className={"slot-label-row"} style={{ fontSize: 'small', display: item.id == 0 ? 'none' : 'block' }}>
                            <span style={{ fontSize: 'small', display: item.id == 0 ? 'none' : 'block' }}>{truncateText(labwareSelection, 28) || "Select Labware..."}</span>
                          </CRow>


                          <CButton
                            key={item.name}
                            id={item.name}
                            className='modal-action-btn'
                            variant="ghost"
                            size="sm"
                            color="danger"
                            style={{ marginTop: '5px', visibility: item.id == 0 ? 'hidden' : 'visible' }}
                            onClick={() => handleDelete(item.id, item.name)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </>


                      </CCol >
                    </>
                  )
                })
              )}
            </CRow>
          )
        })
      )}


    </>
  )
}

export default Deck