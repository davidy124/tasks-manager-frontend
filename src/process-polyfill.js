if (typeof process === 'undefined') {
  global.process = {
    env: {},
    browser: true
  };
}

