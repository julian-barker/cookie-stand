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

const Seattle = new Store('Seattle', 23, 65, 6.3);
const Tokyo = new Store('Tokyo', 3, 24, 1.2);
const Dubai = new Store('Dubai', 11, 38, 3.7);
const Paris = new Store('Paris', 20, 38, 2.3);
const Lima = new Store('Lima', 2, 16, 4.6);

console.log(Seattle, Tokyo, Dubai, Paris, Lima);
