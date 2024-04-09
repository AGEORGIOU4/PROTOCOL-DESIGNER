export function updateWellsForGlobalStepTracking(sourceWells, sourceSlots,isSource) {
    sourceWells.forEach((liquid, liquidIndex) => {
        // Make sure we have wells to iterate over
        if (liquid.wells && liquid.wells.length) {
            // Iterate over each well in the current liquid
            const updatedWells = liquid.wells.map(well => {
                // Determine the well ID (whether the well is a string or an object)
                const wellId = typeof well === 'string' ? well : well.id;
                const currentVolume = well.volume || liquid.volume

                // Check if the current well's ID matches any key in sourceSlots
                if (sourceSlots[wellId] && isSource) {

                    well = { id: wellId, volume: Number(currentVolume) - sourceSlots[wellId].volume }

                } else {

                    well = { id: wellId, volume: Number(currentVolume) }

                }
                return well;
            });

            // Update the wells array for the current liquid with updated wells information
            sourceWells[liquidIndex].wells = updatedWells;
        }
    });
    return sourceWells
}