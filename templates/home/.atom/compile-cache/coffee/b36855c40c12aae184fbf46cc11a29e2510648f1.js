(function() {
  describe("Markdown", function() {
    var editor, editorElement, grammar;
    editor = null;
    grammar = null;
    editorElement = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-markdown');
      });
      editor = atom.workspace.buildTextEditor();
      editor.setText('');
      editor.setCursorBufferPosition(0, 0);
      editor.config.set('editor.softTabs', true);
      editor.config.set('editor.tabLength', 2);
      editor.config.set('editor.tabType', 'soft');
      return runs(function() {
        grammar = atom.grammars.grammarForScopeName('text.md');
        editor.setGrammar(grammar);
        return editorElement = atom.views.getView(editor);
      });
    });
    afterEach(function() {
      return editor.setText('');
    });
    xit('should be empty', function() {
      return expect(editor.isEmpty()).toBe(true);
    });
    xit('should have Markdown selected as grammar', function() {
      return expect(editor.getGrammar().name).toBe('Markdown');
    });
    xit('should have registered its custom commands', function() {
      var command, commands, customCommands, i, isRegistered, len, results;
      commands = atom.commands.findCommands({
        target: editorElement
      });
      customCommands = {
        'markdown:indent-list-item': false,
        'markdown:outdent-list-item': false,
        'markdown:toggle-task': false
      };
      for (i = 0, len = commands.length; i < len; i++) {
        command = commands[i];
        if (customCommands[command.name] != null) {
          customCommands[command.name] = true;
        }
      }
      results = [];
      for (command in customCommands) {
        isRegistered = customCommands[command];
        results.push(expect(isRegistered).toBe(true));
      }
      return results;
    });
    xdescribe('toggling tasks', function() {
      it('toggles a task', function() {
        editor.setText('- [ ] task');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('- [x] task');
      });
      it('toggles a task (with the cursor half way on the line)', function() {
        editor.setText('- [ ] task');
        editor.setCursorBufferPosition(0, 4);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('- [x] task');
      });
      it('toggles a completed task', function() {
        editor.setText('- [x] task');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('- [ ] task');
      });
      it('toggles an indented task', function() {
        editor.setText('  - [ ] task');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('  - [x] task');
      });
      it('does not toggle an invalid task', function() {
        editor.setText('- [] invalid task');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('- [] invalid task');
      });
      it('does nothing on a normal list-item', function() {
        editor.setText('- item');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('- item');
      });
      return it('does nothing on a bit of regular text', function() {
        editor.setText('[ ] text');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:toggle-task");
        return expect(editor.getText()).toBe('[ ] text');
      });
    });
    xdescribe('indenting list-items', function() {
      it('indents a valid list-item', function() {
        editor.setText('- item');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  - item');
      });
      it('indents a list-item when the cursor is not at the start of a line', function() {
        editor.setText('- item');
        editor.setCursorBufferPosition(0, 3);
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  - item');
      });
      it('indents an already indented list-item', function() {
        editor.setText('  - item');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('    - item');
      });
      it('indents a tabbed indented list-item', function() {
        editor.setText('\t- item');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  \t- item');
      });
      it('does NOT indent an invalid list-item', function() {
        editor.setText('-item');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('-item');
      });
      it('indents a partially indented list-item', function() {
        editor.setText(' - item');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('   - item');
      });
      it('does NOT indent a seemingly valid list-item as part of fenced-code', function() {
        editor.setText('```\n- item\n```');
        editor.setCursorBufferPosition(1, 3);
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('```\n- item\n```');
      });
      it('indents a valid numbered list-item', function() {
        editor.setText('1. item');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  1. item');
      });
      it('indents a task-list-item', function() {
        editor.setText('- [ ] task');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  - [ ] task');
      });
      return it('indents definition-lists', function() {
        editor.setText(': definition');
        atom.commands.dispatch(editorElement, "markdown:indent-list-item");
        return expect(editor.getText()).toBe('  : definition');
      });
    });
    return xdescribe('outdenting list-items', function() {
      it('outdents a valid list-item', function() {
        editor.setText('  - item');
        editor.setCursorBufferPosition(0, 0);
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('- item');
      });
      it('outdents a list-item when the cursor is not at the start of a line', function() {
        editor.setText('  - item');
        editor.setCursorBufferPosition(0, 3);
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('- item');
      });
      it('does nothing on an unindented list-item', function() {
        editor.setText('- item');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('- item');
      });
      it('outdents a tabbed indented list-item', function() {
        editor.setText('\t- item');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('- item');
      });
      it('does NOT outdent an invalid list-item', function() {
        editor.setText('  -item');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('  -item');
      });
      it('outdents a partially (3 spaces) indented list-item', function() {
        editor.setText('   - item');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe(' - item');
      });
      it('does NOT outdent a seemingly valid list-item as part of fenced-code', function() {
        editor.setText('```\n  - item\n```');
        editor.setCursorBufferPosition(1, 3);
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('```\n  - item\n```');
      });
      it('indents a valid numbered list-item', function() {
        editor.setText('  1. item');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('1. item');
      });
      it('outdents a task-list-item', function() {
        editor.setText('  - [ ] task');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe('- [ ] task');
      });
      return it('outdents definition-lists', function() {
        editor.setText('  : definition');
        atom.commands.dispatch(editorElement, "markdown:outdent-list-item");
        return expect(editor.getText()).toBe(': definition');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbGFuZ3VhZ2UtbWFya2Rvd24vc3BlYy9jb21tYW5kcy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUE7QUFFbkIsUUFBQTtJQUFBLE1BQUEsR0FBUztJQUNULE9BQUEsR0FBVTtJQUNWLGFBQUEsR0FBZ0I7SUFFaEIsVUFBQSxDQUFXLFNBQUE7TUFFVCxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsbUJBQTlCO01BRGMsQ0FBaEI7TUFHQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUE7TUFDVCxNQUFNLENBQUMsT0FBUCxDQUFlLEVBQWY7TUFDQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBL0IsRUFBa0MsQ0FBbEM7TUFHQSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsaUJBQWxCLEVBQXFDLElBQXJDO01BQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxDQUF0QztNQUNBLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsTUFBcEM7YUFFQSxJQUFBLENBQUssU0FBQTtRQUNILE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLFNBQWxDO1FBQ1YsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEI7ZUFDQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtNQUhiLENBQUw7SUFkUyxDQUFYO0lBbUJBLFNBQUEsQ0FBVSxTQUFBO2FBQ1IsTUFBTSxDQUFDLE9BQVAsQ0FBZSxFQUFmO0lBRFEsQ0FBVjtJQUdBLEdBQUEsQ0FBSSxpQkFBSixFQUF1QixTQUFBO2FBQ3JCLE1B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OUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxjQUFmO1FBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGFBQXZCLEVBQXNDLDRCQUF0QztlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixZQUE5QjtNQUg4QixDQUFoQzthQUtBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO1FBQzlCLE1BQU0sQ0FBQyxPQUFQLENBQWUsZ0JBQWY7UUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsYUFBdkIsRUFBc0MsNEJBQXRDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGNBQTlCO01BSDhCLENBQWhDO0lBbERpQyxDQUFuQztFQWpKbUIsQ0FBckI7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIiMgVE9ET1xuIyBTaW11bGF0ZSBwcmVzc2luZyBgdGFiYCBpbnN0ZWFkIG9mIHRyaWdnZXJpbmcgYSBzcGVjaWZpYyBjb21tYW5kLlxuIyBPciBpcyB0aGF0IHNpbXBseSBvdXRzaWRlIG9mIHRoZSBzY29wZSBvZiB0aGVzZSBzcGVjcz9cblxuZGVzY3JpYmUgXCJNYXJrZG93blwiLCAtPlxuXG4gIGVkaXRvciA9IG51bGxcbiAgZ3JhbW1hciA9IG51bGxcbiAgZWRpdG9yRWxlbWVudCA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1tYXJrZG93bicpXG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IoKVxuICAgIGVkaXRvci5zZXRUZXh0KCcnKVxuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigwLCAwKVxuXG4gICAgIyBTZXQgZGVmYXVsdCBjb25maWcgc28gd2UgY2FuICdhc3N1bWUnIHRoZXNlIHZhbHVlcyBsYXRlciBvblxuICAgIGVkaXRvci5jb25maWcuc2V0KCdlZGl0b3Iuc29mdFRhYnMnLCB0cnVlKVxuICAgIGVkaXRvci5jb25maWcuc2V0KCdlZGl0b3IudGFiTGVuZ3RoJywgMilcbiAgICBlZGl0b3IuY29uZmlnLnNldCgnZWRpdG9yLnRhYlR5cGUnLCAnc29mdCcpXG5cbiAgICBydW5zIC0+XG4gICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCd0ZXh0Lm1kJylcbiAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGdyYW1tYXIpXG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcblxuICBhZnRlckVhY2ggLT5cbiAgICBlZGl0b3Iuc2V0VGV4dCgnJylcblxuICB4aXQgJ3Nob3VsZCBiZSBlbXB0eScsIC0+XG4gICAgZXhwZWN0KGVkaXRvci5pc0VtcHR5KCkpLnRvQmUodHJ1ZSlcblxuICB4aXQgJ3Nob3VsZCBoYXZlIE1hcmtkb3duIHNlbGVjdGVkIGFzIGdyYW1tYXInLCAtPlxuICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWUpLnRvQmUoJ01hcmtkb3duJylcblxuICB4aXQgJ3Nob3VsZCBoYXZlIHJlZ2lzdGVyZWQgaXRzIGN1c3RvbSBjb21tYW5kcycsIC0+XG4gICAgY29tbWFuZHMgPSBhdG9tLmNvbW1hbmRzLmZpbmRDb21tYW5kcyh7IHRhcmdldDogZWRpdG9yRWxlbWVudCB9KVxuICAgIGN1c3RvbUNvbW1hbmRzID1cbiAgICAgICdtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtJzogZmFsc2VcbiAgICAgICdtYXJrZG93bjpvdXRkZW50LWxpc3QtaXRlbSc6IGZhbHNlXG4gICAgICAnbWFya2Rvd246dG9nZ2xlLXRhc2snOiBmYWxzZVxuICAgIGZvciBjb21tYW5kIGluIGNvbW1hbmRzXG4gICAgICBpZiBjdXN0b21Db21tYW5kc1tjb21tYW5kLm5hbWVdP1xuICAgICAgICBjdXN0b21Db21tYW5kc1tjb21tYW5kLm5hbWVdID0gdHJ1ZVxuICAgIGZvciBjb21tYW5kLCBpc1JlZ2lzdGVyZWQgb2YgY3VzdG9tQ29tbWFuZHNcbiAgICAgIGV4cGVjdChpc1JlZ2lzdGVyZWQpLnRvQmUodHJ1ZSlcblxuICB4ZGVzY3JpYmUgJ3RvZ2dsaW5nIHRhc2tzJywgLT5cblxuICAgIGl0ICd0b2dnbGVzIGEgdGFzaycsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnLSBbIF0gdGFzaycpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oMCwgMClcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjp0b2dnbGUtdGFza1wiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJy0gW3hdIHRhc2snKVxuXG4gICAgaXQgJ3RvZ2dsZXMgYSB0YXNrICh3aXRoIHRoZSBjdXJzb3IgaGFsZiB3YXkgb24gdGhlIGxpbmUpJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCctIFsgXSB0YXNrJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigwLCA0KVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOnRvZ2dsZS10YXNrXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnLSBbeF0gdGFzaycpXG5cbiAgICBpdCAndG9nZ2xlcyBhIGNvbXBsZXRlZCB0YXNrJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCctIFt4XSB0YXNrJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigwLCAwKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOnRvZ2dsZS10YXNrXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnLSBbIF0gdGFzaycpXG5cbiAgICBpdCAndG9nZ2xlcyBhbiBpbmRlbnRlZCB0YXNrJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcgIC0gWyBdIHRhc2snKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKDAsIDApXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246dG9nZ2xlLXRhc2tcIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCcgIC0gW3hdIHRhc2snKVxuXG4gICAgaXQgJ2RvZXMgbm90IHRvZ2dsZSBhbiBpbnZhbGlkIHRhc2snLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJy0gW10gaW52YWxpZCB0YXNrJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigwLCAwKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOnRvZ2dsZS10YXNrXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnLSBbXSBpbnZhbGlkIHRhc2snKVxuXG4gICAgaXQgJ2RvZXMgbm90aGluZyBvbiBhIG5vcm1hbCBsaXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJy0gaXRlbScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oMCwgMClcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjp0b2dnbGUtdGFza1wiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJy0gaXRlbScpXG5cbiAgICBpdCAnZG9lcyBub3RoaW5nIG9uIGEgYml0IG9mIHJlZ3VsYXIgdGV4dCcsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnWyBdIHRleHQnKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKDAsIDApXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246dG9nZ2xlLXRhc2tcIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCdbIF0gdGV4dCcpXG5cbiAgeGRlc2NyaWJlICdpbmRlbnRpbmcgbGlzdC1pdGVtcycsIC0+XG5cbiAgICBpdCAnaW5kZW50cyBhIHZhbGlkIGxpc3QtaXRlbScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnLSBpdGVtJylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigwLCAwKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOmluZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCcgIC0gaXRlbScpXG5cbiAgICBpdCAnaW5kZW50cyBhIGxpc3QtaXRlbSB3aGVuIHRoZSBjdXJzb3IgaXMgbm90IGF0IHRoZSBzdGFydCBvZiBhIGxpbmUnLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJy0gaXRlbScpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oMCwgMylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnICAtIGl0ZW0nKVxuXG4gICAgaXQgJ2luZGVudHMgYW4gYWxyZWFkeSBpbmRlbnRlZCBsaXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJyAgLSBpdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnICAgIC0gaXRlbScpXG5cbiAgICBpdCAnaW5kZW50cyBhIHRhYmJlZCBpbmRlbnRlZCBsaXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJ1xcdC0gaXRlbScpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246aW5kZW50LWxpc3QtaXRlbVwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJyAgXFx0LSBpdGVtJylcblxuICAgIGl0ICdkb2VzIE5PVCBpbmRlbnQgYW4gaW52YWxpZCBsaXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJy1pdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnLWl0ZW0nKVxuXG4gICAgaXQgJ2luZGVudHMgYSBwYXJ0aWFsbHkgaW5kZW50ZWQgbGlzdC1pdGVtJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcgLSBpdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnICAgLSBpdGVtJylcblxuICAgIGl0ICdkb2VzIE5PVCBpbmRlbnQgYSBzZWVtaW5nbHkgdmFsaWQgbGlzdC1pdGVtIGFzIHBhcnQgb2YgZmVuY2VkLWNvZGUnLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJ2BgYFxcbi0gaXRlbVxcbmBgYCcpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oMSwgMylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnYGBgXFxuLSBpdGVtXFxuYGBgJylcblxuICAgIGl0ICdpbmRlbnRzIGEgdmFsaWQgbnVtYmVyZWQgbGlzdC1pdGVtJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcxLiBpdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnICAxLiBpdGVtJylcblxuICAgIGl0ICdpbmRlbnRzIGEgdGFzay1saXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJy0gWyBdIHRhc2snKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOmluZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCcgIC0gWyBdIHRhc2snKVxuXG4gICAgaXQgJ2luZGVudHMgZGVmaW5pdGlvbi1saXN0cycsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnOiBkZWZpbml0aW9uJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjppbmRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnICA6IGRlZmluaXRpb24nKVxuXG4gIHhkZXNjcmliZSAnb3V0ZGVudGluZyBsaXN0LWl0ZW1zJywgLT5cblxuICAgIGl0ICdvdXRkZW50cyBhIHZhbGlkIGxpc3QtaXRlbScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnICAtIGl0ZW0nKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKDAsIDApXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246b3V0ZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCctIGl0ZW0nKVxuXG4gICAgaXQgJ291dGRlbnRzIGEgbGlzdC1pdGVtIHdoZW4gdGhlIGN1cnNvciBpcyBub3QgYXQgdGhlIHN0YXJ0IG9mIGEgbGluZScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnICAtIGl0ZW0nKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKDAsIDMpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246b3V0ZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCctIGl0ZW0nKVxuXG4gICAgaXQgJ2RvZXMgbm90aGluZyBvbiBhbiB1bmluZGVudGVkIGxpc3QtaXRlbScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnLSBpdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjpvdXRkZW50LWxpc3QtaXRlbVwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJy0gaXRlbScpXG5cbiAgICBpdCAnb3V0ZGVudHMgYSB0YWJiZWQgaW5kZW50ZWQgbGlzdC1pdGVtJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCdcXHQtIGl0ZW0nKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOm91dGRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnLSBpdGVtJylcblxuICAgIGl0ICdkb2VzIE5PVCBvdXRkZW50IGFuIGludmFsaWQgbGlzdC1pdGVtJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcgIC1pdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjpvdXRkZW50LWxpc3QtaXRlbVwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJyAgLWl0ZW0nKVxuXG4gICAgaXQgJ291dGRlbnRzIGEgcGFydGlhbGx5ICgzIHNwYWNlcykgaW5kZW50ZWQgbGlzdC1pdGVtJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcgICAtIGl0ZW0nKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JFbGVtZW50LCBcIm1hcmtkb3duOm91dGRlbnQtbGlzdC1pdGVtXCIpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnIC0gaXRlbScpXG5cbiAgICBpdCAnZG9lcyBOT1Qgb3V0ZGVudCBhIHNlZW1pbmdseSB2YWxpZCBsaXN0LWl0ZW0gYXMgcGFydCBvZiBmZW5jZWQtY29kZScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnYGBgXFxuICAtIGl0ZW1cXG5gYGAnKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKDEsIDMpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246b3V0ZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCdgYGBcXG4gIC0gaXRlbVxcbmBgYCcpXG5cbiAgICBpdCAnaW5kZW50cyBhIHZhbGlkIG51bWJlcmVkIGxpc3QtaXRlbScsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCgnICAxLiBpdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZWRpdG9yRWxlbWVudCwgXCJtYXJrZG93bjpvdXRkZW50LWxpc3QtaXRlbVwiKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJzEuIGl0ZW0nKVxuXG4gICAgaXQgJ291dGRlbnRzIGEgdGFzay1saXN0LWl0ZW0nLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQoJyAgLSBbIF0gdGFzaycpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246b3V0ZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCctIFsgXSB0YXNrJylcblxuICAgIGl0ICdvdXRkZW50cyBkZWZpbml0aW9uLWxpc3RzJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0KCcgIDogZGVmaW5pdGlvbicpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvckVsZW1lbnQsIFwibWFya2Rvd246b3V0ZGVudC1saXN0LWl0ZW1cIilcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlKCc6IGRlZmluaXRpb24nKVxuIl19
