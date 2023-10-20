import { CCol, CFormLabel, CFormSelect, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import "./styles.css";
import { tube_racks } from "../data";

const TubeRackSelection = ({ name }) => {
  const [boxes, setBoxes] = useState([]);
  const [boxes2, setBoxes2] = useState([]);

  const itemsRef = useRef([]);

  const [selected, setSelected] = useState(tube_racks[0])
  const [rows, setRows] = useState(tube_racks[0].rows);
  const [cols, setCols] = useState(tube_racks[0].cols);
  const [rows2, setRows2] = useState(tube_racks[0].rows2);
  const [cols2, setCols2] = useState(tube_racks[0].cols2);
  const [squared, setSquared] = useState(false);


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

  // Set Up GRID
  useEffect(() => {
    const elems = [];
    let i = 0;

    while (i < rows2) {
      const row = Array.from({ length: cols2 }).map((item, index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        const id = Math.floor(Math.random() * 1e10).toString(16);
        return <CCol key={id} className="wp_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={ref}></CCol>
      })
      elems.push(row)
      i++;
    }
    setBoxes2(elems);

  }, [rows2, cols2]);

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

    ds.subscribe("DS:end",//
      (e) => console.log(e.items)
    );

    return () => {
      ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);

  // Set Selected Labware
  useEffect(() => {
    const item = tube_racks.filter(item => item.label === name);
    setSelected(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setRows2(item[0].rows2);
    setCols2(item[0].cols2);
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

            {
              React.Children.toArray(
                boxes2?.map((row, index) => {
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

          <CRow className={rows && cols < 17 ? "wp_wells_grid" : ""}>
            <CCol md={6}>
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
            </CCol>
            <CCol md={6} className="test-col">
              {
                React.Children.toArray(
                  boxes2?.map((row, index) => {
                    return (
                      <>
                        <CRow className={"wp_rowGrid2"} style={{ display: 'flex', alignContent: 'center' }}>
                          <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                          {row}
                        </CRow>
                      </>
                    )
                  })
                )}
            </CCol>
          </CRow>

        </div >

      </div>

    </>

  )
}
export default TubeRackSelection