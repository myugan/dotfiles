Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom */

var _octicons = require('octicons');

var _octicons2 = _interopRequireDefault(_octicons);

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

/*
  Public: Abstract class for handling the initialization
  boilerplate of an Etch component.
*/

var Octicon = (function () {
  function Octicon(props) {
    _classCallCheck(this, Octicon);

    if (!props || !props.name) {
      throw new Error('The name property is required');
    }
    if (!props.mega) {
      props.mega = false;
    }
    if (!props.spin) {
      props.spin = false;
    }
    this.props = props;

    _etch2['default'].initialize(this);
    if (!props.disableAtomScheduler) {
      Octicon.setScheduler(atom.views);
    }
  }

  /*
    Public: Gets the scheduler Etch uses for coordinating DOM updates.
     Returns a {Scheduler}
  */

  _createClass(Octicon, [{
    key: 'update',

    /*
      Public: Updates the component's properties and re-renders it. Only the
      properties you specify in this object will update – any other properties
      the component stores will be unaffected.
       * `props` an {Object} representing the properties you want to update
    */
    value: function update(props) {
      var oldProps = this.props;
      this.props = Object.assign({}, oldProps, props);
      return _etch2['default'].update(this);
    }

    /*
      Public: Destroys the component, removing it from the DOM.
    */
  }, {
    key: 'destroy',
    value: function destroy() {
      _etch2['default'].destroy(this);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var name = _props.name;
      var className = _props.className;
      var mega = _props.mega;
      var spin = _props.spin;

      var classNames = [mega ? 'mega-etch-octicon' : 'etch-octicon', 'etch-octicon-' + name];
      if (spin) {
        classNames.push('spin-etch-octicon');
      }
      if (className) {
        classNames.push(className);
      }

      var octicon = _octicons2['default'][name].toSVG();
      return _etch2['default'].dom('span', { innerHTML: octicon, className: classNames.join(' ') });
    }
  }], [{
    key: 'getScheduler',
    value: function getScheduler() {
      return _etch2['default'].getScheduler();
    }

    /*
      Public: Sets the scheduler Etch uses for coordinating DOM updates.
       * `scheduler` {Scheduler}
    */
  }, {
    key: 'setScheduler',
    value: function setScheduler(scheduler) {
      _etch2['default'].setScheduler(scheduler);
    }
  }]);

  return Octicon;
})();

