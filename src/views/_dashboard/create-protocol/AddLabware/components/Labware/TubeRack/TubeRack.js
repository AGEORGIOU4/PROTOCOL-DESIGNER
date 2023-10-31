import { CCol, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import React, { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import "./styles.css";
import { tube_racks } from "../data";

function TubeRackSelection({ name }) {
  const [boxes, setBoxes] = useState([]);
  const [boxes2, setBoxes2] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const itemsRef = useRef([]);

  const [selectedLabware, setSelectedLabware] = useState(tube_racks[0])
  const [rows, setRows] = useState(tube_racks[0].rows);
  const [cols, setCols] = useState(tube_racks[0].cols);

  const [rows2, setRows2] = useState(tube_racks[0].rows2 || '');
  const [cols2, setCols2] = useState(tube_racks[0].cols2 || '');

  // Set Up GRID
  useEffect(() => {
    const elems = [];
    let row_index = 0;

    while (row_index < rows) {
      const row = Array.from({ length: cols }).map((item, col_index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        let id = (GetLetter(row_index) + (parseInt(col_index) + 1))

        return <CCol key={id} id={id} className="tr_selectables" style={{ borderRadius: '100%' }} ref={ref}></CCol>
      })
      elems.push(row)
      row_index++;
    }
    setBoxes(elems);
  }, [rows, cols]);

  // Set Up GRID 2
  useEffect(() => {
    const elems = [];
    let row_index = 0;

    if (rows2) {
      while (row_index < rows2) {
        const row = Array.from({ length: cols2 }).map((item, col_index) => {
          const ref = createRef();
          itemsRef.current.push(ref);
          let id = (GetLetter(row_index) + (parseInt(col_index) + 3))

          return <CCol key={id} id={id} className="tr_selectables" style={{ borderRadius: '100%' }} ref={ref}></CCol>
        })
        elems.push(row)
        row_index++;
      }
      setBoxes2(elems);
    }

  }, [rows2, cols2]);

  // Configure Drag Select
  useEffect(() => {
    const ds = new DragSelect({
      draggability: false,
      immediateDrag: false,
      selectables: document.getElementsByClassName("tr_selectables"),
      multiSelectMode: false,
      multiSelectToggling: true,
      refreshMemoryRate: 1000000000000000,
    });

    ds.subscribe('DS:end', (callback_object) => {
      if (callback_object.items) {
        // do something with the items
        const strAscending = [...callback_object.items].sort((a, b) =>
          a.id > b.id ? 1 : -1,
        );
        setSelectedItems(strAscending)
      }
    })

    return () => ds.unsubscribe('DS:end')
  }, [boxes]);

  // Set Selected Labware
  useEffect(() => {
    const item = tube_racks.filter(item => item.label === name);
    setSelectedLabware(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
    setRows2(item[0].rows2);
    setCols2(item[0].cols2);
  }, [name])

  return (
    <>
      <div style={{ display: selectedLabware.name != 'N/A' ? 'block' : 'none' }}>
        {/* <h2 style={{ userSelect: 'none' }}>{selected.name}</h2> */}

        <div className="tr_selection-frame"
        // onMouseUp={(e) => console.log(e)}
        >

          <CRow className="tr_label-row">
            {
              React.Children.toArray(
                boxes?.map((row, index) => {
                  if (index === 0) { // LABEL HEADERS 
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

            {
              React.Children.toArray(
                boxes2?.map((row, index) => {
                  if (index === 0) { // LABEL HEADERS 2
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

          <CRow className={rows && cols < 17 ? "tr_wells_grid" : ""}>
            <CCol style={{ display: 'grid' }}>
              {
                React.Children.toArray(
                  boxes?.map((row, index) => {
                    return (
                      <>
                        <CRow className={"tr_rowGrid"}>
                          <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                          {row}
                        </CRow>
                      </>
                    )
                  })
                )}

            </CCol>

            <CCol style={{ display: rows2 ? 'grid' : 'none', padding: '32px' }}>
              {
                React.Children.toArray(
                  boxes2?.map((row, index) => {
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
export default TubeRackSelection