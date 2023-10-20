import { CCol, CFormLabel, CFormSelect, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import "./styles.css";
import { aluminium_blocks } from "../data";

const AluminiumBlockSelection = ({ name }) => {
  const [boxes, setBoxes] = useState([]);
  const itemsRef = useRef([]);

  const [selected, setSelected] = useState(aluminium_blocks[0])
  const [rows, setRows] = useState(aluminium_blocks[0].rows);
  const [cols, setCols] = useState(aluminium_blocks[0].cols);
  const [squared, setSquared] = useState(false);

  const handleChangeAluminiumBlock = (e) => {
    const item = aluminium_blocks.filter(item => item.label === e.target.value);
    setSelected(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setSquared(item[0].squared);
  }

  // Set Up GRID
  useEffect(() => {
    const elems = [];
    let i = 0;

    while (i < rows) {
      const row = Array.from({ length: cols }).map((item, index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        const id = Math.floor(Math.random() * 1e10).toString(16);
        return <CCol key={id} className="wp_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={ref}></CCol>
      })
      elems.push(row)
      i++;
    }
    setBoxes(elems);
  }, [rows, cols]);

  // Configure Drag Select
  useEffect(() => {
    const ds = new DragSelect({
      draggability: false,
      immediateDrag: false,
      selectables: document.getElementsByClassName("wp_selectables"),
      multiSelectMode: false,
      multiSelectToggling: true,
      refreshMemoryRate: 1000000000000000,

    });

    ds.subscribe("DS:end",// (e) => console.log(e.items)
    );

    return () => {
      ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);

  // Set Selected Labware
  useEffect(() => {
    const item = aluminium_blocks.filter(item => item.label === name);
    setSelected(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setSquared(item[0].squared);
  }, [name])

  return (
    <>
      {/* <CCol md={12}>
        <CFormLabel>Select Well Plate</CFormLabel>
        <CFormSelect options={aluminium_blocks} onChange={handleChangeWellPlate}></CFormSelect>
      </CCol>

      <br /> */}
      <div style={{ display: selected.name != 'N/A' ? 'block' : 'none' }}>
        {/* <h2 style={{ userSelect: 'none' }}>{selected.name}</h2> */}

        <div className="wp_selection-frame"
        // onMouseUp={(e) => console.log(e)}
        >

          <CRow className="wp_label-row">
            {
              React.Children.toArray(
                boxes?.map((row, index) => {
                  if (index === 0) { // LABEL HEADERS 
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

          <div className={rows && cols < 17 ? "wp_wells_grid" : ""}>
            {
              React.Children.toArray(
                boxes?.map((row, index) => {
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

        {/* <div style={{ userSelect: 'none' }}>
          <br />
          <h4><small>Click + Drag to select multiple</small></h4>
          <h4><small>Click + Ctrl to select/unselect </small></h4>
        </div> */}

      </div>

    </>

  )
}
export default AluminiumBlockSelection