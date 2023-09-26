import { CButton } from "@coreui/react-pro"
import { useState } from "react";

const preset = [['+', 1, 2]]
const LIMIT = 5;

const Deck = ({ handleSelectedSlot }) => {
  const [isSelected, setIsSelected] = useState(1);
  const [board, setBoard] = useState(preset);

  const handleClick = (id) => {
    if (id === '+') {
      let tmp_preset = preset;
      let last_row = 0;
      let new_id = 0;

      // Get latest array
      tmp_preset?.map((row, index) => {
        last_row = index;
      })

      // Get last num
      tmp_preset[last_row]?.map((item, index) => {
        if (!isNaN(item)) { // check if it's a number
          new_id = item + 1;
        }
      })

      // Check if row is full
      if (tmp_preset[last_row].length === 3) {
        tmp_preset.push([]); // Add new row
        last_row += 1;
        tmp_preset[last_row].push(new_id);
      } else {
        tmp_preset[last_row].push(new_id);
      }

      if (last_row === LIMIT) {
        alert('You have reached tha Maximum Limit');
      } else {
        setIsSelected('');
        setBoard(tmp_preset)
        setIsSelected(new_id)
        handleSelectedSlot(new_id)
      }
    } else {
      setIsSelected(id);
      handleSelectedSlot(id)
    }
  };

  return (
    <>
      <table className="add-labware-table">
        <tbody>
          {board?.map((rows, index) => {
            return (
              < tr key={index}>
                {rows?.map((item, index) => {
                  return (
                    <td style={{ border: '8px solid #dedede' }} onClick={() => handleClick(item)} key={index}>
                      <CButton onClick={() => handleSelectedSlot(item !== '+' ? item : '')} id={item} key={item} className={isSelected == item ? 'add-labware-btn btn-selected' : 'add-labware-btn'} >{item}</CButton>
                      <label style={{ background: '#fff', textAlign: 'center', width: '100%', padding: '10px' }}>Test</label>
                    </td>
                  )
                })
                }
              </tr>
            )
          })}
        </tbody>
      </table >
      <p><strong>Hint:</strong> Please select an available slot to add labware or occupied slot to modify existing settings</p>
    </>
  )
}

export default Deck