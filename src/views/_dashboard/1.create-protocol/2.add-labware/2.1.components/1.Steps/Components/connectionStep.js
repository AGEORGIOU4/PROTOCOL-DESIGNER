import React from "react";

export const ConnectionStep = ({ variant }) => {
  console.log(variant);
  if (variant === "first") {
    return (
      <div className={"connection-outer"}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            height: 2,
            width: "50%",
            background: "grey",
            right: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            background: "grey",
            right: 0,
            top: "50%",
            height: "100%",
            width: 2,
          }}
        />
      </div>
    );
  } else if (variant === "last") {
    return (
      <div className={"connection-outer"}>
        <div
          style={{
            position: "absolute",
            background: "grey",
            height: 2,
            width: "50%",
            right: 0,
            bottom: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            background: "grey",
            right: 0,
            height: "50%",
            width: 2,
            bottom: "50%",
          }}
        />
      </div>
    );
  }

  return (
    <div className={"connection-outer"}>
      <div
        style={{
          position: "absolute",
          background: "grey",
          top: 0,
          right: 0,
          height: "150%",
          width: 2,
        }}
      />
    </div>
  );
};
