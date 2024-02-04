import React, { createContext, useContext, useState } from 'react';

const TubeRackContext = createContext();

export const useTubeRackContext = () => useContext(TubeRackContext);

export const TubeRackProvider = ({ children }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [sourceSlots, setSourceSlots] = useState({})

    const updateVolume = (updates) => {
        if (!selectedSlot) return;

        let updatedSlot = { ...selectedSlot };
        updates.forEach(({ wellId, newVolume, toTransfer }) => {
            updatedSlot.liquids.selected.forEach(liquid => {
                const well = liquid.wells.find(well => well.id === wellId);
                if (well) {
                    well.volume = newVolume;
                    setSourceSlots(prevSlots => ({
                        ...prevSlots,
                        [well.id]: { id: wellId, volume: toTransfer }
                    }));
                }
            });
        });
        setSelectedSlot(updatedSlot);
    };




    return (
        <TubeRackContext.Provider value={{ selectedSlot, setSelectedSlot, updateVolume, sourceSlots, setSourceSlots }}>
            {children}
        </TubeRackContext.Provider>
    );
};
