import React, { useRef, useState } from "react";
import chroma from "chroma-js";

import {
  CCol,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
} from "@coreui/react-pro";
import CreatableSelect from "react-select/creatable";
import { GetRandomColor } from "src/_common/helpers";


export const disableInputFieldsOnSelect = (value, action) => {
  console.log(value)
  console.log(action)
  if (value == "" && action == "") {
    document.getElementById("validationCustom01").disabled = true;
    document.getElementById("validationCustom02").disabled = true;
    document.getElementById("validationCustom03").disabled = true;
    document.getElementById("validationCustom04").disabled = true;

  } else {
    document.getElementById("validationCustom01").disabled = false;
    switch (action) {
      case "tube_rack":
        document.getElementById("validationCustom02").disabled = false;
        document.getElementById("validationCustom03").disabled = true;
        document.getElementById("validationCustom04").disabled = true;

        break;
      case "well_plate":
        document.getElementById("validationCustom02").disabled = true;
        document.getElementById("validationCustom03").disabled = false;
        document.getElementById("validationCustom04").disabled = true;

        break;
      case "reservoir":
        document.getElementById("validationCustom02").disabled = true;
        document.getElementById("validationCustom03").disabled = true;
        document.getElementById("validationCustom04").disabled = false;
        break;

      default:
        document.getElementById("validationCustom02").disabled = false;
        document.getElementById("validationCustom03").disabled = false;
        document.getElementById("validationCustom04").disabled = false;
        break;
    }
  }
};


const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",

  ":before": {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: "block",
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const colourStyles = {
  control: (styles) => ({ ...styles, backgroundColor: "white" }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color || "#fff");
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? data.color
          : isFocused
            ? color.alpha(0.1).css()
            : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled
          ? isSelected
            ? data.color
            : color.alpha(0.3).css()
          : undefined,
      },
    };
  },
  input: (styles) => ({ ...styles, ...dot() }),
  placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};


const createOption = (id, value, color) => ({
  id: id,
  value: value,
  label: value,
  text: value,
  color: color,
});

export const AddLiquids = ({
  selectedLiquid,
  handleChangeSelectedLiquid,
  liquidVolume,
  handleChangeLiquidVolume,
}) => {
  const [selectedColor, setSelectedColor] = useState(GetRandomColor());
  let items = JSON.parse(localStorage.getItem("liquids"));

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState(items);
  const [value, setValue] = useState(null);
  const volumeRef = useRef(null);

  const handleCreate = (e) => {

    setIsLoading(true);
    let initialLiquids = JSON.parse(localStorage.getItem("liquids")) || [];
    let id = Math.floor(Math.random() * 999999);
    let liquid = { id: id, value: e, label: e, text: e, color: selectedColor };
    initialLiquids.push(liquid);
    localStorage.setItem("liquids", JSON.stringify(initialLiquids));


    const currentOptions = options || [];
    console.log(currentOptions)
    setTimeout(() => {
      const newOption = createOption(id, e, selectedColor);

      // Update state
      setIsLoading(false);
      setOptions([...currentOptions, newOption]);
      setValue(newOption);
      setSelectedColor(newOption.color || "");
      handleChangeSelectedLiquid(newOption, selectedColor);
      volumeRef.current.focus();
    },
      200);
  };

  const handleSelect = (e) => {
    if (e != null) {
      setValue(e || "");
      setSelectedColor(e.color || "");
      handleChangeSelectedLiquid(e, selectedColor);
      volumeRef.current.focus();
    }
  };

  return (
    <>
      <CRow>
        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom02">Liquid Color</CFormLabel>
          <CFormInput
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value || "");
            }}
            type="color"
            style={{ width: "100%", background: "white" }}
          />
        </CCol>

        <CCol md={8}>
          <CFormLabel htmlFor="validationCustom04">
            Select liquid or create new by typing and press ENTER
          </CFormLabel>
          <CreatableSelect
            isClearable
            isDisabled={isLoading}
            isLoading={isLoading}
            onCreateOption={handleCreate}
            onChange={handleSelect}
            options={options || []}
            value={value}
            className="form-multi-select-selection-tags"
            styles={colourStyles}
          />
        </CCol>

        <CCol md={2}>
          <CFormLabel htmlFor="validationCustom03">Volume (ml)</CFormLabel>
          <CFormInput
            ref={volumeRef}
            autoComplete={"off"}
            type="number"
            id="validationCustom03"
            placeholder=""
            required
            value={liquidVolume}
            onChange={handleChangeLiquidVolume}
          />
          <CFormFeedback valid>Looks good!</CFormFeedback>
        </CCol>

      </CRow>

      <br />
    </>
  );
};
