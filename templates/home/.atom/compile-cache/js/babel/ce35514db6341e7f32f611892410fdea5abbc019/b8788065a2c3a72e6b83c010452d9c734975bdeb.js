Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ToolChecker = (function () {
  function ToolChecker(goconfig) {
    _classCallCheck(this, ToolChecker);

    this.goconfig = goconfig;
  }

  _createClass(ToolChecker, [{
    key: 'checkForTools',
    value: _asyncToGenerator(function* (tools) {
      var _this = this;

      if (!tools || !tools.length) {
        return;
      }
      var promises = tools.filter(function (tool) {
        return !!tool;
      }).map(function (tool) {
        return _this.goconfig.locator.findTool(tool);
      });
      var results = yield Promise.all(promises);
      if (results.some(function (cmd) {
        return !cmd;
      })) {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'golang:update-tools');
      }
    })
  }]);

  return ToolChecker;
})();

exports.ToolChecker = ToolChecker;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2dvLXBsdXMvbGliL3Rvb2wtY2hlY2tlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBSU0sV0FBVztBQUdKLFdBSFAsV0FBVyxDQUdILFFBQWtCLEVBQUU7MEJBSDVCLFdBQVc7O0FBSWIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7R0FDekI7O2VBTEcsV0FBVzs7NkJBT0ksV0FBQyxLQUFvQixFQUFFOzs7QUFDeEMsVUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDM0IsZUFBTTtPQUNQO0FBQ0QsVUFBTSxRQUFRLEdBQUcsS0FBSyxDQUNuQixNQUFNLENBQUMsVUFBQSxJQUFJO2VBQUksQ0FBQyxDQUFDLElBQUk7T0FBQSxDQUFDLENBQ3RCLEdBQUcsQ0FBQyxVQUFBLElBQUk7ZUFBSSxNQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUNwRCxVQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0MsVUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsR0FBRztlQUFJLENBQUMsR0FBRztPQUFBLENBQUMsRUFBRTtBQUM3QixZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUNsQyxxQkFBcUIsQ0FDdEIsQ0FBQTtPQUNGO0tBQ0Y7OztTQXJCRyxXQUFXOzs7UUF3QlIsV0FBVyxHQUFYLFdBQVciLCJmaWxlIjoiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvZ28tcGx1cy9saWIvdG9vbC1jaGVja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IHR5cGUgeyBHb0NvbmZpZyB9IGZyb20gJy4vY29uZmlnL3NlcnZpY2UnXG5cbmNsYXNzIFRvb2xDaGVja2VyIHtcbiAgZ29jb25maWc6IEdvQ29uZmlnXG5cbiAgY29uc3RydWN0b3IoZ29jb25maWc6IEdvQ29uZmlnKSB7XG4gICAgdGhpcy5nb2NvbmZpZyA9IGdvY29uZmlnXG4gIH1cblxuICBhc3luYyBjaGVja0ZvclRvb2xzKHRvb2xzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgaWYgKCF0b29scyB8fCAhdG9vbHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcHJvbWlzZXMgPSB0b29sc1xuICAgICAgLmZpbHRlcih0b29sID0+ICEhdG9vbClcbiAgICAgIC5tYXAodG9vbCA9PiB0aGlzLmdvY29uZmlnLmxvY2F0b3IuZmluZFRvb2wodG9vbCkpXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIGlmIChyZXN1bHRzLnNvbWUoY21kID0+ICFjbWQpKSB7XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKFxuICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgICAnZ29sYW5nOnVwZGF0ZS10b29scydcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVG9vbENoZWNrZXIgfVxuIl19