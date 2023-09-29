import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react-pro"
import { useEffect, useState } from "react";



const Deck = ({ handleSelectedSlot }) => {
  const [isSelected, setIsSelected] = useState(0);
  const [board, setBoard] = useState([]);

  useEffect(() => {
    let preset = [
      [
        { id: 0, name: 'Slot 0' },
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
    if (tmp_add[first_row].length === 3) {
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

  const handleDelete = (id) => {
    const tmp_delete = [...board];
    tmp_delete?.map((array, index_1) => {
      array?.map((item, index_2) => {
        if (item.id === id) {
          tmp_delete[index_1].splice(index_2, 1)
          setBoard(tmp_delete)
        }
      })
    })
    handleSelect(0)
  };

  return (
    <>
      <p><strong>Hint:</strong> Please create a new slot and add labware or select an existing slot to modify</p>

      <CButton onClick={() => handleCreate()} id={'+'} className={'add-labware-btn float-end'} >+ Add slot</CButton>

      <table className="add-labware-table">
        <tbody>
          {board?.map((rows, index) => { //iterate through row array
            return (
              < tr key={index}>
                {rows?.map((item, index) => {
                  return (
                    <>
                      {/* Slot */}
                      <td key={index} style={{ border: '8px solid #dedede', padding: '10px' }} >
                        <CButton key={item.id} onClick={() => handleSelect(item.id)} id={item.id} style={{ marginBottom: '10px' }} className={isSelected == item.id ? 'add-labware-slot-btn btn-selected' : 'add-labware-slot-btn'} >{item.id}</CButton>

                        {/* Delete */}
                        <CButton key={item.name} id={item.name} variant="ghost" style={{ width: '100%' }} color="danger" onClick={() => handleDelete(item.id)}><CIcon icon={cilTrash} /></CButton>
                      </td>
                    </>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>



    </>
  )
}

export default Deck