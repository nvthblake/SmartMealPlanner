import React, { useState } from "react";

export function getFridgeSql (db) {
    const [forceUpdate, forceUpdateId] = useForceUpdate();

    db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM FactFridge", 
          [], 
          (_, { rows }) => console.log(rows._array), 
          (_, error) => console.log(error)
        );
      },
      null,
      forceUpdate);

    return rows;
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return [() => setValue(value + 1), value];
  }