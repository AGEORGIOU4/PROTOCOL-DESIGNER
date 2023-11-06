import "./styles.css";
import DragSelect from "dragselect";
import { useRef, useEffect, useState } from "react";

export default function TestPlateSelection() {
  const testPlatesRef = useRef([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const ds = new DragSelect({
    selectedClass: 'ts-selected',
    area: document.getElementsByClassName('.MyApp1'),
    selectables: document.getElementsByClassName("box"),
    draggability: false,
    multiSelectMode: true,
    multiSelectToggling: true,
    customStyles: true

  });

  useEffect(() => {
    ds.subscribe("callback", (e) => {
      console.log(e);
      // const elementosSeleccionados = Array.from(e.elements).map(
      //   (element) => element.id
      // );
      // setSelectedItems(elementosSeleccionados);
    });

    return () => {
      ds.unsubscribe();
    };
  }, []);

  let arrayOfNums = [];
  for (let i = 1; i <= 10; i++) {
    arrayOfNums.push(i);
  }

  const clearAll = () => {
    ds.clearSelection();
  };
  console.log(selectedItems);

  return (
    <>
      <div className="MyApp1">
        {arrayOfNums.map((el, i) => {
          return (
            <div
              key={i}
              className="box"
              id={i}
              ref={(el) => (testPlatesRef.current[i] = el)}
            ></div>
          );
        })}
      </div>

      <button onClick={clearAll}>Clear All</button>
    </>
  );
}
