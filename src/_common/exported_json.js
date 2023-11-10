const setup =
{
  deck:
    [
      {
        id: 1,
        name: "Slot 1",
        tube_rack: "",
        well_plate: "Corning 24 Well Plate 3.4 mL Flat",
        reservoir: "",
        aluminium_block: "",
      },
      {
        id: 2,
        name: "Slot 2",
        tube_rack: "",
        well_plate: "",
        reservoir: "Axygen 1 Well Reservoir 90 mL",
        aluminium_block: ""
      },
      {
        id: 3,
        name: "Slot 3",
        tube_rack: "",
        well_plate: "",
        reservoir: "",
        aluminium_block: ""
      },
      {
        id: 4,
        name: "Slot 4",
        tube_rack: "",
        well_plate: "",
        reservoir: "",
        aluminium_block: "Opentrons 96 Well Aluminum Block with NEST Well Plate 100 µL"
      }
    ],

  steps:
    [
      {
        step_number: 1,
        name: "Transfer",
        volume: 50,

        source: ["A1", "B1,", "C1"],
        destination: ["A2", "B2,", "C2"]
      }
    ],

}

