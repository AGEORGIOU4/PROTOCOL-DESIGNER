import { cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
} from "@coreui/react-pro";
import { getIcons } from "../../1.Steps/helpers";
import React, { useEffect, useState } from "react";
import { AddLiquids } from "../../3.Form/helpers";
import TubeRackSelection from "./Plates/TubeRack/TubeRack";

const WellSetup = ({ selectedSlot, title = "test" }) => {
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [visible, setVisible] = useState(false);

  const [name, setName] = useState("");
  const [tubeRackSelect, setTubeRackSelect] = useState("");
  const [wellPlateSelect, setWellPlateSelect] = useState("");
  const [reservoirSelect, setReservoirSelect] = useState("");
  const [aluminiumBlockSelect, setAluminiumBlockSelect] = useState("");

  const [selectedLabwareName, setSelectedLabwareName] = useState("");
  const [selectedLabwareType, setSelectedLabwareType] = useState("");

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [liquidVolume, setLiquidVolume] = useState("");


  const handleChangeSelectedLiquid = (e, color) => {
    setSelectedLiquid(e);
  };

  const handleChangeLiquidVolume = (e) => {
    setLiquidVolume(e.target.value);
  };

  const handleChangeName = (e) => {
    let text = e.target.value;
    setName(text);

    let item = {
      id: selectedSlot.id,
      name: text,
      labware_name: selectedSlot.labware_name,
      labware_type: selectedSlot.labware_type,
      liquids: selectedSlot.liquids,
    };

    if (text.length > 0) {
      handleSubmitForm(item);
    }
  };

  const handleChangeTubeRack = (e) => {
    setTubeRackSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "tube_rack");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "tube_rack",
      liquids: selectedSlot.liquids,
    };
    handleSubmitForm(item);
  };

  const handleChangeWellPlate = (e) => {
    setWellPlateSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "well_plate");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "well_plate",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };

  const handleChangeReservoir = (e) => {
    setReservoirSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "reservoir");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "reservoir",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };

  const handleChangeAluminiumBlock = (e) => {
    setAluminiumBlockSelect(e.target.value);
    disableInputFieldsOnSelect(e.target.value, "aluminium_block");

    let item = {
      id: selectedSlot.id,
      name: name,
      labware_name: e.target.value,
      labware_type: "aluminium_block",
      liquids: selectedSlot.liquids,
    };

    handleSubmitForm(item);
  };


  return (
    <>

      {selectedSlot.labware_type == "tube_rack" &&

        <>
          <AddLiquids
            selectedLiquid={selectedLiquid}
            liquidVolume={liquidVolume}
            handleChangeSelectedLiquid={handleChangeSelectedLiquid}
            handleChangeLiquidVolume={handleChangeLiquidVolume}
          />
          <TubeRackSelection
            selectedSlot={selectedSlot}
            selectedLabware={selectedSlot?.labware_name}
            selectedLiquid={selectedLiquid}
            liquidVolume={liquidVolume}
          />
        </>
      }


    </>
  );
};
export default WellSetup;
