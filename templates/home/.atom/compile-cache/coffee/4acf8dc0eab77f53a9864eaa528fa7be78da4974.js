(function() {
  var $, CompositeDisposable, InsertImageFileView, TextEditorView, View, config, dialog, fs, lastInsertImageDir, path, ref, remote, templateHelper, utils,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require("atom-space-pen-views"), $ = ref.$, View = ref.View, TextEditorView = ref.TextEditorView;

  path = require("path");

  fs = require("fs-plus");

  remote = require("remote");

  dialog = remote.dialog || remote.require("dialog");

  config = require("../config");

  utils = require("../utils");

  templateHelper = require("../helpers/template-helper");

  lastInsertImageDir = null;

  module.exports = InsertImageFileView = (function(superClass) {
    extend(InsertImageFileView, superClass);

    function InsertImageFileView() {
      return InsertImageFileView.__super__.constructor.apply(this, arguments);
    }

    InsertImageFileView.content = function() {
      return this.div({
        "class": "markdown-writer markdown-writer-dialog"
      }, (function(_this) {
        return function() {
          _this.label("Insert Image", {
            "class": "icon icon-device-camera"
          });
          _this.div(function() {
            _this.label("Image Path (src)", {
              "class": "message"
            });
            _this.subview("imageEditor", new TextEditorView({
              mini: true
            }));
            _this.div({
              "class": "dialog-row"
            }, function() {
              _this.button("Choose Local Image", {
                outlet: "openImageButton",
                "class": "btn"
              });
              return _this.label({
                outlet: "message",
                "class": "side-label"
              });
            });
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
            outlet: "copyImagePanel",
            "class": "hidden dialog-row"
          }, function() {
            return _this.label({
              "for": "markdown-writer-copy-image-checkbox"
            }, function() {
              _this.input({
                id: "markdown-writer-copy-image-checkbox"
              }, {
                type: "checkbox",
                outlet: "copyImageCheckbox"
              });
              return _this.span("Copy Image To: Missing Image Path (src) or Title (alt)", {
                "class": "side-label",
                outlet: "copyImageMessage"
              });
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

    InsertImageFileView.prototype.initialize = function() {
      utils.setTabIndex([this.imageEditor, this.openImageButton, this.titleEditor, this.widthEditor, this.heightEditor, this.alignEditor, this.copyImageCheckbox]);
      this.imageEditor.on("blur", (function(_this) {
        return function() {
          var file;
          file = _this.imageEditor.getText().trim();
          _this.updateImageSource(file);
          return _this.updateCopyImageDest(file);
        };
      })(this));
      this.titleEditor.on("blur", (function(_this) {
        return function() {
          return _this.updateCopyImageDest(_this.imageEditor.getText().trim());
        };
      })(this));
      this.openImageButton.on("click", (function(_this) {
        return function() {
          return _this.openImageDialog();
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

    InsertImageFileView.prototype.onConfirm = function() {
      var callback, imgSource;
      imgSource = this.imageEditor.getText().trim();
      if (!imgSource) {
        return;
      }
      callback = (function(_this) {
        return function() {
          _this.editor.transact(function() {
            return _this.insertImageTag();
          });
          return _this.detach();
        };
      })(this);
      if (!this.copyImageCheckbox.hasClass('hidden') && this.copyImageCheckbox.prop("checked")) {
        return this.copyImage(this.resolveImagePath(imgSource), callback);
      } else {
        return callback();
      }
    };

    InsertImageFileView.prototype.display = function() {
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
      this.setFieldsFromSelection();
      this.panel.show();
      return this.imageEditor.focus();
    };

    InsertImageFileView.prototype.detach = function() {
      var ref1;
      if (this.panel.isVisible()) {
        this.panel.hide();
        if ((ref1 = this.previouslyFocusedElement) != null) {
          ref1.focus();
        }
      }
      return InsertImageFileView.__super__.detach.apply(this, arguments);
    };

    InsertImageFileView.prototype.detached = function() {
      var ref1;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return this.disposables = null;
    };

    InsertImageFileView.prototype.setFieldsFromSelection = function() {
      var img, selection;
      this.range = utils.getTextBufferRange(this.editor, "link");
      selection = this.editor.getTextInRange(this.range);
      if (!selection) {
        return;
      }
      if (utils.isImage(selection)) {
        img = utils.parseImage(selection);
      } else if (utils.isImageTag(selection)) {
        img = utils.parseImageTag(selection);
      } else {
        img = {
          alt: selection
        };
      }
      this.titleEditor.setText(img.alt || "");
      this.widthEditor.setText(img.width || "");
      this.heightEditor.setText(img.height || "");
      this.imageEditor.setText(img.src || "");
      return this.updateImageSource(img.src);
    };

    InsertImageFileView.prototype.openImageDialog = function() {
      var files;
      files = dialog.showOpenDialog({
        properties: ['openFile'],
        defaultPath: lastInsertImageDir || this.siteLocalDir()
      });
      if (!(files && files.length > 0)) {
        return;
      }
      this.imageEditor.setText(files[0]);
      this.updateImageSource(files[0]);
      if (!utils.isUrl(files[0])) {
        lastInsertImageDir = path.dirname(files[0]);
      }
      return this.titleEditor.focus();
    };

    InsertImageFileView.prototype.updateImageSource = function(file) {
      if (!file) {
        return;
      }
      this.displayImagePreview(file);
      if (utils.isUrl(file) || this.isInSiteDir(this.resolveImagePath(file))) {
        return this.copyImagePanel.addClass("hidden");
      } else {
        return this.copyImagePanel.removeClass("hidden");
      }
    };

    InsertImageFileView.prototype.updateCopyImageDest = function(file) {
      var destFile;
      if (!file) {
        return;
      }
      destFile = this.getCopiedImageDestPath(file, this.titleEditor.getText());
      return this.copyImageMessage.text("Copy Image To: " + destFile);
    };

    InsertImageFileView.prototype.displayImagePreview = function(file) {
      if (this.imageOnPreview === file) {
        return;
      }
      if (utils.isImageFile(file)) {
        this.message.text("Opening Image Preview ...");
        this.imagePreview.attr("src", this.resolveImagePath(file));
        this.imagePreview.load((function(_this) {
          return function() {
            _this.message.text("");
            return _this.setImageContext();
          };
        })(this));
        this.imagePreview.error((function(_this) {
          return function() {
            _this.message.text("Error: Failed to Load Image.");
            return _this.imagePreview.attr("src", "");
          };
        })(this));
      } else {
        if (file) {
          this.message.text("Error: Invalid Image File.");
        }
        this.imagePreview.attr("src", "");
        this.widthEditor.setText("");
        this.heightEditor.setText("");
        this.alignEditor.setText("");
      }
      return this.imageOnPreview = file;
    };

    InsertImageFileView.prototype.setImageContext = function() {
      var naturalHeight, naturalWidth, position, ref1;
      ref1 = this.imagePreview.context, naturalWidth = ref1.naturalWidth, naturalHeight = ref1.naturalHeight;
      this.widthEditor.setText("" + naturalWidth);
      this.heightEditor.setText("" + naturalHeight);
      position = naturalWidth > 300 ? "center" : "right";
      return this.alignEditor.setText(position);
    };

    InsertImageFileView.prototype.insertImageTag = function() {
      var img, imgSource, text;
      imgSource = this.imageEditor.getText().trim();
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
      return this.editor.setTextInBufferRange(this.range, text);
    };

    InsertImageFileView.prototype.copyImage = function(file, callback) {
      var confirmation, destFile, error, performWrite;
      if (utils.isUrl(file) || !fs.existsSync(file)) {
        return callback();
      }
      try {
        destFile = this.getCopiedImageDestPath(file, this.titleEditor.getText());
        performWrite = true;
        if (fs.existsSync(destFile)) {
          confirmation = atom.confirm({
            message: "File already exists!",
            detailedMessage: "Another file already exists at:\n" + destFile + "\nDo you want to overwrite it?",
            buttons: ["No", "Yes"]
          });
          performWrite = confirmation === 1;
        }
        if (performWrite) {
          return fs.copy(file, destFile, (function(_this) {
            return function() {
              _this.imageEditor.setText(destFile);
              return callback();
            };
          })(this));
        }
      } catch (error1) {
        error = error1;
        return atom.confirm({
          message: "[Markdown Writer] Error!",
          detailedMessage: "Copying Image:\n" + error.message,
          buttons: ['OK']
        });
      }
    };

    InsertImageFileView.prototype.siteLocalDir = function() {
      return utils.getSitePath(config.get("siteLocalDir"), this.editor.getPath());
    };

    InsertImageFileView.prototype.siteImagesDir = function() {
      return templateHelper.create("siteImagesDir", this.frontMatter, this.dateTime);
    };

    InsertImageFileView.prototype.currentFileDir = function() {
      return path.dirname(this.editor.getPath() || "");
    };

    InsertImageFileView.prototype.isInSiteDir = function(file) {
      return file && file.startsWith(this.siteLocalDir());
    };

    InsertImageFileView.prototype.getCopiedImageDestPath = function(file, title) {
      var extension, filename;
      filename = path.basename(file);
      if (config.get("renameImageOnCopy") && title) {
        extension = path.extname(file);
        title = utils.slugize(title, config.get('slugSeparator'));
        filename = "" + title + extension;
      }
      return path.join(this.siteLocalDir(), this.siteImagesDir(), filename);
    };

    InsertImageFileView.prototype.resolveImagePath = function(file) {
      var absolutePath, relativePath;
      if (!file) {
        return "";
      }
      if (utils.isUrl(file) || fs.existsSync(file)) {
        return file;
      }
      absolutePath = path.join(this.siteLocalDir(), file);
      if (fs.existsSync(absolutePath)) {
        return absolutePath;
      }
      relativePath = path.join(this.currentFileDir(), file);
      if (fs.existsSync(relativePath)) {
        return relativePath;
      }
      return file;
    };

    InsertImageFileView.prototype.generateImageSrc = function(file) {
      return utils.normalizeFilePath(this._generateImageSrc(file));
    };

    InsertImageFileView.prototype._generateImageSrc = function(file) {
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

    InsertImageFileView.prototype.generateRelativeImageSrc = function(file, basePath) {
      return utils.normalizeFilePath(this._generateRelativeImageSrc(file, basePath));
    };

    InsertImageFileView.prototype._generateRelativeImageSrc = function(file, basePath) {
      if (!file) {
        return "";
      }
      if (utils.isUrl(file)) {
        return file;
      }
      return path.relative(basePath || "~", file);
    };

    return InsertImageFileView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL2xpYi92aWV3cy9pbnNlcnQtaW1hZ2UtZmlsZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsbUpBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksZUFBSixFQUFVOztFQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSOztFQUNULE1BQUEsR0FBUyxNQUFNLENBQUMsTUFBUCxJQUFpQixNQUFNLENBQUMsT0FBUCxDQUFlLFFBQWY7O0VBRTFCLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7RUFDVCxLQUFBLEdBQVEsT0FBQSxDQUFRLFVBQVI7O0VBQ1IsY0FBQSxHQUFpQixPQUFBLENBQVEsNEJBQVI7O0VBRWpCLGtCQUFBLEdBQXFCOztFQUVyQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O0lBQ0osbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdDQUFQO09BQUwsRUFBc0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3BELEtBQUMsQ0FBQSxLQUFELENBQU8sY0FBUCxFQUF1QjtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8seUJBQVA7V0FBdkI7VUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7WUFDSCxLQUFDLENBQUEsS0FBRCxDQUFPLGtCQUFQLEVBQTJCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQTNCO1lBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLElBQUksY0FBSixDQUFtQjtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQW5CLENBQXhCO1lBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDthQUFMLEVBQTBCLFNBQUE7Y0FDeEIsS0FBQyxDQUFBLE1BQUQsQ0FBUSxvQkFBUixFQUE4QjtnQkFBQSxNQUFBLEVBQVEsaUJBQVI7Z0JBQTJCLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBbEM7ZUFBOUI7cUJBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTztnQkFBQSxNQUFBLEVBQVEsU0FBUjtnQkFBbUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUExQjtlQUFQO1lBRndCLENBQTFCO1lBR0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO2FBQXRCO1lBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLElBQUksY0FBSixDQUFtQjtjQUFBLElBQUEsRUFBTSxJQUFOO2FBQW5CLENBQXhCO1lBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUE7Y0FDbkIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxZQUFQLEVBQXFCO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDtlQUFyQjtxQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGFBQVQsRUFBd0IsSUFBSSxjQUFKLENBQW1CO2dCQUFBLElBQUEsRUFBTSxJQUFOO2VBQW5CLENBQXhCO1lBRm1CLENBQXJCO1lBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBUDthQUFMLEVBQXFCLFNBQUE7Y0FDbkIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDtlQUF0QjtxQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLGNBQVQsRUFBeUIsSUFBSSxjQUFKLENBQW1CO2dCQUFBLElBQUEsRUFBTSxJQUFOO2VBQW5CLENBQXpCO1lBRm1CLENBQXJCO21CQUdBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7YUFBTCxFQUFxQixTQUFBO2NBQ25CLEtBQUMsQ0FBQSxLQUFELENBQU8sV0FBUCxFQUFvQjtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7ZUFBcEI7cUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLElBQUksY0FBSixDQUFtQjtnQkFBQSxJQUFBLEVBQU0sSUFBTjtlQUFuQixDQUF4QjtZQUZtQixDQUFyQjtVQWRHLENBQUw7VUFpQkEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLE1BQUEsRUFBUSxnQkFBUjtZQUEwQixDQUFBLEtBQUEsQ0FBQSxFQUFPLG1CQUFqQztXQUFMLEVBQTJELFNBQUE7bUJBQ3pELEtBQUMsQ0FBQSxLQUFELENBQU87Y0FBQSxDQUFBLEdBQUEsQ0FBQSxFQUFLLHFDQUFMO2FBQVAsRUFBbUQsU0FBQTtjQUNqRCxLQUFDLENBQUEsS0FBRCxDQUFPO2dCQUFBLEVBQUEsRUFBSSxxQ0FBSjtlQUFQLEVBQ0U7Z0JBQUEsSUFBQSxFQUFLLFVBQUw7Z0JBQWlCLE1BQUEsRUFBUSxtQkFBekI7ZUFERjtxQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNLHdEQUFOLEVBQWdFO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtnQkFBcUIsTUFBQSxFQUFRLGtCQUE3QjtlQUFoRTtZQUhpRCxDQUFuRDtVQUR5RCxDQUEzRDtpQkFLQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxpQkFBUDtXQUFMLEVBQStCLFNBQUE7bUJBQzdCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxNQUFBLEVBQVEsY0FBUjthQUFMO1VBRDZCLENBQS9CO1FBeEJvRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQ7SUFEUTs7a0NBNEJWLFVBQUEsR0FBWSxTQUFBO01BQ1YsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsQ0FBQyxJQUFDLENBQUEsV0FBRixFQUFlLElBQUMsQ0FBQSxlQUFoQixFQUFpQyxJQUFDLENBQUEsV0FBbEMsRUFDaEIsSUFBQyxDQUFBLFdBRGUsRUFDRixJQUFDLENBQUEsWUFEQyxFQUNhLElBQUMsQ0FBQSxXQURkLEVBQzJCLElBQUMsQ0FBQSxpQkFENUIsQ0FBbEI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ3RCLGNBQUE7VUFBQSxJQUFBLEdBQU8sS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBO1VBQ1AsS0FBQyxDQUFBLGlCQUFELENBQW1CLElBQW5CO2lCQUNBLEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFyQjtRQUhzQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7TUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN0QixLQUFDLENBQUEsbUJBQUQsQ0FBcUIsS0FBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBLENBQXJCO1FBRHNCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QjtNQUVBLElBQUMsQ0FBQSxlQUFlLENBQUMsRUFBakIsQ0FBb0IsT0FBcEIsRUFBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxlQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7TUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksbUJBQUosQ0FBQTthQUNmLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FDZixJQUFDLENBQUEsT0FEYyxFQUNMO1FBQ1IsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxTQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUjtRQUVSLGFBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRlI7T0FESyxDQUFqQjtJQWJVOztrQ0FtQlosU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQXNCLENBQUMsSUFBdkIsQ0FBQTtNQUNaLElBQUEsQ0FBYyxTQUFkO0FBQUEsZUFBQTs7TUFFQSxRQUFBLEdBQVcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ1QsS0FBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQTtVQUFILENBQWpCO2lCQUNBLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFGUztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7TUFJWCxJQUFHLENBQUMsSUFBQyxDQUFBLGlCQUFpQixDQUFDLFFBQW5CLENBQTRCLFFBQTVCLENBQUQsSUFBMEMsSUFBQyxDQUFBLGlCQUFpQixDQUFDLElBQW5CLENBQXdCLFNBQXhCLENBQTdDO2VBQ0UsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsU0FBbEIsQ0FBWCxFQUF5QyxRQUF6QyxFQURGO09BQUEsTUFBQTtlQUdFLFFBQUEsQ0FBQSxFQUhGOztJQVJTOztrQ0FhWCxPQUFBLEdBQVMsU0FBQTs7UUFDUCxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtVQUFZLE9BQUEsRUFBUyxLQUFyQjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsd0JBQUQsR0FBNEIsQ0FBQSxDQUFFLFFBQVEsQ0FBQyxhQUFYO01BQzVCLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1YsSUFBQyxDQUFBLFdBQUQsR0FBZSxjQUFjLENBQUMsU0FBZixDQUF5QixJQUFDLENBQUEsTUFBMUI7TUFDZixJQUFDLENBQUEsUUFBRCxHQUFZLGNBQWMsQ0FBQyxXQUFmLENBQUE7TUFDWixJQUFDLENBQUEsc0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7SUFSTzs7a0NBVVQsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsQ0FBQSxDQUFIO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7O2NBQ3lCLENBQUUsS0FBM0IsQ0FBQTtTQUZGOzthQUdBLGlEQUFBLFNBQUE7SUFKTTs7a0NBTVIsUUFBQSxHQUFVLFNBQUE7QUFDUixVQUFBOztZQUFZLENBQUUsT0FBZCxDQUFBOzthQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7SUFGUDs7a0NBSVYsc0JBQUEsR0FBd0IsU0FBQTtBQUN0QixVQUFBO01BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsSUFBQyxDQUFBLE1BQTFCLEVBQWtDLE1BQWxDO01BQ1QsU0FBQSxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixDQUF1QixJQUFDLENBQUEsS0FBeEI7TUFDWixJQUFBLENBQWMsU0FBZDtBQUFBLGVBQUE7O01BRUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLFNBQWQsQ0FBSDtRQUNFLEdBQUEsR0FBTSxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFqQixFQURSO09BQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxVQUFOLENBQWlCLFNBQWpCLENBQUg7UUFDSCxHQUFBLEdBQU0sS0FBSyxDQUFDLGFBQU4sQ0FBb0IsU0FBcEIsRUFESDtPQUFBLE1BQUE7UUFHSCxHQUFBLEdBQU07VUFBRSxHQUFBLEVBQUssU0FBUDtVQUhIOztNQUtMLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixHQUFHLENBQUMsR0FBSixJQUFXLEVBQWhDO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQXFCLEdBQUcsQ0FBQyxLQUFKLElBQWEsRUFBbEM7TUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsR0FBRyxDQUFDLE1BQUosSUFBYyxFQUFwQztNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixHQUFHLENBQUMsR0FBSixJQUFXLEVBQWhDO2FBRUEsSUFBQyxDQUFBLGlCQUFELENBQW1CLEdBQUcsQ0FBQyxHQUF2QjtJQWpCc0I7O2tDQW1CeEIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsY0FBUCxDQUNOO1FBQUEsVUFBQSxFQUFZLENBQUMsVUFBRCxDQUFaO1FBQ0EsV0FBQSxFQUFhLGtCQUFBLElBQXNCLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FEbkM7T0FETTtNQUdSLElBQUEsQ0FBQSxDQUFjLEtBQUEsSUFBUyxLQUFLLENBQUMsTUFBTixHQUFlLENBQXRDLENBQUE7QUFBQSxlQUFBOztNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixLQUFNLENBQUEsQ0FBQSxDQUEzQjtNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixLQUFNLENBQUEsQ0FBQSxDQUF6QjtNQUVBLElBQUEsQ0FBbUQsS0FBSyxDQUFDLEtBQU4sQ0FBWSxLQUFNLENBQUEsQ0FBQSxDQUFsQixDQUFuRDtRQUFBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBTSxDQUFBLENBQUEsQ0FBbkIsRUFBckI7O2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxLQUFiLENBQUE7SUFWZTs7a0NBWWpCLGlCQUFBLEdBQW1CLFNBQUMsSUFBRDtNQUNqQixJQUFBLENBQWMsSUFBZDtBQUFBLGVBQUE7O01BQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQXJCO01BRUEsSUFBRyxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBQSxJQUFxQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQixDQUFiLENBQXhCO2VBQ0UsSUFBQyxDQUFBLGNBQWMsQ0FBQyxRQUFoQixDQUF5QixRQUF6QixFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxjQUFjLENBQUMsV0FBaEIsQ0FBNEIsUUFBNUIsRUFIRjs7SUFKaUI7O2tDQVNuQixtQkFBQSxHQUFxQixTQUFDLElBQUQ7QUFDbkIsVUFBQTtNQUFBLElBQUEsQ0FBYyxJQUFkO0FBQUEsZUFBQTs7TUFDQSxRQUFBLEdBQVcsSUFBQyxDQUFBLHNCQUFELENBQXdCLElBQXhCLEVBQThCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQTlCO2FBQ1gsSUFBQyxDQUFBLGdCQUFnQixDQUFDLElBQWxCLENBQXVCLGlCQUFBLEdBQWtCLFFBQXpDO0lBSG1COztrQ0FLckIsbUJBQUEsR0FBcUIsU0FBQyxJQUFEO01BQ25CLElBQVUsSUFBQyxDQUFBLGNBQUQsS0FBbUIsSUFBN0I7QUFBQSxlQUFBOztNQUVBLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsSUFBbEIsQ0FBSDtRQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDJCQUFkO1FBQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLEtBQW5CLEVBQTBCLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFsQixDQUExQjtRQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ2pCLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLEVBQWQ7bUJBQ0EsS0FBQyxDQUFBLGVBQUQsQ0FBQTtVQUZpQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkI7UUFHQSxJQUFDLENBQUEsWUFBWSxDQUFDLEtBQWQsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNsQixLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw4QkFBZDttQkFDQSxLQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUIsS0FBbkIsRUFBMEIsRUFBMUI7VUFGa0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCLEVBTkY7T0FBQSxNQUFBO1FBVUUsSUFBK0MsSUFBL0M7VUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw0QkFBZCxFQUFBOztRQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFtQixLQUFuQixFQUEwQixFQUExQjtRQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixFQUFyQjtRQUNBLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFzQixFQUF0QjtRQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixFQUFyQixFQWRGOzthQWdCQSxJQUFDLENBQUEsY0FBRCxHQUFrQjtJQW5CQzs7a0NBcUJyQixlQUFBLEdBQWlCLFNBQUE7QUFDZixVQUFBO01BQUEsT0FBa0MsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFoRCxFQUFFLGdDQUFGLEVBQWdCO01BQ2hCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFxQixFQUFBLEdBQUssWUFBMUI7TUFDQSxJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBc0IsRUFBQSxHQUFLLGFBQTNCO01BRUEsUUFBQSxHQUFjLFlBQUEsR0FBZSxHQUFsQixHQUEyQixRQUEzQixHQUF5QzthQUNwRCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsUUFBckI7SUFOZTs7a0NBUWpCLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7TUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBc0IsQ0FBQyxJQUF2QixDQUFBO01BQ1osR0FBQSxHQUNFO1FBQUEsTUFBQSxFQUFRLFNBQVI7UUFDQSxHQUFBLEVBQUssSUFBQyxDQUFBLGdCQUFELENBQWtCLFNBQWxCLENBREw7UUFFQSxlQUFBLEVBQWlCLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixTQUExQixFQUFxQyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQXJDLENBRmpCO1FBR0EsZUFBQSxFQUFpQixJQUFDLENBQUEsd0JBQUQsQ0FBMEIsU0FBMUIsRUFBcUMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFyQyxDQUhqQjtRQUlBLEdBQUEsRUFBSyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUpMO1FBS0EsS0FBQSxFQUFPLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBTFA7UUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FOUjtRQU9BLEtBQUEsRUFBTyxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQVBQOztNQVVGLElBQUcsR0FBRyxDQUFDLEdBQVA7UUFDRSxJQUFBLEdBQU8sY0FBYyxDQUFDLE1BQWYsQ0FBc0IsVUFBdEIsRUFBa0MsSUFBQyxDQUFBLFdBQW5DLEVBQWdELElBQUMsQ0FBQSxRQUFqRCxFQUEyRCxHQUEzRCxFQURUO09BQUEsTUFBQTtRQUdFLElBQUEsR0FBTyxHQUFHLENBQUMsSUFIYjs7YUFLQSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLElBQUMsQ0FBQSxLQUE5QixFQUFxQyxJQUFyQztJQWxCYzs7a0NBb0JoQixTQUFBLEdBQVcsU0FBQyxJQUFELEVBQU8sUUFBUDtBQUNULFVBQUE7TUFBQSxJQUFxQixLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBQSxJQUFxQixDQUFDLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxDQUEzQztBQUFBLGVBQU8sUUFBQSxDQUFBLEVBQVA7O0FBRUE7UUFDRSxRQUFBLEdBQVcsSUFBQyxDQUFBLHNCQUFELENBQXdCLElBQXhCLEVBQThCLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLENBQTlCO1FBQ1gsWUFBQSxHQUFlO1FBRWYsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFFBQWQsQ0FBSDtVQUNFLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTCxDQUNiO1lBQUEsT0FBQSxFQUFTLHNCQUFUO1lBQ0EsZUFBQSxFQUFpQixtQ0FBQSxHQUFvQyxRQUFwQyxHQUE2QyxnQ0FEOUQ7WUFFQSxPQUFBLEVBQVMsQ0FBQyxJQUFELEVBQU8sS0FBUCxDQUZUO1dBRGE7VUFJZixZQUFBLEdBQWdCLFlBQUEsS0FBZ0IsRUFMbEM7O1FBT0EsSUFBRyxZQUFIO2lCQUNFLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixFQUFjLFFBQWQsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQTtjQUN0QixLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsUUFBckI7cUJBQ0EsUUFBQSxDQUFBO1lBRnNCO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QixFQURGO1NBWEY7T0FBQSxjQUFBO1FBZU07ZUFDSixJQUFJLENBQUMsT0FBTCxDQUNFO1VBQUEsT0FBQSxFQUFTLDBCQUFUO1VBQ0EsZUFBQSxFQUFpQixrQkFBQSxHQUFtQixLQUFLLENBQUMsT0FEMUM7VUFFQSxPQUFBLEVBQVMsQ0FBQyxJQUFELENBRlQ7U0FERixFQWhCRjs7SUFIUzs7a0NBeUJYLFlBQUEsR0FBYyxTQUFBO2FBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsTUFBTSxDQUFDLEdBQVAsQ0FBVyxjQUFYLENBQWxCLEVBQThDLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQTlDO0lBQUg7O2tDQUVkLGFBQUEsR0FBZSxTQUFBO2FBQUcsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsZUFBdEIsRUFBdUMsSUFBQyxDQUFBLFdBQXhDLEVBQXFELElBQUMsQ0FBQSxRQUF0RDtJQUFIOztrQ0FFZixjQUFBLEdBQWdCLFNBQUE7YUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQUEsSUFBcUIsRUFBbEM7SUFBSDs7a0NBRWhCLFdBQUEsR0FBYSxTQUFDLElBQUQ7YUFBVSxJQUFBLElBQVEsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFoQjtJQUFsQjs7a0NBR2Isc0JBQUEsR0FBd0IsU0FBQyxJQUFELEVBQU8sS0FBUDtBQUN0QixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBZDtNQUVYLElBQUcsTUFBTSxDQUFDLEdBQVAsQ0FBVyxtQkFBWCxDQUFBLElBQW1DLEtBQXRDO1FBQ0UsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYjtRQUNaLEtBQUEsR0FBUSxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsRUFBcUIsTUFBTSxDQUFDLEdBQVAsQ0FBVyxlQUFYLENBQXJCO1FBQ1IsUUFBQSxHQUFXLEVBQUEsR0FBRyxLQUFILEdBQVcsVUFIeEI7O2FBS0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsWUFBRCxDQUFBLENBQVYsRUFBMkIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUEzQixFQUE2QyxRQUE3QztJQVJzQjs7a0NBV3hCLGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtBQUNoQixVQUFBO01BQUEsSUFBQSxDQUFpQixJQUFqQjtBQUFBLGVBQU8sR0FBUDs7TUFDQSxJQUFlLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFBLElBQXFCLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxDQUFwQztBQUFBLGVBQU8sS0FBUDs7TUFDQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsWUFBRCxDQUFBLENBQVYsRUFBMkIsSUFBM0I7TUFDZixJQUF1QixFQUFFLENBQUMsVUFBSCxDQUFjLFlBQWQsQ0FBdkI7QUFBQSxlQUFPLGFBQVA7O01BQ0EsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFWLEVBQTZCLElBQTdCO01BQ2YsSUFBdUIsRUFBRSxDQUFDLFVBQUgsQ0FBYyxZQUFkLENBQXZCO0FBQUEsZUFBTyxhQUFQOztBQUNBLGFBQU87SUFQUzs7a0NBVWxCLGdCQUFBLEdBQWtCLFNBQUMsSUFBRDthQUNoQixLQUFLLENBQUMsaUJBQU4sQ0FBd0IsSUFBQyxDQUFBLGlCQUFELENBQW1CLElBQW5CLENBQXhCO0lBRGdCOztrQ0FHbEIsaUJBQUEsR0FBbUIsU0FBQyxJQUFEO01BQ2pCLElBQUEsQ0FBaUIsSUFBakI7QUFBQSxlQUFPLEdBQVA7O01BQ0EsSUFBZSxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBZjtBQUFBLGVBQU8sS0FBUDs7TUFDQSxJQUFpRCxNQUFNLENBQUMsR0FBUCxDQUFXLG1CQUFYLENBQWpEO0FBQUEsZUFBTyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBZCxFQUFpQyxJQUFqQyxFQUFQOztNQUNBLElBQStDLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBYixDQUEvQztBQUFBLGVBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsRUFBK0IsSUFBL0IsRUFBUDs7QUFDQSxhQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUFlLElBQUMsQ0FBQSxhQUFELENBQUEsQ0FBZixFQUFpQyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQWQsQ0FBakM7SUFMVTs7a0NBUW5CLHdCQUFBLEdBQTBCLFNBQUMsSUFBRCxFQUFPLFFBQVA7YUFDeEIsS0FBSyxDQUFDLGlCQUFOLENBQXdCLElBQUMsQ0FBQSx5QkFBRCxDQUEyQixJQUEzQixFQUFpQyxRQUFqQyxDQUF4QjtJQUR3Qjs7a0NBRzFCLHlCQUFBLEdBQTJCLFNBQUMsSUFBRCxFQUFPLFFBQVA7TUFDekIsSUFBQSxDQUFpQixJQUFqQjtBQUFBLGVBQU8sR0FBUDs7TUFDQSxJQUFlLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixDQUFmO0FBQUEsZUFBTyxLQUFQOztBQUNBLGFBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFBLElBQVksR0FBMUIsRUFBK0IsSUFBL0I7SUFIa0I7Ozs7S0FwUEs7QUFkbEMiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuZnMgPSByZXF1aXJlIFwiZnMtcGx1c1wiXG5yZW1vdGUgPSByZXF1aXJlIFwicmVtb3RlXCJcbmRpYWxvZyA9IHJlbW90ZS5kaWFsb2cgfHwgcmVtb3RlLnJlcXVpcmUgXCJkaWFsb2dcIlxuXG5jb25maWcgPSByZXF1aXJlIFwiLi4vY29uZmlnXCJcbnV0aWxzID0gcmVxdWlyZSBcIi4uL3V0aWxzXCJcbnRlbXBsYXRlSGVscGVyID0gcmVxdWlyZSBcIi4uL2hlbHBlcnMvdGVtcGxhdGUtaGVscGVyXCJcblxubGFzdEluc2VydEltYWdlRGlyID0gbnVsbCAjIHJlbWVtYmVyIGxhc3QgaW5zZXJ0ZWQgaW1hZ2UgZGlyZWN0b3J5XG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEluc2VydEltYWdlRmlsZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6IFwibWFya2Rvd24td3JpdGVyIG1hcmtkb3duLXdyaXRlci1kaWFsb2dcIiwgPT5cbiAgICAgIEBsYWJlbCBcIkluc2VydCBJbWFnZVwiLCBjbGFzczogXCJpY29uIGljb24tZGV2aWNlLWNhbWVyYVwiXG4gICAgICBAZGl2ID0+XG4gICAgICAgIEBsYWJlbCBcIkltYWdlIFBhdGggKHNyYylcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwiaW1hZ2VFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiZGlhbG9nLXJvd1wiLCA9PlxuICAgICAgICAgIEBidXR0b24gXCJDaG9vc2UgTG9jYWwgSW1hZ2VcIiwgb3V0bGV0OiBcIm9wZW5JbWFnZUJ1dHRvblwiLCBjbGFzczogXCJidG5cIlxuICAgICAgICAgIEBsYWJlbCBvdXRsZXQ6IFwibWVzc2FnZVwiLCBjbGFzczogXCJzaWRlLWxhYmVsXCJcbiAgICAgICAgQGxhYmVsIFwiVGl0bGUgKGFsdClcIiwgY2xhc3M6IFwibWVzc2FnZVwiXG4gICAgICAgIEBzdWJ2aWV3IFwidGl0bGVFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJXaWR0aCAocHgpXCIsIGNsYXNzOiBcIm1lc3NhZ2VcIlxuICAgICAgICAgIEBzdWJ2aWV3IFwid2lkdGhFZGl0b3JcIiwgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUpXG4gICAgICAgIEBkaXYgY2xhc3M6IFwiY29sLTFcIiwgPT5cbiAgICAgICAgICBAbGFiZWwgXCJIZWlnaHQgKHB4KVwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImhlaWdodEVkaXRvclwiLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSlcbiAgICAgICAgQGRpdiBjbGFzczogXCJjb2wtMlwiLCA9PlxuICAgICAgICAgIEBsYWJlbCBcIkFsaWdubWVudFwiLCBjbGFzczogXCJtZXNzYWdlXCJcbiAgICAgICAgICBAc3VidmlldyBcImFsaWduRWRpdG9yXCIsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlKVxuICAgICAgQGRpdiBvdXRsZXQ6IFwiY29weUltYWdlUGFuZWxcIiwgY2xhc3M6IFwiaGlkZGVuIGRpYWxvZy1yb3dcIiwgPT5cbiAgICAgICAgQGxhYmVsIGZvcjogXCJtYXJrZG93bi13cml0ZXItY29weS1pbWFnZS1jaGVja2JveFwiLCA9PlxuICAgICAgICAgIEBpbnB1dCBpZDogXCJtYXJrZG93bi13cml0ZXItY29weS1pbWFnZS1jaGVja2JveFwiLFxuICAgICAgICAgICAgdHlwZTpcImNoZWNrYm94XCIsIG91dGxldDogXCJjb3B5SW1hZ2VDaGVja2JveFwiXG4gICAgICAgICAgQHNwYW4gXCJDb3B5IEltYWdlIFRvOiBNaXNzaW5nIEltYWdlIFBhdGggKHNyYykgb3IgVGl0bGUgKGFsdClcIiwgY2xhc3M6IFwic2lkZS1sYWJlbFwiLCBvdXRsZXQ6IFwiY29weUltYWdlTWVzc2FnZVwiXG4gICAgICBAZGl2IGNsYXNzOiBcImltYWdlLWNvbnRhaW5lclwiLCA9PlxuICAgICAgICBAaW1nIG91dGxldDogJ2ltYWdlUHJldmlldydcblxuICBpbml0aWFsaXplOiAtPlxuICAgIHV0aWxzLnNldFRhYkluZGV4KFtAaW1hZ2VFZGl0b3IsIEBvcGVuSW1hZ2VCdXR0b24sIEB0aXRsZUVkaXRvcixcbiAgICAgIEB3aWR0aEVkaXRvciwgQGhlaWdodEVkaXRvciwgQGFsaWduRWRpdG9yLCBAY29weUltYWdlQ2hlY2tib3hdKVxuXG4gICAgQGltYWdlRWRpdG9yLm9uIFwiYmx1clwiLCA9PlxuICAgICAgZmlsZSA9IEBpbWFnZUVkaXRvci5nZXRUZXh0KCkudHJpbSgpXG4gICAgICBAdXBkYXRlSW1hZ2VTb3VyY2UoZmlsZSlcbiAgICAgIEB1cGRhdGVDb3B5SW1hZ2VEZXN0KGZpbGUpXG4gICAgQHRpdGxlRWRpdG9yLm9uIFwiYmx1clwiLCA9PlxuICAgICAgQHVwZGF0ZUNvcHlJbWFnZURlc3QoQGltYWdlRWRpdG9yLmdldFRleHQoKS50cmltKCkpXG4gICAgQG9wZW5JbWFnZUJ1dHRvbi5vbiBcImNsaWNrXCIsID0+IEBvcGVuSW1hZ2VEaWFsb2coKVxuXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICBAZWxlbWVudCwge1xuICAgICAgICBcImNvcmU6Y29uZmlybVwiOiA9PiBAb25Db25maXJtKCksXG4gICAgICAgIFwiY29yZTpjYW5jZWxcIjogID0+IEBkZXRhY2goKVxuICAgICAgfSkpXG5cbiAgb25Db25maXJtOiAtPlxuICAgIGltZ1NvdXJjZSA9IEBpbWFnZUVkaXRvci5nZXRUZXh0KCkudHJpbSgpXG4gICAgcmV0dXJuIHVubGVzcyBpbWdTb3VyY2VcblxuICAgIGNhbGxiYWNrID0gPT5cbiAgICAgIEBlZGl0b3IudHJhbnNhY3QgPT4gQGluc2VydEltYWdlVGFnKClcbiAgICAgIEBkZXRhY2goKVxuXG4gICAgaWYgIUBjb3B5SW1hZ2VDaGVja2JveC5oYXNDbGFzcygnaGlkZGVuJykgJiYgQGNvcHlJbWFnZUNoZWNrYm94LnByb3AoXCJjaGVja2VkXCIpXG4gICAgICBAY29weUltYWdlKEByZXNvbHZlSW1hZ2VQYXRoKGltZ1NvdXJjZSksIGNhbGxiYWNrKVxuICAgIGVsc2VcbiAgICAgIGNhbGxiYWNrKClcblxuICBkaXNwbGF5OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgIEBwcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpXG4gICAgQGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBmcm9udE1hdHRlciA9IHRlbXBsYXRlSGVscGVyLmdldEVkaXRvcihAZWRpdG9yKVxuICAgIEBkYXRlVGltZSA9IHRlbXBsYXRlSGVscGVyLmdldERhdGVUaW1lKClcbiAgICBAc2V0RmllbGRzRnJvbVNlbGVjdGlvbigpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBpbWFnZUVkaXRvci5mb2N1cygpXG5cbiAgZGV0YWNoOiAtPlxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuICAgICAgQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD8uZm9jdXMoKVxuICAgIHN1cGVyXG5cbiAgZGV0YWNoZWQ6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAZGlzcG9zYWJsZXMgPSBudWxsXG5cbiAgc2V0RmllbGRzRnJvbVNlbGVjdGlvbjogLT5cbiAgICBAcmFuZ2UgPSB1dGlscy5nZXRUZXh0QnVmZmVyUmFuZ2UoQGVkaXRvciwgXCJsaW5rXCIpXG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRUZXh0SW5SYW5nZShAcmFuZ2UpXG4gICAgcmV0dXJuIHVubGVzcyBzZWxlY3Rpb25cblxuICAgIGlmIHV0aWxzLmlzSW1hZ2Uoc2VsZWN0aW9uKVxuICAgICAgaW1nID0gdXRpbHMucGFyc2VJbWFnZShzZWxlY3Rpb24pXG4gICAgZWxzZSBpZiB1dGlscy5pc0ltYWdlVGFnKHNlbGVjdGlvbilcbiAgICAgIGltZyA9IHV0aWxzLnBhcnNlSW1hZ2VUYWcoc2VsZWN0aW9uKVxuICAgIGVsc2VcbiAgICAgIGltZyA9IHsgYWx0OiBzZWxlY3Rpb24gfVxuXG4gICAgQHRpdGxlRWRpdG9yLnNldFRleHQoaW1nLmFsdCB8fCBcIlwiKVxuICAgIEB3aWR0aEVkaXRvci5zZXRUZXh0KGltZy53aWR0aCB8fCBcIlwiKVxuICAgIEBoZWlnaHRFZGl0b3Iuc2V0VGV4dChpbWcuaGVpZ2h0IHx8IFwiXCIpXG4gICAgQGltYWdlRWRpdG9yLnNldFRleHQoaW1nLnNyYyB8fCBcIlwiKVxuXG4gICAgQHVwZGF0ZUltYWdlU291cmNlKGltZy5zcmMpXG5cbiAgb3BlbkltYWdlRGlhbG9nOiAtPlxuICAgIGZpbGVzID0gZGlhbG9nLnNob3dPcGVuRGlhbG9nXG4gICAgICBwcm9wZXJ0aWVzOiBbJ29wZW5GaWxlJ11cbiAgICAgIGRlZmF1bHRQYXRoOiBsYXN0SW5zZXJ0SW1hZ2VEaXIgfHwgQHNpdGVMb2NhbERpcigpXG4gICAgcmV0dXJuIHVubGVzcyBmaWxlcyAmJiBmaWxlcy5sZW5ndGggPiAwXG5cbiAgICBAaW1hZ2VFZGl0b3Iuc2V0VGV4dChmaWxlc1swXSlcbiAgICBAdXBkYXRlSW1hZ2VTb3VyY2UoZmlsZXNbMF0pXG5cbiAgICBsYXN0SW5zZXJ0SW1hZ2VEaXIgPSBwYXRoLmRpcm5hbWUoZmlsZXNbMF0pIHVubGVzcyB1dGlscy5pc1VybChmaWxlc1swXSlcbiAgICBAdGl0bGVFZGl0b3IuZm9jdXMoKVxuXG4gIHVwZGF0ZUltYWdlU291cmNlOiAoZmlsZSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIGZpbGVcbiAgICBAZGlzcGxheUltYWdlUHJldmlldyhmaWxlKVxuXG4gICAgaWYgdXRpbHMuaXNVcmwoZmlsZSkgfHwgQGlzSW5TaXRlRGlyKEByZXNvbHZlSW1hZ2VQYXRoKGZpbGUpKVxuICAgICAgQGNvcHlJbWFnZVBhbmVsLmFkZENsYXNzKFwiaGlkZGVuXCIpXG4gICAgZWxzZVxuICAgICAgQGNvcHlJbWFnZVBhbmVsLnJlbW92ZUNsYXNzKFwiaGlkZGVuXCIpXG5cbiAgdXBkYXRlQ29weUltYWdlRGVzdDogKGZpbGUpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBmaWxlXG4gICAgZGVzdEZpbGUgPSBAZ2V0Q29waWVkSW1hZ2VEZXN0UGF0aChmaWxlLCBAdGl0bGVFZGl0b3IuZ2V0VGV4dCgpKVxuICAgIEBjb3B5SW1hZ2VNZXNzYWdlLnRleHQoXCJDb3B5IEltYWdlIFRvOiAje2Rlc3RGaWxlfVwiKVxuXG4gIGRpc3BsYXlJbWFnZVByZXZpZXc6IChmaWxlKSAtPlxuICAgIHJldHVybiBpZiBAaW1hZ2VPblByZXZpZXcgPT0gZmlsZVxuXG4gICAgaWYgdXRpbHMuaXNJbWFnZUZpbGUoZmlsZSlcbiAgICAgIEBtZXNzYWdlLnRleHQoXCJPcGVuaW5nIEltYWdlIFByZXZpZXcgLi4uXCIpXG4gICAgICBAaW1hZ2VQcmV2aWV3LmF0dHIoXCJzcmNcIiwgQHJlc29sdmVJbWFnZVBhdGgoZmlsZSkpXG4gICAgICBAaW1hZ2VQcmV2aWV3LmxvYWQgPT5cbiAgICAgICAgQG1lc3NhZ2UudGV4dChcIlwiKVxuICAgICAgICBAc2V0SW1hZ2VDb250ZXh0KClcbiAgICAgIEBpbWFnZVByZXZpZXcuZXJyb3IgPT5cbiAgICAgICAgQG1lc3NhZ2UudGV4dChcIkVycm9yOiBGYWlsZWQgdG8gTG9hZCBJbWFnZS5cIilcbiAgICAgICAgQGltYWdlUHJldmlldy5hdHRyKFwic3JjXCIsIFwiXCIpXG4gICAgZWxzZVxuICAgICAgQG1lc3NhZ2UudGV4dChcIkVycm9yOiBJbnZhbGlkIEltYWdlIEZpbGUuXCIpIGlmIGZpbGVcbiAgICAgIEBpbWFnZVByZXZpZXcuYXR0cihcInNyY1wiLCBcIlwiKVxuICAgICAgQHdpZHRoRWRpdG9yLnNldFRleHQoXCJcIilcbiAgICAgIEBoZWlnaHRFZGl0b3Iuc2V0VGV4dChcIlwiKVxuICAgICAgQGFsaWduRWRpdG9yLnNldFRleHQoXCJcIilcblxuICAgIEBpbWFnZU9uUHJldmlldyA9IGZpbGUgIyBjYWNoZSBwcmV2aWV3IGltYWdlIHNyY1xuXG4gIHNldEltYWdlQ29udGV4dDogLT5cbiAgICB7IG5hdHVyYWxXaWR0aCwgbmF0dXJhbEhlaWdodCB9ID0gQGltYWdlUHJldmlldy5jb250ZXh0XG4gICAgQHdpZHRoRWRpdG9yLnNldFRleHQoXCJcIiArIG5hdHVyYWxXaWR0aClcbiAgICBAaGVpZ2h0RWRpdG9yLnNldFRleHQoXCJcIiArIG5hdHVyYWxIZWlnaHQpXG5cbiAgICBwb3NpdGlvbiA9IGlmIG5hdHVyYWxXaWR0aCA+IDMwMCB0aGVuIFwiY2VudGVyXCIgZWxzZSBcInJpZ2h0XCJcbiAgICBAYWxpZ25FZGl0b3Iuc2V0VGV4dChwb3NpdGlvbilcblxuICBpbnNlcnRJbWFnZVRhZzogLT5cbiAgICBpbWdTb3VyY2UgPSBAaW1hZ2VFZGl0b3IuZ2V0VGV4dCgpLnRyaW0oKVxuICAgIGltZyA9XG4gICAgICByYXdTcmM6IGltZ1NvdXJjZSxcbiAgICAgIHNyYzogQGdlbmVyYXRlSW1hZ2VTcmMoaW1nU291cmNlKVxuICAgICAgcmVsYXRpdmVGaWxlU3JjOiBAZ2VuZXJhdGVSZWxhdGl2ZUltYWdlU3JjKGltZ1NvdXJjZSwgQGN1cnJlbnRGaWxlRGlyKCkpXG4gICAgICByZWxhdGl2ZVNpdGVTcmM6IEBnZW5lcmF0ZVJlbGF0aXZlSW1hZ2VTcmMoaW1nU291cmNlLCBAc2l0ZUxvY2FsRGlyKCkpXG4gICAgICBhbHQ6IEB0aXRsZUVkaXRvci5nZXRUZXh0KClcbiAgICAgIHdpZHRoOiBAd2lkdGhFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBoZWlnaHQ6IEBoZWlnaHRFZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBhbGlnbjogQGFsaWduRWRpdG9yLmdldFRleHQoKVxuXG4gICAgIyBpbnNlcnQgaW1hZ2UgdGFnIHdoZW4gaW1nLnNyYyBleGlzdHMsIG90aGVyd2lzZSBjb25zaWRlciB0aGUgaW1hZ2Ugd2FzIHJlbW92ZWRcbiAgICBpZiBpbWcuc3JjXG4gICAgICB0ZXh0ID0gdGVtcGxhdGVIZWxwZXIuY3JlYXRlKFwiaW1hZ2VUYWdcIiwgQGZyb250TWF0dGVyLCBAZGF0ZVRpbWUsIGltZylcbiAgICBlbHNlXG4gICAgICB0ZXh0ID0gaW1nLmFsdFxuXG4gICAgQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZShAcmFuZ2UsIHRleHQpXG5cbiAgY29weUltYWdlOiAoZmlsZSwgY2FsbGJhY2spIC0+XG4gICAgcmV0dXJuIGNhbGxiYWNrKCkgaWYgdXRpbHMuaXNVcmwoZmlsZSkgfHwgIWZzLmV4aXN0c1N5bmMoZmlsZSlcblxuICAgIHRyeVxuICAgICAgZGVzdEZpbGUgPSBAZ2V0Q29waWVkSW1hZ2VEZXN0UGF0aChmaWxlLCBAdGl0bGVFZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgcGVyZm9ybVdyaXRlID0gdHJ1ZVxuXG4gICAgICBpZiBmcy5leGlzdHNTeW5jKGRlc3RGaWxlKVxuICAgICAgICBjb25maXJtYXRpb24gPSBhdG9tLmNvbmZpcm1cbiAgICAgICAgICBtZXNzYWdlOiBcIkZpbGUgYWxyZWFkeSBleGlzdHMhXCJcbiAgICAgICAgICBkZXRhaWxlZE1lc3NhZ2U6IFwiQW5vdGhlciBmaWxlIGFscmVhZHkgZXhpc3RzIGF0OlxcbiN7ZGVzdEZpbGV9XFxuRG8geW91IHdhbnQgdG8gb3ZlcndyaXRlIGl0P1wiXG4gICAgICAgICAgYnV0dG9uczogW1wiTm9cIiwgXCJZZXNcIl1cbiAgICAgICAgcGVyZm9ybVdyaXRlID0gKGNvbmZpcm1hdGlvbiA9PSAxKVxuXG4gICAgICBpZiBwZXJmb3JtV3JpdGVcbiAgICAgICAgZnMuY29weSBmaWxlLCBkZXN0RmlsZSwgPT5cbiAgICAgICAgICBAaW1hZ2VFZGl0b3Iuc2V0VGV4dChkZXN0RmlsZSlcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGF0b20uY29uZmlybVxuICAgICAgICBtZXNzYWdlOiBcIltNYXJrZG93biBXcml0ZXJdIEVycm9yIVwiXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogXCJDb3B5aW5nIEltYWdlOlxcbiN7ZXJyb3IubWVzc2FnZX1cIlxuICAgICAgICBidXR0b25zOiBbJ09LJ11cblxuICAjIGdldCB1c2VyJ3Mgc2l0ZSBsb2NhbCBkaXJlY3RvcnlcbiAgc2l0ZUxvY2FsRGlyOiAtPiB1dGlscy5nZXRTaXRlUGF0aChjb25maWcuZ2V0KFwic2l0ZUxvY2FsRGlyXCIpLCBAZWRpdG9yLmdldFBhdGgoKSlcbiAgIyBnZXQgdXNlcidzIHNpdGUgaW1hZ2VzIGRpcmVjdG9yeVxuICBzaXRlSW1hZ2VzRGlyOiAtPiB0ZW1wbGF0ZUhlbHBlci5jcmVhdGUoXCJzaXRlSW1hZ2VzRGlyXCIsIEBmcm9udE1hdHRlciwgQGRhdGVUaW1lKVxuICAjIGdldCBjdXJyZW50IG9wZW4gZmlsZSBkaXJlY3RvcnlcbiAgY3VycmVudEZpbGVEaXI6IC0+IHBhdGguZGlybmFtZShAZWRpdG9yLmdldFBhdGgoKSB8fCBcIlwiKVxuICAjIGNoZWNrIHRoZSBmaWxlIGlzIGluIHRoZSBzaXRlIGRpcmVjdG9yeVxuICBpc0luU2l0ZURpcjogKGZpbGUpIC0+IGZpbGUgJiYgZmlsZS5zdGFydHNXaXRoKEBzaXRlTG9jYWxEaXIoKSlcblxuICAjIGdldCBjb3B5IGltYWdlIGRlc3RpbmF0aW9uIGZpbGUgcGF0aFxuICBnZXRDb3BpZWRJbWFnZURlc3RQYXRoOiAoZmlsZSwgdGl0bGUpIC0+XG4gICAgZmlsZW5hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGUpXG5cbiAgICBpZiBjb25maWcuZ2V0KFwicmVuYW1lSW1hZ2VPbkNvcHlcIikgJiYgdGl0bGVcbiAgICAgIGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlKVxuICAgICAgdGl0bGUgPSB1dGlscy5zbHVnaXplKHRpdGxlLCBjb25maWcuZ2V0KCdzbHVnU2VwYXJhdG9yJykpXG4gICAgICBmaWxlbmFtZSA9IFwiI3t0aXRsZX0je2V4dGVuc2lvbn1cIlxuXG4gICAgcGF0aC5qb2luKEBzaXRlTG9jYWxEaXIoKSwgQHNpdGVJbWFnZXNEaXIoKSwgZmlsZW5hbWUpXG5cbiAgIyB0cnkgdG8gcmVzb2x2ZSBmaWxlIHRvIGEgdmFsaWQgc3JjIHRoYXQgY291bGQgYmUgZGlzcGxheWVkXG4gIHJlc29sdmVJbWFnZVBhdGg6IChmaWxlKSAtPlxuICAgIHJldHVybiBcIlwiIHVubGVzcyBmaWxlXG4gICAgcmV0dXJuIGZpbGUgaWYgdXRpbHMuaXNVcmwoZmlsZSkgfHwgZnMuZXhpc3RzU3luYyhmaWxlKVxuICAgIGFic29sdXRlUGF0aCA9IHBhdGguam9pbihAc2l0ZUxvY2FsRGlyKCksIGZpbGUpXG4gICAgcmV0dXJuIGFic29sdXRlUGF0aCBpZiBmcy5leGlzdHNTeW5jKGFic29sdXRlUGF0aClcbiAgICByZWxhdGl2ZVBhdGggPSBwYXRoLmpvaW4oQGN1cnJlbnRGaWxlRGlyKCksIGZpbGUpXG4gICAgcmV0dXJuIHJlbGF0aXZlUGF0aCBpZiBmcy5leGlzdHNTeW5jKHJlbGF0aXZlUGF0aClcbiAgICByZXR1cm4gZmlsZSAjIGZhbGxiYWNrIHRvIG5vdCByZXNvbHZlXG5cbiAgIyBnZW5lcmF0ZSBhIHNyYyB0aGF0IGlzIHVzZWQgaW4gbWFya2Rvd24gZmlsZSBiYXNlZCBvbiB1c2VyIGNvbmZpZ3VyYXRpb24gb3IgZmlsZSBsb2NhdGlvblxuICBnZW5lcmF0ZUltYWdlU3JjOiAoZmlsZSkgLT5cbiAgICB1dGlscy5ub3JtYWxpemVGaWxlUGF0aChAX2dlbmVyYXRlSW1hZ2VTcmMoZmlsZSkpXG5cbiAgX2dlbmVyYXRlSW1hZ2VTcmM6IChmaWxlKSAtPlxuICAgIHJldHVybiBcIlwiIHVubGVzcyBmaWxlXG4gICAgcmV0dXJuIGZpbGUgaWYgdXRpbHMuaXNVcmwoZmlsZSlcbiAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShAY3VycmVudEZpbGVEaXIoKSwgZmlsZSkgaWYgY29uZmlnLmdldCgncmVsYXRpdmVJbWFnZVBhdGgnKVxuICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKEBzaXRlTG9jYWxEaXIoKSwgZmlsZSkgaWYgQGlzSW5TaXRlRGlyKGZpbGUpXG4gICAgcmV0dXJuIHBhdGguam9pbihcIi9cIiwgQHNpdGVJbWFnZXNEaXIoKSwgcGF0aC5iYXNlbmFtZShmaWxlKSlcblxuICAjIGdlbmVyYXRlIGEgcmVsYXRpdmUgc3JjIGZyb20gdGhlIGJhc2UgcGF0aCBvciBmcm9tIHVzZXIncyBob21lIGRpcmVjdG9yeVxuICBnZW5lcmF0ZVJlbGF0aXZlSW1hZ2VTcmM6IChmaWxlLCBiYXNlUGF0aCkgLT5cbiAgICB1dGlscy5ub3JtYWxpemVGaWxlUGF0aChAX2dlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYyhmaWxlLCBiYXNlUGF0aCkpXG5cbiAgX2dlbmVyYXRlUmVsYXRpdmVJbWFnZVNyYzogKGZpbGUsIGJhc2VQYXRoKSAtPlxuICAgIHJldHVybiBcIlwiIHVubGVzcyBmaWxlXG4gICAgcmV0dXJuIGZpbGUgaWYgdXRpbHMuaXNVcmwoZmlsZSlcbiAgICByZXR1cm4gcGF0aC5yZWxhdGl2ZShiYXNlUGF0aCB8fCBcIn5cIiwgZmlsZSlcbiJdfQ==
