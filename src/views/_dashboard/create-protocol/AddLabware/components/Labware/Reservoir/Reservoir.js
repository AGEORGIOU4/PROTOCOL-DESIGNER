import { CCol, CFormSelect, CRow } from "@coreui/react-pro";
import DragSelect from "dragselect";
import { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

import './styles.css'
import { reservoirs } from "../data";

const ReservoirSelection = () => {
  const [boxes, setBoxes] = useState([]);
  const itemsRef = useRef([]);

  const [selected, setSelected] = useState(reservoirs[0])
  const [rows, setRows] = useState(reservoirs[0].rows);
  const [cols, setCols] = useState(reservoirs[0].cols);

  const handleChangeWellPlate = (e) => {
    const item = reservoirs.filter(item => item.label === e.target.value);
    setSelected(item[0])
    setRows(item[0].rows);
    setCols(item[0].cols);
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
        return <CCol key={id} className={"r_selectables"} ref={ref}></CCol>
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
      selectables: document.getElementsByClassName("r_selectables"),
      multiSelectMode: false,
      multiSelectToggling: false,
    });

    ds.subscribe("callback",// (e) => console.log(e.items)
    );

    return () => {
      ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);

  return (
    <>
      <CCol md={12}>
        <CFormSelect options={reservoirs} onChange={handleChangeWellPlate}></CFormSelect>
      </CCol>

      <br />

      <h2 style={{ userSelect: 'none' }}>{selected.name}</h2>

      <div className={"r_selectionFrame"} onMouseUp={(e) => console.log(e)}>

        <CRow className={"r_labelRow"}>
          {boxes?.map((row, index) => {
            if (index === 0) { // LABEL HEADERS 
              return (
                row?.map((col, index) => {
                  return (
                    <CCol style={{ userSelect: 'none' }}>
                      <span  >{index + 1}</span>
                    </CCol>
                  )
                })
              )
            }
          })}
        </CRow>

        <div className={rows && cols < 17 ? "r_wells_grid" : ""}>
          {boxes?.map((row, index) => {
            return (
              <>
                <CRow className={"r_rowGrid"}>
                  <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                  {row}
                </CRow>
              </>
            )
          })}
        </div>

      </div>

      <div style={{ userSelect: 'none' }}>
        <br />
        <h4><small>Click + Drag to select multiple</small></h4>
        <h4><small>Click + Ctrl to select/unselect </small></h4>
      </div>

    </>
  )
}
export default ReservoirSelection