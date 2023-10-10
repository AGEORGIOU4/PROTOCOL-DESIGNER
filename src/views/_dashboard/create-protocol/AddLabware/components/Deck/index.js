import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow } from "@coreui/react-pro"
import { useEffect, useState } from "react";
import { PromptWithConfirm } from "src/_common/alerts/swal";
const DECK_TOTAL_COLUMNS = 12;

const getSlotClassName = (id) => {

  switch (id) {
    case -1:
      return 'add-labware-slot-btn add-labware-slot-create-btn'
    default:
      return 'add-labware-slot-btn'
  }
}

const Deck = ({ handleSelectedSlot }) => {
  const [isSelected, setIsSelected] = useState(1);
  const [deckRow, setDeckRow] = useState([]);
  const [deckGrid, setDeckGrid] = useState([]);

  const createButton = -1;

  useEffect(() => {
    let preset = [
      [
        { id: createButton, name: 'Create Slot' }, { id: 1, name: 'Slot 1' }, { id: 2, name: 'Slot 2' }, { id: 3, name: 'Slot 3' },
        { id: 4, name: 'Slot 4' }, { id: 5, name: 'Slot 5' }, { id: 6, name: 'Slot 6' }, { id: 7, name: 'Slot 7' }, { id: 8, name: 'Slot 8' }, { id: 9, name: 'Slot 9' },
        { id: 10, name: 'Slot 10' }, { id: 11, name: 'Slot 11' },
      ]
    ]

    setDeckRow(preset)
    setDeckGrid(preset)
  }, [])

  const handleSelect = (id) => {
    setIsSelected(id);
    handleSelectedSlot(id)
  };

  const handleCreate = () => {
    let id = 0;
    let name = '';

    deckRow?.map((row, index_row) => {
      if (index_row === (deckRow.length - 1)) {
        row?.map((col, index_col) => {
          if (index_col === (row.length - 1)) {
            id = col.id + 1;
            name = 'Slot ' + id;
            deckRow[index_row].push({ id, name })
          }
        })
      }
    })

    splitBoard();

    handleSelect(id)
  };

  const handleDelete = (id, name) => {
    PromptWithConfirm('Are you sure you want to delete ' + name + '?', 'warning', () => deleteSlot(id))
  }

  const deleteSlot = (id) => {
    const tmp_delete = [...deckRow];
    tmp_delete?.map((array, index_1) => {
      array?.map((item, index_2) => {
        if (item.id === id) {
          tmp_delete[index_1].splice([index_2], 1)
          setDeckRow(tmp_delete)
        }
      })
    })
    splitBoard();

    handleSelect(1)
  }

  const splitBoard = () => {
    let array = deckRow[0];

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
                          onClick={() => item.id === createButton ? handleCreate() : handleSelect(item.id)} id={item.id}
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
      <br />
    </>
  )
}

export default Deck