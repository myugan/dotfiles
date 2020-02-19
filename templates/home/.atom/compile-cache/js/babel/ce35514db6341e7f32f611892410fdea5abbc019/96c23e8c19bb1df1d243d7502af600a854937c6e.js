Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createSuggestion = createSuggestion;
exports.getKeyboardEvent = getKeyboardEvent;

var _libHelpers = require('../lib/helpers');

'use babel';

function createSuggestion(text, selected) {
  var className = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var icon = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
  var process = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

  var suggestion = {
    icon: icon,
    title: text,
    'class': className,
    priority: 100,
    selected: selected
  };
  if (process) {
    return (0, _libHelpers.processListItems)([suggestion])[0];
  }
  return suggestion;
}

function getKeyboardEvent() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'keydown' : arguments[0];
  var code = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var event = new KeyboardEvent(name);
  Object.defineProperty(event, 'keyCode', {
    value: code
  });
  return event;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFaUMsZ0JBQWdCOztBQUZqRCxXQUFXLENBQUE7O0FBSUosU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUE2QztNQUEzQyxTQUFTLHlEQUFHLEVBQUU7TUFBRSxJQUFJLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLElBQUk7O0FBQ3hGLE1BQU0sVUFBVSxHQUFHO0FBQ2pCLFFBQUksRUFBSixJQUFJO0FBQ0osU0FBSyxFQUFFLElBQUk7QUFDWCxhQUFPLFNBQVM7QUFDaEIsWUFBUSxFQUFFLEdBQUc7QUFDYixZQUFRLEVBQVIsUUFBUTtHQUNULENBQUE7QUFDRCxNQUFJLE9BQU8sRUFBRTtBQUNYLFdBQU8sa0NBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUN6QztBQUNELFNBQU8sVUFBVSxDQUFBO0NBQ2xCOztBQUVNLFNBQVMsZ0JBQWdCLEdBQTRDO01BQTNDLElBQUkseURBQUcsU0FBUztNQUFFLElBQUkseURBQUcsQ0FBQzs7QUFDekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDckMsUUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO0FBQ3RDLFNBQUssRUFBRSxJQUFJO0dBQ1osQ0FBQyxDQUFBO0FBQ0YsU0FBTyxLQUFLLENBQUE7Q0FDYiIsImZpbGUiOiIvaG9tZS9teXVnYS8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IHByb2Nlc3NMaXN0SXRlbXMgfSBmcm9tICcuLi9saWIvaGVscGVycydcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN1Z2dlc3Rpb24odGV4dCwgc2VsZWN0ZWQsIGNsYXNzTmFtZSA9ICcnLCBpY29uID0gJycsIHByb2Nlc3MgPSB0cnVlKSB7XG4gIGNvbnN0IHN1Z2dlc3Rpb24gPSB7XG4gICAgaWNvbixcbiAgICB0aXRsZTogdGV4dCxcbiAgICBjbGFzczogY2xhc3NOYW1lLFxuICAgIHByaW9yaXR5OiAxMDAsXG4gICAgc2VsZWN0ZWQsXG4gIH1cbiAgaWYgKHByb2Nlc3MpIHtcbiAgICByZXR1cm4gcHJvY2Vzc0xpc3RJdGVtcyhbc3VnZ2VzdGlvbl0pWzBdXG4gIH1cbiAgcmV0dXJuIHN1Z2dlc3Rpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEtleWJvYXJkRXZlbnQobmFtZSA9ICdrZXlkb3duJywgY29kZSA9IDApOiBLZXlib2FyZEV2ZW50IHtcbiAgY29uc3QgZXZlbnQgPSBuZXcgS2V5Ym9hcmRFdmVudChuYW1lKVxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXZlbnQsICdrZXlDb2RlJywge1xuICAgIHZhbHVlOiBjb2RlLFxuICB9KVxuICByZXR1cm4gZXZlbnRcbn1cbiJdfQ==