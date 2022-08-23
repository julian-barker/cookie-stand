function $(x) {
  return document.getElementById(x);
}

function _(x) {
  return document.createElement(x);
}

const lookup = new Map();
const opening = 6;
const closing = 20;
const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
const hours = createHours(opening, closing);
const hrlyTotals = new Array(closing - opening + 1).fill(0);

const Seattle = new Store('Seattle', 23, 65, 6.3);
const Tokyo = new Store('Tokyo', 3, 24, 1.2);
const Dubai = new Store('Dubai', 11, 38, 3.7);
const Paris = new Store('Paris', 20, 38, 2.3);
const Lima = new Store('Lima', 2, 16, 4.6);

const stores = [Seattle, Tokyo, Dubai, Paris, Lima];
console.log(stores, lookup);

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
  const store = {};
  store.name = name;
  store.min = min;
  store.max = max;
  store.avg = avg;
  store.projection = [];
  store.projection2 = [];
  store.dailyTotal = 0;
  store.project = function() {
    let i;
    let total = 0;
    const temp = [];
    const temp2 = [];
    for (i = 0; i < hours.length - 1; i++) {
      let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg * traffic[i]);
      temp.push(`${hours[i]}: ${sales} cookies`);
      temp2.push(sales);
      total += sales;
    }
    temp.push(`Total: ${total} cookies`);
    temp2.push(total);
    this.dailyTotal = total;
    this.projection = temp;
    this.projection2 = temp2;
  };
  store.project();
  lookup.set(name, store);
  return store;
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

  const headings = _('tr');
  const totals = _('tr');
  headings.innerHTML += '<th>Location</th>';
  totals.innerHTML = '<td><b>Totals</b></td>';
  hrlyTotals.fill(0);

  let store;
  for (store of stores) {
    let row = _('tr');
    row.innerHTML += `<b>${store.name}</b>`;

    let i;
    for (i in store.projection2) {
      row.innerHTML += `<td>${store.projection2[i]}</td>`;
      hrlyTotals[i] += store.projection2[i];
    }
    tab.appendChild(row);
  }

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
  let el = $('table-container');
  let popup = document.createElement('div');
  let exit = document.createElement('button');
  let select = document.createElement('select');
  let option = document.createElement('option');
  let store;

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
    let option = document.createElement('option');
    option.setAttribute('value', `${store.name}`);
    option.innerHTML = store.name;
    select.appendChild(option);
  }


  popup.appendChild(select);
  popup.appendChild(exit);
  el.appendChild(popup);

  select.addEventListener('change', input);
}

// on selection, present input fields with default values to update Store params
function input() {
  if (!$('store-select').value) {
    return;
  }

  let popup = $('popup');
  popup.removeChild($('exit-update'));
  let submit = document.createElement('button');
  let exit = document.createElement('button');

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
  let div = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');
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
  let el = $('table-container');
  let popup = $('popup');
  let select = $('store-select');
  let min = $('min');
  let max = $('max');
  let avg = $('avg');

  let store = lookup.get(select.value);
  // console.log(store);

  store.min = parseInt(min.value);
  store.max = parseInt(max.value);
  store.avg = parseInt(avg.value);
  // console.log(min, max, avg);
  // console.log(store.min, store,max, store.avg);
  store.project();
  display();

  el.removeChild(popup);
}


function exitUpdate() {
  $('table-container').removeChild($('popup'));
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
