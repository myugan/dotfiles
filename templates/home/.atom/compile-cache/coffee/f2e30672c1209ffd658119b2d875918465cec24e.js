(function() {
  var NewDraftView, NewFileView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  NewFileView = require("./new-file-view");

  module.exports = NewDraftView = (function(superClass) {
    extend(NewDraftView, superClass);

    function NewDraftView() {
      return NewDraftView.__super__.constructor.apply(this, arguments);
    }

    NewDraftView.fileType = "Draft";

    NewDraftView.pathConfig = "siteDraftsDir";

    NewDraftView.fileNameConfig = "newDraftFileName";

    return NewDraftView;

  })(NewFileView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9uZXctZHJhZnQtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlCQUFBO0lBQUE7OztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLFlBQUMsQ0FBQSxRQUFELEdBQVk7O0lBQ1osWUFBQyxDQUFBLFVBQUQsR0FBYzs7SUFDZCxZQUFDLENBQUEsY0FBRCxHQUFrQjs7OztLQUhPO0FBSDNCIiwic291cmNlc0NvbnRlbnQiOlsiTmV3RmlsZVZpZXcgPSByZXF1aXJlIFwiLi9uZXctZmlsZS12aWV3XCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTmV3RHJhZnRWaWV3IGV4dGVuZHMgTmV3RmlsZVZpZXdcbiAgQGZpbGVUeXBlID0gXCJEcmFmdFwiXG4gIEBwYXRoQ29uZmlnID0gXCJzaXRlRHJhZnRzRGlyXCJcbiAgQGZpbGVOYW1lQ29uZmlnID0gXCJuZXdEcmFmdEZpbGVOYW1lXCJcbiJdfQ==
