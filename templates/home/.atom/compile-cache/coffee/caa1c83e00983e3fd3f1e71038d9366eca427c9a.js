(function() {
  var $, CSON, CompositeDisposable, InsertLinkView, TextEditorView, View, config, fs, guid, helper, posts, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  CSON = require("season");

  fs = require("fs-plus");

  guid = require("guid");

  config = require("../config");

  utils = require("../utils");

  helper = require("../helpers/insert-link-helper");

  templateHelper = require("../helpers/template-helper");

  posts = null;

  module.exports = InsertLinkView = (function(superClass) {
    extend(InsertLinkView, superClass);

    function InsertLinkView() {
      return InsertLinkView.__super__.constructor.apply(this, arguments);
    }

    InsertLinkView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Link", {
            "class": "icon icon-globe"
          });
          _this.div(function() {
            _this.label("Text to be displayed", {
              "class": "message"
            });
            _this.subview("textEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Web Address", {
              "class": "message"
            });
            _this.subview("urlEditor", new TextEditorView({
              mini: true
            }));
            _this.label("Title", {
              "class": "message"
            });
            return _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
          });
          _this.div({
            "class": "dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-save-link-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-save-link-checkbox"
              }, {
                type: "checkbox",
                outlet: "saveCheckbox"
              });
              return _this.span("Automatically link to this text next time", {
                "class": "side-label"
              });
            });
          });
          return _this.div({
            outlet: "searchBox"
          }, function() {
            _this.label("Search Posts", {
              "class": "icon icon-search"
            });
            _this.subview("searchEditor", new TextEditorView({
              mini: true
            }));
            return _this.ul({
              "class": "markdown-writer-list",
              outlet: "searchResult"
            });
          });
        };
      })(this));
    };

    InsertLinkView.prototype.initialize = function() {
      utils.setTabIndex([this.textEditor, this.urlEditor, this.titleEditor, this.saveCheckbox, this.searchEditor]);
      this.searchEditor.getModel().onDidChange((function(_this) {
        return function() {
          if (posts) {
            return _this.updateSearch(_this.searchEditor.getText());
          }
        };
      })(this));
      this.searchResult.on("click", "li", (function(_this) {
        return function(e) {
          return _this.useSearchResult(e);
        };
      })(this));
      this.disposables = new CompositeDisposable();
      return this.disposables.add(atom.commands.add(this.element, {
        "core:confirm": (function(_this) {
          return function() {
            return _this.onConfirm();
          };
        })(this),
        "core:cancel": (function(_this) {
          return function() {
            return _this.detach();
          };
        })(this)
      }));
    };

    InsertLinkView.prototype.onConfirm = function() {
      var link;
      link = {
        text: this.textEditor.getText(),
        url: this.urlEditor.getText().trim(),
        title: this.titleEditor.getText().trim()
      };
      this.editor.transact((function(_this) {
        return function() {
          if (link.url) {
            return _this.insertLink(link);
          } else {
            return _this.removeLink(link.text);
          }
        };
      })(this));
      this.updateSavedLinks(link);
      return this.detach();
    };

    InsertLinkView.prototype.display = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.panel.show();
      this.fetchPosts();
      return this.loadSavedLinks((function(_this) {
        return function() {
          _this._normalizeSelectionAndSetLinkFields();
          if (_this.textEditor.getText()) {
            _this.urlEditor.getModel().selectAll();
            return _this.urlEditor.focus();
          } else {
            return _this.textEditor.focus();
          }
        };
      })(this));
    };

    InsertLinkView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertLinkView.__super__.detach.apply(this, arguments);
    };

    InsertLinkView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertLinkView.prototype._normalizeSelectionAndSetLinkFields = function() {
      this.range = utils.getTextBufferRange(this.editor, "link");
      this.currLink = this._findLinkInRange();
      this.referenceId = this.currLink.id;
      this.range = this.currLink.linkRange || this.range;
      this.definitionRange = this.currLink.definitionRange;
      this.setLink(this.currLink);
      return this.saveCheckbox.prop("checked", this.isInSavedLink(this.currLink));
    };

    InsertLinkView.prototype._findLinkInRange = function() {
      var link, selection;
      link = utils.findLinkInRange(this.editor, this.range);
      if (link != null) {
        if (!link.id) {
          return link;
        }
        if (link.id && link.linkRange && link.definitionRange) {
          return link;
        }
        link.id = null;
        return link;
      }
      selection = this.editor.getTextInRange(this.range);
      if (this.getSavedLink(selection)) {
        return this.getSavedLink(selection);
      }
      return {
        text: selection,
        url: "",
        title: ""
      };
    };

    InsertLinkView.prototype.updateSearch = function(query) {
      var results;
      if (!(query && posts)) {
        return;
      }
      query = query.trim().toLowerCase();
      results = posts.filter(function(post) {
        return post.title.toLowerCase().indexOf(query) >= 0;
      }).map(function(post) {
        return "<li data-url='" + post.url + "'>" + post.title + "</li>";
      });
      return this.searchResult.empty().append(results.join(""));
    };

    InsertLinkView.prototype.useSearchResult = function(e) {
      if (!this.textEditor.getText()) {
        this.textEditor.setText(e.target.textContent);
      }
      this.titleEditor.setText(e.target.textContent);
      this.urlEditor.setText(e.target.dataset.url);
      return this.titleEditor.focus();
    };

    InsertLinkView.prototype.insertLink = function(link) {
      if (this.definitionRange) {
        return this.updateReferenceLink(link);
      } else if (link.title) {
        return this.insertReferenceLink(link);
      } else {
        return this.insertInlineLink(link);
      }
    };

    InsertLinkView.prototype.insertInlineLink = function(link) {
      var newRange, text;
      text = templateHelper.create("linkInlineTag", link);
      newRange = this.editor.setTextInBufferRange(this.range, text);
      if (!config.get("foldInlineLinks")) {
        return;
      }
      newRange = newRange.copy();
      newRange.start.column += link.text.length + 3;
      newRange.end.column -= 1;
      return this.editor.foldBufferRange(newRange);
    };

    InsertLinkView.prototype.updateReferenceLink = function(link) {
      var definitionText, inlineLink, inlineText;
      if (link.title) {
        link = this._referenceLink(link);
        inlineText = templateHelper.create("referenceInlineTag", link);
        definitionText = templateHelper.create("referenceDefinitionTag", link);
        if (definitionText) {
          this.editor.setTextInBufferRange(this.range, inlineText);
          return this.editor.setTextInBufferRange(this.definitionRange, definitionText);
        } else {
          return this.replaceReferenceLink(inlineText);
        }
      } else {
        inlineLink = templateHelper.create("linkInlineTag", link);
        return this.replaceReferenceLink(inlineLink);
      }
    };

    InsertLinkView.prototype.insertReferenceLink = function(link) {
      var definitionText, inlineText;
      link = this._referenceLink(link);
      inlineText = templateHelper.create("referenceInlineTag", link);
      definitionText = templateHelper.create("referenceDefinitionTag", link);
      this.editor.setTextInBufferRange(this.range, inlineText);
      if (definitionText) {
        if (config.get("referenceInsertPosition") === "article") {
          return helper.insertAtEndOfArticle(this.editor, definitionText);
        } else {
          return helper.insertAfterCurrentParagraph(this.editor, definitionText);
        }
      }
    };

    InsertLinkView.prototype._referenceLink = function(link) {
      link['indent'] = " ".repeat(config.get("referenceIndentLength"));
      link['title'] = /^[-\*\!]$/.test(link.title) ? "" : link.title;
      link['label'] = this.referenceId || guid.raw().slice(0, 8);
      return link;
    };

    InsertLinkView.prototype.removeLink = function(text) {
      if (this.referenceId) {
        return this.replaceReferenceLink(text);
      } else {
        return this.editor.setTextInBufferRange(this.range, text);
      }
    };

    InsertLinkView.prototype.replaceReferenceLink = function(text) {
      var position;
      this.editor.setTextInBufferRange(this.range, text);
      position = this.editor.getCursorBufferPosition();
      helper.removeDefinitionRange(this.editor, this.definitionRange);
      return this.editor.setCursorBufferPosition(position);
    };

    InsertLinkView.prototype.setLink = function(link) {
      this.textEditor.setText(link.text);
      this.titleEditor.setText(link.title);
      return this.urlEditor.setText(link.url);
    };

    InsertLinkView.prototype.getSavedLink = function(text) {
      var link, ref1;
      link = (ref1 = this.links) != null ? ref1[text.toLowerCase()] : void 0;
      if (!link) {
        return link;
      }
      if (!link.text) {
        link["text"] = text;
      }
      return link;
    };

    InsertLinkView.prototype.isInSavedLink = function(link) {
      var savedLink;
      savedLink = this.getSavedLink(link.text);
      return !!savedLink && !(["text", "title", "url"].some(function(k) {
        return savedLink[k] !== link[k];
      }));
    };

    InsertLinkView.prototype.updateToLinks = function(link) {
      var inSavedLink, linkUpdated;
      linkUpdated = false;
      inSavedLink = this.isInSavedLink(link);
      if (this.saveCheckbox.prop("checked")) {
        if (!inSavedLink && link.url) {
          this.links[link.text.toLowerCase()] = link;
          linkUpdated = true;
        }
      } else if (inSavedLink) {
        delete this.links[link.text.toLowerCase()];
        linkUpdated = true;
      }
      return linkUpdated;
    };

    InsertLinkView.prototype.updateSavedLinks = function(link) {
      if (this.updateToLinks(link)) {
        return CSON.writeFile(config.get("siteLinkPath"), this.links);
      }
    };

    InsertLinkView.prototype.loadSavedLinks = function(callback) {
      return CSON.readFile(config.get("siteLinkPath"), (function(_this) {
        return function(err, data) {
          _this.links = data || {};
          return callback();
        };
      })(this));
    };

    InsertLinkView.prototype.fetchPosts = function() {
      var error, succeed;
      if (posts) {
        return (posts.length < 1 ? this.searchBox.hide() : void 0);
      }
      succeed = (function(_this) {
        return function(body) {
          posts = body.posts;
          if (posts.length > 0) {
            _this.searchBox.show();
            _this.searchEditor.setText(_this.textEditor.getText());
            return _this.updateSearch(_this.textEditor.getText());
          }
        };
      })(this);
      error = (function(_this) {
        return function(err) {
          return _this.searchBox.hide();
        };
      })(this);
      return utils.getJSON(config.get("urlForPosts"), succeed, error);
    };

    return InsertLinkView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtbGluay12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0hBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksZUFBSixFQUFVOztFQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsTUFBQSxHQUFTLE9BQUEsQ0FBUSwrQkFBUjs7RUFDVCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFakIsS0FBQSxHQUFROztFQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRCxLQUFDLENBQUEsS0FBRCxDQUFPLGFBQVAsRUFBc0I7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGlCQUFQO1dBQXRCO1VBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO1lBQ0gsS0FBQyxDQUFBLEtBQUQsQ0FBTyxzQkFBUCxFQUErQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUEvQjtZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsWUFBVCxFQUF1QixJQUFJLGNBQUosQ0FBbUI7Y0FBQSxJQUFBLEVB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QyxJQUFYLENBQUEsQ0FBQSxHQUFBLE1BQUQsRUFBUDs7TUFFQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDUixLQUFBLEdBQVEsSUFBSSxDQUFDO1VBQ2IsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLENBQWxCO1lBQ0UsS0FBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQUE7WUFDQSxLQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsS0FBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBdEI7bUJBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFkLEVBSEY7O1FBRlE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO01BTVYsS0FBQSxHQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO2lCQUFTLEtBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFBO1FBQVQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO2FBRVIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxNQUFNLENBQUMsR0FBUCxDQUFXLGFBQVgsQ0FBZCxFQUF5QyxPQUF6QyxFQUFrRCxLQUFsRDtJQVhVOzs7O0tBNU5lO0FBZDdCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlIFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIlxuQ1NPTiA9IHJlcXVpcmUgXCJzZWFzb25cIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5ndWlkID0gcmVxdWlyZSBcImd1aWRcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcbmhlbHBlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL2luc2VydC1saW5rLWhlbHBlclwiXG50ZW1wbGF0ZUhlbHBlciA9IHJlcXVpcmUgXCIuLi9oZWxwZXJzL3RlbXBsYXRlLWhlbHBlclwiXG5cbnBvc3RzID0gbnVsbCAjIHRvIGNhY2hlIHBvc3RzXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEluc2VydExpbmtWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiBcIm1hcmtkb3duLXdyaXRlciBtYXJrZG93bi13cml0ZXItZGlhbG9nXCIsID0+XG4gICAgICBAbGFiZWwgXCJJbnNlcnQgTGlua1wiLCBjbGFzczogXCJpY29uIGljb24tZ2xvYmVcIlxuICAgICAgQGRpdiA9PlxuICAgICAgICBAbGFiZWwgXCJUZXh0IHRvIGJlIGRpc3BsYXllZFwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJ0ZXh0RWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgICBAbGFiZWwgXCJXZWIgQWRkcmVzc1wiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgQHN1YnZpZXcgXCJ1cmxFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBsYWJlbCBcIlRpdGxlXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICBAc3VidmlldyBcInRpdGxlRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBjbGFzczogXCJkaWFsb2ctcm93XCIsID0+XG4gICAgICAgIEBsYWJlbCBmb3I6IFwibWFya2Rvd24td3JpdGVyLXNhdmUtbGluay1jaGVja2JveFwiLCA9PlxuICAgICAgICAgIEBpbnB1dCBpZDogXCJtYXJrZG93bi13cml0ZXItc2F2ZS1saW5rLWNoZWNrYm94XCIsXG4gICAgICAgICAgICB0eXBlOlwiY2hlY2tib3hcIiwgb3V0bGV0OiBcInNhdmVDaGVja2JveFwiXG4gICAgICAgICAgQHNwYW4gXCJBdXRvbWF0aWNhbGx5IGxpbmsgdG8gdGhpcyB0ZXh0IG5leHQgdGltZVwiLCBjbGFzczogXCJzaWRlLWxhYmVsXCJcbiAgICAgIEBkaXYgb3V0bGV0OiBcInNlYXJjaEJveFwiLCA9PlxuICAgICAgICBAbGFiZWwgXCJTZWFyY2ggUG9zdHNcIiwgY2xhc3M6IFwiaWNvbiBpY29uLXNlYXJjaFwiXG4gICAgICAgIEBzdWJ2aWV3IFwic2VhcmNoRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgICBAdWwgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyLWxpc3RcIiwgb3V0bGV0OiBcInNlYXJjaFJlc3VsdFwiXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICB1dGlscy5zZXRUYWJJbmRleChbQHRleHRFZGl0b3IsIEB1cmxFZGl0b3IsIEB0aXRsZUVkaXRvcixcbiAgICAgIEBzYXZlQ2hlY2tib3gsIEBzZWFyY2hFZGl0b3JdKVxuXG4gICAgQHNlYXJjaEVkaXRvci5nZXRNb2RlbCgpLm9uRGlkQ2hhbmdlID0+XG4gICAgICBAdXBkYXRlU2VhcmNoKEBzZWFyY2hFZGl0b3IuZ2V0VGV4dCgpKSBpZiBwb3N0c1xuICAgIEBzZWFyY2hSZXN1bHQub24gXCJjbGlja1wiLCBcImxpXCIsIChlKSA9PiBAdXNlU2VhcmNoUmVzdWx0KGUpXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgIEBlbGVtZW50LCB7XG4gICAgICAgIFwiY29yZTpjb25maXJtXCI6ID0+IEBvbkNvbmZpcm0oKSxcbiAgICAgICAgXCJjb3JlOmNhbmNlbFwiOiAgPT4gQGRldGFjaCgpXG4gICAgICB9KSlcblxuICBvbkNvbmZpcm06IC0+XG4gICAgbGluayA9XG4gICAgICB0ZXh0OiBAdGV4dEVkaXRvci5nZXRUZXh0KClcbiAgICAgIHVybDogQHVybEVkaXRvci5nZXRUZXh0KCkudHJpbSgpXG4gICAgICB0aXRsZTogQHRpdGxlRWRpdG9yLmdldFRleHQoKS50cmltKClcblxuICAgIEBlZGl0b3IudHJhbnNhY3QgPT5cbiAgICAgIGlmIGxpbmsudXJsIHRoZW4gQGluc2VydExpbmsobGluaykgZWxzZSBAcmVtb3ZlTGluayhsaW5rLnRleHQpXG5cbiAgICBAdXBkYXRlU2F2ZWRMaW5rcyhsaW5rKVxuICAgIEBkZXRhY2goKVxuXG4gIGRpc3BsYXk6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcywgdmlzaWJsZTogZmFsc2UpXG4gICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCA9ICQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudClcbiAgICBAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgQHBhbmVsLnNob3coKVxuICAgICMgZmV0Y2ggcmVtb3RlIGFuZCBsb2NhbCBsaW5rc1xuICAgIEBmZXRjaFBvc3RzKClcbiAgICBAbG9hZFNhdmVkTGlua3MgPT5cbiAgICAgIEBfbm9ybWFsaXplU2VsZWN0aW9uQW5kU2V0TGlua0ZpZWxkcygpXG5cbiAgICAgIGlmIEB0ZXh0RWRpdG9yLmdldFRleHQoKVxuICAgICAgICBAdXJsRWRpdG9yLmdldE1vZGVsKCkuc2VsZWN0QWxsKClcbiAgICAgICAgQHVybEVkaXRvci5mb2N1cygpXG4gICAgICBlbHNlXG4gICAgICAgIEB0ZXh0RWRpdG9yLmZvY3VzKClcblxuICBkZXRhY2g6IC0+XG4gICAgaWYgQHBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAcGFuZWwuaGlkZSgpXG4gICAgICBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50Py5mb2N1cygpXG4gICAgc3VwZXJcblxuICBkZXRhY2hlZDogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG51bGxcblxuICBfbm9ybWFsaXplU2VsZWN0aW9uQW5kU2V0TGlua0ZpZWxkczogLT5cbiAgICBAcmFuZ2UgPSB1dGlscy5nZXRUZXh0QnVmZmVyUmFuZ2UoQGVkaXRvciwgXCJsaW5rXCIpXG4gICAgQGN1cnJMaW5rID0gQF9maW5kTGlua0luUmFuZ2UoKVxuXG4gICAgQHJlZmVyZW5jZUlkID0gQGN1cnJMaW5rLmlkXG4gICAgQHJhbmdlID0gQGN1cnJMaW5rLmxpbmtSYW5nZSB8fCBAcmFuZ2VcbiAgICBAZGVmaW5pdGlvblJhbmdlID0gQGN1cnJMaW5rLmRlZmluaXRpb25SYW5nZVxuXG4gICAgQHNldExpbmsoQGN1cnJMaW5rKVxuICAgIEBzYXZlQ2hlY2tib3gucHJvcChcImNoZWNrZWRcIiwgQGlzSW5TYXZlZExpbmsoQGN1cnJMaW5rKSlcblxuICBfZmluZExpbmtJblJhbmdlOiAtPlxuICAgIGxpbmsgPSB1dGlscy5maW5kTGlua0luUmFuZ2UoQGVkaXRvciwgQHJhbmdlKVxuICAgIGlmIGxpbms/XG4gICAgICByZXR1cm4gbGluayB1bmxlc3MgbGluay5pZFxuICAgICAgIyBDaGVjayBpcyBsaW5rIGl0IGFuIG9ycGhhbiByZWZlcmVuY2UgbGlua1xuICAgICAgcmV0dXJuIGxpbmsgaWYgbGluay5pZCAmJiBsaW5rLmxpbmtSYW5nZSAmJiBsaW5rLmRlZmluaXRpb25SYW5nZVxuICAgICAgIyAgUmVtb3ZlIGxpbmsuaWQgaWYgaXQgaXMgb3JwaGFuXG4gICAgICBsaW5rLmlkID0gbnVsbFxuICAgICAgcmV0dXJuIGxpbmtcbiAgICAjIEZpbmQgc2VsZWN0aW9uIGluIHNhdmVkIGxpbmtzLCBhbmQgYXV0by1wb3B1bGF0ZSBpdFxuICAgIHNlbGVjdGlvbiA9IEBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoQHJhbmdlKVxuICAgIHJldHVybiBAZ2V0U2F2ZWRMaW5rKHNlbGVjdGlvbikgaWYgQGdldFNhdmVkTGluayhzZWxlY3Rpb24pXG4gICAgIyBEZWZhdWx0IGZhbGxiYWNrXG4gICAgdGV4dDogc2VsZWN0aW9uLCB1cmw6IFwiXCIsIHRpdGxlOiBcIlwiXG5cbiAgdXBkYXRlU2VhcmNoOiAocXVlcnkpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBxdWVyeSAmJiBwb3N0c1xuICAgIHF1ZXJ5ID0gcXVlcnkudHJpbSgpLnRvTG93ZXJDYXNlKClcbiAgICByZXN1bHRzID0gcG9zdHNcbiAgICAgIC5maWx0ZXIoKHBvc3QpIC0+IHBvc3QudGl0bGUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHF1ZXJ5KSA+PSAwKVxuICAgICAgLm1hcCgocG9zdCkgLT4gXCI8bGkgZGF0YS11cmw9JyN7cG9zdC51cmx9Jz4je3Bvc3QudGl0bGV9PC9saT5cIilcbiAgICBAc2VhcmNoUmVzdWx0LmVtcHR5KCkuYXBwZW5kKHJlc3VsdHMuam9pbihcIlwiKSlcblxuICB1c2VTZWFyY2hSZXN1bHQ6IChlKSAtPlxuICAgIEB0ZXh0RWRpdG9yLnNldFRleHQoZS50YXJnZXQudGV4dENvbnRlbnQpIHVubGVzcyBAdGV4dEVkaXRvci5nZXRUZXh0KClcbiAgICBAdGl0bGVFZGl0b3Iuc2V0VGV4dChlLnRhcmdldC50ZXh0Q29udGVudClcbiAgICBAdXJsRWRpdG9yLnNldFRleHQoZS50YXJnZXQuZGF0YXNldC51cmwpXG4gICAgQHRpdGxlRWRpdG9yLmZvY3VzKClcblxuICBpbnNlcnRMaW5rOiAobGluaykgLT5cbiAgICBpZiBAZGVmaW5pdGlvblJhbmdlXG4gICAgICBAdXBkYXRlUmVmZXJlbmNlTGluayhsaW5rKVxuICAgIGVsc2UgaWYgbGluay50aXRsZVxuICAgICAgQGluc2VydFJlZmVyZW5jZUxpbmsobGluaylcbiAgICBlbHNlXG4gICAgICBAaW5zZXJ0SW5saW5lTGluayhsaW5rKVxuXG4gIGluc2VydElubGluZUxpbms6IChsaW5rKSAtPlxuICAgIHRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJsaW5rSW5saW5lVGFnXCIsIGxpbmspXG5cbiAgICBuZXdSYW5nZSA9IEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB0ZXh0KVxuICAgIHJldHVybiB1bmxlc3MgY29uZmlnLmdldChcImZvbGRJbmxpbmVMaW5rc1wiKVxuXG4gICAgbmV3UmFuZ2UgPSBuZXdSYW5nZS5jb3B5KClcbiAgICBuZXdSYW5nZS5zdGFydC5jb2x1bW4gKz0gbGluay50ZXh0Lmxlbmd0aCArIDMgIyBbXShcbiAgICBuZXdSYW5nZS5lbmQuY29sdW1uIC09IDEgIyApXG4gICAgQGVkaXRvci5mb2xkQnVmZmVyUmFuZ2UobmV3UmFuZ2UpXG5cbiAgdXBkYXRlUmVmZXJlbmNlTGluazogKGxpbmspIC0+XG4gICAgaWYgbGluay50aXRsZSAjIHVwZGF0ZSB0aGUgcmVmZXJlbmNlIGxpbmtcbiAgICAgIGxpbmsgPSBAX3JlZmVyZW5jZUxpbmsobGluaylcbiAgICAgIGlubGluZVRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJyZWZlcmVuY2VJbmxpbmVUYWdcIiwgbGluaylcbiAgICAgIGRlZmluaXRpb25UZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwicmVmZXJlbmNlRGVmaW5pdGlvblRhZ1wiLCBsaW5rKVxuXG4gICAgICBpZiBkZWZpbml0aW9uVGV4dFxuICAgICAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKEByYW5nZSwgaW5saW5lVGV4dClcbiAgICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAZGVmaW5pdGlvblJhbmdlLCBkZWZpbml0aW9uVGV4dClcbiAgICAgIGVsc2VcbiAgICAgICAgQHJlcGxhY2VSZWZlcmVuY2VMaW5rKGlubGluZVRleHQpXG4gICAgZWxzZSAjIHJlcGxhY2UgYnkgdG8gaW5saW5lIGxpbmtcbiAgICAgIGlubGluZUxpbmsgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJsaW5rSW5saW5lVGFnXCIsIGxpbmspXG4gICAgICBAcmVwbGFjZVJlZmVyZW5jZUxpbmsoaW5saW5lTGluaylcblxuICBpbnNlcnRSZWZlcmVuY2VMaW5rOiAobGluaykgLT5cbiAgICBsaW5rID0gQF9yZWZlcmVuY2VMaW5rKGxpbmspXG4gICAgaW5saW5lVGV4dCA9IHRlbXBsYXRlSGVscGVyLmNyZWF0ZShcInJlZmVyZW5jZUlubGluZVRhZ1wiLCBsaW5rKVxuICAgIGRlZmluaXRpb25UZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwicmVmZXJlbmNlRGVmaW5pdGlvblRhZ1wiLCBsaW5rKVxuXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAcmFuZ2UsIGlubGluZVRleHQpXG4gICAgaWYgZGVmaW5pdGlvblRleHQgIyBpbnNlcnQgb25seSBpZiBkZWZpbml0aW9uVGV4dCBleGlzdHNcbiAgICAgIGlmIGNvbmZpZy5nZXQoXCJyZWZlcmVuY2VJbnNlcnRQb3NpdGlvblwiKSA9PSBcImFydGljbGVcIlxuICAgICAgICBoZWxwZXIuaW5zZXJ0QXRFbmRPZkFydGljbGUoQGVkaXRvciwgZGVmaW5pdGlvblRleHQpXG4gICAgICBlbHNlXG4gICAgICAgIGhlbHBlci5pbnNlcnRBZnRlckN1cnJlbnRQYXJhZ3JhcGgoQGVkaXRvciwgZGVmaW5pdGlvblRleHQpXG5cbiAgX3JlZmVyZW5jZUxpbms6IChsaW5rKSAtPlxuICAgIGxpbmtbJ2luZGVudCddID0gXCIgXCIucmVwZWF0KGNvbmZpZy5nZXQoXCJyZWZlcmVuY2VJbmRlbnRMZW5ndGhcIikpXG4gICAgbGlua1sndGl0bGUnXSA9IGlmIC9eWy1cXCpcXCFdJC8udGVzdChsaW5rLnRpdGxlKSB0aGVuIFwiXCIgZWxzZSBsaW5rLnRpdGxlXG4gICAgbGlua1snbGFiZWwnXSA9IEByZWZlcmVuY2VJZCB8fCBndWlkLnJhdygpWzAuLjddXG4gICAgbGlua1xuXG4gIHJlbW92ZUxpbms6ICh0ZXh0KSAtPlxuICAgIGlmIEByZWZlcmVuY2VJZFxuICAgICAgQHJlcGxhY2VSZWZlcmVuY2VMaW5rKHRleHQpICMgcmVwbGFjZSB3aXRoIHJhdyB0ZXh0XG4gICAgZWxzZVxuICAgICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAcmFuZ2UsIHRleHQpXG5cbiAgcmVwbGFjZVJlZmVyZW5jZUxpbms6ICh0ZXh0KSAtPlxuICAgIEBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UoQHJhbmdlLCB0ZXh0KVxuXG4gICAgcG9zaXRpb24gPSBAZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBoZWxwZXIucmVtb3ZlRGVmaW5pdGlvblJhbmdlKEBlZGl0b3IsIEBkZWZpbml0aW9uUmFuZ2UpXG4gICAgQGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihwb3NpdGlvbilcblxuICBzZXRMaW5rOiAobGluaykgLT5cbiAgICBAdGV4dEVkaXRvci5zZXRUZXh0KGxpbmsudGV4dClcbiAgICBAdGl0bGVFZGl0b3Iuc2V0VGV4dChsaW5rLnRpdGxlKVxuICAgIEB1cmxFZGl0b3Iuc2V0VGV4dChsaW5rLnVybClcblxuICBnZXRTYXZlZExpbms6ICh0ZXh0KSAtPlxuICAgIGxpbmsgPSBAbGlua3M/W3RleHQudG9Mb3dlckNhc2UoKV1cbiAgICByZXR1cm4gbGluayB1bmxlc3MgbGlua1xuXG4gICAgbGlua1tcInRleHRcIl0gPSB0ZXh0IHVubGVzcyBsaW5rLnRleHRcbiAgICByZXR1cm4gbGlua1xuXG4gIGlzSW5TYXZlZExpbms6IChsaW5rKSAtPlxuICAgIHNhdmVkTGluayA9IEBnZXRTYXZlZExpbmsobGluay50ZXh0KVxuICAgICEhc2F2ZWRMaW5rICYmICEoW1widGV4dFwiLCBcInRpdGxlXCIsIFwidXJsXCJdLnNvbWUgKGspIC0+IHNhdmVkTGlua1trXSAhPSBsaW5rW2tdKVxuXG4gIHVwZGF0ZVRvTGlua3M6IChsaW5rKSAtPlxuICAgIGxpbmtVcGRhdGVkID0gZmFsc2VcbiAgICBpblNhdmVkTGluayA9IEBpc0luU2F2ZWRMaW5rKGxpbmspXG5cbiAgICBpZiBAc2F2ZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIpXG4gICAgICBpZiAhaW5TYXZlZExpbmsgJiYgbGluay51cmxcbiAgICAgICAgQGxpbmtzW2xpbmsudGV4dC50b0xvd2VyQ2FzZSgpXSA9IGxpbmtcbiAgICAgICAgbGlua1VwZGF0ZWQgPSB0cnVlXG4gICAgZWxzZSBpZiBpblNhdmVkTGlua1xuICAgICAgZGVsZXRlIEBsaW5rc1tsaW5rLnRleHQudG9Mb3dlckNhc2UoKV1cbiAgICAgIGxpbmtVcGRhdGVkID0gdHJ1ZVxuXG4gICAgcmV0dXJuIGxpbmtVcGRhdGVkXG5cbiAgIyBzYXZlIHRoZSBuZXcgbGluayB0byBDU09OIGZpbGUgaWYgdGhlIGxpbmsgaGFzIHVwZGF0ZWQgQGxpbmtzXG4gIHVwZGF0ZVNhdmVkTGlua3M6IChsaW5rKSAtPlxuICAgIENTT04ud3JpdGVGaWxlKGNvbmZpZy5nZXQoXCJzaXRlTGlua1BhdGhcIiksIEBsaW5rcykgaWYgQHVwZGF0ZVRvTGlua3MobGluaylcblxuICAjIGxvYWQgc2F2ZWQgbGlua3MgZnJvbSBDU09OIGZpbGVzXG4gIGxvYWRTYXZlZExpbmtzOiAoY2FsbGJhY2spIC0+XG4gICAgQ1NPTi5yZWFkRmlsZSBjb25maWcuZ2V0KFwic2l0ZUxpbmtQYXRoXCIpLCAoZXJyLCBkYXRhKSA9PlxuICAgICAgQGxpbmtzID0gZGF0YSB8fCB7fVxuICAgICAgY2FsbGJhY2soKVxuXG4gICMgZmV0Y2ggcmVtb3RlIHBvc3RzIGluIEpTT04gZm9ybWF0XG4gIGZldGNoUG9zdHM6IC0+XG4gICAgcmV0dXJuIChAc2VhcmNoQm94LmhpZGUoKSBpZiBwb3N0cy5sZW5ndGggPCAxKSBpZiBwb3N0c1xuXG4gICAgc3VjY2VlZCA9IChib2R5KSA9PlxuICAgICAgcG9zdHMgPSBib2R5LnBvc3RzXG4gICAgICBpZiBwb3N0cy5sZW5ndGggPiAwXG4gICAgICAgIEBzZWFyY2hCb3guc2hvdygpXG4gICAgICAgIEBzZWFyY2hFZGl0b3Iuc2V0VGV4dChAdGV4dEVkaXRvci5nZXRUZXh0KCkpXG4gICAgICAgIEB1cGRhdGVTZWFyY2goQHRleHRFZGl0b3IuZ2V0VGV4dCgpKVxuICAgIGVycm9yID0gKGVycikgPT4gQHNlYXJjaEJveC5oaWRlKClcblxuICAgIHV0aWxzLmdldEpTT04oY29uZmlnLmdldChcInVybEZvclBvc3RzXCIpLCBzdWNjZWVkLCBlcnJvcilcbiJdfQ==
