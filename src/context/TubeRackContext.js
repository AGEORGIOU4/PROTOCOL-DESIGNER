import React, { createContext, useContext, useState } from 'react';

const TubeRackContext = createContext();

export const useTubeRackContext = () => useContext(TubeRackContext);

export const TubeRackProvider = ({ children }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const updateVolume = (updates) => {
        if (!selectedSlot) return;

        let updatedSlot = { ...selectedSlot };
        updates.forEach(({ wellId, newVolume }) => {
            updatedSlot.liquids.selected.forEach(liquid => {
                const well = liquid.wells.find(well => well.id === wellId);
                if (well) {
                    debugger
                    well.volume = newVolume;
                }
            });
        });
        debugger
        setSelectedSlot(updatedSlot);
    };




    return (
        <TubeRackContext.Provider value={{ selectedSlot, setSelectedSlot, updateVolume }}>
            {children}
        </TubeRackContext.Provider>
    );
};
