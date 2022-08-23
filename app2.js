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

console.log(seattle);
