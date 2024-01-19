import "./styles.css";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef, useReducer } from "react";
import { CButton, CCol, CFormTextarea, CRow, CTooltip } from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { tube_racks } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";

export default function TubeRackSelection({ selectedSlot, selectedLabware, selectedLiquid, liquidVolume, handleClose },) {
  const tubeRacksRef = useRef([]);

  const [selectedWells, setSelectedWells] = useState('');
  const [selectedWellsElement, setSelectedWellsElement] = useState([]);
  const [ds, setDS] = useState(new DragSelect({ draggability: false, }));

  const settings = {
    draggability: false,
    multiSelectMode: true,
    selectables: document.getElementsByClassName("tr_selectables"),
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


  var rows = tube_racks[0].rows;
  var rows2 = tube_racks[0].rows2;
  var cols = tube_racks[0].cols;
  var cols2 = tube_racks[0].cols2;
  var squared = false;

  // Set Selected Labware
  const item = tube_racks.filter(item => item.label === selectedLabware);

  rows = (item[0].rows);
  rows2 = (item[0].rows2);
  cols = (item[0].cols);
  cols2 = (item[0].cols2);
  squared = (item[0].squared);

  // Set Up GRID
  const elems = [];
  let row_index = 0;

  while (row_index < rows) {
    const row = Array.from({ length: cols }).map((item, col_index) => {
      const tr_ref = createRef();
      tubeRacksRef.current.push(tr_ref);
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
        <>
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
            <CCol key={id} id={id} className="tr_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={tr_ref}></CCol>
          </CTooltip>
        </>
      )
    })
    elems.push(row)
    row_index++;
  }

  // Set Up GRID 2
  const elems2 = [];
  let row_index2 = 0;

  while (row_index2 < rows2) {
    const row = Array.from({ length: cols2 }).map((item, col_index2) => {
      const tr_ref2 = createRef();
      tubeRacksRef.current.push(tr_ref2);
      let id = (GetLetter(row_index2) + (parseInt(col_index2) + 3))

      let liquid = '';
      let volume = '';

      let tmp_selected = selectedSlot.liquids.selected;
      tmp_selected?.map((selected, index) => {
        selected.wells?.map((well, index) => {
          if (well == id) {
            liquid = selected.liquid;
            volume = selected.volume;
          }
        })
      })

      return (
        <>

          <CTooltip
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
            <CCol key={id} id={id} className="tr_selectables tr_selectables2" style={{ borderRadius: squared ? '0' : '100%' }} ref={tr_ref2}></CCol>
          </CTooltip>

        </>
      )
    })

    elems2.push(row)
    row_index2++;


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
      <div style={{ display: selectedLabware.name != 'N/A' ? 'block' : 'none' }}>
        <div className="tr_selection-frame"
        // onMouseUp={(e) => console.log(e)}
        >

          {/*  LABEL HEADERS */}
          <CRow className="tr_label-row">
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  if (index === 0) {
                    return (
                      row?.map((col, index) => {
                        return (
                          <CCol className="tr_label-col">
                            <span  >{index + 1}</span>
                          </CCol>
                        )
                      })
                    )
                  }
                })
              )}

            {/*  LABEL HEADERS 2 */}
            {
              React.Children.toArray(
                elems2?.map((row, index) => {
                  if (index === 0) {
                    return (
                      row?.map((col, index) => {
                        return (
                          <CCol style={{ display: rows2 ? 'grid' : 'none' }} className="tr_label-col">
                            <span  >{index + 3}</span>
                          </CCol>
                        )
                      })
                    )
                  }
                })
              )}

          </CRow>

          {/*  SLOTS */}
          <CRow className={rows && cols < 17 ? "tr_wells_grid" : ""}>
            <CCol style={{ display: 'grid' }}>
              {
                React.Children.toArray(
                  elems?.map((row, index) => {

                    return (
                      <>
                        <CRow className={"tr_rowGrid"}>
                          <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '50px' }}>{GetLetter(index)}</span>
                          {row}
                        </CRow>
                      </>
                    )
                  })
                )}

            </CCol>

            <CCol style={{ display: rows2 ? 'grid' : 'none', marginLeft: '22px' }}>
              {
                React.Children.toArray(
                  elems2?.map((row, index) => {
                    return (
                      <>
                        <CRow className={"tr_rowGrid"}>
                          {row}
                          <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '0px' }}>{GetLetter(index)}</span>
                        </CRow>
                      </>
                    )
                  })
                )}
            </CCol>
          </CRow>

        </div >

        <br style={{ userSelect: 'none' }} />

        <h6 style={{ userSelect: 'none' }}>Selected: </h6>

        <CFormTextarea disabled defaultValue={selectedWells} rows={1}
        ></CFormTextarea>

        <hr />
        <div >
          <CButton className='standard-btn float-end' color="primary" onClick={handleSave}>
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
