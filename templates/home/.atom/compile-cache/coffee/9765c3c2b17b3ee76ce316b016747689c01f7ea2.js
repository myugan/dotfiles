(function() {
  module.exports = {
    query: function(el) {
      return document.querySelector(el);
    },
    queryAll: function(el) {
      return document.querySelectorAll(el);
    },
    addClass: function(el, className) {
      return this.toggleClass('add', el, className);
    },
    removeClass: function(el, className) {
      return this.toggleClass('remove', el, className);
    },
    toggleClass: function(action, el, className) {
      var i, results;
      if (el !== null) {
        i = 0;
        results = [];
        while (i < el.length) {
          el[i].classList[action](className);
          results.push(i++);
        }
        return results;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvc2V0aS11aS9saWIvZG9tLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxLQUFBLEVBQU8sU0FBQyxFQUFEO2FBQ0wsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsRUFBdkI7SUFESyxDQUFQO0lBR0EsUUFBQSxFQUFVLFNBQUMsRUFBRDthQUNSLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixFQUExQjtJQURRLENBSFY7SUFNQSxRQUFBLEVBQVUsU0FBQyxFQUFELEVBQUssU0FBTDthQUNSLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYixFQUFvQixFQUFwQixFQUF3QixTQUF4QjtJQURRLENBTlY7SUFTQSxXQUFBLEVBQWEsU0FBQyxFQUFELEVBQUssU0FBTDthQUNYLElBQUMsQ0FBQSxXQUFELENBQWEsUUFBYixFQUF1QixFQUF2QixFQUEyQixTQUEzQjtJQURXLENBVGI7SUFZQSxXQUFBLEVBQWEsU0FBQyxNQUFELEVBQVMsRUFBVCxFQUFhLFNBQWI7QUFDWCxVQUFBO01BQUEsSUFBRyxFQUFBLEtBQU0sSUFBVDtRQUNFLENBQUEsR0FBSTtBQUNKO2VBQU0sQ0FBQSxHQUFJLEVBQUUsQ0FBQyxNQUFiO1VBQ0UsRUFBRyxDQUFBLENBQUEsQ0FBRSxDQUFDLFNBQVUsQ0FBQSxNQUFBLENBQWhCLENBQXdCLFNBQXhCO3VCQUNBLENBQUE7UUFGRixDQUFBO3VCQUZGOztJQURXLENBWmI7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIHF1ZXJ5OiAoZWwpIC0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvciBlbFxuXG4gIHF1ZXJ5QWxsOiAoZWwpIC0+XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCBlbFxuXG4gIGFkZENsYXNzOiAoZWwsIGNsYXNzTmFtZSkgLT5cbiAgICBAdG9nZ2xlQ2xhc3MgJ2FkZCcsIGVsLCBjbGFzc05hbWVcblxuICByZW1vdmVDbGFzczogKGVsLCBjbGFzc05hbWUpIC0+XG4gICAgQHRvZ2dsZUNsYXNzICdyZW1vdmUnLCBlbCwgY2xhc3NOYW1lXG5cbiAgdG9nZ2xlQ2xhc3M6IChhY3Rpb24sIGVsLCBjbGFzc05hbWUpIC0+XG4gICAgaWYgZWwgIT0gbnVsbFxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBlbC5sZW5ndGhcbiAgICAgICAgZWxbaV0uY2xhc3NMaXN0W2FjdGlvbl0gY2xhc3NOYW1lXG4gICAgICAgIGkrK1xuIl19
