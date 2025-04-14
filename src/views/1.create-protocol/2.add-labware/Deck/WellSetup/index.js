import React, { useState } from "react";
import { AddLiquids } from "../../Form/helpers";
import TubeRackSelection from "./Plates/TubeRack/TubeRack";

const WellSetup = ({ selectedSlot }) => {
  const [name, setName] = useState("");

  const [selectedLiquid, setSelectedLiquid] = useState("");
  const [liquidVolume, setLiquidVolume] = useState("");


  const handleChangeSelectedLiquid = (e) => { setSelectedLiquid(e); };

  const handleChangeLiquidVolume = (e) => { setLiquidVolume(e.target.value); };

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
