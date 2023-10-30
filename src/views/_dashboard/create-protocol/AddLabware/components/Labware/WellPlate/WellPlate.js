import { CCol, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import "./styles.css";
import { well_plates } from "../data";

const WellPlateSelection = ({ name }) => {
  const [boxes, setBoxes] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const itemsRef = useRef([]);

  const [selectedLabware, setSelectedLabware] = useState(well_plates[0])
  const [rows, setRows] = useState(well_plates[0].rows);
  const [cols, setCols] = useState(well_plates[0].cols);

  const [squared, setSquared] = useState(false);

  // Set Up GRID
  useEffect(() => {
    const elems = [];
    let row_index = 0;

    while (row_index < rows) {
      const row = Array.from({ length: cols }).map((item, col_index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        let id = (GetLetter(row_index) + (parseInt(col_index) + 1))

        return <CCol key={id} id={id} className="wp_selectables" style={{ borderRadius: squared ? '0' : '100%' }} ref={ref}></CCol>
      })
      elems.push(row)
      row_index++;
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

    ds.subscribe('DS:end', (callback_object) => {
      if (callback_object.items) {
        // do something with the items
        setSelectedItems(callback_object.items)
      }
    })

    return () => ds.unsubscribe('DS:end')
  }, [boxes]);

  // Set Selected Labware
  useEffect(() => {
    const item = well_plates.filter(item => item.label === name);
    setSelectedLabware(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setSquared(item[0].squared);
  }, [name])

  return (
    <>
      <div style={{ display: selectedLabware.name != 'N/A' ? 'block' : 'none' }}>
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

        <br />

        <h4>Selected: </h4>
        <table>
          <tr>
            {React.Children.toArray(
              selectedItems?.map((selected, index) => {
                return (
                  <td>{selected.id},</td>
                )
              })

            )}
          </tr>
        </table>

      </div>

    </>

  )
}
export default WellPlateSelection