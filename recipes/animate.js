const colors = require('ansi-colors');
const noop = () => {};

class Animate {
  constructor(options = {}) {
    this.options = options;
    this.frames = options.frames || [];
    this.maxTime = options.maxTime || 120000;
    this.framerate = options.framerate || 80;
    this.onUpdate = options.onUpdate || noop;
    this.onStart = options.onStart || noop;
    this.onStop = options.onStop || noop;
    this.onFail = options.onFail || noop;
    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.fail = this.fail.bind(this);
    this.timer = { timeout: null, count: 0, index: options.index || 0 };
  }

  ele(arr, i = this.timer.index) {
    return arr[i % arr.length];
  }

  frame() {
    return this.ele(this.frames);
  }

  async start() {
    this.failed = setTimeout(this.fail, this.maxTime);
    await this.onStart.call(this, this.timer);
    await this.update();
  }

  async update() {
    clearTimeout(this.timer.timeout);
    this.timer.timeout = setTimeout(async() => {
      await this.onUpdate.call(this, this.timer);
      await this.update(++this.timer.index);
    }, this.framerate);
  }

  async stop() {
    clearTimeout(this.failed);
    clearTimeout(this.timer.timeout);
    await this.onStop.call(this, this.timer);
  }

  async fail() {
    await this.onFail.call(this, this.timer);
    await this.stop();
  }
}

module.exports = Animate;

// const repeatElements = (arr, times = 5) => {
//   let res = [];
//   for (let ele of arr) {
//     res.push(...Array(times).fill(ele));
//   }
//   return res;
// };

// const remove = (arr, blacklist) => {
//   let omit = blacklist || ['black', 'gray', 'grey', 'white'];
//   return arr.filter(ele => !omit.includes(ele));
// };

// const ansi = require('../lib/ansi');
// const write = str => process.stdout.write(str);

// const animate = new Animate({
//   maxTime: 5000,
//   frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
//   onStart() {
//     write(ansi.cursor.hide());
//   },
//   onUpdate() {
//     write('\r' + this.frame());
//   },
//   onStop() {
//     write(ansi.cursor.show());
//     write('\n');
//   },
//   onFail() {
//     console.log(colors.red('Oh no! It failed!'));
//   }
// });

// const animate = (options = {}) => {
//   let { prompt } = options;

//   return new Animate({
//     maxTime: 5000,
//     frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
//     onStop: () => options.prompt.render(),
//     ...options
//   });
// };

// animate.start();
