function $(x) {
  return document.getElementById(x);
}

const seattle = {
  name: 'seattle',
  min: 23,
  max: 65,
  avg: 6.3,
  arr: []
};

const tokyo = {
  name: 'tokyo',
  min: 3,
  max: 24,
  avg: 1.2,
  arr: []
};

const dubai = {
  name: 'dubai',
  min: 11,
  max: 38,
  avg: 3.7,
  arr: []
};

const paris = {
  name: 'paris',
  min: 20,
  max: 38,
  avg: 2.3,
  arr: []
};

const lima = {
  name: 'lima',
  min: 2,
  max: 16,
  avg: 4.6,
  arr: []
};

const stores = [seattle, tokyo, dubai, paris, lima];

function project(obj) {
  let i;
  let total = 0;
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


for (let store of stores) {
  project(store);
  let el = $('sales-tracker-2');
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


function chooseStore() {
  // if ($('popup') === null) {
  //   return;
  // }
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

  popup.addEventListener()
}

function update() {
  let el = $('popup');

  addInputField(el, 'min');
  addInputField(el, 'max');
  addInputField(el, 'avg');


  // let minLabel = document.createElement('label');
  // minLabel.setAttribute('for', 'min');
  // let minInput = document.createElement('input');
  // minInput.setAttribute('type', 'number');
  // minInput.setAttribute('id', 'min');
  // minInput.setAttribute('name', 'min');

  // let maxLabel = document.createElement('label');
  // maxLabel.setAttribute('for', 'max');
  // let maxInput = document.createElement('input');
  // maxInput.setAttribute('type', 'number');
  // maxInput.setAttribute('id', 'max');
  // maxInput.setAttribute('name', 'max');

  // let avgLabel = document.createElement('label');
  // avgLabel.setAttribute('for', 'avg');
  // let avgInput = document.createElement('input');
  // avgInput.setAttribute('type', 'number');
  // avgInput.setAttribute('id', 'avg');
  // avgInput.setAttribute('name', 'avg');

}

function addInputField(el, value) {
  let div = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');

  div.setAttribute('id', `${value}-container`);

  label.setAttribute('for', value);

  input.setAttribute('type', 'number');
  input.setAttribute('id', value);
  input.setAttribute('name', value);

  div.appendChild(label);
  div.appendChild(input);
  el.appendChild(div);

}
// console.log(seattle);
