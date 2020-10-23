import React from 'react';

function OrderObj(column, desc) {
  this.column = column,
  this.desc = desc,
  this.statementOrderStr = function() {
    if (desc) return ` ? DESC `
    else return ` ? `
  }
  
}

export default OrderObj;