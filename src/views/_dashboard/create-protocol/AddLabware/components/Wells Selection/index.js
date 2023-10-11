import { CCol, CRow } from "@coreui/react-pro";
import "./styles.css";
import DragSelect from "dragselect";
import { useRef, useState, useEffect, createRef } from "react";

const ROWS = 12;
const COLUMNS = 12;

const NumberToLetter = (number) => {
  return String.fromCharCode(64 + parseInt(number, 10));
}

const WellsSelection = () => {
  const [boxes, setBoxes] = useState([]);
  const itemsRef = useRef([]);

  useEffect(() => {
    const elems = [];
    let i = 0;
    while (i < ROWS) {
      const row = Array.from({ length: COLUMNS }).map((item, index) => {
        const ref = createRef();
        itemsRef.current.push(ref);
        const id = Math.floor(Math.random() * 1e10).toString(16);
        return <div key={id} className="box" ref={ref}></div>
      })

      elems.push(row)

      i++;
    }
    setBoxes(elems);

  }, []);

  useEffect(() => {
    const ds = new DragSelect({
      selectables: document.getElementsByClassName("box"),
      area: document.querySelector('#well-selection-area'),
      draggability: false,

    });

    ds.subscribe("callback",
      // (e) => console.log(e.items)
    );

    return () => {
      // ds.unsubscribe();
    };
  }, [boxes]);

  // console.log(itemsRef);


  return (
    <>
      <div id='well-selection-area' className="wells-selection"
      // onMouseUp={(e) => console.log(e)}
      >



        <CRow className="label-row">
          {boxes?.map((row, index) => {
            console.log(row)
            if (index === 0) {
              return (
                row?.map((col, index) => {
                  return (
                    <CCol className="label-col">
                      <span className="box" style={{ border: 'none' }}>{index + 1}</span>
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
              <CRow className="well-row">
                <span style={{ userSelect: 'none', width: 'auto', display: 'flex', alignItems: 'center', width: '50px' }}>{NumberToLetter(index + 1)}</span>
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