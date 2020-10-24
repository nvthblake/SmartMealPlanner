-- get date diff
SELECT julianday(expDate) - julianday(createdTs) AS dateDiff
FROM FactFridge
/* select from table - JS code

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
*/
/* drop table from database

    db.transaction(tx => {
      tx.executeSql(
        `DROP TABLE IF EXISTS FactFridge;`
      );
      });
*/