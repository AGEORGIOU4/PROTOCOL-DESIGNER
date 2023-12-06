import "./styles.css";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { CButton, CCol, CFormTextarea, CRow } from "@coreui/react-pro";
import { GetLetter } from "src/_common/helpers";
import { aluminium_blocks } from "../data";
import CIcon from "@coreui/icons-react";
import { cilSave } from "@coreui/icons";

export default function AluminiumBlockSelection({ selectedLabware, selectedLiquid, liquidVolume }) {
  const aluminiumBlocksRef = useRef([]);

  const [selectedAluminiumBlocks, setSelectedAluminiumBlocks] = useState([]);
  const [selectedItemsText, setSelectedItemsText] = useState('');
  const [ds, setDS] = useState(new DragSelect({ draggability: false }));

  const settings = {
    draggability: false,
    multiSelectMode: true,
    selectables: document.getElementsByClassName("ab_selectables"),
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
        setSelectedAluminiumBlocks(strAscending)
      }
    })

    return () => ds.unsubscribe('DS:end')

  }, [ds])

  var rows = aluminium_blocks[0].rows;
  var cols = aluminium_blocks[0].cols;
  var squared = false;

  // Set Selected Labware
  const item = aluminium_blocks.filter(item => item.label === selectedLabware);

  rows = (item[0].rows);
  cols = (item[0].cols);
  squared = (item[0].squared);

  // Set Up GRID
  const elems = [];
  let row_index = 0;

  while (row_index < rows) {
    const row = Array.from({ length: cols }).map((item, col_index) => {
      const ab_ref = createRef();
      aluminiumBlocksRef.current.push(ab_ref);
      let id = (GetLetter(row_index) + (parseInt(col_index) + 1))
      return <CCol key={id} id={id} className="ab_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={ab_ref}></CCol>
    })
    elems.push(row)
    row_index++;
  }

  const handleSave = () => {
    let items = (aluminiumBlocksRef.current);

    items?.map((item, index) => {
      try {
        document.getElementById(item.current.id).style.background = '#EFEFEF';
      } catch (e) {
      }
    })

    selectedAluminiumBlocks?.map((item, index) => {
      document.getElementById(item.id).style.background = selectedLiquid.color;
    })
  }

  const clearAll = () => {
    setSelectedAluminiumBlocks([]);
    setSelectedItemsText('');

    ds.clearSelection();
    let items = (aluminiumBlocksRef.current);

    items?.map((item, index) => {
      try {
        document.getElementById(item.current.id).style.background = '#EFEFEF';
      } catch (e) {
      }
    })
  };

  return (
    <>
      <div style={{ display: selectedLabware.name != 'N/A' ? 'block' : 'none' }}>
        <div className="ab_selection-frame"
        // onMouseUp={(e) => console.log(e)}
        >

          {/*  LABEL HEADERS */}
          <CRow className="ab_label-row">
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  if (index === 0) {
                    return (
                      row?.map((col, index) => {
                        return (
                          <CCol className="ab_label-col">
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
          <div className={rows && cols < 17 ? "ab_wells_grid" : ""}>
            {
              React.Children.toArray(
                elems?.map((row, index) => {
                  return (
                    <>
                      <CRow className={"ab_rowGrid"}>
                        <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                        {row}
                      </CRow>
                    </>
                  )
                })
              )}
          </div>

        </div >

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