exports['default'] = Octicon;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbm9kZV9tb2R1bGVzL2V0Y2gtb2N0aWNvbi9saWIvT2N0aWNvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3dCQUdxQixVQUFVOzs7O29CQUNkLE1BQU07Ozs7Ozs7OztJQU1GLE9BQU87QUFDZCxXQURPLE9BQU8sQ0FDYixLQUFLLEVBQUU7MEJBREQsT0FBTzs7QUFFeEIsUUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDekIsWUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0tBQ2pEO0FBQ0QsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDZixXQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtLQUNuQjtBQUNELFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ2YsV0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7S0FDbkI7QUFDRCxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTs7QUFFbEIsc0JBQUssVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxLQUFLLENBQUMsb0JBQW9CLEVBQUU7QUFDL0IsYUFBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDakM7R0FDRjs7Ozs7OztlQWpCa0IsT0FBTzs7Ozs7Ozs7O1dBeUNuQixnQkFBQyxLQUFLLEVBQUU7QUFDYixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO0FBQzNCLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQy9DLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7Ozs7O1dBS08sbUJBQUc7QUFDVCx3QkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbkI7OztXQUVNLGtCQUFHO21CQUNnQyxJQUFJLENBQUMsS0FBSztVQUExQyxJQUFJLFVBQUosSUFBSTtVQUFFLFNBQVMsVUFBVCxTQUFTO1VBQUUsSUFBSSxVQUFKLElBQUk7VUFBRSxJQUFJLFVBQUosSUFBSTs7QUFDbkMsVUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLEdBQUcsY0FBYyxvQkFBa0IsSUFBSSxDQUFHLENBQUE7QUFDeEYsVUFBSSxJQUFJLEVBQUU7QUFDUixrQkFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO09BQ3JDO0FBQ0QsVUFBSSxTQUFTLEVBQUU7QUFDYixrQkFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTtPQUMzQjs7QUFFRCxVQUFNLE9BQU8sR0FBRyxzQkFBUyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN0QyxhQUFPLGtCQUFLLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtLQUNqRjs7O1dBM0NtQix3QkFBRztBQUNyQixhQUFPLGtCQUFLLFlBQVksRUFBRSxDQUFBO0tBQzNCOzs7Ozs7OztXQU1tQixzQkFBQyxTQUFTLEVBQUU7QUFDOUIsd0JBQUssWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQzdCOzs7U0FqQ2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbm9kZV9tb2R1bGVzL2V0Y2gtb2N0aWNvbi9saWIvT2N0aWNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICovXG5cbmltcG9ydCBvY3RpY29ucyBmcm9tICdvY3RpY29ucydcbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbi8qXG4gIFB1YmxpYzogQWJzdHJhY3QgY2xhc3MgZm9yIGhhbmRsaW5nIHRoZSBpbml0aWFsaXphdGlvblxuICBib2lsZXJwbGF0ZSBvZiBhbiBFdGNoIGNvbXBvbmVudC5cbiovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPY3RpY29uIHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcyB8fCAhcHJvcHMubmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbmFtZSBwcm9wZXJ0eSBpcyByZXF1aXJlZCcpXG4gICAgfVxuICAgIGlmICghcHJvcHMubWVnYSkge1xuICAgICAgcHJvcHMubWVnYSA9IGZhbHNlXG4gICAgfVxuICAgIGlmICghcHJvcHMuc3Bpbikge1xuICAgICAgcHJvcHMuc3BpbiA9IGZhbHNlXG4gICAgfVxuICAgIHRoaXMucHJvcHMgPSBwcm9wc1xuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gICAgaWYgKCFwcm9wcy5kaXNhYmxlQXRvbVNjaGVkdWxlcikge1xuICAgICAgT2N0aWNvbi5zZXRTY2hlZHVsZXIoYXRvbS52aWV3cylcbiAgICB9XG4gIH1cblxuICAvKlxuICAgIFB1YmxpYzogR2V0cyB0aGUgc2NoZWR1bGVyIEV0Y2ggdXNlcyBmb3IgY29vcmRpbmF0aW5nIERPTSB1cGRhdGVzLlxuICAgICBSZXR1cm5zIGEge1NjaGVkdWxlcn1cbiAgKi9cbiAgc3RhdGljIGdldFNjaGVkdWxlciAoKSB7XG4gICAgcmV0dXJuIGV0Y2guZ2V0U2NoZWR1bGVyKClcbiAgfVxuXG4gIC8qXG4gICAgUHVibGljOiBTZXRzIHRoZSBzY2hlZHVsZXIgRXRjaCB1c2VzIGZvciBjb29yZGluYXRpbmcgRE9NIHVwZGF0ZXMuXG4gICAgICogYHNjaGVkdWxlcmAge1NjaGVkdWxlcn1cbiAgKi9cbiAgc3RhdGljIHNldFNjaGVkdWxlciAoc2NoZWR1bGVyKSB7XG4gICAgZXRjaC5zZXRTY2hlZHVsZXIoc2NoZWR1bGVyKVxuICB9XG5cbiAgLypcbiAgICBQdWJsaWM6IFVwZGF0ZXMgdGhlIGNvbXBvbmVudCdzIHByb3BlcnRpZXMgYW5kIHJlLXJlbmRlcnMgaXQuIE9ubHkgdGhlXG4gICAgcHJvcGVydGllcyB5b3Ugc3BlY2lmeSBpbiB0aGlzIG9iamVjdCB3aWxsIHVwZGF0ZSDigJMgYW55IG90aGVyIHByb3BlcnRpZXNcbiAgICB0aGUgY29tcG9uZW50IHN0b3JlcyB3aWxsIGJlIHVuYWZmZWN0ZWQuXG4gICAgICogYHByb3BzYCBhbiB7T2JqZWN0fSByZXByZXNlbnRpbmcgdGhlIHByb3BlcnRpZXMgeW91IHdhbnQgdG8gdXBkYXRlXG4gICovXG4gIHVwZGF0ZSAocHJvcHMpIHtcbiAgICBjb25zdCBvbGRQcm9wcyA9IHRoaXMucHJvcHNcbiAgICB0aGlzLnByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgb2xkUHJvcHMsIHByb3BzKVxuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgLypcbiAgICBQdWJsaWM6IERlc3Ryb3lzIHRoZSBjb21wb25lbnQsIHJlbW92aW5nIGl0IGZyb20gdGhlIERPTS5cbiAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgbmFtZSwgY2xhc3NOYW1lLCBtZWdhLCBzcGluIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IFttZWdhID8gJ21lZ2EtZXRjaC1vY3RpY29uJyA6ICdldGNoLW9jdGljb24nLCBgZXRjaC1vY3RpY29uLSR7bmFtZX1gXVxuICAgIGlmIChzcGluKSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goJ3NwaW4tZXRjaC1vY3RpY29uJylcbiAgICB9XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKGNsYXNzTmFtZSlcbiAgICB9XG5cbiAgICBjb25zdCBvY3RpY29uID0gb2N0aWNvbnNbbmFtZV0udG9TVkcoKVxuICAgIHJldHVybiBldGNoLmRvbSgnc3BhbicsIHsgaW5uZXJIVE1MOiBvY3RpY29uLCBjbGFzc05hbWU6IGNsYXNzTmFtZXMuam9pbignICcpIH0pXG4gIH1cbn1cbiJdfQ==