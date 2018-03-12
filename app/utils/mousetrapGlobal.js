/* eslint-disable no-param-reassign */
// ADAPTED FROM https://github.com/ccampbell/mousetrap/blob/dddbe0a977ec799cbd603136789df27656a64f61/plugins/global-bind/mousetrap-global-bind.js

/**
 * adds a bindGlobal method to Mousetrap that allows you to
 * bind specific keyboard shortcuts that will still work
 * inside a text input field
 *
 * usage:
 * Mousetrap.bindGlobal('ctrl+s', _saveChanges);
 */

export default function (Mousetrap) {
  const _globalCallbacks = {};
  const _originalStopCallback = Mousetrap.prototype.stopCallback;

  Mousetrap.prototype.stopCallback = function (e, element, combo, sequence) {
    const self = this;

    if (self.paused) {
      return true;
    }

    if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
      return false;
    }

    return _originalStopCallback.call(self, e, element, combo);
  };

  Mousetrap.prototype.bindGlobal = function (keys, callback, action) {
    const self = this;
    self.bind(keys, callback, action);

    if (keys instanceof Array) {
      for (let i = 0; i < keys.length; i++) {
        _globalCallbacks[keys[i]] = true;
      }
      return;
    }

    _globalCallbacks[keys] = true;
  };

  Mousetrap.init();
}
