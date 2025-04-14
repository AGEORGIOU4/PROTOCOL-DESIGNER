import React from "react";

const Dashboard = React.lazy(() => import("./views/_dashboard/Dashboard"));

const CreateProtocol = React.lazy(() => import("./views/1.create-protocol"));

const AddLabware = React.lazy(() => import("./views/1.create-protocol/2.add-labware"));

const ImportProtocol = React.lazy(() => import("./views/2.import-protocol/ImportProtocol"));

const routes = [
  { path: "/", exact: true, name: "Start" },
  { path: "/protocol-designer", name: "Protocol Designer", element: Dashboard },

  { path: "/create-protocol", name: "Create Protocol", element: CreateProtocol },
  { path: "/add-labware", name: "Add Labware", element: AddLabware },

  { path: "/import-protocol", name: "Import Protocol", element: ImportProtocol },
];

export default routes;
