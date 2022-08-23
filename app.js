function $(x) {
  return document.getElementById(x);
}

class Store {
  constructor (name, min, max, avgSales) {
    this.name = name;
    this.min = min;
    this.max = max;
    this.avg = avgSales;
    this.sim = [];
    this.simulate();
  }

  getSim() {
    return this.sim;
  }

  simulate() {
    let i;
    let total = 0;
    const temp = [];
    for (i = 6; i < 20; i++) {
      let t = (i + 11) % 12 + 1;
      let m = Math.floor(i/12) ? 'pm' : 'am';
      let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg);
      temp.push(`${t}${m}: ${sales} cookies`);
      total += sales;
    }
    temp.push(`Total: ${total} cookies`);
    this.sim = temp;
    this.getSim();
  }
}

const Seattle = new Store('Seattle', 23, 65, 6.3);
const Tokyo = new Store('Tokyo', 3, 24, 1.2);
const Dubai = new Store('Dubai', 11, 38, 3.7);
const Paris = new Store('Paris', 20, 38, 2.3);
const Lima = new Store('Lima', 2, 16, 4.6);

const stores = [Seattle, Tokyo, Dubai, Paris, Lima];

function display() {
  let i;
  const tab = $('table');
  let headings = document.createElement('tr');
  headings.innerHTML += '<th>Time</th>';
  for (let store of stores){
    headings.innerHTML += `<th>${store.name}</th>`;
  }
  tab.appendChild(headings);
  for (i = 6; i < 20; i++) {
    let t = (i + 11) % 12 + 1;
    let m = Math.floor(i/12) ? 'pm' : 'am';
    let row = document.createElement('tr');
    row.innerHTML += `<td>${t}${m}</td>`;
    for (let store of stores){
      let str = store.sim[i-6];
      console.log(str);
      let cookies = str.slice(str.search(': ') + 2);
      console.log(cookies);
      row.innerHTML += `<td>${cookies}</td>`;
    }
    tab.appendChild(row);
  }
  let totals = document.createElement('tr');
  totals.innerHTML += '<td>Totals</td>';
  for (let store of stores){
    let str = store.sim[i-6];
    console.log(str);
    let cookies = str.slice(str.search(': ') + 2);
    console.log(cookies);
    totals.innerHTML += `<td>${cookies}</td>`;
  }
  tab.appendChild(totals);
}

// display();

// function display2(store) {
//   let location = store.name;
//   console.log(location.toLowerCase());
//   let el = $(location.toLowerCase());
//   for (let hour of store.sim) {
//     el.innerHTML += `<li>${hour}</li>`;
//   }
// }

// for (let store of stores) {
//   display2(store);
// }


function chooseStore() {
  // if ($('popup') === null) {
  //   return;
  // }

  if ($('popup')) {
    return;
  }
  let el = $('sales-update');
  let popup = document.createElement('div');
  let select = document.createElement('select');
  let option = document.createElement('option');
  let store;

  popup.setAttribute('id', 'popup');

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
  el.appendChild(popup);

  select.addEventListener('change', input);
}


function input() {
  // let select = $('store-select');
  if (!$('store-select').value) {
    return;
  }

  let el = $('popup');
  let submit = document.createElement('button');

  submit.setAttribute('id','submit-update');
  submit.setAttribute('onclick', 'update()');
  submit.innerHTML = 'Update Values';

  addInputField(el, 'min');
  addInputField(el, 'max');
  addInputField(el, 'avg');
  el.appendChild(submit);
}


function addInputField(el, value) {
  let div = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');

  if ($(`${value}-container`)) {
    el.removeChild($(`${value}-container`));
  }
  div.setAttribute('id', `${value}-container`);

  label.setAttribute('for', value);
  label.innerHTML = `${value}:`;

  input.setAttribute('type', 'number');
  input.setAttribute('id', value);
  input.setAttribute('name', value);

  div.appendChild(label);
  div.appendChild(input);
  el.appendChild(div);

}


function update() {
  let el = $('sales-update');
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
  project(store);
  display();

  el.removeChild(popup);
}
// console.log(seattle);

