import { cilCopy, cilDrop, cilOptions, cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CImage, CRow } from "@coreui/react-pro"
import React, { useEffect, useState } from "react";
import { truncateText } from "src/_common/helpers";
import { getSlotBtnClassName, getSlotLabwareImage } from "./helpers";
import { cidDrop } from "@coreui/icons-pro";

const DECK_TOTAL_COLUMNS = 3;

const Deck = ({ handleSelectedSlot, newLabwareSelection }) => {
  const [isSelected, setIsSelected] = useState();
  const [deckSlots, setDeckSlots] = useState([]);
  const [deckGrid, setDeckGrid] = useState([]);

  let preset = [];

  // Set up Slots and select the 1st
  useEffect(() => {
    let items = []
    try {
      items = JSON.parse(localStorage.getItem('slots')); // Check memory
    } catch (e) {
      console.log(e)
    }

    if (items) {
      preset = items;
    } else {
      for (let i = 0; i <= 0; i++) {
        preset.push({ id: 0, name: '+', tube_rack: "", well_plate: "", reservoir: "", aluminium_block: "" });
      }
    }

    let subarrayLength = DECK_TOTAL_COLUMNS;
    let subarrays = [];
    for (let i = 0; i < preset.length; i += subarrayLength) {
      subarrays.push(preset.slice(i, i + subarrayLength));
    }
    setDeckSlots([preset])
    setDeckGrid(subarrays)
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

  const handleDuplicate = (item) => {
    let id = 0;
    let name = 'Slot ' + id;
    let tube_rack = '';
    let well_plate = '';
    let reservoir = '';
    let aluminium_block = '';

    tube_rack = item.tube_rack;
    well_plate = item.well_plate;
    reservoir = item.reservoir;
    aluminium_block = item.aluminium_block;


    deckSlots?.map((row, index_row) => {
      if (index_row === (deckSlots.length - 1)) {
        row?.map((col, index_col) => {
          if (index_col === (row.length - 1)) {
            id = col.id + 1;
            name = 'Slot ' + id;
            tube_rack = tube_rack;
            well_plate = well_plate;
            reservoir = reservoir;
            aluminium_block = aluminium_block;
            deckSlots[index_row].push({ id, name, tube_rack, well_plate, reservoir, aluminium_block })
          }
        })
      }
    })
    splitBoard();
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

  //  LOCAL STORAGE MANAGEMENT
  useEffect(() => {
    try {
      if (deckSlots[0]) {
        localStorage.setItem('slots', JSON.stringify(deckSlots[0]));
      }
    } catch (e) {
      console.log(e);
    }
  }, [deckGrid])

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
                        <div key={item.id}
                          style={{}}
                          onClick={(e) => handleSelect(item)} id={item.id}
                          className={getSlotBtnClassName(item.id, isSelected)} >

                          <CIcon icon={cidDrop}
                            className="float-end" size="xxl"
                            style={{
                              visibility: item.id == 0 ? 'hidden' : 'visible',
                              background: 'rgba(0,0,0,0.7)',
                              position: 'relative', color: '#9013FE',
                              borderRadius: '0px 12px 0 12px',
                              margin: '2px 2px -35px 0',
                            }}

                          />

                          <CImage src={'/labware/' + getSlotLabwareImage(item.id === 0 ? 'create' : labwareSelection)} className="add-labware-slot-btn-img">
                          </CImage>
                          {item.id != 0 &&
                            <div style={{ textAlign: 'end', marginTop: '-35px', background: 'rgba(0,0,0,0.7)', position: 'relative', borderRadius: '0 0 11px 11px' }}>
                              <span className="float-start" style={{ fontSize: 'small', whiteSpace: 'nowrap', display: item.id == 0 ? 'none' : 'block', padding: '6px 10px' }}>{truncateText(item.name, 17)}</span>
                              <CButton
                                key={'d_' + item.name}
                                id={'d_' + item.name}
                                className='modal-action-btn'
                                variant="ghost"
                                size="sm"
                                color="light"
                                style={{ marginTop: '5px', visibility: item.id == 0 ? 'hidden' : 'visible' }}
                                onClick={() => handleDuplicate(item)}>
                                <CIcon icon={cilCopy} />
                              </CButton>

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
                            </div>
                          }

                          {/* {item.id == 0 && <CRow>
                            <small style={{ padding: '20px', alignItems: 'center' }}>{truncateText(item.name, 46)}</small>
                          </CRow>
                          } */}

                        </div>

                        {/* <>
                          <CRow className={"slot-label-row"} style={{ fontSize: 'small', display: item.id == 0 ? 'none' : 'block' }}>
                            <span style={{ fontSize: 'small', display: item.id == 0 ? 'none' : 'block' }}>{truncateText(item.name, 28)}</span>
                          </CRow>
                        </> */}


                        <br />
                        <br />

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