import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow } from "@coreui/react-pro"
import { useEffect, useState } from "react";
import { PromptWithConfirm } from "src/_common/alerts/swal";
const DECK_TOTAL_COLUMNS = 5;

const getSlotClassName = (id) => {

  switch (id) {
    case -1:
      return 'add-labware-slot-btn add-labware-slot-create-btn'
    default:
      return 'add-labware-slot-btn'
  }
}

const Deck = ({ handleSelectedSlot, newLabwareSelection }) => {
  const [isSelected, setIsSelected] = useState();
  const [deckSlots, setDeckSlots] = useState([]);
  const [deckGrid, setDeckGrid] = useState([]);

  const createButton = -1;

  // Set up Slots
  useEffect(() => {
    let arr = [{ id: createButton, name: 'Create Slot' }];
    for (let i = 1; i < 2; i++) {
      arr.push({ id: i, name: 'Slot ' + i, tube_rack: "", well_plate: "", reservoir: "", aluminium_block: "" });
    }

    let preset = [arr];

    setDeckSlots(preset)
    setDeckGrid(preset)

    let item = preset[0].filter((item => item.id == 1));
    item = item[0]
    handleSelect(item)
  }, [])

  const setDefaultSelection = () => {
    let item = deckSlots[0].filter((item => item.id === 1));
    item = item[0];
    handleSelect(item)
  }

  const handleSelect = (item) => {
    setIsSelected(item.id);
    handleSelectedSlot(item)
    console.log(deckSlots)
  };

  const handleEdit = () => {
    if (deckSlots.length > 0) {
      let tmp_arr = deckSlots;

      let index = tmp_arr[0].findIndex(item => item.name == newLabwareSelection.name);
      tmp_arr[0][index] = newLabwareSelection;
      setDeckSlots(tmp_arr)
    }

  };

  useEffect(() => {
    handleEdit()
  }, [newLabwareSelection])

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

  const handleDelete = (id, name) => {
    PromptWithConfirm('Are you sure you want to delete ' + name + '?', 'warning', () => deleteSlot(id))
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

      <table className="add-labware-table">
        <tbody>
          {deckGrid?.map((rows, index) => { //iterate through row array
            return (
              <tr key={index}>
                {rows?.map((item, index) => {
                  return (
                    <>
                      {/* Slot */}
                      <td key={index} style={{ maxWidth: '20px', textAlign: 'center' }} >
                        <div key={item} style={{ border: '1px solid #f0f0f0' }}><small>{item.name}</small></div>

                        <CButton key={item.id}
                          onClick={() => item.id === createButton ? handleCreate() : handleSelect(item)} id={item.id}
                          className={isSelected === item.id ? 'add-labware-slot-btn btn-selected' : getSlotClassName(item.id)} >
                          {item.id === createButton ? '+' : item.id}
                        </CButton>

                        <CButton
                          key={item.name}
                          id={item.name}
                          className='modal-action-btn'
                          variant="ghost"
                          size="sm"
                          color="danger"
                          style={{ visibility: item.id === 1 || item.id === -1 ? 'hidden' : 'initial' }}
                          onClick={() => handleDelete(item.id, item.name)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </td >
                    </>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <h6><strong>Please select an existing slot or create new one</strong></h6>
      <br />

    </>
  )
}

export default Deck