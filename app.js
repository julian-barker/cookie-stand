
const $ = (x) => {return document.getElementById(x);};
const _ = (x) => {return document.createElement(x);};

if ( document.querySelector('title').getAttribute('id') === 'home') {
  $('gallery-select').addEventListener('click', gallerySelect);
}

$('ld-switch').addEventListener('click', lightDark);

const lookup = new Map();
const opening = 6;
const closing = 20;
const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];
// const traffic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const hours = createHours(opening, closing);
const totalHourlySales = new Array(closing - opening + 1).fill(0);
const totalHourlyStaff = new Array(closing - opening).fill(0);

const storePrototype = {
  project() {
    let i;
    let total = 0;
    const workers = [];
    const temp = [];
    for (i = 0; i < hours.length - 1; i++) {
      let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg * traffic[i]);
      const worker = Math.ceil(sales / 20);
      workers.push(worker > 1 ? worker : 2); //min of 2 workers per shift
      temp.push(sales);
      total += sales;
    }

    temp.push(total);
    this.workers = workers;
    this.dailyTotal = total;
    this.projection = temp;
  },

  render() {
    const table = $('sales-table');

    let row = _('tr');
    row.innerHTML += `<td>${this.name}</td>`; //populate location column

    let i;
    for (i in this.projection) {
      // console.log(`store: ${store.name}; i = ${i}`);
      row.innerHTML += `<td>${this.projection[i]}</td>`;
      totalHourlySales[i] += this.projection[i];
    }
    table.appendChild(row);
  }
};

Object.setPrototypeOf(Store.prototype, storePrototype);
// console.log (storePrototype);
// console.log(Store);
const stores = [];

new Store('Seattle', 23, 65, 6.3);
new Store('Tokyo', 3, 24, 1.2);
new Store('Dubai', 11, 38, 3.7);
new Store('Paris', 20, 38, 2.3);
new Store('Lima', 2, 16, 4.6);

// const Seattle = new Store('Seattle', 23, 65, 6.3);
// const Tokyo = new Store('Tokyo', 3, 24, 1.2);
// const Dubai = new Store('Dubai', 11, 38, 3.7);
// const Paris = new Store('Paris', 20, 38, 2.3);
// const Lima = new Store('Lima', 2, 16, 4.6);

// const stores = [Seattle, Tokyo, Dubai, Paris, Lima];

displaySales();
displayStaff();
displayStores();
$('choose-store').addEventListener('click', chooseStore);



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
  this.project();
  lookup.set(name, this);
  stores.push(this);
}


// displays Stores as a table
function displaySales() {
  const tab = $('sales-table');
  while (tab.firstChild) {
    tab.removeChild(tab.firstChild);
  }
  totalHourlySales.fill(0);

  const colgroup = _('colgroup');
  const colLocations = _('col');
  const colValues = _('col');
  const colTotals = _('col');

  colLocations.setAttribute('id', 'locations');
  colValues.setAttribute('span', '14');
  colValues.setAttribute('class', 'table-values');
  colTotals.setAttribute('id', 'daily-totals');
  colgroup.appendChild(colLocations);
  colgroup.appendChild(colValues);
  colgroup.appendChild(colTotals);

  renderColgroup();
  renderHeading();
  let store;
  for (store of stores) {
    store.render();
  }
  renderTotals();
}


// insert colgroup element
function renderColgroup() {
  const tab = $('sales-table');
  const colgroup = _('colgroup');
  const colLocations = _('col');
  const colValues = _('col');
  const colTotals = _('col');

  colLocations.setAttribute('id', 'table-locations');
  colValues.setAttribute('span', '14');
  colValues.setAttribute('class', 'table-values');
  colTotals.setAttribute('id', 'daily-totals');
  colgroup.appendChild(colLocations);
  colgroup.appendChild(colValues);
  colgroup.appendChild(colTotals);

  tab.appendChild(colgroup);
}


// insert table headings row
function renderHeading() {
  const tab = $('sales-table');
  const thead = _('thead');
  const headings = _('tr');
  headings.innerHTML = '<th>Location</th>';

  let i;
  for (i in hours) {
    headings.innerHTML += `<th>${hours[i]}</th>`;
  }
  thead.appendChild(headings);
  tab.appendChild(thead);
}


// insert table totals row
function renderTotals() {
  const tab = $('sales-table');
  const totals = _('tr');
  totals.innerHTML = '<th>Total</th>';

  let i;
  for (i in hours) {
    totals.innerHTML += `<th>${totalHourlySales[i]}</th>`;
  }
  tab.appendChild(totals);
}


