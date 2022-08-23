
const $ = (x) => {return document.getElementById(x);};
const _ = (x) => {return document.createElement(x);};

const lookup = new Map();
const opening = 6;
const closing = 20;
const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
const hours = createHours(opening, closing);
const hrlyTotals = new Array(closing - opening + 1).fill(0);

const storePrototype = {
  project() {
    let i;
    let total = 0;
    const temp = [];
    for (i = 0; i < hours.length - 1; i++) {
      let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg * traffic[i]);
      temp.push(sales);
      total += sales;
    }

    temp.push(total);
    this.dailyTotal = total;
    this.projection = temp;
  }
};

Object.setPrototypeOf(Store.prototype, storePrototype);
// console.log (storePrototype);
// console.log(Store);

const Seattle = new Store('Seattle', 23, 65, 6.3);
const Tokyo = new Store('Tokyo', 3, 24, 1.2);
const Dubai = new Store('Dubai', 11, 38, 3.7);
const Paris = new Store('Paris', 20, 38, 2.3);
const Lima = new Store('Lima', 2, 16, 4.6);

const stores = [Seattle, Tokyo, Dubai, Paris, Lima];

display();


// create the array of hours
function createHours(open, close) {
  let i;
  const temp = [];
  for (i = open; i < close; i++) {
    let t = (i + 11) % 12 + 1;
    let m = Math.floor(i/12) ? 'pm' : 'am';
    temp.push(`${t}${m}`);
  }
  temp.push('Daily Total');
  return temp;
}


// constructor function for Stores
function Store(name, min, max, avg) {
  this.name = name;
  this.min = min;
  this.max = max;
  this.avg = avg;
  // store.projection = [];
  // store.dailyTotal = 0;

  // store.project = function() {
  //   let i;
  //   let total = 0;
  //   const temp = [];
  //   const temp2 = [];
  //   for (i = 0; i < hours.length - 1; i++) {
  //     let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg * traffic[i]);
  //     temp.push(sales);
  //     total += sales;
  //   }

  //   temp.push(total);
  //   this.dailyTotal = total;
  //   this.projection = temp;
  //   this.projection2 = temp2;
  // };

  this.project();
  lookup.set(name, this);
}


// displays Stores as a table
function display() {
  const tab = $('table');
  while (tab.firstChild) {
    tab.removeChild(tab.firstChild);
  }

  const colgroup = _('colgroup');
  const colLocations = _('col');
  const colValues = _('col');
  const colTotals = _('col');

  colLocations.setAttribute('id', 'locations');
  colValues.setAttribute('span', '14');
  colValues.setAttribute('id', 'cookie-values');
  colTotals.setAttribute('id', 'daily-totals');
  colgroup.appendChild(colLocations);
  colgroup.appendChild(colValues);
  colgroup.appendChild(colTotals);

  // create headings and totals rows with first column elements
  const headings = _('tr');
  const totals = _('tr');
  headings.innerHTML += '<th>Location</th>';
  totals.innerHTML = '<td><b>Totals</b></td>';
  hrlyTotals.fill(0);

  // populate data rows
  let store;
  for (store of stores) {
    let row = _('tr');
    row.innerHTML += `<b>${store.name}</b>`; //populate location column

    let i;
    for (i in store.projection) {
      // console.log(`store: ${store.name}; i = ${i}`);
      row.innerHTML += `<td>${store.projection[i]}</td>`;
      hrlyTotals[i] += store.projection[i];
    }
    tab.appendChild(row);
  }

  // populate headings and totals rows
  let j;
  for (j in hours) {
    headings.innerHTML += `<th>${hours[j]}</th>`;
    totals.innerHTML += `<td>${hrlyTotals[j]}</td>`;
  }
  tab.appendChild(totals);
  tab.prepend(headings);
  tab.prepend(colgroup);
}



// brings up Store selection menu as popup on button push
function chooseStore() {
  if ($('popup')) {
    return;
  }

  let container = $('table-container');
  let blur = _('div');
  let popup = _('div');
  let exit = _('button');
  let select = _('select');
  let option = _('option');
  let store;


  blur.setAttribute('id', 'popup-blur');
  popup.setAttribute('id', 'popup');

  exit.setAttribute('id','exit-update');
  exit.setAttribute('onclick', 'exitUpdate()');
  exit.innerHTML = 'Cancel';

  select.setAttribute('name', 'store');
  select.setAttribute('id', 'store-select');
  select.innerHTML = 'Which store would you like to update?';

  option.setAttribute('value', '');
  option.innerHTML = '-- Please Select an Option From Below --';
  select.appendChild(option);

  for (store of stores) {
    let option = _('option');
    option.setAttribute('value', `${store.name}`);
    option.innerHTML = store.name;
    select.appendChild(option);
  }

  popup.appendChild(select);
  popup.appendChild(exit);
  blur.appendChild(popup);
  container.appendChild(blur);

  select.addEventListener('change', input);
}

// on selection, present input fields with default values to update Store params
function input() {
  if (!$('store-select').value) {
    return;
  }

  let blur = $('popup-blur');
  let popup = $('popup');
  popup.removeChild($('exit-update'));
  let submit = _('button');
  let exit = _('button');

  submit.setAttribute('id','submit-update');
  submit.setAttribute('onclick', 'update()');
  submit.innerHTML = 'Update Values';

  exit.setAttribute('id','exit-update');
  exit.setAttribute('onclick', 'exitUpdate()');
  exit.innerHTML = 'Cancel';

  addInputField(popup, 'min');
  addInputField(popup, 'max');
  addInputField(popup, 'avg');
  popup.appendChild(submit);
  popup.appendChild(exit);
}

// helper function to add an input element
function addInputField(el, value) {
  let div = _('div');
  let label = _('label');
  let input = _('input');
  let store = lookup.get($('store-select').value);

  if ($(`${value}-container`)) {
    el.removeChild($(`${value}-container`));
  }

  div.setAttribute('id', `${value}-container`);

  label.setAttribute('for', value);
  label.innerHTML = `${value}:`;

  input.setAttribute('type', 'number');
  input.setAttribute('id', value);
  input.setAttribute('name', value);
  input.setAttribute('value', store[value]);

  div.appendChild(label);
  div.appendChild(input);
  el.appendChild(div);

}

// on submission, alters store params with input values and reruns projection for that Store
function update() {
  let container = $('table-container');
  let popup = $('popup');
  let select = $('store-select');
  let min = $('min');
  let max = $('max');
  let avg = $('avg');

  let store = lookup.get(select.value);

  store.min = parseInt(min.value);
  store.max = parseInt(max.value);
  store.avg = parseInt(avg.value);

  store.project();
  display();
  exitUpdate();
}


function exitUpdate() {
  $('table-container').removeChild($('popup-blur'));
}



// class Store {
//   constructor (name, min, max, avgSales) {
//     this.name = name;
//     this.min = min;
//     this.max = max;
//     this.avg = avgSales;
//     this.sim = [];
//     this.simulate();
//   }

//   getSim() {
//     return this.sim;
//   }

//   simulate() {
//     let i;
//     let total = 0;
//     const temp = [];
//     for (i = 6; i < 20; i++) {
//       let t = (i + 11) % 12 + 1;
//       let m = Math.floor(i/12) ? 'pm' : 'am';
//       let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg);
//       temp.push(`${t}${m}: ${sales} cookies`);
//       total += sales;
//     }
//     temp.push(`Total: ${total} cookies`);
//     this.sim = temp;
//     this.getSim();
//   }
// }
