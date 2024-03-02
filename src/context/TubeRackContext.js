import React, { createContext, useContext, useState } from 'react';

const TubeRackContext = createContext();

export const useTubeRackContext = () => useContext(TubeRackContext);

export const TubeRackProvider = ({ children }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [sourceSlots, setSourceSlots] = useState({});

    const updateVolume = (updates) => {
        if (!selectedSlot) return;

        let updatedSlot = { ...selectedSlot };
        updates.forEach(({ wellId, newVolume, toTransfer }) => {
            let liquidNames = []; // To keep track of liquid names for combining

            updatedSlot.liquids.selected.forEach(liquid => {
                const well = liquid.wells.find(well => well.id === wellId);
                if (well) {
                    well.volume = newVolume;
                    if (!liquidNames.includes(liquid.liquid)) {
                        liquidNames.push(liquid.liquid);
                    }
                    // Update logic for sourceSlots to keep track of changes
                    setSourceSlots(prevSlots => ({
                        ...prevSlots,
                        [well.id]: {
                            id: wellId,
                            volume: toTransfer,
                            liquid: liquidNames.join('/') // Combining liquid names
                        }
                    }));
                }
            });

            // If the well is being updated but doesn't match any existing liquid
            if (liquidNames.length === 0) {
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
