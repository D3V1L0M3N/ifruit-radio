module.exports = {
  convertUnix: (ts) => {
    let d = new Date();
    let nowTs = Math.floor(d.getTime() / 1000);
    let seconds = nowTs - ts;
    if (seconds > 2*24*3600) { return `a few days ago`; }
    if (seconds > 24*3600) { return `yesterday`; }
    if (seconds > 3600) { return `a few hours ago`; }
    if (seconds > 1800) { return `Half an hour ago`; }
    if (seconds > 60) { return Math.floor(seconds/60) + ` minutes ago`; }
  },
  
  msToTime: (duration) => {
    let seconds      = Math.floor((duration / 1000) % 60),
        minutes      = Math.floor((duration / (1000 * 60)) % 60),
        hours        = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days         = Math.floor(duration / (1000 * 60 * 60 * 24));
    days = (days < 10) ? "0" + days : days;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`;
  },

  asyncForEach: async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  },

  waitFor: (ms) => new Promise(r => setTimeout(r, ms)),

  timedPromise: (callback) => {
    return new Promise((resolve, reject) => {
      // Set up the timeout
      const timer = setTimeout(() => { reject(new Error(`Promise timed out after 5000ms`)); }, 60000);

      // Set up the real work
      callback((value) => {
        clearTimeout(timer);
        resolve(value);
      }, (error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  }
}