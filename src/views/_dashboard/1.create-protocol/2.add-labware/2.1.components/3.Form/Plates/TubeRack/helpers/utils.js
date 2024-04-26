export function updateWellsForGlobalStepTracking(sourceWells, sourceSlots, isSource) {
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


export function updateDestinationWells(sourceSlots, foundItem, totalSelected, selectedSlot, stepId) {
    let volumeToAdd
    const destinationLength = totalSelected.reduce((total, item) => {
        return total + item.wells.length;
    }, 0);

    const sourceLength = Object.keys(sourceSlots).length


    // Continue with volume submission if the selection is valid
    for (let key in sourceSlots) {
        if (sourceSlots.hasOwnProperty(key)) {
            volumeToAdd = sourceSlots[key].volume * sourceLength
            break
        }
    }

    volumeToAdd = volumeToAdd / destinationLength

    let sourceNamesSet = new Set();
    // Collect unique liquid names from sourceSlots
    for (let key in sourceSlots) {
        sourceNamesSet.add(sourceSlots[key].liquid);
    }

    // Convert the set to a string, separated by slashes
    let sourceNames = Array.from(sourceNamesSet).join("/");

    const updatedDestinationSource = totalSelected.map(item => {
        // Split existing item liquids into an array, filter out empty strings
        let existingLiquids = item.liquid.split("/").filter(name => name);
        item.volume = Number(item.volume) + volumeToAdd
        item.wells.forEach(well => well.volume = Number(well.volume) + volumeToAdd);
        // Create a set for existing liquids to ensure uniqueness
        let liquidSet = new Set(existingLiquids);

        // Add sourceNames to the set if not already present
        sourceNames.split("/").forEach(name => {
            if (name && !liquidSet.has(name)) {
                liquidSet.add(name);
            }
        });

        // Join the updated set of liquid names
        let updatedLiquid = Array.from(liquidSet).join("/");
        if (!item.color)
            item.color = "#000000"
        // Update the item's liquid property
        return {
            ...item,
            liquid: updatedLiquid
        };
    });

    const currentDestinationWells = {}

    updatedDestinationSource.map((destination) => {
        destination.wells.forEach(well => {
            currentDestinationWells[well.id] = { id: well.id, volume: well.volume, liquid: destination.liquid }
        })
    })

    // Assuming 'items' is your initial object and 'updatedDestinationSource' is the object with updates.
    const liquidsOrSource = selectedSlot.liquids?.selected?.length ? selectedSlot.liquids.selected : selectedSlot.source;
    // Step 0: Initialize 'destination' as a deep copy of 'liquid   s.selected' from 'source'
    foundItem.destination = JSON.parse(JSON.stringify(liquidsOrSource));
    foundItem.destination = foundItem.destination.filter(item => item.wells.length > 0)

    // Step 1: Remove the updated wells from their original groups in 'destination'
    foundItem.destination.forEach(destinationItem => {
        // First, filter wells based on whether they are being updated
        let filteredWells = destinationItem.wells.filter(well => {
            const wellId = typeof well === 'object' && well !== null ? well.id : well;
            const isWellUpdated = updatedDestinationSource.some(update =>
                update.wells.some(updatedWell => wellId === updatedWell.id)
            );
            return !isWellUpdated; // Keep the well if it's not being updated
        });
        // Then, map over filtered wells to update their volume as necessary
        destinationItem.wells = filteredWells.map(well => {
            const wellId = typeof well === 'object' && well !== null ? well.id : well;
            if (sourceSlots[wellId]) {
                let updatedNewVolume
                if (well.volume) {
                    updatedNewVolume = well.volume - sourceSlots[wellId].volume
                } else {
                    updatedNewVolume = destinationItem.volume - sourceSlots[wellId].volume
                }
                return {
                    id: wellId,
                    volume: updatedNewVolume,
                };
            }
            return well;
        });
    });


    const items = JSON.parse(localStorage.getItem('tubeTransfer'));
    const currentStep = items.find(item => item.stepId === stepId);
    currentStep.destination = foundItem.destination
    currentStep.destinationLabwareName = selectedSlot.name || selectedSlot.sourceLabwareName

    // Step 2: Add the updated wells to new or existing groups in 'destination'
    updatedDestinationSource.forEach(update => {
        update.wells.forEach(updatedWell => {
            const wellId = updatedWell.id;
            const updateLiquidName = update.liquid;
            let targetGroup = foundItem.destination.find(destinationItem => destinationItem.liquid === updateLiquidName);

            if (!targetGroup) {
                targetGroup = {
                    wells: [{ id: wellId, volume: updatedWell.volume.toString() }],
                    liquid: updateLiquidName,
                    color: update.color,
                    volume: updatedWell.volume.toString()
                };
                foundItem.destination.push(targetGroup);
            } else {

                const existingWell = targetGroup.wells.find(w => typeof w !== 'string' && w.id === wellId);
                if (!existingWell) {
                    targetGroup.wells.push({ id: wellId, volume: updatedWell.volume.toString() });
                    // Optionally update the group's volume if needed
                    targetGroup.volume = (parseInt(targetGroup.volume) + updatedWell.volume).toString();
                }
            }
        });
    });

    currentStep.destination = foundItem.destination;
    const stepsStatus = JSON.parse(localStorage.getItem('stepsStatus'))
    const currentLabware = stepsStatus.find(step => step.StepId === stepId)

    currentLabware[selectedSlot.name || selectedSlot.sourceLabwareName].destinationWells = currentStep.destination
    stepsStatus.forEach((step) => {
        if (step.StepId === stepId) {
            // Directly modify properties of `step` without reassigning it
            Object.assign(step, currentLabware); // This will copy properties from `currentLabware` to `step`
            step.sourceOptions["destinationWells"] = currentDestinationWells;
            step.sourceOptions.destinationTubeRack = selectedSlot.name || selectedSlot.sourceLabwareName;

            Object.entries(currentLabware).forEach(([key, value]) => {
                if (key === 'sourceOptions' || key === 'sourceTubeRack' || key === "StepId" || key === step.sourceOptions.destinationTubeRack) {
                    return;
                }
                if (key !== selectedSlot.name && key !== step.sourceOptions.destinationTubeRack)
                    step[key].destinationWells = updateWellsForGlobalStepTracking(step[key].sourceWells, sourceSlots, false);
            });
        }
    });

    localStorage.setItem('stepsStatus', JSON.stringify(stepsStatus))

}


export function cleanWells(wells) {

    return wells.filter(liquid => liquid.wells.length > 0)
}


export function updateTubeTransferVisuals(stepId, source) {
    const stepsStatus = JSON.parse(localStorage.getItem("stepsStatus"))
    const startingIndex = stepsStatus.findIndex(step => step.StepId === stepId)
    const displayTubesTransfer = JSON.parse(localStorage.getItem("tubeTransfer"))
    const displayTubesTransferCopy = displayTubesTransfer.map(tube => ({ ...tube }));
    const startingIndexDisplayTubeTransfer = displayTubesTransfer.findIndex(tube => tube.stepId === stepId)
    let editedTubeRack

    if (startingIndexDisplayTubeTransfer + 1 !== displayTubesTransfer.length) {
        if (source === true)
            editedTubeRack = stepsStatus[startingIndex].sourceOptions.sourceTubeRack
        else
            editedTubeRack = stepsStatus[startingIndex].sourceOptions.destinationTubeRack
        for (let i = startingIndexDisplayTubeTransfer + 1; i < displayTubesTransfer.length; i++) {
            const sourceLabware = displayTubesTransfer[i].sourceLabwareName
            const destinationLabware = displayTubesTransfer[i].destinationLabwareName
            if (sourceLabware === editedTubeRack || destinationLabware === editedTubeRack)
                displayTubesTransferCopy.splice(i, 1)
        }
        localStorage.setItem("tubeTransfer", JSON.stringify(displayTubesTransferCopy))
    }
}