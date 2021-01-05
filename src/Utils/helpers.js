import React, {useState} from 'react';

export const arrayUnique = (array) => {
  var a = array.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

export const refDataToMultiSLFormat = (obj) => {
  // needs to look like this
  /*
    const outArr = [
    // this is the parent or 'item'
    {
      name: 'Building and related trades workers, excluding electricians',
      id: 0,
      // these are the children or 'sub items'
        children: [
          {
            name: 'Building finishers and related trades workers:',
            id: 10,
          },
          {
            name: 'Building frame and related trades workers',
            id: 17,
          }
        ] */
  let outArr = [];

  obj.docs.map((doc, index) => {
    //console.log("heading ", heading)
    let outItem = {};
    //substring sort key which is first two digits
    outItem.title = doc.id.substring(2);
    outItem.id = 100 * (index + 1);
    //console.log("outItem.id ", outItem.id)
    // now map children
    let childArr = [];
    const children = Object.keys(doc.data());
    children.map((child, index2) => {
      let outChild = {};
      //console.log("child ", child)
      outChild.title = child;
      outChild.id = outItem.id + (index2 + 1);
      //console.log("outChild.id ", outChild.id)
      childArr.push(outChild);
    });
    outItem.children = childArr;
    outArr.push(outItem);
  });
  return outArr;
};

export const flattenObject = function (ob, arr = []) {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object') {
      if (arr.includes(i)) {
        toReturn[i] = ob[i];
        continue;
      }

      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

export const dataToSectionListFormat = (obj) => {
  //("obj ", obj)
  if (typeof obj != 'undefined') {
    //let outArr = []
    const entries = Object.entries(obj);
    //console.log("entries ", entries)

    let outItemObj = {};
    let dtlArr = [];
    dtlArr.push(obj);
    outItemObj.title = obj.name;
    if (typeof obj.company !== 'undefined') {
      outItemObj.title = outItemObj.title + ' ' + obj.company;
    }
    outItemObj.data = dtlArr;
    //outArr.push(outItemObj)

    return outItemObj;
  } else {
    return {};
  }
};
