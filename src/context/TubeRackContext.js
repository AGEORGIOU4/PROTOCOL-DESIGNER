import React, { createContext, useContext, useState } from 'react';
// Create a context object for managing tube rack data across the application
const TubeRackContext = createContext();
// Custom hook to provide easy access to the TubeRackContext
export const useTubeRackContext = () => useContext(TubeRackContext);
// Provider component to wrap the part of your app that needs access to this context
export const TubeRackProvider = ({ children }) => {
    // State to track the currently selected slot in the tube rack system
    const [selectedSlot, setSelectedSlot] = useState(null);
    // State to keep track of slots in the source tube rack
    const [sourceSlots, setSourceSlots] = useState({});

    // Function to update the volume of liquid in wells
    const updateVolume = (updates) => {
        if (!selectedSlot) return; // If no slot is selected, exit the function early

        // Start with a copy of the current sourceSlots to accumulate changes
        // Create a new object to accumulate changes to source slots
        const newSourceSlots = {};


        updates.forEach(({ wellId, newVolume, toTransfer }) => {
            let liquidNames = []; // Array to collect liquid names for logging or debugging
            const liquidsOrSource = selectedSlot.liquids?.selected?.length ? selectedSlot.liquids.selected : selectedSlot.source;

            // Flag to check if the well was updated
            let wellFound = false;

            // Iterate through each liquid or source data to find the appropriate well
            liquidsOrSource.forEach(liquid => {
                const wellIndex = liquid.wells.findIndex(well => (well.id && well.id === wellId) || well === wellId);
                if (wellIndex !== -1) {
                    wellFound = true;
                    const well = liquid.wells[wellIndex];

                    // Update the well with new volume or create a new well entry if it doesn't exist
                    const updatedWell = typeof well === 'string' ? { id: wellId, volume: newVolume, liquid: liquid.liquid } : { ...well, volume: newVolume };

                    // Add or update the well entry in newSourceSlots
                    newSourceSlots[wellId] = {
                        ...newSourceSlots[wellId],
                        id: wellId,
                        volume: toTransfer,
                        liquid: updatedWell.liquid || liquid.liquid
                    };

                    // Collect the liquid name if it's not already included
                    if (!liquidNames.includes(liquid.liquid)) {
                        liquidNames.push(liquid.liquid);
                    }
                }
            });

            // Handle the case where the well was not found in any liquids
            if (!wellFound) {
                newSourceSlots[wellId] = {
                    ...newSourceSlots[wellId],
                    id: wellId,
                    volume: toTransfer,
                    liquid: 'Unknown' // Or any default name you'd like to assign
                };
            }
        });
        // Set the new source slots state after all updates
        setSourceSlots(newSourceSlots);
        // Update the selectedSlot to ensure components re-render with updated data
        setSelectedSlot(currentSelectedSlot => ({ ...currentSelectedSlot }));
    };


    return (
        <TubeRackContext.Provider value={{ selectedSlot, setSelectedSlot, updateVolume, sourceSlots, setSourceSlots }}>
            {children}
        </TubeRackContext.Provider>
    );
};
