function $(x) {
  return document.getElementById(x);
}

const seattle = {
  name: 'Seattle',
  min: 23,
  max: 65,
  avg: 6.3,
  arr: []
};

const tokyo = {
  name: 'Tokyo',
  min: 3,
  max: 24,
  avg: 1.2,
  arr: []
};

const dubai = {
  name: 'Dubai',
  min: 11,
  max: 38,
  avg: 3.7,
  arr: []
};

const paris = {
  name: 'Paris',
  min: 20,
  max: 38,
  avg: 2.3,
  arr: []
};

const lima = {
  name: 'Lima',
  min: 2,
  max: 16,
  avg: 4.6,
  arr: []
};

const stores = [seattle, tokyo, dubai, paris, lima];
const lookup = new Map();
for (let store of stores) {
  lookup.set(store.name, store);
}

function project(obj) {
  let i;
  let total = 0;
  obj.arr = [];
  for (i = 6; i < 20; i++) {
    let t = (i + 11) % 12 + 1;
    let m = Math.floor(i/12) ? 'pm' : 'am';
    // console.log (min, max, avg);
    let sales = Math.floor((Math.random() * (obj.max - obj.min + 1) + obj.min) * obj.avg);
    obj.arr.push(`${t}${m}: ${sales} cookies`);
    total += sales;
  }
  obj.arr.push(`Total: ${total} cookies`);
}

display();

function display() {
  let el = $('sales-tracker-2');
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  for (let store of stores) {
    project(store);
    let div = document.createElement('div');
    div.innerHTML += `<h2>${store.name}</h2>`;
    let ul = document.createElement('ul');
    for (let hr of store.arr) {
      let li = document.createElement('li');
      li.innerHTML = hr;
      ul.appendChild(li);
    }
    div.appendChild(ul);
    el.appendChild(div);
  }
}



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
