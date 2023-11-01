import { cilPlus, cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow } from "@coreui/react-pro"
import React, { useEffect, useState } from "react";
import { truncateText } from "src/_common/helpers";

const DECK_TOTAL_COLUMNS = 3;

const Deck = ({ handleSelectedSlot, newLabwareSelection }) => {
  const [isSelected, setIsSelected] = useState();
  const [deckSlots, setDeckSlots] = useState([]);
  const [deckGrid, setDeckGrid] = useState([]);

  // Set up Slots and select the 1st
  useEffect(() => {
    let preset = [];
    for (let i = 1; i <= 9; i++) {
      preset.push({ id: i, name: 'Slot ' + i, tube_rack: "", well_plate: "", reservoir: "", aluminium_block: "" });
    }

    let subarrayLength = DECK_TOTAL_COLUMNS;

    let subarrays = [];
    for (let i = 0; i < preset.length; i += subarrayLength) {
      subarrays.push(preset.slice(i, i + subarrayLength));
    }

    setDeckSlots([preset])
    setDeckGrid(subarrays)

    let item = preset.filter((item => item.id == 1));
    item = item[0];

    handleSelect(item)
  }, [])

  useEffect(() => {
    handleEdit()
  }, [newLabwareSelection])

  const setDefaultSelection = () => {
    let item = deckSlots[0].filter((item => item.id === 1));
    item = item[0];
    handleSelect(item)
  }

  const handleSelect = (item) => {
    setIsSelected(item.id);
    handleSelectedSlot(item)
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

    if (id === isSelected) {
      setDefaultSelection();
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
          <strong>Please select an existing slot or create new one</strong>
        </CCol>
        <CCol md={4}>
          <CButton className="standard-btn float-end" onClick={handleCreate}><CIcon size='sm' icon={cilPlus} /> CREATE SLOT</CButton>
        </CCol>
      </div>



      <table className="add-labware-table">
        <tbody>
          {React.Children.toArray(
            deckGrid?.map((rows, index) => { //iterate through row array
              return (
                <tr key={index}>
                  {React.Children.toArray(
                    rows?.map((item, index) => {
                      let labwareSelection = item.tube_rack || item.well_plate || item.reservoir || item.aluminium_block;
                      return (
                        <>
                          {/* Slot */}
                          <td key={index} style={{ maxWidth: '20px', textAlign: 'center' }} >
                            {/* <div key={item} style={{ border: '1px solid #f0f0f0', height: '50px' }}><small>{item.name}</small></div> */}

                            <CButton key={item.id}
                              onClick={() => handleSelect(item)} id={item.id}
                              className={isSelected === item.id ? 'add-labware-slot-btn btn-selected' : "add-labware-slot-btn"} >

                              <CRow>
                                <small style={{ height: '102px', display: 'grid', alignItems: 'center' }}>{truncateText(item.name, 46)}</small>
                              </CRow>
                              <CRow className={"slot-label-row"}>
                                <span style={{ fontSize: 'small' }}>{truncateText(labwareSelection, 28) || "Select labware"}</span>
                              </CRow>
                            </CButton>

                            <CButton
                              key={item.name}
                              id={item.name}
                              className='modal-action-btn'
                              variant="ghost"
                              size="sm"
                              color="danger"
                              style={{ marginTop: '30px' }}
                              onClick={() => handleDelete(item.id, item.name)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </td >
                        </>
                      )
                    })
                  )}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

    </>
  )
}

export default Deck