import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CFormLabel } from "@coreui/react-pro"
import { useEffect, useState } from "react";
import { PromptWithConfirm } from "src/_common/alerts/swal";

const DECK_TOTAL_COLUMNS = 6;

const Deck = ({ handleSelectedSlot }) => {
  const [isSelected, setIsSelected] = useState(1);
  const [board, setBoard] = useState([]);


  useEffect(() => {
    let preset = [
      [
        { id: 1, name: 'Slot 1' },
      ]
    ]

    setBoard(preset)
  }, [])

  const handleSelect = (id) => {
    setIsSelected(id);
    handleSelectedSlot(id)
  };

  const handleCreate = () => {
    const tmp_add = [...board];
    let first_row = 0;
    let last_row = 0;

    let id = 0;
    let name = '';

    // Get latest array
    tmp_add?.map((row, index) => {
      last_row = index;
    })

    // Get last num
    tmp_add[first_row].map((item, index) => {
      id = item.id + 1;
      name = 'Slot ' + id;
    })

    // Check if row is full
    if (tmp_add[first_row].length === DECK_TOTAL_COLUMNS) {
      tmp_add.unshift([]); // Add new row as first row
      last_row += 1;


      tmp_add[first_row].push({ id, name });
      setBoard(tmp_add)
    } else {
      tmp_add[first_row].push({ id, name });
      setBoard(tmp_add)
    }
    handleSelect(id)

  };

  const handleDelete = (id, name) => {
    PromptWithConfirm('Are you sure you want to delete ' + name + '?', 'warning', () => DeleteSlot(id))
  }

  const DeleteSlot = (id) => {
    const tmp_delete = [...board];
    tmp_delete?.map((array, index_1) => {
      array?.map((item, index_2) => {
        if (item.id === id) {
          tmp_delete[index_1].splice([index_2], 1)
          setBoard(tmp_delete)
        }
      })
    })
    console.log(tmp_delete)
    handleSelect(1)
  }

  return (
    <>
      <CButton onClick={() => handleCreate()} className='add-labware-btn'>+ Add slot</CButton>

      <table className="add-labware-table">
        <tbody>
          {board?.map((rows, index) => { //iterate through row array
            return (
              < tr key={index}>
                {rows?.map((item, index) => {
                  return (
                    <>
                      {/* Slot */}
                      <td key={index} style={{ border: '4px solid #dedede', textAlign: 'center' }} >
                        <CFormLabel>{item.name}</CFormLabel>
                        <CButton key={item.id} onClick={() => handleSelect(item.id)} id={item.id} className={isSelected == item.id ? 'add-labware-slot-btn btn-selected' : 'add-labware-slot-btn'} >{item.id}</CButton>

                        {/* Delete */}
                        <CButton key={item.name} id={item.name} variant="ghost" size="sm" color="danger" onClick={() => handleDelete(item.id, item.name)}><CIcon icon={cilTrash} /></CButton>
                      </td >
                    </>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table >

      <p><strong>Hint:</strong> Please create a new slot and add labware or select an existing slot to modify</p>
    </>
  )
}

export default Deck