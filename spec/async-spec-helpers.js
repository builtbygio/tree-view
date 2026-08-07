var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var async_spec_helpers_exports = {};
__export(async_spec_helpers_exports, {
  afterEach: () => afterEach,
  beforeEach: () => beforeEach,
  conditionPromise: () => conditionPromise,
  emitterEventPromise: () => emitterEventPromise,
  promisify: () => promisify,
  promisifySome: () => promisifySome,
  timeoutPromise: () => timeoutPromise
});
module.exports = __toCommonJS(async_spec_helpers_exports);
function beforeEach(fn) {
  global.beforeEach(function() {
    const result = fn();
    if (result instanceof Promise) {
      waitsForPromise(() => result);
    }
  });
}
function afterEach(fn) {
  global.afterEach(function() {
    const result = fn();
    if (result instanceof Promise) {
      waitsForPromise(() => result);
    }
  });
}
["it", "fit", "ffit", "fffit"].forEach(function(name) {
  module.exports[name] = function(description, fn) {
    if (fn === void 0) {
      global[name](description);
      return;
    }
    global[name](description, function() {
      const result = fn();
      if (result instanceof Promise) {
        waitsForPromise(() => result);
      }
    });
  };
});
async function conditionPromise(condition, description = "anonymous condition") {
  const startTime = Date.now();
  while (true) {
    await timeoutPromise(100);
    if (await condition()) {
      return;
    }
    if (Date.now() - startTime > 5e3) {
      throw new Error("Timed out waiting on " + description);
    }
  }
}
function timeoutPromise(timeout) {
  return new Promise(function(resolve) {
    global.setTimeout(resolve, timeout);
  });
}
function waitsForPromise(fn) {
  const promise = fn();
  global.waitsFor("spec promise to resolve", function(done) {
    promise.then(done, function(error) {
      jasmine.getEnv().currentSpec.fail(error);
      done();
    });
  });
}
function emitterEventPromise(emitter, event, timeout = 15e3) {
  return new Promise((resolve, reject) => {
    const timeoutHandle = setTimeout(() => {
      reject(new Error(`Timed out waiting for '${event}' event`));
    }, timeout);
    emitter.once(event, () => {
      clearTimeout(timeoutHandle);
      resolve();
    });
  });
}
function promisify(original) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      args.push((err, ...results) => {
        if (err) {
          reject(err);
        } else {
          resolve(...results);
        }
      });
      return original(...args);
    });
  };
}
function promisifySome(obj, fnNames) {
  const result = {};
  for (const fnName of fnNames) {
    result[fnName] = promisify(obj[fnName]);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  afterEach,
  beforeEach,
  conditionPromise,
  emitterEventPromise,
  promisify,
  promisifySome,
  timeoutPromise
});
