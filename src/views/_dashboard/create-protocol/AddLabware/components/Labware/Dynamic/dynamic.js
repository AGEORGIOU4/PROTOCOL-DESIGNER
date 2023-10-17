import { CCol, CRow } from "@coreui/react-pro";
import "./dynamic_styles.css";
import DragSelect from "dragselect";
import { useRef, useState, useEffect, createRef } from "react";
import { GetLetter } from "src/_common/helpers";

const ROWS = 8;
const COLUMNS = 12;
const SQUARED_WELL_PLATE = false;
const WELL_PLATE_ml = 50;

const WellsSelection = () => {
  const [boxes, setBoxes] = useState([]);
  const itemsRef = useRef([]);


  // Set Up GRID
  useEffect(() => {
    const elems = [];
    let i = 0;

    while (i < ROWS) {
      const row = Array.from({ length: COLUMNS }).map((item, index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        const id = Math.floor(Math.random() * 1e10).toString(16);
        return <CCol key={id} className="selectables" style={{ borderRadius: SQUARED_WELL_PLATE ? '0' : '100%' }} ref={ref}></CCol>
      })
      elems.push(row)
      i++;
    }
    setBoxes(elems);
  }, []);

  // Configure Drag Select
  useEffect(() => {
    const ds = new DragSelect({
      draggability: false,
      immediateDrag: false,
      selectables: document.getElementsByClassName("selectables"),
      area: document.querySelector('#well-selection-area'),
      selectionThreshold: 0,
      // multiSelectMode: false,
      // multiSelectToggling: false,
      // multiSelectKeys: ['Control']

    });

    ds.subscribe("callback",
      // (e) => console.log(e.items)
    );

    return () => {
      ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);


  return (
    <>
      <h2>{ROWS * COLUMNS} Well Plate {SQUARED_WELL_PLATE ? 'Flat' : ''} {WELL_PLATE_ml}μL</h2>
      <div id='well-selection-area' className="wells-selection-frame"
      // onMouseUp={(e) => console.log(e)}
      >

        <CRow className="label-row">
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


        {boxes?.map((row, index) => {
          return (
            <>
              <CRow>
                <span style={{ userSelect: 'none', display: 'flex', alignItems: 'center', width: '40px' }}>{GetLetter(index)}</span>
                {row}
              </CRow>
            </>
          )
        })}

      </div>
    </>
  )
}
export default WellsSelection