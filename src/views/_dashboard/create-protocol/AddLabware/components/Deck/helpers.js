export const getSlotBtnClassName = (id, isSelected) => {
  console.log(isSelected)

  if (id == 0) {
    return "add-labware-slot-btn-create"
  } else if (id == isSelected) {
    return "add-labware-slot-btn add-labware-slot-btn-selected "
  } else {
    return "add-labware-slot-btn"
  }
}

export const getSlotLabwareImage = (selectedLabware) => {
  switch (selectedLabware) {

    // TUBE RACK 1
    case "Opentrons 10 Tube Rack with Falcon 4x50 mL, 6x15 mL Conical":
    case "Opentrons 10 Tube Rack with NEST 4x50 mL, 6x15 mL Conical":
      return '/tube-rack_1.png';

    // TUBE RACK 2
    case "Opentrons 15 Tube Rack with Falcon 15 mL Conical":
    case "Opentrons 15 Tube Rack with NEST 15 mL Conical":
      return '/tube-rack_2.png';

    // TUBE RACK 3
    case "Opentrons 24 Tube Rack with Eppendorf 1.5 mL Safe-Lock Snapcap":
    case "Opentrons 24 Tube Rack with Eppendorf 2 mL Safe-Lock Snapcap":
    case "Opentrons 24 Tube Rack with Generic 2 mL Screwcap":
    case "Opentrons 24 Tube Rack with NEST 0.5 mL Screwcap":
    case "Opentrons 24 Tube Rack with NEST 1.5 mL Screwcap":
    case "Opentrons 24 Tube Rack with NEST 2 mL Screwcap":
      return '/tube-rack_3.png';

    // TUBE RACK 4
    case "Opentrons 24 Tube Rack with NEST 1.5 mL Snapcap":
    case "Opentrons 24 Tube Rack with NEST 2 mL Snapcap":
      return '/tube-rack_4.png';

    // TUBE RACK 5
    case "Opentrons 6 Tube Rack with Falcon 50 mL Conical":
    case "Opentrons 6 Tube Rack with NEST 50 mL Conical":
      return '/tube-rack_5.png';



    // WELL PLATE 6 1
    case "Corning 6 Well Plate 16.8 mL Flat":
      return '/well-plate(6)_1.png';

    // WELL PLATE 12 1
    case "Corning 12 Well Plate 6.9 mL Flat":
      return '/well-plate(12)_1.png';

    // WELL PLATE 24 1
    case "Corning 24 Well Plate 3.4 mL Flat":
      return '/well-plate(24)_1.png';

    // WELL PLATE 48 1
    case "Corning 48 Well Plate 1.6 mL Flat":
      return '/well-plate(48)_1.png';

    // WELL PLATE 96 1
    case "Bio-Rad 96 Well Plate 200 µL PCR":
    case "NEST 96 Well Plate 100 µL PCR Full Skirt":
    case "NEST 96 Well Plate 200 µL Flat":
    case "Opentrons Tough 96 Well Plate 200 µL PCR Full Skirt":
      return '/well-plate(96)_1.png';

    // WELL PLATE 96 2
    case "Corning 96 Well Plate 360 µL Flat":
      return '/well-plate(96)_2.png';

    // WELL PLATE 96 3
    case "NEST 96 Deep Well Plate 2mL":
    case "USA Scientific 96 Deep Well Plate 2.4 mL":
      return '/well-plate(96)_3.png';

    // WELL PLATE 96 4
    case "Thermo Scientific Nunc 96 Well Plate 1300 µL":
    case "Thermo Scientific Nunc 96 Well Plate 2000 µL":
      return '/well-plate(96)_4.png';

    // WELL PLATE 384 1
    case "Applied Biosystems MicroAmp 384 Well Plate 40 µL":
    case "Bio-Rad 384 Well Plate 50 µL":
      return '/well-plate(384)_1.png';

    // WELL PLATE 384 2
    case "Corning 384 Well Plate 112 µL Flat":
      return '/well-plate(384)_2.png';



    case "create":
      return '/add-plate.png';
    default:
      return '/default-plate.png';
  }
}