(function() {
  var $, CompositeDisposable, InsertImageClipboardView, TextEditorView, View, clipboard, config, fs, path, ref, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  clipboard = require('clipboard');

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  module.exports = InsertImageClipboardView = (function(superClass) {
    extend(InsertImageClipboardView, superClass);

    function InsertImageClipboardView() {
      return InsertImageClipboardView.__super__.constructor.apply(this, arguments);
    }

    InsertImageClipboardView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image from Clipboard", {
            "class": "icon icon-clippy"
          });
          _this.div(function() {
            _this.label("Title (alt)", {
              "class": "message"
            });
            _this.subview("titleEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Width (px)", {
                "class": "message"
              });
              return _this.subview("widthEditor", new TextEditorView({
                mini: true
              }));
            });
            _this.div({
              "class": "col-1"
            }, function() {
              _this.label("Height (px)", {
                "class": "message"
              });
              return _this.subview("heightEditor", new TextEditorView({
                mini: true
              }));
            });
            return _this.div({
              "class": "col-2"
            }, function() {
              _this.label("Alignment", {
                "class": "message"
              });
              return _this.subview("alignEditor", new TextEditorView({
                mini: true
              }));
            });
          });
          _this.div({
            "class": "dialog-row"
          }, function() {
            return _this.span("Save Image To: Missing Title (alt)", {
              outlet: "copyImageMessage"
            });
          });
          return _this.div({
            "class": "image-container"
          }, function() {
            return _this.img({
              outlet: 'imagePreview'
            });
          });
        };
      })(this));
    };

    InsertImageClipboardView.prototype.initialize = function() {
      utils.setTabIndex([this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor]);
      this.titleEditor.on("keyup", (function(_this) {
        return function() {
          return _this.updateCopyImageDest();
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

    InsertImageClipboardView.prototype.onConfirm = function() {
      var confirmation, destFile, error, title;
      title = this.titleEditor.getText().trim();
      if (!title) {
        return;
      }
      try {
        destFile = this.getCopiedImageDestPath(title);
        if (fs.existsSync(destFile)) {
          confirmation = atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destFile + "\nDo you want to overwrite it?",
            buttons: ["No", "Yes"]
          });
          if (confirmation === 0) {
            this.titleEditor.focus();
            return;
          }
        }
        if (this.clipboardImage.toPNG) {
          fs.writeFileSync(destFile, this.clipboardImage.toPNG());
        } else {
          fs.writeFileSync(destFile, this.clipboardImage.toPng());
        }
        clipboard.writeText(destFile);
        this.editor.transact((function(_this) {
          return function() {
            return _this.insertImageTag(destFile);
          };
        })(this));
        return this.detach();
      } catch (error1) {
        error = error1;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Saving Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageClipboardView.prototype.display = function(e) {
      this.clipboardImage = clipboard.readImage();
      if (this.clipboardImage.isEmpty()) {
        e.abortKeyBinding();
        return;
      }
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.previouslyFocusedElement = $(document.activeElement);
      this.editor = atom.workspace.getActiveTextEditor();
      this.frontMatter = templateHelper.getEditor(this.editor);
      this.dateTime = templateHelper.getDateTime();
      this.setImageContext();
      this.displayImagePreview();
      this.panel.show();
      return this.titleEditor.focus();
    };

    InsertImageClipboardView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertImageClipboardView.__super__.detach.call(this);
    };

    InsertImageClipboardView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertImageClipboardView.prototype.setImageContext = function() {
      var height, position, ref1, width;
      ref1 = this.clipboardImage.getSize(), width = ref1.width, height = ref1.height;
      this.widthEditor.setText("" + width);
      this.heightEditor.setText("" + height);
      position = width > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageClipboardView.prototype.updateCopyImageDest = function() {
      var destFile, title;
      title = this.titleEditor.getText().trim();
      if (title) {
        destFile = this.getCopiedImageDestPath(title);
        return this.copyImageMessage.text("Save Image To: " + destFile);
      } else {
        return this.copyImageMessage.text("Save Image To: Missing Title (alt)");
      }
    };

    InsertImageClipboardView.prototype.displayImagePreview = function() {
      this.imagePreview.attr("src", this.clipboardImage.toDataURL());
      return this.imagePreview.error(function() {
        return console.log("Error: Failed to Load Image.");
      });
    };

    InsertImageClipboardView.prototype.insertImageTag = function(imgSource) {
      var img, text;
      img = {
        rawSrc: imgSource,
        src: this.generateImageSrc(imgSource),
        relativeFileSrc: this.generateRelativeImageSrc(imgSource, this.currentFileDir()),
        relativeSiteSrc: this.generateRelativeImageSrc(imgSource, this.siteLocalDir()),
        alt: this.titleEditor.getText(),
        width: this.widthEditor.getText(),
        height: this.heightEditor.getText(),
        align: this.alignEditor.getText()
      };
      if (img.src) {
        text = templateHelper.create("imageTag", this.frontMatter, this.dateTime, img);
      } else {
        text = img.alt;
      }
      return this.editor.insertText(text);
    };

    InsertImageClipboardView.prototype.siteLocalDir = function() {
      var ref1;
      return utils.getSitePath(config.get("siteLocalDir"), (ref1 = this.editor) != null ? ref1.getPath() : void 0);
    };

    InsertImageClipboardView.prototype.siteImagesDir = function() {
      return templateHelper.create("siteImagesDir", this.frontMatter, this.dateTime);
    };

    InsertImageClipboardView.prototype.currentFileDir = function() {
      return path.dirname(this.editor.getPath() || "");
    };

    InsertImageClipboardView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(this.siteLocalDir());
    };

    InsertImageClipboardView.prototype.getCopiedImageDestPath = function(title) {
      var extension, filename;
      extension = ".png";
      if (!title) {
        title = (new Date()).toISOString().replace(/[:\.]/g, "-");
      }
      title = utils.slugize(title, config.get('slugSeparator'));
      filename = "" + title + extension;
      return path.join(this.siteLocalDir(), this.siteImagesDir(), filename);
    };

    InsertImageClipboardView.prototype.generateImageSrc = function(file) {
      return utils.normalizeFilePath(this._generateImageSrc(file));
    };

    InsertImageClipboardView.prototype._generateImageSrc = function(file) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      if (config.get('relativeImagePath')) {
        return path.relative(this.currentFileDir(), file);
      }
      if (this.isInSiteDir(file)) {
        return path.relative(this.siteLocalDir(), file);
      }
      return path.join("/", this.siteImagesDir(), path.basename(file));
    };

    InsertImageClipboardView.prototype.generateRelativeImageSrc = function(file, basePath) {
      return utils.normalizeFilePath(this._generateRelativeImageSrc(file, basePath));
    };

    InsertImageClipboardView.prototype._generateRelativeImageSrc = function(file, basePath) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      return path.relative(basePath || "~", file);
    };

    return InsertImageClipboardView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtaW1hZ2UtY2xpcGJvYXJkLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrSEFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxlQUFKLEVBQVU7O0VBQ1YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVI7O0VBRVosTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztFQUNULEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUjs7RUFDUixjQUFBLEdBQWlCLE9BQUEsQ0FBUSw0QkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztJQUNKLHdCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtPQUFMLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNwRCxLQUFDLENBQUEsS0FBRCxDQUFPLDZCQUFQLEVBQXNDO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDtXQUF0QztVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtZQUNILEtBQUMsQ0FBQSxLQUFELENBQU8sYUFBUCxFQUFzQjtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDthQUF0QjtZQUNBLEtBQUMsQ0FBQSxPQUFELENBQVMsYUFBVCxFQUF3QixJQUFJLGNBQUosQ0FBbUI7Y0FBQSxJQUFBLEVBQU0sSUFBTjthQUFuQixDQUF4QjtZQUNBLEtBQUMsQ0FBQSxH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Q0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBZixFQUFpQyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FBakM7SUFMVTs7dUNBUW5CLHdCQUFBLEdBQTBCLFNBQUMsSUFBRCxFQUFPLFFBQVA7YUFDeEIsS0FBSyxDQUFDLGlCQUFOLENBQXdCLElBQUMsQ0FBQSx5QkFBRCxDQUEyQixJQUEzQixFQUFpQyxRQUFqQyxDQUF4QjtJQUR3Qjs7dUNBRzFCLHlCQUFBLEdBQTJCLFNBQUMsSUFBRCxFQUFPLFFBQVA7TUFDekIsSUFBQSxDQUFpQixJQUFqQjtBQUFBLGVBQU8sR0FBUDs7TUFDQSxJQUFlLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFmO0FBQUEsZUFBTyxLQUFQOztBQUNBLGFBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFBLElBQVksR0FBMUIsRUFBK0IsSUFBL0I7SUFIa0I7Ozs7S0F2S1U7QUFYdkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5jbGlwYm9hcmQgPSByZXF1aXJlICdjbGlwYm9hcmQnXG5cbmNvbmZpZyA9IHJlcXVpcmUgXCIuLi9jb25maWdcIlxudXRpbHMgPSByZXF1aXJlIFwiLi4vdXRpbHNcIlxudGVtcGxhdGVIZWxwZXIgPSByZXF1aXJlIFwiLi4vaGVscGVycy90ZW1wbGF0ZS1oZWxwZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBJbnNlcnRJbWFnZUNsaXBib2FyZFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1kaWFsb2dcIiwgPT5cbiAgICAgIEBsYWJlbCBcIkluc2VydCBJbWFnZSBmcm9tIENsaXBib2FyZFwiLCBjbGFzczogXCJpY29uIGljb24tY2xpcHB5XCJcbiAgICAgIEBkaXYgPT5cbiAgICAgICAgQGxhYmVsIFwiVGl0bGUgKGFsdClcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidGl0bGVFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJXaWR0aCAocHgpXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICAgIEBzdWJ2aWV3IFwid2lkdGhFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJIZWlnaHQgKHB4KVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImhlaWdodEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGRpdiBjbGFzczogXCJjb2wtMlwiLCA9PlxuICAgICAgICAgIEBsYWJlbCBcIkFsaWdubWVudFwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImFsaWduRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBjbGFzczogXCJkaWFsb2ctcm93XCIsID0+XG4gICAgICAgIEBzcGFuIFwiU2F2ZSBJbWFnZSBUbzogTWlzc2luZyBUaXRsZSAoYWx0KVwiLCBvdXRsZXQ6IFwiY29weUltYWdlTWVzc2FnZVwiXG4gICAgICBAZGl2IGNsYXNzOiBcImltYWdlLWNvbnRhaW5lclwiLCA9PlxuICAgICAgICBAaW1nIG91dGxldDogJ2ltYWdlUHJldmlldydcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHV0aWxzLnNldFRhYkluZGV4KFtAdGl0bGVFZGl0b3IsIEB3aWR0aEVkaXRvciwgQGhlaWdodEVkaXRvciwgQGFsaWduRWRpdG9yXSlcblxuICAgIEB0aXRsZUVkaXRvci5vbiBcImtleXVwXCIsID0+IEB1cGRhdGVDb3B5SW1hZ2VEZXN0KClcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgQGVsZW1lbnQsIHtcbiAgICAgICAgXCJjb3JlOmNvbmZpcm1cIjogPT4gQG9uQ29uZmlybSgpLFxuICAgICAgICBcImNvcmU6Y2FuY2VsXCI6ICA9PiBAZGV0YWNoKClcbiAgICAgIH0pKVxuXG4gIG9uQ29uZmlybTogLT5cbiAgICB0aXRsZSA9IEB0aXRsZUVkaXRvci5nZXRUZXh0KCkudHJpbSgpXG4gICAgcmV0dXJuIHVubGVzcyB0aXRsZVxuXG4gICAgdHJ5XG4gICAgICBkZXN0RmlsZSA9IEBnZXRDb3BpZWRJbWFnZURlc3RQYXRoKHRpdGxlKVxuXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKGRlc3RGaWxlKVxuICAgICAgICBjb25maXJtYXRpb24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICBtZXNzYWdlOiBcIkZpbGUgYWxyZWFkeSBleGlzdHMhXCJcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiQW5vdGhlciBmaWxlIGFscmVhZHkgZXhpc3RzIGF0OlxcbiN7ZGVzdEZpbGV9XFxuRG8geW91IHdhbnQgdG8gb3ZlcndyaXRlIGl0P1wiXG4gICAgICAgICAgYnV0dG9uczogW1wiTm9cIiwgXCJZZXNcIl1cbiAgICAgICAgIyBhYm9ydCBvdmVyd3JpdGUgYW5kIGVkaXQgdGl0bGVcbiAgICAgICAgaWYgY29uZmlybWF0aW9uID09IDBcbiAgICAgICAgICBAdGl0bGVFZGl0b3IuZm9jdXMoKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICBpZiBAY2xpcGJvYXJkSW1hZ2UudG9QTkdcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhkZXN0RmlsZSwgQGNsaXBib2FyZEltYWdlLnRvUE5HKCkpXG4gICAgICBlbHNlICMgdGhpcyBpcyBmYWxsYmFja1xuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGRlc3RGaWxlLCBAY2xpcGJvYXJkSW1hZ2UudG9QbmcoKSlcbiAgICAgICMgd3JpdGUgZGVzdCBwYXRoIHRvIGNsaXBib2FyZFxuICAgICAgY2xpcGJvYXJkLndyaXRlVGV4dChkZXN0RmlsZSlcblxuICAgICAgQGVkaXRvci50cmFuc2FjdCA9PiBAaW5zZXJ0SW1hZ2VUYWcoZGVzdEZpbGUpXG4gICAgICBAZGV0YWNoKClcbiAgICBjYXRjaCBlcnJvclxuICAgICAgYXRvbS5jb25maXJtXG4gICAgICAgIG1lc3NhZ2U6IFwiW01hcmtkb3duIFdyaXRlcl0gRXJyb3IhXCJcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiBcIlNhdmluZyBJbWFnZTpcXG4je2Vycm9yLm1lc3NhZ2V9XCJcbiAgICAgICAgYnV0dG9uczogWydPSyddXG5cbiAgZGlzcGxheTogKGUpIC0+XG4gICAgIyByZWFkIGltYWdlIGZyb20gY2xpcGJvYXJkXG4gICAgQGNsaXBib2FyZEltYWdlID0gY2xpcGJvYXJkLnJlYWRJbWFnZSgpXG4gICAgIyBza2lwIGFuZCByZXR1cm5cbiAgICBpZiBAY2xpcGJvYXJkSW1hZ2UuaXNFbXB0eSgpXG4gICAgICBlLmFib3J0S2V5QmluZGluZygpXG4gICAgICByZXR1cm5cbiAgICAjIGRpc3BsYXkgdmlld1xuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBmcm9udE1hdHRlciA9IHRlbXBsYXRlSGVscGVyLmdldEVkaXRvcihAZWRpdG9yKVxuICAgIEBkYXRlVGltZSA9IHRlbXBsYXRlSGVscGVyLmdldERhdGVUaW1lKClcbiAgICAjIGluaXRpYWxpemUgdmlld1xuICAgIEBzZXRJbWFnZUNvbnRleHQoKVxuICAgIEBkaXNwbGF5SW1hZ2VQcmV2aWV3KClcbiAgICAjIHNob3cgdmlld1xuICAgIEBwYW5lbC5zaG93KClcbiAgICBAdGl0bGVFZGl0b3IuZm9jdXMoKVxuXG4gIGRldGFjaDogLT5cbiAgICBpZiBAcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgIEBwYW5lbC5oaWRlKClcbiAgICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQ/LmZvY3VzKClcblxuICAgIHN1cGVyKClcblxuICBkZXRhY2hlZDogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBkaXNwb3NhYmxlcyA9IG51bGxcblxuICBzZXRJbWFnZUNvbnRleHQ6IC0+XG4gICAgeyB3aWR0aCwgaGVpZ2h0IH0gPSBAY2xpcGJvYXJkSW1hZ2UuZ2V0U2l6ZSgpXG4gICAgQHdpZHRoRWRpdG9yLnNldFRleHQoXCJcIiArIHdpZHRoKVxuICAgIEBoZWlnaHRFZGl0b3Iuc2V0VGV4dChcIlwiICsgaGVpZ2h0KVxuXG4gICAgcG9zaXRpb24gPSBpZiB3aWR0aCA+IDMwMCB0aGVuIFwiY2VudGVyXCIgZWxzZSBcInJpZ2h0XCJcbiAgICBAYWxpZ25FZGl0b3Iuc2V0VGV4dChwb3NpdGlvbilcblxuICB1cGRhdGVDb3B5SW1hZ2VEZXN0OiAtPlxuICAgIHRpdGxlID0gQHRpdGxlRWRpdG9yLmdldFRleHQoKS50cmltKClcbiAgICBpZiB0aXRsZVxuICAgICAgZGVzdEZpbGUgPSBAZ2V0Q29waWVkSW1hZ2VEZXN0UGF0aCh0aXRsZSlcbiAgICAgIEBjb3B5SW1hZ2VNZXNzYWdlLnRleHQoXCJTYXZlIEltYWdlIFRvOiAje2Rlc3RGaWxlfVwiKVxuICAgIGVsc2VcbiAgICAgIEBjb3B5SW1hZ2VNZXNzYWdlLnRleHQoXCJTYXZlIEltYWdlIFRvOiBNaXNzaW5nIFRpdGxlIChhbHQpXCIpXG5cbiAgZGlzcGxheUltYWdlUHJldmlldzogLT5cbiAgICBAaW1hZ2VQcmV2aWV3LmF0dHIoXCJzcmNcIiwgQGNsaXBib2FyZEltYWdlLnRvRGF0YVVSTCgpKVxuICAgIEBpbWFnZVByZXZpZXcuZXJyb3IgLT4gY29uc29sZS5sb2coXCJFcnJvcjogRmFpbGVkIHRvIExvYWQgSW1hZ2UuXCIpXG5cbiAgaW5zZXJ0SW1hZ2VUYWc6IChpbWdTb3VyY2UpIC0+XG4gICAgaW1nID1cbiAgICAgIHJhd1NyYzogaW1nU291cmNlLFxuICAgICAgc3JjOiBAZ2VuZXJhdGVJbWFnZVNyYyhpbWdTb3VyY2UpXG4gICAgICByZWxhdGl2ZUZpbGVTcmM6IEBnZW5lcmF0ZVJlbGF0aXZlSW1hZ2VTcmMoaW1nU291cmNlLCBAY3VycmVudEZpbGVEaXIoKSlcbiAgICAgIHJlbGF0aXZlU2l0ZVNyYzogQGdlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYyhpbWdTb3VyY2UsIEBzaXRlTG9jYWxEaXIoKSlcbiAgICAgIGFsdDogQHRpdGxlRWRpdG9yLmdldFRleHQoKVxuICAgICAgd2lkdGg6IEB3aWR0aEVkaXRvci5nZXRUZXh0KClcbiAgICAgIGhlaWdodDogQGhlaWdodEVkaXRvci5nZXRUZXh0KClcbiAgICAgIGFsaWduOiBAYWxpZ25FZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICAjIGluc2VydCBpbWFnZSB0YWcgd2hlbiBpbWcuc3JjIGV4aXN0cywgb3RoZXJ3aXNlIGNvbnNpZGVyIHRoZSBpbWFnZSB3YXMgcmVtb3ZlZFxuICAgIGlmIGltZy5zcmNcbiAgICAgIHRleHQgPSB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJpbWFnZVRhZ1wiLCBAZnJvbnRNYXR0ZXIsIEBkYXRlVGltZSwgaW1nKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBpbWcuYWx0XG5cbiAgICBAZWRpdG9yLmluc2VydFRleHQodGV4dClcblxuICAjIGdldCB1c2VyJ3Mgc2l0ZSBsb2NhbCBkaXJlY3RvcnlcbiAgc2l0ZUxvY2FsRGlyOiAtPiB1dGlscy5nZXRTaXRlUGF0aChjb25maWcuZ2V0KFwic2l0ZUxvY2FsRGlyXCIpLCBAZWRpdG9yPy5nZXRQYXRoKCkpXG4gICMgZ2V0IHVzZXIncyBzaXRlIGltYWdlcyBkaXJlY3RvcnlcbiAgc2l0ZUltYWdlc0RpcjogLT4gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwic2l0ZUltYWdlc0RpclwiLCBAZnJvbnRNYXR0ZXIsIEBkYXRlVGltZSlcbiAgIyBnZXQgY3VycmVudCBvcGVuIGZpbGUgZGlyZWN0b3J5XG4gIGN1cnJlbnRGaWxlRGlyOiAtPiBwYXRoLmRpcm5hbWUoQGVkaXRvci5nZXRQYXRoKCkgfHwgXCJcIilcbiAgIyBjaGVjayB0aGUgZmlsZSBpcyBpbiB0aGUgc2l0ZSBkaXJlY3RvcnlcbiAgaXNJblNpdGVEaXI6IChmaWxlKSAtPiBmaWxlICYmIGZpbGUuc3RhcnRzV2l0aChAc2l0ZUxvY2FsRGlyKCkpXG5cbiAgIyBnZXQgY29weSBpbWFnZSBkZXN0aW5hdGlvbiBmaWxlIHBhdGhcbiAgZ2V0Q29waWVkSW1hZ2VEZXN0UGF0aDogKHRpdGxlKSAtPlxuICAgIGV4dGVuc2lvbiA9IFwiLnBuZ1wiXG4gICAgdGl0bGUgPSAobmV3IERhdGUoKSkudG9JU09TdHJpbmcoKS5yZXBsYWNlKC9bOlxcLl0vZywgXCItXCIpIHVubGVzcyB0aXRsZVxuICAgIHRpdGxlID0gdXRpbHMuc2x1Z2l6ZSh0aXRsZSwgY29uZmlnLmdldCgnc2x1Z1NlcGFyYXRvcicpKVxuICAgIGZpbGVuYW1lID0gXCIje3RpdGxlfSN7ZXh0ZW5zaW9ufVwiXG4gICAgcGF0aC5qb2luKEBzaXRlTG9jYWxEaXIoKSwgQHNpdGVJbWFnZXNEaXIoKSwgZmlsZW5hbWUpXG5cbiAgIyBnZW5lcmF0ZSBhIHNyYyB0aGF0IGlzIHVzZWQgaW4gbWFya2Rvd24gZmlsZSBiYXNlZCBvbiB1c2VyIGNvbmZpZ3VyYXRpb24gb3IgZmlsZSBsb2NhdGlvblxuICBnZW5lcmF0ZUltYWdlU3JjOiAoZmlsZSkgLT5cbiAgICB1dGlscy5ub3JtYWxpemVGaWxlUGF0aChAX2dlbmVyYXRlSW1hZ2VTcmMoZmlsZSkpXG5cbiAgX2dlbmVyYXRlSW1hZ2VTcmM6IChmaWxlKSAtPlxuICAgIHJldHVybiBcIlwiIHVubGVzcyBmaWxlXG4gICAgcmV0dXJuIGZpbGUgaWYgdXRpbHMuaXNVcmwoZmlsZSlcbiAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShAY3VycmVudEZpbGVEaXIoKSwgZmlsZSkgaWYgY29uZmlnLmdldCgncmVsYXRpdmVJbWFnZVBhdGgnKVxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKEBzaXRlTG9jYWxEaXIoKSwgZmlsZSkgaWYgQGlzSW5TaXRlRGlyKGZpbGUpXG4gICAgcmV0dXJuIHBhdGguam9pbihcIi9cIiwgQHNpdGVJbWFnZXNEaXIoKSwgcGF0aC5iYXNlbmFtZShmaWxlKSlcblxuICAjIGdlbmVyYXRlIGEgcmVsYXRpdmUgc3JjIGZyb20gdGhlIGJhc2UgcGF0aCBvciBmcm9tIHVzZXIncyBob21lIGRpcmVjdG9yeVxuICBnZW5lcmF0ZVJlbGF0aXZlSW1hZ2VTcmM6IChmaWxlLCBiYXNlUGF0aCkgLT5cbiAgICB1dGlscy5ub3JtYWxpemVGaWxlUGF0aChAX2dlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYyhmaWxlLCBiYXNlUGF0aCkpXG5cbiAgX2dlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYzogKGZpbGUsIGJhc2VQYXRoKSAtPlxuICAgIHJldHVybiBcIlwiIHVubGVzcyBmaWxlXG4gICAgcmV0dXJuIGZpbGUgaWYgdXRpbHMuaXNVcmwoZmlsZSlcbiAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShiYXNlUGF0aCB8fCBcIn5cIiwgZmlsZSlcbiJdfQ==
