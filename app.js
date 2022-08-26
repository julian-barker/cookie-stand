
const $ = (x) => {return document.getElementById(x);};
const _ = (x) => {return document.createElement(x);};

if ( document.querySelector('title').getAttribute('id') === 'home') {
  $('gallery-select').addEventListener('click', gallerySelect);
}

if ( document.querySelector('title').getAttribute('id') === 'order') {
  $('order-form').addEventListener('submit', placeOrder);
}

$('ld-switch').addEventListener('click', lightDark);

const lookup = new Map();
const opening = 6;
const closing = 20;
const traffic = [0.5, 0.75, 1.0, 0.6, 0.8, 1.0, 0.7, 0.4, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6];

const hours = createHours(opening, closing);
const totalHourlySales = new Array(closing - opening + 1).fill(0);
const totalHourlyStaff = new Array(closing - opening).fill(0);

const orders = [];

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

  renderSales() {
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
  },

  renderStaff() {
    const table = $('staff-table');

    let row = _('tr');
    row.innerHTML += `<td>${this.name}</td>`; //populate location column

    let i;
    for (i in this.workers) {
      // console.log(`store: ${store.name}; i = ${i}`);
      row.innerHTML += `<td>${this.workers[i]}</td>`;
      totalHourlyStaff[i] += this.workers[i];
    }
    table.appendChild(row);
  },

  renderStores(body) {
    const stats = _('div');
    stats.setAttribute('id', `stats-${this.name}`);
    stats.innerHTML += `<h4>${this.name}</h4>`;
    stats.innerHTML += `<p>High (cust/hr): ${this.max}</p>`;
    stats.innerHTML += `<p>Low (cust/hr): ${this.min}</p>`;
    stats.innerHTML += `<p>Avg Purchase: ${this.avg}</p>`;
    body.appendChild(stats);
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

displaySales();
displayStaff();
displayStores();
$('choose-store').addEventListener('click', chooseStore);
$('add-store').addEventListener('click', addStore);




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


// constructor function for Orders
function Order(first, last, street, city, state, zip, phone, email, comments, type, qty) {
  this.name = [first, last];
  this.address = [street, city, state, zip];
  this.phone = phone;
  this.email = email;
  this.comments = comments;
  this.order = [type, qty];
  orders.push(this);
}



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


// displays Stores as a table
function displaySales() {
  const table = $('sales-table');
  if (table.innerHTML) table.innerHTML = '';
  totalHourlySales.fill(0);

  renderHeading(table, hours.length);
  let store;
  for (store of stores) {
    store.renderSales();
  }
  renderTotals(table, hours.length);
}


function displayStaff() {
  const table = $('staff-table');
  if (table.innerHTML) table.innerHTML = '';
  totalHourlyStaff.fill(0);

  renderHeading(table, totalHourlyStaff.length);
  let store;
  for (store of stores) {
    store.renderStaff();
  }
  renderTotals(table, totalHourlyStaff.length);
}


// insert table headings row
function renderHeading(table, len) {
  // const tab = $('sales-table');
  const thead = _('thead');
  const headings = _('tr');
  headings.innerHTML = '<th>Location</th>';

  let i;
  // for (i in hours) {
  for (i = 0; i < len; i++) {
    headings.innerHTML += `<th>${hours[i]}</th>`;
  }
  thead.appendChild(headings);
  table.appendChild(thead);
}


// insert table totals row
function renderTotals(table, len) {
  // const tab = $('sales-table');
  const totals = _('tr');
  totals.innerHTML = '<th>Total</th>';

  let i;
  // for (i in hours) {
  for (i = 0; i < len; i++) {
    totals.innerHTML += `<th>${totalHourlySales[i]}</th>`;
  }
  table.appendChild(totals);
}


// displays store params
function displayStores() {
  const body = $('stats-body');
  if (body.innerHTML) {
    body.innerHTML = '';
  }

  let store;
  for (store of stores) {
    store.renderStores(body);
  }
}


function addStore() {
  if ($('popup')) {
    return;
  }

  let container = document.querySelector('main');
  let blur = _('div');
  let popup = _('div');
  let form = _('form');
  const fieldset = _('fieldset');
  let ul = _('ul');
  let submit = _('button');
  let exit = _('button');

  blur.setAttribute('id', 'popup-blur');
  popup.setAttribute('id', 'popup');

  form.setAttribute('id', 'new-store-form');

  submit.setAttribute('id','submit-update');
  submit.addEventListener('click', submitStore);
  submit.innerHTML = 'Add Store';

  exit.setAttribute('id','exit-add');
  exit.addEventListener('click', exitPopup);
  exit.innerHTML = 'Cancel';

  addInputField(ul, 'name');
  addInputField(ul, 'min');
  addInputField(ul, 'max');
  addInputField(ul, 'avg');

  fieldset.appendChild(ul);
  form.appendChild(fieldset);
  popup.appendChild(form);
  popup.appendChild(submit);
  popup.appendChild(exit);
  blur.appendChild(popup);
  container.prepend(blur);
}

function submitStore() {
  const name = document.querySelector('#name-input').value;
  if (lookup.get(name)) {
    alert('That store already exists!');
    return;
  }

  const min = parseInt(document.querySelector('#min-input').value);
  const max = parseInt(document.querySelector('#max-input').value);
  const avg = parseInt(document.querySelector('#avg-input').value);

  const store = new Store(name, min, max, avg);

  store.project();
  displaySales();
  displayStaff();
  displayStores();
  exitPopup();
}

// brings up Store selection menu as popup on button push
function chooseStore() {
  if ($('popup')) {
    return;
  }

  let container = document.querySelector('main');
  let blur = _('div');
  let popup = _('div');
  let exit = _('button');
  let select = _('select');
  let option = _('option');
  let store;


  blur.setAttribute('id', 'popup-blur');
  popup.setAttribute('id', 'popup');

  exit.setAttribute('id','exit-update');
  exit.addEventListener('click', exitPopup);
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
  container.prepend(blur);

  select.addEventListener('change', input);
}

// on selection, present input fields with default values to update Store params
function input() {
  if (!$('store-select').value) {
    return;
  }

  const popup = $('popup');
  popup.removeChild($('exit-update'));

  const ul = _('ul');
  const submit = _('button');
  const exit = _('button');

  submit.setAttribute('id','submit-update');
  submit.addEventListener('click', update);
  submit.innerHTML = 'Update Values';

  exit.setAttribute('id','exit-update');
  exit.addEventListener('click', exitPopup);
  exit.innerHTML = 'Cancel';

  addUpdateField(ul, 'min');
  addUpdateField(ul, 'max');
  addUpdateField(ul, 'avg');

  popup.appendChild(ul);
  popup.appendChild(submit);
  popup.appendChild(exit);
}

// helper function to add an input element
function addUpdateField(container, value) {
  let li = _('li');
  let label = _('label');
  let input = _('input');
  let store = lookup.get($('store-select').value);

  if ($(`${value}-container`)) {
    container.removeChild($(`${value}-container`));
  }

  li.setAttribute('id', `${value}-container`);

  label.setAttribute('for', value);
  label.innerHTML = `${value}: `;

  input.setAttribute('type', 'number');
  input.setAttribute('id', `${value}-input`);
  input.setAttribute('name', value);
  input.setAttribute('value', store[value]);

  li.appendChild(label);
  li.appendChild(input);
  container.appendChild(li);
}

function addInputField(container, value) {
  const li = _('li');
  const label = _('label');
  const input = _('input');


  li.setAttribute('id', `${value}-container`);

  label.setAttribute('for', value);
  label.innerHTML = `${value}: `;

  input.setAttribute('type', 'text');
  input.setAttribute('id', `${value}-input`);
  input.setAttribute('name', value);

  li.appendChild(label);
  li.appendChild(input);
  container.appendChild(li);
}

// on submission, alters store params with input values and reruns projection for that Store
function update() {
  const select = $('store-select');
  const min = $('min-input');
  const max = $('max-input');
  const avg = $('avg-input');

  const store = lookup.get(select.value);

  store.min = parseInt(min.value);
  store.max = parseInt(max.value);
  store.avg = parseInt(avg.value);

  store.project();
  displaySales();
  displayStaff();
  displayStores();
  exitPopup();
}

function exitPopup() {
  document.querySelector('main').removeChild($('popup-blur'));
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


function placeOrder(event) {
  event.preventDefault();

  const form = $('order-form');
  const response = form.querySelectorAll('input');
  const type = response[0].value;
  const qty = response[1].value;
  const first = response[2].value;
  const last = response[3].value;
  const street = response[4].value;
  const city = response[5].value;
  const zip = response[6].value;
  const phone = response[7].value;
  const email = response[8].value;
  const state = form.querySelector('select').value;
  const comments = form.querySelector('textarea').value;
  new Order(first, last, street, city, state, zip, phone, email, comments, type, qty);
}
