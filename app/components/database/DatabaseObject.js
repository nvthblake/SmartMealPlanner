import React from 'react';
import * as SQLite from 'expo-sqlite';

import WhereObj from './WhereObj';
import OrderObj from './OrderObj';

function DatabaseObject({ tableName, db }) {

  const [forceUpdate, forceUpdateId] = useForceUpdate();

  return {
    tableName = tableName,
    db = db,

    insert: function(columns, values) {
      if (columnns.length !== values.length)
        throw new Error ("Columns and Values arrays must be of the same length.");
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO ? ( ${createQuestionMarkStr(columns.length)} ) values ( ${createQuestionMarkStr(columns.length)} );`, 
          [tableName, ... columns, ... values],
          [],
          (_, error) => console.log("Insert ", tableName, error)
        );
      },
      null,
      forceUpdate);
    },  // insert()
    
    select: function(where=[WhereObj(null, null, null)], orderBy=[OrderObj(null, null)]) {
      // where: array of WhereObj's; orderBy: array of OrderObj's

      let selectQuery = `SELECT * FROM ${tableName}`;
      let arguments = [];

      // If where clause required
      if (!isArrayEqual(where, [WhereObj(null, null, null)]))
        selectQuery += " WHERE ";
        where.forEach((WhereObj, index) => {
          if (index >= 1)
            selectQuery += " AND ";
          selectQuery += WhereObj.statementWhereStr();
          arguments = [...arguments, ...WhereObj.argWhereArray()];
        })
      // If order by clause is required
      if (!isArrayEqual(orderBy, [OrderObj(null, null)]))
        selectQuery + " ORDER BY ";
        orderBy.forEach((OrderObj, index) => {
          if (index >= 1)
            selectQuery += " , ";
          selectQuery += OrderObj.statementOrderStr();
          arguments = arguments.push(OrderObj.column);
        })
      
      console.log(selectQuery, arguments);
      // db.transaction(tx => {
      //   tx.executeSql(
      //   `${selectQuery};`, 
      //   arguments,
      //   (_, { rows }) => console.log(rows._array), 
      //   (_, error) => console.log("Insert ", tableName, error)
      // );
      // },
      // null,
      // forceUpdate);

      // return rows._array;
    }  // select()
  }
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

function createQuestionMarkStr(n) {
  let questionMarks = [];
    for (i=0; i<n; i++)
      questionMarks.push('?');
    return questionMarks.join(", ");
}

function isArrayEqual(a, b) {
  return JSON.stringify(a) === JSON(stringify(b));
}

export default DatabaseObject;