// displays table of staff requirements
function displayStaff() {
  const tab = $('staff-table');
  while (tab.firstChild) {
    tab.removeChild(tab.firstChild);
  }

  const colgroup = _('colgroup');
  const colLocations = _('col');
  const colValues = _('col');

  colLocations.setAttribute('id', 'locations');
  colValues.setAttribute('span', '14');
  colValues.setAttribute('class', 'table-values');
  colgroup.appendChild(colLocations);
  colgroup.appendChild(colValues);

  // create headings and totals rows with first column elements
  const thead = _('thead');
  const headings = _('tr');
  const totals = _('tr');
  headings.innerHTML = '<th>Location</th>';
  totals.innerHTML = '<td>Totals</td>';
  totalHourlyStaff.fill(0);

  // populate data rows
  let store;
  for (store of stores) {
    let row = _('tr');
    row.innerHTML = `<td>${store.name}</td>`; //populate location column

    let i;
    for (i in store.workers) {
      // console.log(`store: ${store.name}; i = ${i}`, store.workers[i]);
      row.innerHTML += `<td>${store.workers[i]}</td>`;
      totalHourlyStaff[i] += store.workers[i];
    }
    tab.appendChild(row);
  }

  // populate headings and totals rows
  let j;
  for (j = 0; j < hours.length - 1; j++) {
    headings.innerHTML += `<th>${hours[j]}</th>`;
    totals.innerHTML += `<td>${totalHourlyStaff[j]}</td>`;
  }
  tab.appendChild(totals);
  thead.appendChild(headings);
  tab.prepend(thead);
  tab.prepend(colgroup);
}

// displays store params
function displayStores() {
  const container = $('params-container');
  if ($('stats-body')) {
    container.removeChild($('stats-body'));
  }
  const body = _('div');

  body.setAttribute('id', 'stats-body');

  let store;
  for (store of stores) {
    const stats = _('div');
    stats.setAttribute('id', `stats-${store.name}`);
    stats.innerHTML += `<h3>${store.name}</h3>`;
    stats.innerHTML += `<p>High (cust/hr): ${store.max}</p>`;
    stats.innerHTML += `<p>Low (cust/hr): ${store.min}</p>`;
    stats.innerHTML += `<p>Avg Purchase: ${store.avg}</p>`;
    body.appendChild(stats);
  }
  container.insertBefore(body, $('choose-store'));
}

// brings up Store selection menu as popup on button push
function chooseStore() {
  if ($('popup')) {
    return;
  }

  let container = $('sales-container');
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

  let popup = $('popup');
  popup.removeChild($('exit-update'));
  let submit = _('button');
  let exit = _('button');

  submit.setAttribute('id','submit-update');
  //submit.setAttribute('onclick', 'update()');
  submit.addEventListener('click', update);
  submit.innerHTML = 'Update Values';

  exit.setAttribute('id','exit-update');
  exit.addEventListener('click', exitUpdate);
  exit.innerHTML = 'Cancel';

  addInputField(popup, 'min');
  addInputField(popup, 'max');
  addInputField(popup, 'avg');
  popup.appendChild(submit);
  popup.appendChild(exit);
}

// helper function to add an input element
function addInputField(container, value) {
  let div = _('div');
  let label = _('label');
  let input = _('input');
  let store = lookup.get($('store-select').value);

  if ($(`${value}-container`)) {
    container.removeChild($(`${value}-container`));
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
  container.appendChild(div);
}

// on submission, alters store params with input values and reruns projection for that Store
function update() {
  let select = $('store-select');
  let min = $('min');
  let max = $('max');
  let avg = $('avg');

  let store = lookup.get(select.value);

  store.min = parseInt(min.value);
  store.max = parseInt(max.value);
  store.avg = parseInt(avg.value);

  store.project();
  displaySales();
  displayStaff();
  displayStores();
  exitUpdate();
}

function exitUpdate() {
  $('sales-container').removeChild($('popup-blur'));
}


function lightDark() {
  const page = document.querySelector('html');
  page.classList.toggle('dark');
}


function gallerySelect(e) {
  const pic = $('gallery-display');
  const src = e.target.getAttribute('src');
  const alt = e.target.getAttribute('alt');
  pic.setAttribute('src', src);
  pic.setAttribute('alt', alt);
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
