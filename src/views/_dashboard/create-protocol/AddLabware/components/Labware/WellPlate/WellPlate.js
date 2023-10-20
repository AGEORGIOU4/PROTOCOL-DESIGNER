import { CCol, CFormLabel, CFormSelect, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import "./styles.css";
import { well_plates } from "../data";

const WellPlateSelection = ({ name }) => {
  const [boxes, setBoxes] = useState([]);
  const itemsRef = useRef([]);

  const [selected, setSelected] = useState(well_plates[0])
  const [rows, setRows] = useState(well_plates[0].rows);
  const [cols, setCols] = useState(well_plates[0].cols);
  const [squared, setSquared] = useState(false);

  const handleChangeWellPlate = (e) => {
    const item = well_plates.filter(item => item.label === e.target.value);
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

    ds.subscribe("DS:end",
      // (e) => console.log(e.items)
    );

    return () => {
      ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);


  // Set Selected Labware
  useEffect(() => {
    const item = well_plates.filter(item => item.label === name);
    setSelected(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setSquared(item[0].squared);
  }, [name])

  return (
    <>
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

      </div>

    </>

  )
}
export default WellPlateSelection