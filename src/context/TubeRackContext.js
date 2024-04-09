import React, { createContext, useContext, useState } from 'react';

const TubeRackContext = createContext();

export const useTubeRackContext = () => useContext(TubeRackContext);

export const TubeRackProvider = ({ children }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [sourceSlots, setSourceSlots] = useState({});

    const updateVolume = (updates) => {
        if (!selectedSlot) return;

        // Start with a copy of the current sourceSlots to accumulate changes

        const newSourceSlots = {};


        updates.forEach(({ wellId, newVolume, toTransfer }) => {
            let liquidNames = [];
            const liquidsOrSource = selectedSlot.liquids?.selected?.length ? selectedSlot.liquids.selected : selectedSlot.source;

            // This variable will help us determine if the well was found and updated
            let wellFound = false;

            liquidsOrSource.forEach(liquid => {
                const wellIndex = liquid.wells.findIndex(well => (well.id && well.id === wellId) || well === wellId);
                if (wellIndex !== -1) {
                    wellFound = true;
                    const well = liquid.wells[wellIndex];

                    // Assuming the need to update or create a new well entry
                    const updatedWell = typeof well === 'string' ? { id: wellId, volume: newVolume, liquid: liquid.liquid } : { ...well, volume: newVolume };

                    // Update or create the entry in the newSourceSlots
                    newSourceSlots[wellId] = {
                        ...newSourceSlots[wellId],
                        id: wellId,
                        volume: toTransfer,
                        liquid: updatedWell.liquid || liquid.liquid
                    };

                    if (!liquidNames.includes(liquid.liquid)) {
                        liquidNames.push(liquid.liquid);
                    }
                }
            });

            // If the well wasn't found in any of the liquids, treat it as a new entry
            if (!wellFound) {
                newSourceSlots[wellId] = {
                    ...newSourceSlots[wellId],
                    id: wellId,
                    volume: toTransfer,
                    liquid: 'Unknown' // Or any default name you'd like to assign
                };
            }
        });
        // Update the state once after computing all changes
        setSourceSlots(newSourceSlots);
        // Also update selectedSlot if necessary, making sure to use a function to get the current state
        setSelectedSlot(currentSelectedSlot => ({ ...currentSelectedSlot }));
    };


    return (
        <TubeRackContext.Provider value={{ selectedSlot, setSelectedSlot, updateVolume, sourceSlots, setSourceSlots }}>
            {children}
        </TubeRackContext.Provider>
    );
};
