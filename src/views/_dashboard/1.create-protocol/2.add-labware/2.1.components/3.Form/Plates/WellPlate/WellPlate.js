import "./styles.css";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { CButton, CCol, CFormTextarea, CRow, CTooltip } from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { well_plates } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";

export default function WellPlateSelection({ selectedSlot, selectedLabware, selectedLiquid, liquidVolume, handleClose }) {
  const wellPlatesRef = useRef([]);

  const [selectedWells, setSelectedWells] = useState('');
  const [selectedWellsElement, setSelectedWellsElement] = useState([]);
  const [ds, setDS] = useState(new DragSelect({ draggability: false }));

  const settings = {
    draggability: false,
    multiSelectMode: true,
    selectables: document.getElementsByClassName("wp_selectables"),
  };

  useEffect(() => {
    ds?.setSettings(settings);

    ds.subscribe('DS:end', (callback_object) => {
      if (callback_object.items) {
        // Sort selected ASC
        const strAscending = [...callback_object.items].sort((a, b) =>
          a.id > b.id ? 1 : -1,
        );
        let tmp_arr = [];
        strAscending?.map((item, index) => {
          tmp_arr.push(item.id);

        })
        setSelectedWells(tmp_arr);
        setSelectedWellsElement(strAscending)
      }
    })

    return () => ds.unsubscribe('DS:end')

  }, [ds])


  var rows = well_plates[0].rows;
  var cols = well_plates[0].cols;
  var squared = false;

  // Set Selected Labware
  const item = well_plates.filter(item => item.label === selectedLabware);

  rows = (item[0].rows);
  cols = (item[0].cols);
  squared = (item[0].squared);

  // Set Up GRID
  const elems = [];
  let row_index = 0;

  while (row_index < rows) {
    const row = Array.from({ length: cols }).map((item, col_index) => {
      const wp_ref = createRef();
      wellPlatesRef.current.push(wp_ref);
      let id = (GetLetter(row_index) + (parseInt(col_index) + 1))

      let liquid = '';
      let volume = '';

      try {
        let tmp_selected = selectedSlot.liquids.selected;
        tmp_selected?.map((selected, index) => {
          selected.wells?.map((well, index) => {
            if (well == id) {
              liquid = selected.liquid;
              volume = selected.volume;
            }
          })
        })
      } catch (e) {
        console.log(e)
      }

      return (

        <CTooltip
          style={{ display: liquid ? 'block' : 'none' }}
          id={id}
          key={id}
          content={
            <>
              <div style={{ textAlign: 'left' }}>
                <p>Liquid: {liquid}</p>
                <p>Volume: {volume}ul</p>
              </div>

            </>
          }
          placement="bottom"
        >
          <CCol key={id} id={id} className="wp_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={wp_ref}></CCol>
        </CTooltip>

      )
    })
    elems.push(row)
    row_index++;
  }

  useEffect(() => {
    let items = JSON.parse(localStorage.getItem('slots')); // Check memory
    const foundItem = items?.find(item => item.id === selectedSlot.id);
    if (foundItem) {
      foundItem.liquids.selected?.map((selections, index) => {
        let tmp_arr = selections.wells;
        let tmp_color = selections.color;
        for (let i = 0; i < tmp_arr.length; i++) {
          try {
            document.getElementById(tmp_arr[i]).style.background = tmp_color;
          } catch (e) {
          }
        }
      })
    }
  }, [])

  const handleSave = () => {
    if (selectedWellsElement.length > 0 && (!selectedLiquid || liquidVolume <= 0)) {
      alert("Please select a liquid from the list and add volume");
    } else {
      selectedWellsElement?.map((item, index) => {
        document.getElementById(item.id).style.background = selectedLiquid.color;
      })

      // 1. Get items and find specific slot
      let items = JSON.parse(localStorage.getItem('slots')); // Check memory
      let tmp_selectedSlot = items?.find(item => item.id === selectedSlot.id);

      if (tmp_selectedSlot?.liquids.selected.length > 0) { // Check 2. (Check if any selection well belongs to exisτing array)

        let selected_wells_array = tmp_selectedSlot.liquids.selected;

        selected_wells_array?.map((item, index) => {
          const filteredArray = item.wells.filter(item => !selectedWells.includes(item));
          tmp_selectedSlot.liquids.selected[index].wells = filteredArray;
        })
        tmp_selectedSlot?.liquids.selected.push({ wells: selectedWells, liquid: selectedLiquid.text, color: selectedLiquid.color, volume: liquidVolume });
      } else { // First Entry
        tmp_selectedSlot?.liquids.selected.push({ wells: selectedWells, liquid: selectedLiquid.text, color: selectedLiquid.color, volume: liquidVolume });
      }

      // 3. Find slot's index and update it on memory
      const foundIndex = items?.findIndex(item => item.id === selectedSlot.id);
      if (foundIndex !== -1) {
        items[foundIndex] = tmp_selectedSlot
        localStorage.setItem('slots', JSON.stringify(items));
      }

      handleClose();
    }
  }

  const clearAll = () => {
    let items = JSON.parse(localStorage.getItem('slots')); // Check memory
    let foundItem = items?.find(item => item.id === selectedSlot.id);
    foundItem.liquids = { selected: [] };

    const foundIndex = items?.findIndex(item => item.id === selectedSlot.id);
    if (foundIndex !== -1) {
      items[foundIndex] = foundItem
      localStorage.setItem('slots', JSON.stringify(items));
    }

    setSelectedWellsElement([]);
    setSelectedWells('');

    ds.clearSelection();

    elems?.map((items, index) => {

      try {
        items?.map((item, index) => {
          document.getElementById(item.key).style.background = '#EFEFEF';
        })
      } catch (e) {
      }
    })
  };

  return (
    <>
      <div>
        <div className="wp_selection-frame" id="area"
        // onMouseUp={(e) => console.log(e)}
        >

          {/*  LABEL HEADERS */}
          <CRow className="wp_label-row">
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  if (index === 0) {
                    return (
                      row?.map((col, index) => {
                        return (
                          <CCol className="wp_label-col">
                            <span  >{index + 1}</span>
                          </CCol>
                        )
                      })
                    )
                  }
                })
              )}
          </CRow>

          {/*  SLOTS */}
          <div className={rows && cols < 17 ? "wp_wells_grid" : ""}>
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  return (
                    <>
                      <CRow className={"wp_rowGrid"}>
                        <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                        {row}
                      </CRow>
                    </>
                  )
                })
              )}
          </div>

        </div >

        <br style={{ userSelect: 'none' }} />

        <h6 style={{ userSelect: 'none' }}>Selected: </h6>

        <CFormTextarea disabled defaultValue={selectedWells} rows={1}></CFormTextarea>

        <hr />
        <div >
          <CButton className='standard-btn float-end' disabled={selectedLiquid ? false : true} color="primary" onClick={handleSave}>
            <CIcon size="sm" icon={cilSave} /> SAVE
          </CButton>
          <CButton className='standard-btn float-end' color="primary" style={{ marginRight: '10px' }} onClick={clearAll}>
            <CIcon size="sm" icon={cilSave} /> CLEAR
          </CButton>
        </div>

        <span style={{ fontSize: '24px', marginTop: '26px', userSelect: 'none' }}><strong>{selectedLabware}</strong></span>

      </div>

    </>

  )
}

