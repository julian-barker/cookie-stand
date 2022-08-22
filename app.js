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
      let t = i % 12;
      let m = Math.floor(i/12) ? 'pm' : 'am';
      let sales = Math.floor((Math.random() * (this.max - this.min + 1) + this.min) * this.avg);
      temp.push(`${t}${m}: ${sales} cookies`);
      total += sales;
    }
    temp.push(`Total: ${total} cookies`);
    this.sim = temp;
    this.getSim();
  }

  // update(min, max, avg) {
  //   for (let arg of arguments) {
  //     if (arg !== undefined) {
  //       this[arg] = arg;
  //     }
  //   }
  //   this.simulate();
  //   return 'stats and simulation updated';
  // }
}


// const Seattle2 = {
//   min: 4,
//   max: 7,
//   avg: 7,
// };

const Seattle = new Store('Seattle', 23, 65, 6.3);
const Tokyo = new Store('Tokyo', 3, 24, 1.2);
const Dubai = new Store('Dubai', 11, 38, 3.7);
const Paris = new Store('Paris', 20, 38, 2.3);
const Lima = new Store('Lima', 2, 16, 4.6);

const stores = [Seattle, Tokyo, Dubai, Paris, Lima];

function display() {
  let i;
  const tab = $('table');
  let title = document.createElement('h2');
  let headings = document.createElement('tr');
  headings.innerHTML += '<th>Time</th>';
  for (let store of stores){
    headings.innerHTML += `<th>${store.name}</th>`;
  }
  tab.appendChild(headings);
  for (i = 6; i < 20; i++) {
    let t = i % 12;
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

console.log(Seattle, Tokyo, Dubai, Paris, Lima);
display();
