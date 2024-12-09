//main funtion that returns array of array of combinations
function combine(n, r = null) {
  //deals with if just r is null (wants all subsets)
  if (r == null) {
    let result = [];
    for (let i = 0; i <= n; i++) {
      result[i] = contCombine(n, i)
    }
    return result;
  }
  //deals with impossible scenario
  if (r > n) return null;
  //after error handling, throws combination to another function
  return contCombine(n, r);
}

//auxillary function for combinations
function contCombine(n, r) {
  let result = [];
  let curComb = [];
  //create first combo
  for (let i = 0; i < r; i++) {
    curComb[i] = i + 1;
  }
  let unusedElts = []
  //create list of unused elements
  for (let i = 0; i < n - r; i++) {
    unusedElts[i] = i + r + 1;
  }
  //calculation combination amount
  let combinations = fallingFactorial(n, r) / factorial(r)
  for (let i = 0; i < combinations; i++) {
    result[i] = [];
  }
  //fills first combination into result
  for (let j = 0; j < r; j++) {
    result[0][j] = curComb[j];
  }
  //runs algorithm combinations - 1 times
  for (let i = 0; i < combinations - 1; i++) {
    let found = false;
    let j = 0;
    //searching for a number in curComb that is not the biggest of the unusedElts
    while (!found) {
      if (!isBiggest(unusedElts, curComb[r - j - 1])) {
        //if found, swap between unusedElts with the next biggest number
        swapNextBiggestBetween(curComb, unusedElts, r - j - 1);
        //if that new number is not the biggest, then swap each number after with the next biggest number with respect to the new number
        if (!isBiggest(unusedElts, curComb[r - j - 1])) {
          for (let k = r - j; k < r; k++) {
            swapNextBiggestBetween(curComb, unusedElts, r - j - 1, k);
          }
        }
        //set found to true
        found = true;
      }
      //increment from the back of curComb to the front
      j++;
    }
    //fill result with new curComb
    for (let j = 0; j < r; j++) {
      result[i + 1][j] = curComb[j];
    }
  }
  return result;
}

//calculates falling factorial
function fallingFactorial(n, r) {
  let result = 1;
  for (let i = 0; i < r; i++) {
    result *= n - i;
  }
  return result;
}

//calculates factorial
function factorial(n) {
  let result = 1;
  for (let i = 0; i < n; i++) {
    result *= i + 1;
  }
  return result;
}

//determines if a number is the biggest number compared to an array
function isBiggest(unusedElts, num) {
  for (let i = 0; i < unusedElts.length; i++) {
    if (num < unusedElts[i]) return false;
  }
  return true
}

//swaps the position in one array with the next biggest number with respect to j
function swapNextBiggestBetween(curComb, unusedElts, j, l = j) {
  let done = false;
  let i = 1;
  while (!done) {
    for (let k = 0; k < unusedElts.length; k++) {
      if (curComb[j] + i == unusedElts[k]) {
        let temp = curComb[l];
        curComb[l] = unusedElts[k];
        unusedElts[k] = temp;
        done = true;
      }
      if (done) break;
    }
    i++;
  }
}

//main function that returns array of permutated arrays
function permute(n, r = n) {
  //error checks
  if (r > n) return null;
  //gets permutation number for each combo
  let permNum = factorial(r);
  //gets combos
  let combos = combine(n, r);
  let result = [];
  //fills result with combo arrays
  for (let i = 0; i < combos.length; i++) {
    result[i] = [];
  }
  //fills result with perm arrays
  for (let i = 0; i < combos.length; i++) {
    for (let j = 0; j < permNum; j++) {
      result[i][j] = [];
    }
  }
  //loops through each possible combo
  for (let i = 0; i < combos.length; i++) {
    let curPerm = combos[i];
    let arrows = [];
    //sets arrows to array of -1
    for (let j = 0; j < r; j++) {
      arrows[j] = -1;
    }
    //inputs first combo
    for (let j = 0; j < r; j++) {
      result[i][0][j] = curPerm[j];
    }
    //loops through each perm of the combo
    for (let j = 1; j < permNum; j++) {
      let found = false;
      let ommissions = [];
      while (!found) {
        //stores biggest number (that is not ommitted)
        let biggest = 0;
        //stores index of this number
        let index;
        //loops through each number in curPerm, finding the biggest one
        for (let k = 0; k < r; k++) {
          //can't be biggest if it is ommited
          if (!(ommissions.includes(k))) {
            if (biggest < curPerm[k]) {
              biggest = curPerm[k];
              index = k;
            }
          }
        }
        //looks if this biggest, non-omitted number points to a smaller number or edge
        if (pointsToSmaller(curPerm, arrows, index)) {
          //swaps positions
          swapIn(curPerm, arrows, index, index + arrows[index]);
          found = true;
        } else {
          //flips direction of arrow
          arrows[index] *= -1;
          //ommits number from being mobile
          ommissions.push(index);
        }
      }
      //fills result with the new curPerm
      for (let k = 0; k < r; k++) {
        result[i][j][k] = curPerm[k];
      }
    }
  }
  return result;
}

//sees if a number points to a smaller number
function pointsToSmaller(curPerm, arrows, permInd) {
  if (permInd == 0 && arrows[permInd] == -1) return false;
  if (permInd == curPerm.length - 1 && arrows[permInd] == 1) return false;
  return curPerm[permInd] > curPerm[permInd + arrows[permInd]];
}

//swaps two number in the same array, and in the arrow array
function swapIn(curPerm, arrows, i, j) {
  let temp = curPerm[i];
  curPerm[i] = curPerm[j];
  curPerm[j] = temp;
  temp = arrows[i];
  arrows[i] = arrows[j];
  arrows[j] = temp;
}

function countDerangements(perms, printPerms = false) {
  let result = 0
  for (let i = 0; i < perms.length; i++) {
    if (isDerangement(perms[i], printPerms)) result++;

  }
  return result;
}

function isDerangement(perm, printPerms = false) {
  for (let i = 0; i < perm.length; i++) {
    if (perm[i] == i + 1) {
      if (printPerms) console.log(perm, false);
      return false;
    }
  }
  if (printPerms) console.log(perm, true);
  return true
}

function approxE(n, printPerms = false, printVals = true) {
  let perms = permute(n)[0];
  let derangements = countDerangements(perms, printPerms);
  let eApprox = perms.length / derangements;
  if (printVals) {
    console.log("Total perms: " + perms.length);
    console.log("Total derangements: " + derangements);
    console.log(n, eApprox, Math.E);
  }
  return eApprox;
}

//two main functions:
//combine(n, r)
//permutate(n, r)
//approxE(5)
approxE(11);
