(function() {
  var EditTOC;

  EditTOC = require("../../lib/commands/edit-toc");

  describe("EditTOC", function() {
    var editTOC, editor, ref;
    ref = [], editor = ref[0], editTOC = ref[1];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open("toc.markdown");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-gfm");
      });
      return runs(function() {
        return editor = atom.workspace.getActiveTextEditor();
      });
    });
    describe("Insert TOC", function() {
      beforeEach(function() {
        return editTOC = new EditTOC("insert-toc");
      });
      it("insert empty TOC", function() {
        editor.setText("\n\nthis is a sentence");
        editor.setCursorBufferPosition([0, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("<!-- TOC -->\n\n\n<!-- /TOC -->\n\nthis is a sentence");
      });
      it("insert new TOC", function() {
        editor.setText("# Markdown-Writer for Atom\n\n\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
        editor.setCursorBufferPosition([2, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("# Markdown-Writer for Atom\n\n<!-- TOC -->\n\n- [Markdown-Writer for Atom](#markdown-writer-for-atom)\n  - [Features](#features)\n    - [Blogging](#blogging)\n    - [General](#general)\n  - [Installation](#installation)\n  - [Setup](#setup)\n  - [Contributing](#contributing)\n  - [Project](#project)\n\n<!-- /TOC -->\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
      });
      return it("update TOC based on options", function() {
        editor.setText("# Markdown-Writer for Atom\n\n<!-- TOC depthFrom:2 -->\n\n- [Markdown-Writer for Atom](#markdown-writer-for-atom)\n  - [Features](#features)\n    - [Blogging](#blogging)\n    - [General](#general)\n  - [Installation](#installation)\n  - [Setup](#setup)\n  - [Contributing](#contributing)\n  - [Project](#project)\n\n<!-- /TOC -->\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
        editor.setCursorBufferPosition([8, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("# Markdown-Writer for Atom\n\n<!-- TOC depthFrom:2 -->\n\n- [Features](#features)\n  - [Blogging](#blogging)\n  - [General](#general)\n- [Installation](#installation)\n- [Setup](#setup)\n- [Contributing](#contributing)\n- [Project](#project)\n\n<!-- /TOC -->\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
      });
    });
    return describe("Update TOC", function() {
      beforeEach(function() {
        return editTOC = new EditTOC("update-toc");
      });
      it("skip update if no TOC", function() {
        editor.setText("\nthis is a sentence");
        editor.setCursorBufferPosition([0, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("\nthis is a sentence");
      });
      it("skip update if TOC is incomplete", function() {
        editor.setText("<!-- TOC -->\n\n- [Features](#features)\n\nthis is a sentence");
        editor.setCursorBufferPosition([0, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("<!-- TOC -->\n\n- [Features](#features)\n\nthis is a sentence");
      });
      return it("update TOC based on options", function() {
        editor.setText("# Markdown-Writer for Atom\n\n<!-- TOC depthFrom:2 -->\n\n- [Markdown-Writer for Atom](#markdown-writer-for-atom)\n  - [Features](#features)\n    - [Blogging](#blogging)\n    - [General](#general)\n  - [Installation](#installation)\n  - [Setup](#setup)\n  - [Contributing](#contributing)\n  - [Project](#project)\n\n<!-- /TOC -->\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
        editor.setCursorBufferPosition([8, 0]);
        editTOC.trigger();
        return expect(editor.getText()).toBe("# Markdown-Writer for Atom\n\n<!-- TOC depthFrom:2 -->\n\n- [Features](#features)\n  - [Blogging](#blogging)\n  - [General](#general)\n- [Installation](#installation)\n- [Setup](#setup)\n- [Contributing](#contributing)\n- [Project](#project)\n\n<!-- /TOC -->\n\n## Features\n\n### Blogging\n\n### General\n\n## Installation\n\n## Setup\n\n## Contributing\n\n## Project");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvY29tbWFuZHMvZWRpdC10b2Mtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsNkJBQVI7O0VBRVYsUUFBQSxDQUFTLFNBQVQsRUFBb0IsU0FBQTtBQUNsQixRQUFBO0lBQUEsTUFBb0IsRUFBcEIsRUFBQyxlQUFELEVBQVM7SUFFVCxVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQjtNQUFILENBQWhCO01BQ0EsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssU0FBQTtlQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFBWixDQUFMO0lBSFMsQ0FBWDtJQUtBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUE7TUFDckIsVUFBQSxDQUFXLFNBQUE7ZUFBRyxPQUFBLEdBQVUsSUFBSSxPQUFKLENBQVksWUFBWjtNQUFiLENBQVg7TUFFQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQTtRQUNyQixNQUFNLENBQUMsT0FBUCxDQUFlLHdCQUFmO1FBS0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxPQUFPLENBQUMsT0FBUixDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHVEQUE5QjtNQVRxQixDQUF2QjtNQWtCQSxFQUFBLENBQUcsZ0JBQUgsRUFBcUIsU0FBQTtRQUNuQixNQUFNLENBQUMsT0FBUCxDQUFlLDhJQUFmO1FBbUJBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO1FBRUEsT0FBTyxDQUFDLE9BQVIsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw2YUFBOUI7TUF2Qm1CLENBQXJCO2FBc0RBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO1FBQ2hDLE1BQU0sQ0FBQyxPQUFQLENBQWUseWJBQWY7UUE4QkEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxPQUFPLENBQUMsT0FBUixDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtYQUE5QjtNQWxDZ0MsQ0FBbEM7SUEzRXFCLENBQXZCO1dBMklBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUE7TUFDckIsVUFBQSxDQUFXLFNBQUE7ZUFBRyxPQUFBLEdBQVUsSUFBSSxPQUFKLENBQVksWUFBWjtNQUFiLENBQVg7TUFFQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtRQUMxQixNQUFNLENBQUMsT0FBUCxDQUFlLHNCQUFmO1FBSUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxPQUFPLENBQUMsT0FBUixDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHNCQUE5QjtNQVIwQixDQUE1QjtNQWFBLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO1FBQ3JDLE1BQU0sQ0FBQyxPQUFQLENBQWUsK0RBQWY7UUFPQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUVBLE9BQU8sQ0FBQyxPQUFSLENBQUE7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsK0RBQTlCO01BWHFDLENBQXZDO2FBbUJBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO1FBQ2hDLE1BQU0sQ0FBQyxPQUFQLENBQWUseWJBQWY7UUE4QkEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0I7UUFFQSxPQUFPLENBQUMsT0FBUixDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtYQUE5QjtNQWxDZ0MsQ0FBbEM7SUFuQ3FCLENBQXZCO0VBbkprQixDQUFwQjtBQUZBIiwic291cmNlc0NvbnRlbnQiOlsiRWRpdFRPQyA9IHJlcXVpcmUgXCIuLi8uLi9saWIvY29tbWFuZHMvZWRpdC10b2NcIlxuXG5kZXNjcmliZSBcIkVkaXRUT0NcIiwgLT5cbiAgW2VkaXRvciwgZWRpdFRPQ10gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcInRvYy5tYXJrZG93blwiKVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcImxhbmd1YWdlLWdmbVwiKVxuICAgIHJ1bnMgLT4gZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgZGVzY3JpYmUgXCJJbnNlcnQgVE9DXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBlZGl0VE9DID0gbmV3IEVkaXRUT0MoXCJpbnNlcnQtdG9jXCIpXG5cbiAgICBpdCBcImluc2VydCBlbXB0eSBUT0NcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuXG5cbiAgICAgIHRoaXMgaXMgYSBzZW50ZW5jZVxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBlZGl0VE9DLnRyaWdnZXIoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICA8IS0tIFRPQyAtLT5cblxuXG4gICAgICA8IS0tIC9UT0MgLS0+XG5cbiAgICAgIHRoaXMgaXMgYSBzZW50ZW5jZVxuICAgICAgXCJcIlwiXG5cbiAgICBpdCBcImluc2VydCBuZXcgVE9DXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICMgTWFya2Rvd24tV3JpdGVyIGZvciBBdG9tXG5cblxuXG4gICAgICAjIyBGZWF0dXJlc1xuXG4gICAgICAjIyMgQmxvZ2dpbmdcblxuICAgICAgIyMjIEdlbmVyYWxcblxuICAgICAgIyMgSW5zdGFsbGF0aW9uXG5cbiAgICAgICMjIFNldHVwXG5cbiAgICAgICMjIENvbnRyaWJ1dGluZ1xuXG4gICAgICAjIyBQcm9qZWN0XG4gICAgICBcIlwiXCJcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMiwgMF0pXG5cbiAgICAgIGVkaXRUT0MudHJpZ2dlcigpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICMgTWFya2Rvd24tV3JpdGVyIGZvciBBdG9tXG5cbiAgICAgIDwhLS0gVE9DIC0tPlxuXG4gICAgICAtIFtNYXJrZG93bi1Xcml0ZXIgZm9yIEF0b21dKCNtYXJrZG93bi13cml0ZXItZm9yLWF0b20pXG4gICAgICAgIC0gW0ZlYXR1cmVzXSgjZmVhdHVyZXMpXG4gICAgICAgICAgLSBbQmxvZ2dpbmddKCNibG9nZ2luZylcbiAgICAgICAgICAtIFtHZW5lcmFsXSgjZ2VuZXJhbClcbiAgICAgICAgLSBbSW5zdGFsbGF0aW9uXSgjaW5zdGFsbGF0aW9uKVxuICAgICAgICAtIFtTZXR1cF0oI3NldHVwKVxuICAgICAgICAtIFtDb250cmlidXRpbmddKCNjb250cmlidXRpbmcpXG4gICAgICAgIC0gW1Byb2plY3RdKCNwcm9qZWN0KVxuXG4gICAgICA8IS0tIC9UT0MgLS0+XG5cbiAgICAgICMjIEZlYXR1cmVzXG5cbiAgICAgICMjIyBCbG9nZ2luZ1xuXG4gICAgICAjIyMgR2VuZXJhbFxuXG4gICAgICAjIyBJbnN0YWxsYXRpb25cblxuICAgICAgIyMgU2V0dXBcblxuICAgICAgIyMgQ29udHJpYnV0aW5nXG5cbiAgICAgICMjIFByb2plY3RcbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJ1cGRhdGUgVE9DIGJhc2VkIG9uIG9wdGlvbnNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgIyBNYXJrZG93bi1Xcml0ZXIgZm9yIEF0b21cblxuICAgICAgPCEtLSBUT0MgZGVwdGhGcm9tOjIgLS0+XG5cbiAgICAgIC0gW01hcmtkb3duLVdyaXRlciBmb3IgQXRvbV0oI21hcmtkb3duLXdyaXRlci1mb3ItYXRvbSlcbiAgICAgICAgLSBbRmVhdHVyZXNdKCNmZWF0dXJlcylcbiAgICAgICAgICAtIFtCbG9nZ2luZ10oI2Jsb2dnaW5nKVxuICAgICAgICAgIC0gW0dlbmVyYWxdKCNnZW5lcmFsKVxuICAgICAgICAtIFtJbnN0YWxsYXRpb25dKCNpbnN0YWxsYXRpb24pXG4gICAgICAgIC0gW1NldHVwXSgjc2V0dXApXG4gICAgICAgIC0gW0NvbnRyaWJ1dGluZ10oI2NvbnRyaWJ1dGluZylcbiAgICAgICAgLSBbUHJvamVjdF0oI3Byb2plY3QpXG5cbiAgICAgIDwhLS0gL1RPQyAtLT5cblxuICAgICAgIyMgRmVhdHVyZXNcblxuICAgICAgIyMjIEJsb2dnaW5nXG5cbiAgICAgICMjIyBHZW5lcmFsXG5cbiAgICAgICMjIEluc3RhbGxhdGlvblxuXG4gICAgICAjIyBTZXR1cFxuXG4gICAgICAjIyBDb250cmlidXRpbmdcblxuICAgICAgIyMgUHJvamVjdFxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzgsIDBdKVxuXG4gICAgICBlZGl0VE9DLnRyaWdnZXIoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAjIE1hcmtkb3duLVdyaXRlciBmb3IgQXRvbVxuXG4gICAgICA8IS0tIFRPQyBkZXB0aEZyb206MiAtLT5cblxuICAgICAgLSBbRmVhdHVyZXNdKCNmZWF0dXJlcylcbiAgICAgICAgLSBbQmxvZ2dpbmddKCNibG9nZ2luZylcbiAgICAgICAgLSBbR2VuZXJhbF0oI2dlbmVyYWwpXG4gICAgICAtIFtJbnN0YWxsYXRpb25dKCNpbnN0YWxsYXRpb24pXG4gICAgICAtIFtTZXR1cF0oI3NldHVwKVxuICAgICAgLSBbQ29udHJpYnV0aW5nXSgjY29udHJpYnV0aW5nKVxuICAgICAgLSBbUHJvamVjdF0oI3Byb2plY3QpXG5cbiAgICAgIDwhLS0gL1RPQyAtLT5cblxuICAgICAgIyMgRmVhdHVyZXNcblxuICAgICAgIyMjIEJsb2dnaW5nXG5cbiAgICAgICMjIyBHZW5lcmFsXG5cbiAgICAgICMjIEluc3RhbGxhdGlvblxuXG4gICAgICAjIyBTZXR1cFxuXG4gICAgICAjIyBDb250cmlidXRpbmdcblxuICAgICAgIyMgUHJvamVjdFxuICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgXCJVcGRhdGUgVE9DXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPiBlZGl0VE9DID0gbmV3IEVkaXRUT0MoXCJ1cGRhdGUtdG9jXCIpXG5cbiAgICBpdCBcInNraXAgdXBkYXRlIGlmIG5vIFRPQ1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG5cbiAgICAgIHRoaXMgaXMgYSBzZW50ZW5jZVxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBlZGl0VE9DLnRyaWdnZXIoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG5cbiAgICAgIHRoaXMgaXMgYSBzZW50ZW5jZVxuICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInNraXAgdXBkYXRlIGlmIFRPQyBpcyBpbmNvbXBsZXRlXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgIDwhLS0gVE9DIC0tPlxuXG4gICAgICAtIFtGZWF0dXJlc10oI2ZlYXR1cmVzKVxuXG4gICAgICB0aGlzIGlzIGEgc2VudGVuY2VcbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgZWRpdFRPQy50cmlnZ2VyKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgPCEtLSBUT0MgLS0+XG5cbiAgICAgIC0gW0ZlYXR1cmVzXSgjZmVhdHVyZXMpXG5cbiAgICAgIHRoaXMgaXMgYSBzZW50ZW5jZVxuICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInVwZGF0ZSBUT0MgYmFzZWQgb24gb3B0aW9uc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAjIE1hcmtkb3duLVdyaXRlciBmb3IgQXRvbVxuXG4gICAgICA8IS0tIFRPQyBkZXB0aEZyb206MiAtLT5cblxuICAgICAgLSBbTWFya2Rvd24tV3JpdGVyIGZvciBBdG9tXSgjbWFya2Rvd24td3JpdGVyLWZvci1hdG9tKVxuICAgICAgICAtIFtGZWF0dXJlc10oI2ZlYXR1cmVzKVxuICAgICAgICAgIC0gW0Jsb2dnaW5nXSgjYmxvZ2dpbmcpXG4gICAgICAgICAgLSBbR2VuZXJhbF0oI2dlbmVyYWwpXG4gICAgICAgIC0gW0luc3RhbGxhdGlvbl0oI2luc3RhbGxhdGlvbilcbiAgICAgICAgLSBbU2V0dXBdKCNzZXR1cClcbiAgICAgICAgLSBbQ29udHJpYnV0aW5nXSgjY29udHJpYnV0aW5nKVxuICAgICAgICAtIFtQcm9qZWN0XSgjcHJvamVjdClcblxuICAgICAgPCEtLSAvVE9DIC0tPlxuXG4gICAgICAjIyBGZWF0dXJlc1xuXG4gICAgICAjIyMgQmxvZ2dpbmdcblxuICAgICAgIyMjIEdlbmVyYWxcblxuICAgICAgIyMgSW5zdGFsbGF0aW9uXG5cbiAgICAgICMjIFNldHVwXG5cbiAgICAgICMjIENvbnRyaWJ1dGluZ1xuXG4gICAgICAjIyBQcm9qZWN0XG4gICAgICBcIlwiXCJcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbOCwgMF0pXG5cbiAgICAgIGVkaXRUT0MudHJpZ2dlcigpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICMgTWFya2Rvd24tV3JpdGVyIGZvciBBdG9tXG5cbiAgICAgIDwhLS0gVE9DIGRlcHRoRnJvbToyIC0tPlxuXG4gICAgICAtIFtGZWF0dXJlc10oI2ZlYXR1cmVzKVxuICAgICAgICAtIFtCbG9nZ2luZ10oI2Jsb2dnaW5nKVxuICAgICAgICAtIFtHZW5lcmFsXSgjZ2VuZXJhbClcbiAgICAgIC0gW0luc3RhbGxhdGlvbl0oI2luc3RhbGxhdGlvbilcbiAgICAgIC0gW1NldHVwXSgjc2V0dXApXG4gICAgICAtIFtDb250cmlidXRpbmddKCNjb250cmlidXRpbmcpXG4gICAgICAtIFtQcm9qZWN0XSgjcHJvamVjdClcblxuICAgICAgPCEtLSAvVE9DIC0tPlxuXG4gICAgICAjIyBGZWF0dXJlc1xuXG4gICAgICAjIyMgQmxvZ2dpbmdcblxuICAgICAgIyMjIEdlbmVyYWxcblxuICAgICAgIyMgSW5zdGFsbGF0aW9uXG5cbiAgICAgICMjIFNldHVwXG5cbiAgICAgICMjIENvbnRyaWJ1dGluZ1xuXG4gICAgICAjIyBQcm9qZWN0XG4gICAgICBcIlwiXCJcbiJdfQ==
