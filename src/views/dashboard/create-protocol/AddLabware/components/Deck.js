import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CRow } from "@coreui/react-pro"
import { useEffect, useState } from "react";
import { PromptWithConfirm } from "src/_common/alerts/swal";
const DECK_TOTAL_COLUMNS = 8;

const Deck = ({ handleSelectedSlot }) => {
  const [isSelected, setIsSelected] = useState(1);
  const [board, setBoard] = useState([]);
  const [tmp_board, setTmpBoard] = useState([]);


  useEffect(() => {
    let preset = [
      [
        { id: 1, name: 'Slot 1' }, { id: 2, name: 'Slot 2' }, { id: 3, name: 'Slot 3' }, { id: 4, name: 'Slot 4' }, { id: 5, name: 'Slot 5' }, { id: 6, name: 'Slot 6' }, { id: 7, name: 'Slot 7' }, { id: 8, name: 'Slot 8' },
      ]
    ]

    setBoard(preset)
    setTmpBoard(preset)
  }, [])

  const handleSelect = (id) => {
    setIsSelected(id);
    handleSelectedSlot(id)
  };

  const handleCreate = () => {
    let id = 0;
    let name = '';

    tmp_board?.map((row, index_row) => {
      if (index_row === (tmp_board.length - 1)) {
        row?.map((col, index_col) => {
          if (index_col === (row.length - 1)) {
            id = col.id + 1;
            name = 'Slot ' + id;
            tmp_board[index_row].push({ id, name })
          }
        })
      }
    })

    let array = tmp_board[0];

    let subarrayLength = DECK_TOTAL_COLUMNS;

    let subarrays = [];
    for (let i = 0; i < array.length; i += subarrayLength) {
      subarrays.push(array.slice(i, i + subarrayLength));
    }

    const mirrorArray = subarrays.slice().reverse();

    setBoard(mirrorArray)

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

      <CRow >
        <CCol md={6}>
          <p color="light"><strong>*Please select an existing slot or create a new slot to add labware.</strong> </p>
        </CCol>
        <CCol md={6} style={{ textAlign: 'right', marginTop: '6px' }}>
          <CButton onClick={() => handleCreate()} className='add-labware-btn '><small>+ ADD SLOT</small></CButton>
        </CCol>
      </CRow>

      <table className="add-labware-table">
        <tbody>
          {board?.map((rows, index) => { //iterate through row array
            return (
              <>
                < tr key={index}>
                  {rows?.map((item, index) => {
                    return (
                      <>
                        {/* Slot */}
                        <td key={index} style={{ maxWidth: '20px', textAlign: 'center' }} >
                          <div style={{ background: '#797979', color: '#fff' }}><strong>{item.name}</strong></div>
                          <CButton key={item.id} onClick={() => handleSelect(item.id)} id={item.id} className={isSelected == item.id ? 'add-labware-slot-btn btn-selected' : 'add-labware-slot-btn'} >{item.id}</CButton>

                          <CButton key={item.name} id={item.name} variant="ghost" size="sm" color="danger" style={{ visibility: item.id === 1 ? 'hidden' : 'initial' }} onClick={() => handleDelete(item.id, item.name)}><CIcon icon={cilTrash} /></CButton>

                        </td >
                      </>
                    )
                  })}
                </tr>
              </>
            )
          })}
        </tbody>
      </table >
      <br />

    </>
  )
}

export default Deck