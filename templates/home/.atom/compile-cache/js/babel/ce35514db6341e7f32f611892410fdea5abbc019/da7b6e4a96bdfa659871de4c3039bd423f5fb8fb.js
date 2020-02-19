Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getDeep = getDeep;
exports.elementPropInHierarcy = elementPropInHierarcy;
exports.eachElementInHierarchy = eachElementInHierarchy;
exports.shortenPath = shortenPath;
exports.location = location;
exports.debounce = debounce;
exports.shallowEqual = shallowEqual;
exports.editorStyle = editorStyle;
exports.getEditor = getEditor;
exports.openFile = openFile;
exports.isValidEditor = isValidEditor;
exports.saveAllEditors = saveAllEditors;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var REGEX_TO_INDEX = /\[["']?(\w+)["']?]/g;
var REGEX_LEADING_DOT = /^\./;

function getDeep(o, path) {
  path = path
  // convert indexes to properties (like a["b"]['c'][0])
  .replace(REGEX_TO_INDEX, '.$1')
  // strip a leading dot (as it might occur because of the previous replace)
  .replace(REGEX_LEADING_DOT, '').split('.');

  var obj = o;
  while (obj && path.length) {
    var n = path.shift();
    obj = obj[n];
  }
  return obj;
}

function elementPropInHierarcy(element, prop) {
  var el = eachElementInHierarchy(element, function (el) {
    return getDeep(el, prop) !== undefined;
  });
  return getDeep(el, prop);
}

function eachElementInHierarchy(element, fn) {
  while (element && !fn(element)) {
    element = element.parentElement;
  }
  return element;
}

function shortenPath(file) {
  return _path2['default'].normalize(file).split(_path2['default'].sep).slice(-2).join(_path2['default'].sep);
}

function location(file, line) {
  if (typeof file === 'object') {
    var _file = file;
    file = _file.file;
    line = _file.line;
  }
  return shortenPath(file) + ':' + (line + 1);
}

function debounce(func, wait) {
  if (!wait) {
    return func;
  }
  var timeout = undefined;
  var fn = function fn() {
    var context = this;
    var args = arguments;
    fn.cancel();
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
  fn.cancel = function () {
    return clearTimeout(timeout);
  };
  return fn;
}

/**
 * Checks if at least the all keys in new props strict equal exist in the old props
 * @param  {Object} [oldProps={}] The old props
 * @param  {Object} [newProps={}] The new props
 * @return {bool}
 */

function shallowEqual() {
  var oldProps = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var newProps = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var newKeys = Object.keys(newProps).sort();
  var oldKeys = Object.keys(oldProps).sort();

  // check if all keys are in the old props
  if (!newKeys.every(function (key) {
    return oldKeys.includes(key);
  })) {
    return false;
  }

  return newKeys.every(function (key) {
    return newProps[key] === oldProps[key];
  });
}

var style = undefined;

function editorStyle() {
  if (!style) {
    style = {
      'font-family': atom.config.get('editor.fontFamily'),
      'font-size': atom.config.get('editor.fontSize') + 'px',
      'line-height': atom.config.get('editor.lineHeight')
    };
  }
  return style;
}

function getEditor() {
  return atom.workspace.getActiveTextEditor() || atom.workspace.getCenter().getActiveTextEditor();
}

function openFile(file, line, column) {
  return atom.workspace.open(file, { initialLine: line, searchAllPanes: true }).then(function (editor) {
    editor.scrollToBufferPosition([line, column], { center: true });
    return editor;
  });
}

function isValidEditor(e) {
  if (!e || !e.getGrammar) {
    return false;
  }
  var grammar = e.getGrammar();
  if (!grammar) {
    return false;
  }
  return grammar.scopeName === 'source.go';
}

function saveAllEditors() {
  var promises = [];
  for (var editor of atom.workspace.getTextEditors()) {
    if (editor.isModified() && isValidEditor(editor)) {
      promises.push(editor.save());
    }
  }
  return Promise.all(promises);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLWRlYnVnL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRWlCLE1BQU07Ozs7QUFGdkIsV0FBVyxDQUFBOztBQUlYLElBQU0sY0FBYyxHQUFHLHFCQUFxQixDQUFBO0FBQzVDLElBQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFBOztBQUN4QixTQUFTLE9BQU8sQ0FBRSxDQUFDLEVBQUUsSUFBSSxFQUFFO0FBQ2hDLE1BQUksR0FBRyxJQUFJOztHQUVSLE9BQU8sQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDOztHQUU5QixPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQzlCLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFYixNQUFJLEdBQUcsR0FBRyxDQUFDLENBQUE7QUFDWCxTQUFPLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNwQixPQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ2I7QUFDRCxTQUFPLEdBQUcsQ0FBQTtDQUNYOztBQUVNLFNBQVMscUJBQXFCLENBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNwRCxNQUFNLEVBQUUsR0FBRyxzQkFBc0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxFQUFFO1dBQUssT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxTQUFTO0dBQUEsQ0FBQyxDQUFBO0FBQ25GLFNBQU8sT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtDQUN6Qjs7QUFFTSxTQUFTLHNCQUFzQixDQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUU7QUFDbkQsU0FBTyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDOUIsV0FBTyxHQUFHLE9BQU8sQ0FBQyxh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ZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmNvbnN0IFJFR0VYX1RPX0lOREVYID0gL1xcW1tcIiddPyhcXHcrKVtcIiddP10vZ1xuY29uc3QgUkVHRVhfTEVBRElOR19ET1QgPSAvXlxcLi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWVwIChvLCBwYXRoKSB7XG4gIHBhdGggPSBwYXRoXG4gICAgLy8gY29udmVydCBpbmRleGVzIHRvIHByb3BlcnRpZXMgKGxpa2UgYVtcImJcIl1bJ2MnXVswXSlcbiAgICAucmVwbGFjZShSRUdFWF9UT19JTkRFWCwgJy4kMScpXG4gICAgLy8gc3RyaXAgYSBsZWFkaW5nIGRvdCAoYXMgaXQgbWlnaHQgb2NjdXIgYmVjYXVzZSBvZiB0aGUgcHJldmlvdXMgcmVwbGFjZSlcbiAgICAucmVwbGFjZShSRUdFWF9MRUFESU5HX0RPVCwgJycpXG4gICAgLnNwbGl0KCcuJylcblxuICB2YXIgb2JqID0gb1xuICB3aGlsZSAob2JqICYmIHBhdGgubGVuZ3RoKSB7XG4gICAgdmFyIG4gPSBwYXRoLnNoaWZ0KClcbiAgICBvYmogPSBvYmpbbl1cbiAgfVxuICByZXR1cm4gb2JqXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50UHJvcEluSGllcmFyY3kgKGVsZW1lbnQsIHByb3ApIHtcbiAgY29uc3QgZWwgPSBlYWNoRWxlbWVudEluSGllcmFyY2h5KGVsZW1lbnQsIChlbCkgPT4gZ2V0RGVlcChlbCwgcHJvcCkgIT09IHVuZGVmaW5lZClcbiAgcmV0dXJuIGdldERlZXAoZWwsIHByb3ApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlYWNoRWxlbWVudEluSGllcmFyY2h5IChlbGVtZW50LCBmbikge1xuICB3aGlsZSAoZWxlbWVudCAmJiAhZm4oZWxlbWVudCkpIHtcbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5QYXRoIChmaWxlKSB7XG4gIHJldHVybiBwYXRoLm5vcm1hbGl6ZShmaWxlKS5zcGxpdChwYXRoLnNlcCkuc2xpY2UoLTIpLmpvaW4ocGF0aC5zZXApXG59XG5leHBvcnQgZnVuY3Rpb24gbG9jYXRpb24gKGZpbGUsIGxpbmUpIHtcbiAgaWYgKHR5cGVvZiBmaWxlID09PSAnb2JqZWN0Jykge1xuICAgICh7IGZpbGUsIGxpbmUgfSA9IGZpbGUpXG4gIH1cbiAgcmV0dXJuIGAke3Nob3J0ZW5QYXRoKGZpbGUpfToke2xpbmUgKyAxfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlIChmdW5jLCB3YWl0KSB7XG4gIGlmICghd2FpdCkge1xuICAgIHJldHVybiBmdW5jXG4gIH1cbiAgbGV0IHRpbWVvdXRcbiAgY29uc3QgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXNcbiAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzXG4gICAgZm4uY2FuY2VsKClcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aW1lb3V0ID0gbnVsbFxuICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKVxuICAgIH0sIHdhaXQpXG4gIH1cbiAgZm4uY2FuY2VsID0gKCkgPT4gY2xlYXJUaW1lb3V0KHRpbWVvdXQpXG4gIHJldHVybiBmblxufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhdCBsZWFzdCB0aGUgYWxsIGtleXMgaW4gbmV3IHByb3BzIHN0cmljdCBlcXVhbCBleGlzdCBpbiB0aGUgb2xkIHByb3BzXG4gKiBAcGFyYW0gIHtPYmplY3R9IFtvbGRQcm9wcz17fV0gVGhlIG9sZCBwcm9wc1xuICogQHBhcmFtICB7T2JqZWN0fSBbbmV3UHJvcHM9e31dIFRoZSBuZXcgcHJvcHNcbiAqIEByZXR1cm4ge2Jvb2x9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaGFsbG93RXF1YWwgKG9sZFByb3BzID0ge30sIG5ld1Byb3BzID0ge30pIHtcbiAgY29uc3QgbmV3S2V5cyA9IE9iamVjdC5rZXlzKG5ld1Byb3BzKS5zb3J0KClcbiAgY29uc3Qgb2xkS2V5cyA9IE9iamVjdC5rZXlzKG9sZFByb3BzKS5zb3J0KClcblxuICAvLyBjaGVjayBpZiBhbGwga2V5cyBhcmUgaW4gdGhlIG9sZCBwcm9wc1xuICBpZiAoIW5ld0tleXMuZXZlcnkoKGtleSkgPT4gb2xkS2V5cy5pbmNsdWRlcyhrZXkpKSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcmV0dXJuIG5ld0tleXMuZXZlcnkoKGtleSkgPT4gbmV3UHJvcHNba2V5XSA9PT0gb2xkUHJvcHNba2V5XSlcbn1cblxubGV0IHN0eWxlXG5leHBvcnQgZnVuY3Rpb24gZWRpdG9yU3R5bGUgKCkge1xuICBpZiAoIXN0eWxlKSB7XG4gICAgc3R5bGUgPSB7XG4gICAgICAnZm9udC1mYW1pbHknOiBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5mb250RmFtaWx5JyksXG4gICAgICAnZm9udC1zaXplJzogYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IuZm9udFNpemUnKSArICdweCcsXG4gICAgICAnbGluZS1oZWlnaHQnOiBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5saW5lSGVpZ2h0JylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0eWxlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFZGl0b3IgKCkge1xuICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpIHx8IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlbkZpbGUgKGZpbGUsIGxpbmUsIGNvbHVtbikge1xuICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlLCB7IGluaXRpYWxMaW5lOiBsaW5lLCBzZWFyY2hBbGxQYW5lczogdHJ1ZSB9KS50aGVuKChlZGl0b3IpID0+IHtcbiAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihbbGluZSwgY29sdW1uXSwgeyBjZW50ZXI6IHRydWUgfSlcbiAgICByZXR1cm4gZWRpdG9yXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRWRpdG9yIChlKSB7XG4gIGlmICghZSB8fCAhZS5nZXRHcmFtbWFyKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgY29uc3QgZ3JhbW1hciA9IGUuZ2V0R3JhbW1hcigpXG4gIGlmICghZ3JhbW1hcikge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiBncmFtbWFyLnNjb3BlTmFtZSA9PT0gJ3NvdXJjZS5nbydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmVBbGxFZGl0b3JzICgpIHtcbiAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICBmb3IgKGNvbnN0IGVkaXRvciBvZiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpKSB7XG4gICAgaWYgKGVkaXRvci5pc01vZGlmaWVkKCkgJiYgaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICBwcm9taXNlcy5wdXNoKGVkaXRvci5zYXZlKCkpXG4gICAgfVxuICB9XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcylcbn1cbiJdfQ==