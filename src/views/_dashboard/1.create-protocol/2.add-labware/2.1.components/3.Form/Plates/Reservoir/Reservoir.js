import "./styles.css";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { CButton, CCol, CFormTextarea, CRow } from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { reservoirs } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";


export default function ReservoirSelection({ selectedLabware, selectedLiquid, liquidVolume }) {
  const reservoirsRef = useRef([]);

  const [selectedReservoirs, setSelectedReservoirs] = useState([]);
  const [selectedItemsText, setSelectedItemsText] = useState('');
  const [ds, setDS] = useState(new DragSelect({ draggability: false }));

  const settings = {
    draggability: false,
    multiSelectMode: true,
    selectables: document.getElementsByClassName("r_selectables"),
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
        setSelectedItemsText(tmp_arr);
        setSelectedReservoirs(strAscending)

      }
    })

    return () => ds.unsubscribe('DS:end')

  }, [ds])


  var rows = reservoirs[0].rows;
  var cols = reservoirs[0].cols;
  var squared = false;

  // Set Selected Labware
  const item = reservoirs.filter(item => item.label === selectedLabware);
  console.log(selectedLabware)
  rows = (item[0].rows);
  cols = (item[0].cols);
  squared = (item[0].squared);

  // Set Up GRID
  const elems = [];
  let row_index = 0;

  while (row_index < rows) {
    const row = Array.from({ length: cols }).map((item, col_index) => {
      const r_ref = createRef();
      reservoirsRef.current.push(r_ref);
      let id = (GetLetter(row_index) + (parseInt(col_index) + 1))
      return <CCol key={id} id={id} className="r_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={r_ref}></CCol>
    })
    elems.push(row)
    row_index++;
  }

  const handleSave = () => {
    let items = (reservoirsRef.current);

    items?.map((item, index) => {
      try {
        document.getElementById(item.current.id).style.background = '#EFEFEF';
      } catch (e) {
      }
    })

    selectedReservoirs?.map((item, index) => {
      document.getElementById(item.id).style.background = selectedLiquid.color;
    })
  }

  const clearAll = () => {
    setSelectedReservoirs([]);
    setSelectedItemsText('');

    ds.clearSelection();
    let items = (reservoirsRef.current);

    items?.map((item, index) => {
      try {
        document.getElementById(item.current.id).style.background = '#EFEFEF';
      } catch (e) {
      }
    })
  };

  return (
    <>
      <div>
        <div className={"r_selectionFrame"}
        // onMouseUp={(e) => console.log(e)}
        >
          {/*  LABEL HEADERS */}
          <CRow className={"r_labelRow"}>
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  if (index === 0) {
                    return (
                      row?.map((col, index) => {
                        return (
                          <CCol className="r_label-col">
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
          <div className={rows && cols < 17 ? "r_wells_grid" : ""}>
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  return (
                    <>
                      <CRow className={"r_rowGrid"}>
                        <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                        {row}
                      </CRow>
                    </>
                  )
                })
              )}
          </div>

        </div>

        <br />

        <h6>Selected: </h6>

        <CFormTextarea disabled defaultValue={selectedItemsText} rows={1}></CFormTextarea>

        <hr />
        <div >
          <CButton className='standard-btn float-end' disabled={selectedLiquid ? false : true} color="primary" onClick={handleSave}>
            <CIcon size="sm" icon={cilSave} /> SAVE
          </CButton>
          <CButton className='standard-btn float-end' color="primary" style={{ marginRight: '10px' }} onClick={clearAll}>
            <CIcon size="sm" icon={cilSave} /> CLEAR
          </CButton>
        </div>

        <span style={{ fontSize: '24px', marginTop: '26px' }}><strong>{selectedLabware}</strong></span>

      </div>

    </>

  )
}
