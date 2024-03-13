import React, { createContext, useContext, useState } from 'react';

const TubeRackContext = createContext();

export const useTubeRackContext = () => useContext(TubeRackContext);

export const TubeRackProvider = ({ children }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [sourceSlots, setSourceSlots] = useState({});

    const updateVolume = (updates) => {
        if (!selectedSlot) return;
        let updatedSlot = { ...selectedSlot };
        debugger
        updates.forEach(({ wellId, newVolume, toTransfer }) => {
            let liquidNames = []; // To keep track of liquid names for combining
            let wellFound = false; // Flag to check if the well has been found and updated
            const liquidsOrSource = updatedSlot.liquids?.selected?.length ? updatedSlot.liquids.selected : updatedSlot.source;
            liquidsOrSource.forEach(liquid => {
                const wellIndex = liquid.wells.findIndex(well => (well.id && well.id === wellId) || well === wellId);
                if (wellIndex !== -1) {
                    wellFound = true;
                    const well = liquid.wells[wellIndex];
                    // Convert string to object if well is identified by a string
                    if (typeof well === 'string') {
                        liquid.wells[wellIndex] = { id: wellId, volume: newVolume, liquid: liquid.liquid };
                    } else {
                        well.volume = newVolume; // Update volume if well is already an object
                    }

                    if (!liquidNames.includes(liquid.liquid)) {
                        liquidNames.push(liquid.liquid);
                    }

                    // Correcting the update logic for sourceSlots
                    setSourceSlots(prevSlots => ({
                        ...prevSlots,
                        [wellId]: { // Use wellId directly to handle both cases
                            id: wellId,
                            volume: toTransfer,
                            liquid: liquidNames.join('/') // Combining liquid names
                        }
                    }));
                }
            });

            // If the well wasn't found in any of the liquids, treat it as a new entry
            if (!wellFound) {
                setSourceSlots(prevSlots => ({
                    ...prevSlots,
                    [wellId]: {
                        id: wellId,
                        volume: toTransfer,
                        liquid: 'Unknown' // Or any default name you'd like to assign
                    }
                }));
            }
        });
        setSelectedSlot(updatedSlot);
    };

    return (
        <TubeRackContext.Provider value={{ selectedSlot, setSelectedSlot, updateVolume, sourceSlots, setSourceSlots }}>
            {children}
        </TubeRackContext.Provider>
    );
};
