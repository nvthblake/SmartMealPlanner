import React from 'react';

function WhereObj(column, filterValues, comparison) {
  this.column = column,
  this.filterValues = filterValues,
  this.comparison = comparison,
  this.statementWhereStr  = function() {
    if (this.comparison === "in") return ` ? IN ${createQuestionMarkStr(filterValues.length())} `;
    else if (this.comparison === "=") return ` ? = ${filterValues[0]} `;
    else return ` ? ${this.comparison} ${filterValues[0]} `;
  }
  this.argWhereArray = function() {
    if (this.comparison === "in") return [this.column, ...this.filterValues];
    else return [this.column, this.filterValues[0]];
  }

}


function inClauseSQL(filterValues=[]) {
  const filterStr = filterValues.join(", ");
  return `(${filterValues})`;
}

function createQuestionMarkStr(n) {
  let questionMarks = [];
    for (i=0; i<n; i++)
      questionMarks.push('?');
    return questionMarks.join(", ");
}

export default WhereObj;