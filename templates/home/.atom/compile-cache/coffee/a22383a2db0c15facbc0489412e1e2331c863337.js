(function() {
  var path, utils;

  path = require("path");

  utils = require("../lib/utils");

  describe("utils", function() {
    describe(".capitalize", function() {
      return it("capitalize string", function() {
        expect(utils.capitalize("")).toEqual("");
        expect(utils.capitalize("Author")).toEqual("Author");
        expect(utils.capitalize("authorName")).toEqual("AuthorName");
        return expect(utils.capitalize("中文")).toEqual("中文");
      });
    });
    describe(".incrementChars", function() {
      it("increment empty chars", function() {
        return expect(utils.incrementChars("")).toEqual("a");
      });
      it("increment 1 char", function() {
        expect(utils.incrementChars("a")).toEqual("b");
        expect(utils.incrementChars("f")).toEqual("g");
        expect(utils.incrementChars("y")).toEqual("z");
        return expect(utils.incrementChars("z")).toEqual("aa");
      });
      return it("increment 2 char", function() {
        expect(utils.incrementChars("AC")).toEqual("AD");
        expect(utils.incrementChars("EZ")).toEqual("FA");
        return expect(utils.incrementChars("ZZ")).toEqual("AAA");
      });
    });
    describe(".slugize", function() {
      it("slugize string", function() {
        var fixture;
        fixture = "hello world!";
        expect(utils.slugize(fixture)).toEqual("hello-world");
        fixture = "hello-world";
        expect(utils.slugize(fixture)).toEqual("hello-world");
        fixture = " hello     World";
        return expect(utils.slugize(fixture)).toEqual("hello-world");
      });
      it("slugize chinese", function() {
        var fixture;
        fixture = "中文也可以";
        expect(utils.slugize(fixture)).toEqual("中文也可以");
        fixture = "中文：也可以";
        expect(utils.slugize(fixture)).toEqual("中文：也可以");
        fixture = " 「中文」  『也可以』";
        return expect(utils.slugize(fixture)).toEqual("「中文」-『也可以』");
      });
      return it("slugize empty string", function() {
        expect(utils.slugize(void 0)).toEqual("");
        return expect(utils.slugize("")).toEqual("");
      });
    });
    describe(".getPackagePath", function() {
      it("get the package path", function() {
        var root;
        root = atom.packages.resolvePackagePath("markdown-writer");
        return expect(utils.getPackagePath()).toEqual(root);
      });
      return it("get the path to package file", function() {
        var cheatsheetPath, root;
        root = atom.packages.resolvePackagePath("markdown-writer");
        cheatsheetPath = path.join(root, "CHEATSHEET.md");
        return expect(utils.getPackagePath("CHEATSHEET.md")).toEqual(cheatsheetPath);
      });
    });
    describe(".getAbsolutePath", function() {
      return it("expand ~ to homedir", function() {
        var absPath;
        absPath = utils.getAbsolutePath(path.join("~", "markdown-writer"));
        return expect(absPath).toEqual(path.join(utils.getHomedir(), "markdown-writer"));
      });
    });
    describe(".template", function() {
      it("generate template", function() {
        var fixture;
        fixture = "<a href=''>hello <title>! <from></a>";
        return expect(utils.template(fixture, {
          title: "world",
          from: "markdown-writer"
        })).toEqual("<a href=''>hello world! markdown-writer</a>");
      });
      return it("generate template with data missing", function() {
        var fixture;
        fixture = "<a href='<url>' title='<title>'><img></a>";
        return expect(utils.template(fixture, {
          url: "//",
          title: ''
        })).toEqual("<a href='//' title=''><img></a>");
      });
    });
    describe(".untemplate", function() {
      it("generate untemplate for normal text", function() {
        var fn;
        fn = utils.untemplate("text");
        expect(fn("text")).toEqual({
          _: "text"
        });
        return expect(fn("abc")).toEqual(void 0);
      });
      it("generate untemplate for template", function() {
        var fn;
        fn = utils.untemplate("{year}-{month}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("2016-01")).toEqual({
          _: "2016-01",
          year: "2016",
          month: "01"
        });
      });
      it("generate untemplate for complex template", function() {
        var fn;
        fn = utils.untemplate("{year}-{month}-{day} {hour}:{minute}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("2016-01-03 12:19")).toEqual({
          _: "2016-01-03 12:19",
          year: "2016",
          month: "01",
          day: "03",
          hour: "12",
          minute: "19"
        });
      });
      return it("generate untemplate for template with regex chars", function() {
        var fn;
        fn = utils.untemplate("[{year}-{month}-{day}] - {hour}:{minute}");
        expect(fn("2016-11-12")).toEqual(void 0);
        return expect(fn("[2016-01-03] - 12:19")).toEqual({
          _: "[2016-01-03] - 12:19",
          year: "2016",
          month: "01",
          day: "03",
          hour: "12",
          minute: "19"
        });
      });
    });
    describe(".parseDate", function() {
      return it("parse date dashed string", function() {
        var date, parseDate;
        date = utils.getDate();
        parseDate = utils.parseDate(date);
        return expect(parseDate).toEqual(date);
      });
    });
    it("check is valid html image tag", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.isImageTag(fixture)).toBe(true);
    });
    it("check parse valid html image tag", function() {
      var fixture;
      fixture = "<img alt=\"alt\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\">";
      return expect(utils.parseImageTag(fixture)).toEqual({
        alt: "alt",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check parse valid html image tag with title", function() {
      var fixture;
      fixture = "<img title=\"\" src=\"src.png\" class=\"aligncenter\" height=\"304\" width=\"520\" />";
      return expect(utils.parseImageTag(fixture)).toEqual({
        title: "",
        src: "src.png",
        "class": "aligncenter",
        height: "304",
        width: "520"
      });
    });
    it("check is not valid image", function() {
      var fixture;
      fixture = "[text](url)";
      return expect(utils.isImage(fixture)).toBe(false);
    });
    it("check is valid image", function() {
      var fixture;
      fixture = "![](url)";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = '![](url "title")';
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text]()";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text](url)";
      expect(utils.isImage(fixture)).toBe(true);
      fixture = "![text](url 'title')";
      return expect(utils.isImage(fixture)).toBe(true);
    });
    it("parse valid image", function() {
      var fixture;
      fixture = "![text](url)";
      return expect(utils.parseImage(fixture)).toEqual({
        alt: "text",
        src: "url",
        title: ""
      });
    });
    it("check is valid image file", function() {
      var fixture;
      fixture = "fixtures/abc.jpg";
      expect(utils.isImageFile(fixture)).toBe(true);
      fixture = "fixtures/abc.txt";
      return expect(utils.isImageFile(fixture)).toBe(false);
    });
    describe(".isInlineLink", function() {
      it("check is text invalid inline link", function() {
        var fixture;
        fixture = "![text](url)";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[text][]";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[![](image.png)][id]";
        expect(utils.isInlineLink(fixture)).toBe(false);
        fixture = "[![image title](image.png)][id]";
        return expect(utils.isInlineLink(fixture)).toBe(false);
      });
      it("check is text valid inline link", function() {
        var fixture;
        fixture = "[text]()";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url title)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[text](url 'title')";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[[link](in_another_link)][]";
        return expect(utils.isInlineLink(fixture)).toBe(true);
      });
      return it("check is image link valid inlink link", function() {
        var fixture;
        fixture = "[![](image.png)](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[![text](image.png)](url)";
        expect(utils.isInlineLink(fixture)).toBe(true);
        fixture = "[![text](image.png)](url 'title')";
        return expect(utils.isInlineLink(fixture)).toBe(true);
      });
    });
    it("parse valid inline link text", function() {
      var fixture;
      fixture = "[text]()";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "",
        title: ""
      });
      fixture = "[text](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: ""
      });
      fixture = "[text](url title)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
      fixture = "[text](url 'title')";
      return expect(utils.parseInlineLink(fixture)).toEqual({
        text: "text",
        url: "url",
        title: "title"
      });
    });
    it("parse valid image text inline link", function() {
      var fixture;
      fixture = "[![](image.png)](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![](image.png)",
        url: "url",
        title: ""
      });
      fixture = "[![text](image.png)](url)";
      expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![text](image.png)",
        url: "url",
        title: ""
      });
      fixture = "[![text](image.png 'title')](url 'title')";
      return expect(utils.parseInlineLink(fixture)).toEqual({
        text: "![text](image.png 'title')",
        url: "url",
        title: "title"
      });
    });
    describe(".isReferenceLink", function() {
      it("check is text invalid reference link", function() {
        var fixture;
        fixture = "![text](url)";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[text](has)";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![text](image.png)][]";
        return expect(utils.isReferenceLink(fixture)).toBe(false);
      });
      it("check is text valid reference link", function() {
        var fixture;
        fixture = "[text][]";
        expect(utils.isReferenceLink(fixture)).toBe(true);
        fixture = "[text][id with space]";
        return expect(utils.isReferenceLink(fixture)).toBe(true);
      });
      return it("check is text valid image reference link", function() {
        var fixture;
        fixture = "[![](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![text](image.png)][]";
        expect(utils.isReferenceLink(fixture)).toBe(false);
        fixture = "[![](image.png)][id with space]";
        expect(utils.isReferenceLink(fixture)).toBe(true);
        fixture = "[![text](image.png)][id with space]";
        return expect(utils.isReferenceLink(fixture)).toBe(true);
      });
    });
    describe(".parseReferenceLink", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in [Jekyll][id].");
        });
      });
      it("parse valid reference link text without id", function() {
        var fixture;
        fixture = "[text][]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "text",
          text: "text",
          url: "http://www.jekyll.com",
          title: "",
          definitionRange: {
            start: {
              row: 2,
              column: 0
            },
            end: {
              row: 2,
              column: 29
            }
          }
        });
      });
      it("parse valid reference link text with id", function() {
        var fixture;
        fixture = "[Jekyll][id]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "id",
          text: "Jekyll",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          definitionRange: {
            start: {
              row: 3,
              column: 0
            },
            end: {
              row: 3,
              column: 40
            }
          }
        });
      });
      return it("parse orphan reference link text", function() {
        var fixture;
        fixture = "[Jekyll][jekyll]";
        return expect(utils.parseReferenceLink(fixture, editor)).toEqual({
          id: "jekyll",
          text: "Jekyll",
          url: "",
          title: "",
          definitionRange: null
        });
      });
    });
    describe(".isReferenceDefinition", function() {
      it("check is text invalid reference definition", function() {
        var fixture;
        fixture = "[text] http";
        expect(utils.isReferenceDefinition(fixture)).toBe(false);
        fixture = "[^text]: http";
        return expect(utils.isReferenceDefinition(fixture)).toBe(false);
      });
      it("check is text valid reference definition", function() {
        var fixture;
        fixture = "[text text]: http";
        return expect(utils.isReferenceDefinition(fixture)).toBe(true);
      });
      return it("check is text valid reference definition with title", function() {
        var fixture;
        fixture = "  [text]: http 'title not in double quote'";
        return expect(utils.isReferenceDefinition(fixture)).toBe(true);
      });
    });
    describe(".parseReferenceDefinition", function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("empty.markdown");
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          return editor.setText("Transform your plain [text][] into static websites and blogs.\n\n[text]: http://www.jekyll.com\n[id]: http://jekyll.com \"Jekyll Website\"\n\nMarkdown (or Textile), Liquid, HTML & CSS go in [Jekyll][id].");
        });
      });
      it("parse valid reference definition text without id", function() {
        var fixture;
        fixture = "[text]: http://www.jekyll.com";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "text",
          text: "text",
          url: "http://www.jekyll.com",
          title: "",
          linkRange: {
            start: {
              row: 0,
              column: 21
            },
            end: {
              row: 0,
              column: 29
            }
          }
        });
      });
      it("parse valid reference definition text with id", function() {
        var fixture;
        fixture = "[id]: http://jekyll.com \"Jekyll Website\"";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "id",
          text: "Jekyll",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          linkRange: {
            start: {
              row: 5,
              column: 48
            },
            end: {
              row: 5,
              column: 60
            }
          }
        });
      });
      return it("parse orphan reference definition text", function() {
        var fixture;
        fixture = "[jekyll]: http://jekyll.com \"Jekyll Website\"";
        return expect(utils.parseReferenceDefinition(fixture, editor)).toEqual({
          id: "jekyll",
          text: "",
          url: "http://jekyll.com",
          title: "Jekyll Website",
          linkRange: null
        });
      });
    });
    describe(".isFootnote", function() {
      it("check is text invalid footnote", function() {
        var fixture;
        fixture = "[text]";
        expect(utils.isFootnote(fixture)).toBe(false);
        fixture = "![abc]";
        return expect(utils.isFootnote(fixture)).toBe(false);
      });
      return it("check is text valid footnote", function() {
        var fixture;
        fixture = "[^1]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^text]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^text text]";
        expect(utils.isFootnote(fixture)).toBe(true);
        fixture = "[^12]:";
        return expect(utils.isFootnote(fixture)).toBe(true);
      });
    });
    describe(".parseFootnote", function() {
      return it("parse valid footnote", function() {
        var fixture;
        fixture = "[^1]";
        expect(utils.parseFootnote(fixture)).toEqual({
          label: "1",
          content: "",
          isDefinition: false
        });
        fixture = "[^text]: ";
        return expect(utils.parseFootnote(fixture)).toEqual({
          label: "text",
          content: "",
          isDefinition: true
        });
      });
    });
    describe(".isTableSeparator", function() {
      it("check is table separator", function() {
        var fixture;
        fixture = "----|";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "----| ";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "--|--";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "|--|";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "-|--|- ";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "---- |------ | ---";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
      it("check is table separator with extra pipes", function() {
        var fixture;
        fixture = "|-----";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "|--|--";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "|---- |------ | ---|";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
      return it("check is table separator with format", function() {
        var fixture;
        fixture = ":--  |::---";
        expect(utils.isTableSeparator(fixture)).toBe(false);
        fixture = "|:---: |";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = ":--|--:";
        expect(utils.isTableSeparator(fixture)).toBe(true);
        fixture = "|:---: |:----- | --: |";
        return expect(utils.isTableSeparator(fixture)).toBe(true);
      });
    });
    describe(".parseTableSeparator", function() {
      it("parse table separator", function() {
        var fixture;
        fixture = "|----|";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty"],
          columns: ["----"],
          columnWidths: [4]
        });
        fixture = "--|--";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["empty", "empty"],
          columns: ["--", "--"],
          columnWidths: [2, 2]
        });
        fixture = "-|--|--| ";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["empty", "empty", "empty", "empty"],
          columns: ["-", "--", "--", ""],
          columnWidths: [1, 2, 2, 0]
        });
        fixture = "---- |------ | ---";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["empty", "empty", "empty"],
          columns: ["----", "------", "---"],
          columnWidths: [4, 6, 3]
        });
      });
      it("parse table separator with extra pipes", function() {
        var fixture;
        fixture = "|--|--";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty", "empty"],
          columns: ["--", "--"],
          columnWidths: [2, 2]
        });
        fixture = "|---- |------ | ---|";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["empty", "empty", "empty"],
          columns: ["----", "------", "---"],
          columnWidths: [4, 6, 3]
        });
      });
      return it("parse table separator with format", function() {
        var fixture;
        fixture = ":-|-:|::";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["left", "right", "center"],
          columns: [":-", "-:", "::"],
          columnWidths: [2, 2, 2]
        });
        fixture = ":--|--:";
        expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: false,
          alignments: ["left", "right"],
          columns: [":--", "--:"],
          columnWidths: [3, 3]
        });
        fixture = "|:---: |:----- | --: |";
        return expect(utils.parseTableSeparator(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["center", "left", "right"],
          columns: [":---:", ":-----", "--:"],
          columnWidths: [5, 6, 3]
        });
      });
    });
    describe(".isTableRow", function() {
      it("check table separator is a table row", function() {
        var fixture;
        fixture = ":--  |:---";
        return expect(utils.isTableRow(fixture)).toBe(true);
      });
      return it("check is table row", function() {
        var fixture;
        fixture = "| empty content |";
        expect(utils.isTableRow(fixture)).toBe(true);
        fixture = "abc|feg";
        expect(utils.isTableRow(fixture)).toBe(true);
        fixture = "|   abc |efg | |";
        expect(utils.isTableRow(fixture)).toBe(true);
        fixture = "| abc|efg | | ";
        return expect(utils.isTableRow(fixture)).toBe(true);
      });
    });
    describe(".parseTableRow", function() {
      it("parse table separator by table row ", function() {
        var fixture;
        fixture = "|:---: |:----- | --: |";
        return expect(utils.parseTableRow(fixture)).toEqual({
          separator: true,
          extraPipes: true,
          alignments: ["center", "left", "right"],
          columns: [":---:", ":-----", "--:"],
          columnWidths: [5, 6, 3]
        });
      });
      return it("parse table row ", function() {
        var fixture;
        fixture = "| 中文 |";
        expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: true,
          columns: ["中文"],
          columnWidths: [4]
        });
        fixture = "abc|feg";
        expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: false,
          columns: ["abc", "feg"],
          columnWidths: [3, 3]
        });
        fixture = "abc| ";
        expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: false,
          columns: ["abc", ""],
          columnWidths: [3, 0]
        });
        fixture = "|   abc |efg | |";
        return expect(utils.parseTableRow(fixture)).toEqual({
          separator: false,
          extraPipes: true,
          columns: ["abc", "efg", ""],
          columnWidths: [3, 3, 0]
        });
      });
    });
    it("create table separator", function() {
      var row;
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: false,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("--|---|--");
      row = utils.createTableSeparator({
        numOfColumns: 2,
        extraPipes: true,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("|---|---|");
      row = utils.createTableSeparator({
        numOfColumns: 1,
        extraPipes: true,
        columnWidth: 1,
        alignment: "left"
      });
      expect(row).toEqual("|:--|");
      row = utils.createTableSeparator({
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [2, 3, 3],
        alignment: "left"
      });
      expect(row).toEqual("|:---|:----|:----|");
      row = utils.createTableSeparator({
        numOfColumns: 4,
        extraPipes: false,
        columnWidth: 3,
        alignment: "left",
        alignments: ["empty", "right", "center"]
      });
      return expect(row).toEqual("----|----:|:---:|:---");
    });
    it("create empty table row", function() {
      var row;
      row = utils.createTableRow([], {
        numOfColumns: 3,
        columnWidth: 1,
        alignment: "empty"
      });
      expect(row).toEqual("  |   |  ");
      row = utils.createTableRow([], {
        numOfColumns: 3,
        extraPipes: true,
        columnWidths: [1, 2, 3],
        alignment: "empty"
      });
      return expect(row).toEqual("|   |    |     |");
    });
    it("create table row", function() {
      var row;
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        extraPipes: true,
        columnWidths: [4, 7]
      });
      expect(row).toEqual("| 中文 | English |");
      row = utils.createTableRow(["中文", "English"], {
        numOfColumns: 2,
        columnWidths: [8, 10],
        alignments: ["right", "center"]
      });
      return expect(row).toEqual("    中文 |  English  ");
    });
    it("create an empty table", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        columnWidths: [4, 1, 4],
        alignments: ["left", "center", "right"]
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["     |   |     ", ":----|:-:|----:", "     |   |     "]);
    });
    it("create an empty table with extra pipes", function() {
      var options, rows;
      rows = [];
      options = {
        numOfColumns: 3,
        extraPipes: true,
        columnWidth: 1,
        alignment: "empty"
      };
      rows.push(utils.createTableRow([], options));
      rows.push(utils.createTableSeparator(options));
      rows.push(utils.createTableRow([], options));
      return expect(rows).toEqual(["|   |   |   |", "|---|---|---|", "|   |   |   |"]);
    });
    it("check is url", function() {
      var fixture;
      fixture = "https://github.com/zhuochun/md-writer";
      expect(utils.isUrl(fixture)).toBe(true);
      fixture = "/Users/zhuochun/md-writer";
      return expect(utils.isUrl(fixture)).toBe(false);
    });
    return it("normalize file path", function() {
      var expected, fixture;
      fixture = "https://github.com/zhuochun/md-writer";
      expect(utils.normalizeFilePath(fixture)).toEqual(fixture);
      fixture = "\\github.com\\zhuochun\\md-writer.gif";
      expected = "/github.com/zhuochun/md-writer.gif";
      expect(utils.normalizeFilePath(fixture)).toEqual(expected);
      return expect(utils.normalizeFilePath(expected)).toEqual(expected);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvbWFya2Rvd24td3JpdGVyL3NwZWMvdXRpbHMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0VBRVIsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQTtJQUtoQixRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO2FBQ3RCLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1FBQ3RCLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBTixDQUFpQixFQUFqQixDQUFQLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsRUFBckM7UUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQU4sQ0FBaUIsUUFBakIsQ0FBUCxDQUFrQyxDQUFDLE9BQW5DLENBQTJDLFFBQTNDO1FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFOLENBQWlCLFlBQWpCLENBQVAsQ0FBc0MsQ0FBQyxPQUF2QyxDQUErQyxZQUEvQztlQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBTixDQUFpQixJQUFqQixDQUFQLENBQThCLENBQUMsT0FBL0IsQ0FBdUMsSUFBdkM7TUFKc0IsQ0FBeEI7SUFEc0IsQ0FBeEI7SUFPQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQTtNQUMxQixFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtlQUMxQixNQUFBLENBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsRUFBckIsQ0FBUCxDQUFnQyxDQUFDLE9BQWpDLENBQXlDLEdBQXpDO01BRDBCLENBQTVCO01BR0EsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUE7UUFDckIsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLENBQVAsQ0FBaUMsQ0FBQyxPQUFsQyxDQUEw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QWxEO0lBUHdCLENBQTFCO0VBOW1CZ0IsQ0FBbEI7QUFIQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlIFwicGF0aFwiXG51dGlscyA9IHJlcXVpcmUgXCIuLi9saWIvdXRpbHNcIlxuXG5kZXNjcmliZSBcInV0aWxzXCIsIC0+XG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgR2VuZXJhbCBVdGlsc1xuI1xuICBkZXNjcmliZSBcIi5jYXBpdGFsaXplXCIsIC0+XG4gICAgaXQgXCJjYXBpdGFsaXplIHN0cmluZ1wiLCAtPlxuICAgICAgZXhwZWN0KHV0aWxzLmNhcGl0YWxpemUoXCJcIikpLnRvRXF1YWwoXCJcIilcbiAgICAgIGV4cGVjdCh1dGlscy5jYXBpdGFsaXplKFwiQXV0aG9yXCIpKS50b0VxdWFsKFwiQXV0aG9yXCIpXG4gICAgICBleHBlY3QodXRpbHMuY2FwaXRhbGl6ZShcImF1dGhvck5hbWVcIikpLnRvRXF1YWwoXCJBdXRob3JOYW1lXCIpXG4gICAgICBleHBlY3QodXRpbHMuY2FwaXRhbGl6ZShcIuS4reaWh1wiKSkudG9FcXVhbChcIuS4reaWh1wiKVxuXG4gIGRlc2NyaWJlIFwiLmluY3JlbWVudENoYXJzXCIsIC0+XG4gICAgaXQgXCJpbmNyZW1lbnQgZW1wdHkgY2hhcnNcIiwgLT5cbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcIlwiKSkudG9FcXVhbChcImFcIilcblxuICAgIGl0IFwiaW5jcmVtZW50IDEgY2hhclwiLCAtPlxuICAgICAgZXhwZWN0KHV0aWxzLmluY3JlbWVudENoYXJzKFwiYVwiKSkudG9FcXVhbChcImJcIilcbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcImZcIikpLnRvRXF1YWwoXCJnXCIpXG4gICAgICBleHBlY3QodXRpbHMuaW5jcmVtZW50Q2hhcnMoXCJ5XCIpKS50b0VxdWFsKFwielwiKVxuICAgICAgZXhwZWN0KHV0aWxzLmluY3JlbWVudENoYXJzKFwielwiKSkudG9FcXVhbChcImFhXCIpXG5cbiAgICBpdCBcImluY3JlbWVudCAyIGNoYXJcIiwgLT5cbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcIkFDXCIpKS50b0VxdWFsKFwiQURcIilcbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcIkVaXCIpKS50b0VxdWFsKFwiRkFcIilcbiAgICAgIGV4cGVjdCh1dGlscy5pbmNyZW1lbnRDaGFycyhcIlpaXCIpKS50b0VxdWFsKFwiQUFBXCIpXG5cbiAgZGVzY3JpYmUgXCIuc2x1Z2l6ZVwiLCAtPlxuICAgIGl0IFwic2x1Z2l6ZSBzdHJpbmdcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcImhlbGxvIHdvcmxkIVwiXG4gICAgICBleHBlY3QodXRpbHMuc2x1Z2l6ZShmaXh0dXJlKSkudG9FcXVhbChcImhlbGxvLXdvcmxkXCIpXG4gICAgICBmaXh0dXJlID0gXCJoZWxsby13b3JsZFwiXG4gICAgICBleHBlY3QodXRpbHMuc2x1Z2l6ZShmaXh0dXJlKSkudG9FcXVhbChcImhlbGxvLXdvcmxkXCIpXG4gICAgICBmaXh0dXJlID0gXCIgaGVsbG8gICAgIFdvcmxkXCJcbiAgICAgIGV4cGVjdCh1dGlscy5zbHVnaXplKGZpeHR1cmUpKS50b0VxdWFsKFwiaGVsbG8td29ybGRcIilcblxuICAgIGl0IFwic2x1Z2l6ZSBjaGluZXNlXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCLkuK3mlofkuZ/lj6/ku6VcIlxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUoZml4dHVyZSkpLnRvRXF1YWwoXCLkuK3mlofkuZ/lj6/ku6VcIilcbiAgICAgIGZpeHR1cmUgPSBcIuS4reaWh++8muS5n+WPr+S7pVwiXG4gICAgICBleHBlY3QodXRpbHMuc2x1Z2l6ZShmaXh0dXJlKSkudG9FcXVhbChcIuS4reaWh++8muS5n+WPr+S7pVwiKVxuICAgICAgZml4dHVyZSA9IFwiIOOAjOS4reaWh+OAjSAg44CO5Lmf5Y+v5Lul44CPXCJcbiAgICAgIGV4cGVjdCh1dGlscy5zbHVnaXplKGZpeHR1cmUpKS50b0VxdWFsKFwi44CM5Lit5paH44CNLeOAjuS5n+WPr+S7peOAj1wiKVxuXG4gICAgaXQgXCJzbHVnaXplIGVtcHR5IHN0cmluZ1wiLCAtPlxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUodW5kZWZpbmVkKSkudG9FcXVhbChcIlwiKVxuICAgICAgZXhwZWN0KHV0aWxzLnNsdWdpemUoXCJcIikpLnRvRXF1YWwoXCJcIilcblxuICBkZXNjcmliZSBcIi5nZXRQYWNrYWdlUGF0aFwiLCAtPlxuICAgIGl0IFwiZ2V0IHRoZSBwYWNrYWdlIHBhdGhcIiwgLT5cbiAgICAgIHJvb3QgPSBhdG9tLnBhY2thZ2VzLnJlc29sdmVQYWNrYWdlUGF0aChcIm1hcmtkb3duLXdyaXRlclwiKVxuICAgICAgZXhwZWN0KHV0aWxzLmdldFBhY2thZ2VQYXRoKCkpLnRvRXF1YWwocm9vdClcblxuICAgIGl0IFwiZ2V0IHRoZSBwYXRoIHRvIHBhY2thZ2UgZmlsZVwiLCAtPlxuICAgICAgcm9vdCA9IGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKFwibWFya2Rvd24td3JpdGVyXCIpXG4gICAgICBjaGVhdHNoZWV0UGF0aCA9IHBhdGguam9pbihyb290LCBcIkNIRUFUU0hFRVQubWRcIilcbiAgICAgIGV4cGVjdCh1dGlscy5nZXRQYWNrYWdlUGF0aChcIkNIRUFUU0hFRVQubWRcIikpLnRvRXF1YWwoY2hlYXRzaGVldFBhdGgpXG5cbiAgZGVzY3JpYmUgXCIuZ2V0QWJzb2x1dGVQYXRoXCIsIC0+XG4gICAgaXQgXCJleHBhbmQgfiB0byBob21lZGlyXCIsIC0+XG4gICAgICBhYnNQYXRoID0gdXRpbHMuZ2V0QWJzb2x1dGVQYXRoKHBhdGguam9pbihcIn5cIiwgXCJtYXJrZG93bi13cml0ZXJcIikpXG4gICAgICBleHBlY3QoYWJzUGF0aCkudG9FcXVhbChwYXRoLmpvaW4odXRpbHMuZ2V0SG9tZWRpcigpLCBcIm1hcmtkb3duLXdyaXRlclwiKSlcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUZW1wbGF0ZVxuI1xuXG4gIGRlc2NyaWJlIFwiLnRlbXBsYXRlXCIsIC0+XG4gICAgaXQgXCJnZW5lcmF0ZSB0ZW1wbGF0ZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiPGEgaHJlZj0nJz5oZWxsbyA8dGl0bGU+ISA8ZnJvbT48L2E+XCJcbiAgICAgIGV4cGVjdCh1dGlscy50ZW1wbGF0ZShmaXh0dXJlLCB0aXRsZTogXCJ3b3JsZFwiLCBmcm9tOiBcIm1hcmtkb3duLXdyaXRlclwiKSlcbiAgICAgICAgLnRvRXF1YWwoXCI8YSBocmVmPScnPmhlbGxvIHdvcmxkISBtYXJrZG93bi13cml0ZXI8L2E+XCIpXG5cbiAgICBpdCBcImdlbmVyYXRlIHRlbXBsYXRlIHdpdGggZGF0YSBtaXNzaW5nXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCI8YSBocmVmPSc8dXJsPicgdGl0bGU9Jzx0aXRsZT4nPjxpbWc+PC9hPlwiXG4gICAgICBleHBlY3QodXRpbHMudGVtcGxhdGUoZml4dHVyZSwgdXJsOiBcIi8vXCIsIHRpdGxlOiAnJykpXG4gICAgICAgIC50b0VxdWFsKFwiPGEgaHJlZj0nLy8nIHRpdGxlPScnPjxpbWc+PC9hPlwiKVxuXG4gIGRlc2NyaWJlIFwiLnVudGVtcGxhdGVcIiwgLT5cbiAgICBpdCBcImdlbmVyYXRlIHVudGVtcGxhdGUgZm9yIG5vcm1hbCB0ZXh0XCIsIC0+XG4gICAgICBmbiA9IHV0aWxzLnVudGVtcGxhdGUoXCJ0ZXh0XCIpXG4gICAgICBleHBlY3QoZm4oXCJ0ZXh0XCIpKS50b0VxdWFsKF86IFwidGV4dFwiKVxuICAgICAgZXhwZWN0KGZuKFwiYWJjXCIpKS50b0VxdWFsKHVuZGVmaW5lZClcblxuICAgIGl0IFwiZ2VuZXJhdGUgdW50ZW1wbGF0ZSBmb3IgdGVtcGxhdGVcIiwgLT5cbiAgICAgIGZuID0gdXRpbHMudW50ZW1wbGF0ZShcInt5ZWFyfS17bW9udGh9XCIpXG4gICAgICBleHBlY3QoZm4oXCIyMDE2LTExLTEyXCIpKS50b0VxdWFsKHVuZGVmaW5lZClcbiAgICAgIGV4cGVjdChmbihcIjIwMTYtMDFcIikpLnRvRXF1YWwoXzogXCIyMDE2LTAxXCIsIHllYXI6IFwiMjAxNlwiLCBtb250aDogXCIwMVwiKVxuXG4gICAgaXQgXCJnZW5lcmF0ZSB1bnRlbXBsYXRlIGZvciBjb21wbGV4IHRlbXBsYXRlXCIsIC0+XG4gICAgICBmbiA9IHV0aWxzLnVudGVtcGxhdGUoXCJ7eWVhcn0te21vbnRofS17ZGF5fSB7aG91cn06e21pbnV0ZX1cIilcbiAgICAgIGV4cGVjdChmbihcIjIwMTYtMTEtMTJcIikpLnRvRXF1YWwodW5kZWZpbmVkKVxuICAgICAgZXhwZWN0KGZuKFwiMjAxNi0wMS0wMyAxMjoxOVwiKSkudG9FcXVhbChcbiAgICAgICAgXzogXCIyMDE2LTAxLTAzIDEyOjE5XCIsIHllYXI6IFwiMjAxNlwiLCBtb250aDogXCIwMVwiLFxuICAgICAgICBkYXk6IFwiMDNcIiwgaG91cjogXCIxMlwiLCBtaW51dGU6IFwiMTlcIilcblxuICAgIGl0IFwiZ2VuZXJhdGUgdW50ZW1wbGF0ZSBmb3IgdGVtcGxhdGUgd2l0aCByZWdleCBjaGFyc1wiLCAtPlxuICAgICAgZm4gPSB1dGlscy51bnRlbXBsYXRlKFwiW3t5ZWFyfS17bW9udGh9LXtkYXl9XSAtIHtob3VyfTp7bWludXRlfVwiKVxuICAgICAgZXhwZWN0KGZuKFwiMjAxNi0xMS0xMlwiKSkudG9FcXVhbCh1bmRlZmluZWQpXG4gICAgICBleHBlY3QoZm4oXCJbMjAxNi0wMS0wM10gLSAxMjoxOVwiKSkudG9FcXVhbChcbiAgICAgICAgXzogXCJbMjAxNi0wMS0wM10gLSAxMjoxOVwiLCB5ZWFyOiBcIjIwMTZcIiwgbW9udGg6IFwiMDFcIixcbiAgICAgICAgZGF5OiBcIjAzXCIsIGhvdXI6IFwiMTJcIiwgbWludXRlOiBcIjE5XCIpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgRGF0ZSBhbmQgVGltZVxuI1xuXG4gIGRlc2NyaWJlIFwiLnBhcnNlRGF0ZVwiLCAtPlxuICAgIGl0IFwicGFyc2UgZGF0ZSBkYXNoZWQgc3RyaW5nXCIsIC0+XG4gICAgICBkYXRlID0gdXRpbHMuZ2V0RGF0ZSgpXG4gICAgICBwYXJzZURhdGUgPSB1dGlscy5wYXJzZURhdGUoZGF0ZSlcbiAgICAgIGV4cGVjdChwYXJzZURhdGUpLnRvRXF1YWwoZGF0ZSlcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBJbWFnZSBIVE1MIFRhZ1xuI1xuXG4gIGl0IFwiY2hlY2sgaXMgdmFsaWQgaHRtbCBpbWFnZSB0YWdcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJcIlwiXG4gICAgPGltZyBhbHQ9XCJhbHRcIiBzcmM9XCJzcmMucG5nXCIgY2xhc3M9XCJhbGlnbmNlbnRlclwiIGhlaWdodD1cIjMwNFwiIHdpZHRoPVwiNTIwXCI+XG4gICAgXCJcIlwiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2VUYWcoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBpdCBcImNoZWNrIHBhcnNlIHZhbGlkIGh0bWwgaW1hZ2UgdGFnXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiXCJcIlxuICAgIDxpbWcgYWx0PVwiYWx0XCIgc3JjPVwic3JjLnBuZ1wiIGNsYXNzPVwiYWxpZ25jZW50ZXJcIiBoZWlnaHQ9XCIzMDRcIiB3aWR0aD1cIjUyMFwiPlxuICAgIFwiXCJcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUltYWdlVGFnKGZpeHR1cmUpKS50b0VxdWFsXG4gICAgICBhbHQ6IFwiYWx0XCIsIHNyYzogXCJzcmMucG5nXCIsXG4gICAgICBjbGFzczogXCJhbGlnbmNlbnRlclwiLCBoZWlnaHQ6IFwiMzA0XCIsIHdpZHRoOiBcIjUyMFwiXG5cbiAgaXQgXCJjaGVjayBwYXJzZSB2YWxpZCBodG1sIGltYWdlIHRhZyB3aXRoIHRpdGxlXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiXCJcIlxuICAgIDxpbWcgdGl0bGU9XCJcIiBzcmM9XCJzcmMucG5nXCIgY2xhc3M9XCJhbGlnbmNlbnRlclwiIGhlaWdodD1cIjMwNFwiIHdpZHRoPVwiNTIwXCIgLz5cbiAgICBcIlwiXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbWFnZVRhZyhmaXh0dXJlKSkudG9FcXVhbFxuICAgICAgdGl0bGU6IFwiXCIsIHNyYzogXCJzcmMucG5nXCIsXG4gICAgICBjbGFzczogXCJhbGlnbmNlbnRlclwiLCBoZWlnaHQ6IFwiMzA0XCIsIHdpZHRoOiBcIjUyMFwiXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgSW1hZ2VcbiNcblxuICBpdCBcImNoZWNrIGlzIG5vdCB2YWxpZCBpbWFnZVwiLCAtPlxuICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMuaXNJbWFnZShmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICBpdCBcImNoZWNrIGlzIHZhbGlkIGltYWdlXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiIVtdKHVybClcIlxuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgZml4dHVyZSA9ICchW10odXJsIFwidGl0bGVcIiknXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2UoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICBmaXh0dXJlID0gXCIhW3RleHRdKClcIlxuICAgIGV4cGVjdCh1dGlscy5pc0ltYWdlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgZml4dHVyZSA9IFwiIVt0ZXh0XSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMuaXNJbWFnZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgIGZpeHR1cmUgPSBcIiFbdGV4dF0odXJsICd0aXRsZScpXCJcbiAgICBleHBlY3QodXRpbHMuaXNJbWFnZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gIGl0IFwicGFyc2UgdmFsaWQgaW1hZ2VcIiwgLT5cbiAgICBmaXh0dXJlID0gXCIhW3RleHRdKHVybClcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUltYWdlKGZpeHR1cmUpKS50b0VxdWFsXG4gICAgICBhbHQ6IFwidGV4dFwiLCBzcmM6IFwidXJsXCIsIHRpdGxlOiBcIlwiXG5cbiAgaXQgXCJjaGVjayBpcyB2YWxpZCBpbWFnZSBmaWxlXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiZml4dHVyZXMvYWJjLmpwZ1wiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2VGaWxlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgZml4dHVyZSA9IFwiZml4dHVyZXMvYWJjLnR4dFwiXG4gICAgZXhwZWN0KHV0aWxzLmlzSW1hZ2VGaWxlKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jIExpbmtcbiNcblxuICBkZXNjcmliZSBcIi5pc0lubGluZUxpbmtcIiwgLT5cbiAgICBpdCBcImNoZWNrIGlzIHRleHQgaW52YWxpZCBpbmxpbmUgbGlua1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiIVt0ZXh0XSh1cmwpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG4gICAgICBmaXh0dXJlID0gXCJbdGV4dF1bXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiWyFbXShpbWFnZS5wbmcpXVtpZF1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW2ltYWdlIHRpdGxlXShpbWFnZS5wbmcpXVtpZF1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCB2YWxpZCBpbmxpbmUgbGlua1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdKClcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdKHVybClcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdKHVybCB0aXRsZSlcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdKHVybCAndGl0bGUnKVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICAjIGxpbmsgaW4gbGluayB0ZXh0IGlzIGludmFsaWQgc2VtYW50aWMsIGJ1dCBpdCBjb250YWlucyBvbmUgdmFsaWQgbGlua1xuICAgICAgZml4dHVyZSA9IFwiW1tsaW5rXShpbl9hbm90aGVyX2xpbmspXVtdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgaW1hZ2UgbGluayB2YWxpZCBpbmxpbmsgbGlua1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiWyFbXShpbWFnZS5wbmcpXSh1cmwpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldKHVybClcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzSW5saW5lTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiWyFbdGV4dF0oaW1hZ2UucG5nKV0odXJsICd0aXRsZScpXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0lubGluZUxpbmsoZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBpdCBcInBhcnNlIHZhbGlkIGlubGluZSBsaW5rIHRleHRcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJbdGV4dF0oKVwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW5saW5lTGluayhmaXh0dXJlKSkudG9FcXVhbChcbiAgICAgIHt0ZXh0OiBcInRleHRcIiwgdXJsOiBcIlwiLCB0aXRsZTogXCJcIn0pXG4gICAgZml4dHVyZSA9IFwiW3RleHRdKHVybClcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUlubGluZUxpbmsoZml4dHVyZSkpLnRvRXF1YWwoXG4gICAgICB7dGV4dDogXCJ0ZXh0XCIsIHVybDogXCJ1cmxcIiwgdGl0bGU6IFwiXCJ9KVxuICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwgdGl0bGUpXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0VxdWFsKFxuICAgICAge3RleHQ6IFwidGV4dFwiLCB1cmw6IFwidXJsXCIsIHRpdGxlOiBcInRpdGxlXCJ9KVxuICAgIGZpeHR1cmUgPSBcIlt0ZXh0XSh1cmwgJ3RpdGxlJylcIlxuICAgIGV4cGVjdCh1dGlscy5wYXJzZUlubGluZUxpbmsoZml4dHVyZSkpLnRvRXF1YWwoXG4gICAgICB7dGV4dDogXCJ0ZXh0XCIsIHVybDogXCJ1cmxcIiwgdGl0bGU6IFwidGl0bGVcIn0pXG5cbiAgaXQgXCJwYXJzZSB2YWxpZCBpbWFnZSB0ZXh0IGlubGluZSBsaW5rXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiWyFbXShpbWFnZS5wbmcpXSh1cmwpXCJcbiAgICBleHBlY3QodXRpbHMucGFyc2VJbmxpbmVMaW5rKGZpeHR1cmUpKS50b0VxdWFsKFxuICAgICAge3RleHQ6IFwiIVtdKGltYWdlLnBuZylcIiwgdXJsOiBcInVybFwiLCB0aXRsZTogXCJcIn0pXG4gICAgZml4dHVyZSA9IFwiWyFbdGV4dF0oaW1hZ2UucG5nKV0odXJsKVwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW5saW5lTGluayhmaXh0dXJlKSkudG9FcXVhbChcbiAgICAgIHt0ZXh0OiBcIiFbdGV4dF0oaW1hZ2UucG5nKVwiLCB1cmw6IFwidXJsXCIsIHRpdGxlOiBcIlwifSlcbiAgICBmaXh0dXJlID0gXCJbIVt0ZXh0XShpbWFnZS5wbmcgJ3RpdGxlJyldKHVybCAndGl0bGUnKVwiXG4gICAgZXhwZWN0KHV0aWxzLnBhcnNlSW5saW5lTGluayhmaXh0dXJlKSkudG9FcXVhbChcbiAgICAgIHt0ZXh0OiBcIiFbdGV4dF0oaW1hZ2UucG5nICd0aXRsZScpXCIsIHVybDogXCJ1cmxcIiwgdGl0bGU6IFwidGl0bGVcIn0pXG5cbiAgZGVzY3JpYmUgXCIuaXNSZWZlcmVuY2VMaW5rXCIsIC0+XG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IGludmFsaWQgcmVmZXJlbmNlIGxpbmtcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIiFbdGV4dF0odXJsKVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VMaW5rKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdKGhhcylcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIltdW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW10oaW1hZ2UucG5nKV1bXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VMaW5rKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiWyFbdGV4dF0oaW1hZ2UucG5nKV1bXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VMaW5rKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IHZhbGlkIHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbdGV4dF1bXVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VMaW5rKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJbdGV4dF1baWQgd2l0aCBzcGFjZV1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IHZhbGlkIGltYWdlIHJlZmVyZW5jZSBsaW5rXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbIVtdKGltYWdlLnBuZyldW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW3RleHRdKGltYWdlLnBuZyldW11cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZShmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIlshW10oaW1hZ2UucG5nKV1baWQgd2l0aCBzcGFjZV1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiWyFbdGV4dF0oaW1hZ2UucG5nKV1baWQgd2l0aCBzcGFjZV1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzUmVmZXJlbmNlTGluayhmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwiLnBhcnNlUmVmZXJlbmNlTGlua1wiLCAtPlxuICAgIGVkaXRvciA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwiZW1wdHkubWFya2Rvd25cIilcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICBUcmFuc2Zvcm0geW91ciBwbGFpbiBbdGV4dF1bXSBpbnRvIHN0YXRpYyB3ZWJzaXRlcyBhbmQgYmxvZ3MuXG5cbiAgICAgICAgW3RleHRdOiBodHRwOi8vd3d3Lmpla3lsbC5jb21cbiAgICAgICAgW2lkXTogaHR0cDovL2pla3lsbC5jb20gXCJKZWt5bGwgV2Vic2l0ZVwiXG5cbiAgICAgICAgTWFya2Rvd24gKG9yIFRleHRpbGUpLCBMaXF1aWQsIEhUTUwgJiBDU1MgZ28gaW4gW0pla3lsbF1baWRdLlxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwicGFyc2UgdmFsaWQgcmVmZXJlbmNlIGxpbmsgdGV4dCB3aXRob3V0IGlkXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbdGV4dF1bXVwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VSZWZlcmVuY2VMaW5rKGZpeHR1cmUsIGVkaXRvcikpLnRvRXF1YWxcbiAgICAgICAgaWQ6IFwidGV4dFwiLCB0ZXh0OiBcInRleHRcIiwgdXJsOiBcImh0dHA6Ly93d3cuamVreWxsLmNvbVwiLCB0aXRsZTogXCJcIlxuICAgICAgICBkZWZpbml0aW9uUmFuZ2U6IHtzdGFydDoge3JvdzogMiwgY29sdW1uOiAwfSwgZW5kOiB7cm93OiAyLCBjb2x1bW46IDI5fX1cblxuICAgIGl0IFwicGFyc2UgdmFsaWQgcmVmZXJlbmNlIGxpbmsgdGV4dCB3aXRoIGlkXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbSmVreWxsXVtpZF1cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlUmVmZXJlbmNlTGluayhmaXh0dXJlLCBlZGl0b3IpKS50b0VxdWFsXG4gICAgICAgIGlkOiBcImlkXCIsIHRleHQ6IFwiSmVreWxsXCIsIHVybDogXCJodHRwOi8vamVreWxsLmNvbVwiLCB0aXRsZTogXCJKZWt5bGwgV2Vic2l0ZVwiXG4gICAgICAgIGRlZmluaXRpb25SYW5nZToge3N0YXJ0OiB7cm93OiAzLCBjb2x1bW46IDB9LCBlbmQ6IHtyb3c6IDMsIGNvbHVtbjogNDB9fVxuXG4gICAgaXQgXCJwYXJzZSBvcnBoYW4gcmVmZXJlbmNlIGxpbmsgdGV4dFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW0pla3lsbF1bamVreWxsXVwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VSZWZlcmVuY2VMaW5rKGZpeHR1cmUsIGVkaXRvcikpLnRvRXF1YWxcbiAgICAgICAgaWQ6IFwiamVreWxsXCIsIHRleHQ6IFwiSmVreWxsXCIsIHVybDogXCJcIiwgdGl0bGU6IFwiXCIsIGRlZmluaXRpb25SYW5nZTogbnVsbFxuXG4gIGRlc2NyaWJlIFwiLmlzUmVmZXJlbmNlRGVmaW5pdGlvblwiLCAtPlxuICAgIGl0IFwiY2hlY2sgaXMgdGV4dCBpbnZhbGlkIHJlZmVyZW5jZSBkZWZpbml0aW9uXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbdGV4dF0gaHR0cFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VEZWZpbml0aW9uKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiW150ZXh0XTogaHR0cFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VEZWZpbml0aW9uKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IHZhbGlkIHJlZmVyZW5jZSBkZWZpbml0aW9uXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbdGV4dCB0ZXh0XTogaHR0cFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNSZWZlcmVuY2VEZWZpbml0aW9uKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGlzIHRleHQgdmFsaWQgcmVmZXJlbmNlIGRlZmluaXRpb24gd2l0aCB0aXRsZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiICBbdGV4dF06IGh0dHAgJ3RpdGxlIG5vdCBpbiBkb3VibGUgcXVvdGUnXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1JlZmVyZW5jZURlZmluaXRpb24oZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi5wYXJzZVJlZmVyZW5jZURlZmluaXRpb25cIiwgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcImVtcHR5Lm1hcmtkb3duXCIpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgVHJhbnNmb3JtIHlvdXIgcGxhaW4gW3RleHRdW10gaW50byBzdGF0aWMgd2Vic2l0ZXMgYW5kIGJsb2dzLlxuXG4gICAgICAgIFt0ZXh0XTogaHR0cDovL3d3dy5qZWt5bGwuY29tXG4gICAgICAgIFtpZF06IGh0dHA6Ly9qZWt5bGwuY29tIFwiSmVreWxsIFdlYnNpdGVcIlxuXG4gICAgICAgIE1hcmtkb3duIChvciBUZXh0aWxlKSwgTGlxdWlkLCBIVE1MICYgQ1NTIGdvIGluIFtKZWt5bGxdW2lkXS5cbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInBhcnNlIHZhbGlkIHJlZmVyZW5jZSBkZWZpbml0aW9uIHRleHQgd2l0aG91dCBpZFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdOiBodHRwOi8vd3d3Lmpla3lsbC5jb21cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvbihmaXh0dXJlLCBlZGl0b3IpKS50b0VxdWFsXG4gICAgICAgIGlkOiBcInRleHRcIiwgdGV4dDogXCJ0ZXh0XCIsIHVybDogXCJodHRwOi8vd3d3Lmpla3lsbC5jb21cIiwgdGl0bGU6IFwiXCJcbiAgICAgICAgbGlua1JhbmdlOiB7c3RhcnQ6IHtyb3c6IDAsIGNvbHVtbjogMjF9LCBlbmQ6IHtyb3c6IDAsIGNvbHVtbjogMjl9fVxuXG4gICAgaXQgXCJwYXJzZSB2YWxpZCByZWZlcmVuY2UgZGVmaW5pdGlvbiB0ZXh0IHdpdGggaWRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIltpZF06IGh0dHA6Ly9qZWt5bGwuY29tIFxcXCJKZWt5bGwgV2Vic2l0ZVxcXCJcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlUmVmZXJlbmNlRGVmaW5pdGlvbihmaXh0dXJlLCBlZGl0b3IpKS50b0VxdWFsXG4gICAgICAgIGlkOiBcImlkXCIsIHRleHQ6IFwiSmVreWxsXCIsIHVybDogXCJodHRwOi8vamVreWxsLmNvbVwiLCB0aXRsZTogXCJKZWt5bGwgV2Vic2l0ZVwiXG4gICAgICAgIGxpbmtSYW5nZToge3N0YXJ0OiB7cm93OiA1LCBjb2x1bW46IDQ4fSwgZW5kOiB7cm93OiA1LCBjb2x1bW46IDYwfX1cblxuICAgIGl0IFwicGFyc2Ugb3JwaGFuIHJlZmVyZW5jZSBkZWZpbml0aW9uIHRleHRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIltqZWt5bGxdOiBodHRwOi8vamVreWxsLmNvbSBcXFwiSmVreWxsIFdlYnNpdGVcXFwiXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVJlZmVyZW5jZURlZmluaXRpb24oZml4dHVyZSwgZWRpdG9yKSkudG9FcXVhbFxuICAgICAgICBpZDogXCJqZWt5bGxcIiwgdGV4dDogXCJcIiwgdXJsOiBcImh0dHA6Ly9qZWt5bGwuY29tXCIsIHRpdGxlOiBcIkpla3lsbCBXZWJzaXRlXCIsXG4gICAgICAgIGxpbmtSYW5nZTogbnVsbFxuXG4gIGRlc2NyaWJlIFwiLmlzRm9vdG5vdGVcIiwgLT5cbiAgICBpdCBcImNoZWNrIGlzIHRleHQgaW52YWxpZCBmb290bm90ZVwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiW3RleHRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0Zvb3Rub3RlKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuICAgICAgZml4dHVyZSA9IFwiIVthYmNdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0Zvb3Rub3RlKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0ZXh0IHZhbGlkIGZvb3Rub3RlXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbXjFdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0Zvb3Rub3RlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJbXnRleHRdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc0Zvb3Rub3RlKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJbXnRleHQgdGV4dF1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzRm9vdG5vdGUoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIlteMTJdOlwiXG4gICAgICBleHBlY3QodXRpbHMuaXNGb290bm90ZShmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gIGRlc2NyaWJlIFwiLnBhcnNlRm9vdG5vdGVcIiwgLT5cbiAgICBpdCBcInBhcnNlIHZhbGlkIGZvb3Rub3RlXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJbXjFdXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZUZvb3Rub3RlKGZpeHR1cmUpKS50b0VxdWFsKGxhYmVsOiBcIjFcIiwgY29udGVudDogXCJcIiwgaXNEZWZpbml0aW9uOiBmYWxzZSlcbiAgICAgIGZpeHR1cmUgPSBcIltedGV4dF06IFwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VGb290bm90ZShmaXh0dXJlKSkudG9FcXVhbChsYWJlbDogXCJ0ZXh0XCIsIGNvbnRlbnQ6IFwiXCIsIGlzRGVmaW5pdGlvbjogdHJ1ZSlcblxuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyBUYWJsZVxuI1xuXG4gIGRlc2NyaWJlIFwiLmlzVGFibGVTZXBhcmF0b3JcIiwgLT5cbiAgICBpdCBcImNoZWNrIGlzIHRhYmxlIHNlcGFyYXRvclwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiLS0tLXxcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGZpeHR1cmUgPSBcIi0tLS18IFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiLS18LS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcInwtLXxcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIi18LS18LSBcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcIi0tLS0gfC0tLS0tLSB8IC0tLVwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9CZSh0cnVlKVxuXG4gICAgaXQgXCJjaGVjayBpcyB0YWJsZSBzZXBhcmF0b3Igd2l0aCBleHRyYSBwaXBlc1wiLCAtPlxuICAgICAgZml4dHVyZSA9IFwifC0tLS0tXCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKGZhbHNlKVxuXG4gICAgICBmaXh0dXJlID0gXCJ8LS18LS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICAgIGZpeHR1cmUgPSBcInwtLS0tIHwtLS0tLS0gfCAtLS18XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgICBpdCBcImNoZWNrIGlzIHRhYmxlIHNlcGFyYXRvciB3aXRoIGZvcm1hdFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwiOi0tICB8OjotLS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGZpeHR1cmUgPSBcInw6LS0tOiB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCI6LS18LS06XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG4gICAgICBmaXh0dXJlID0gXCJ8Oi0tLTogfDotLS0tLSB8IC0tOiB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5pc1RhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0JlKHRydWUpXG5cbiAgZGVzY3JpYmUgXCIucGFyc2VUYWJsZVNlcGFyYXRvclwiLCAtPlxuICAgIGl0IFwicGFyc2UgdGFibGUgc2VwYXJhdG9yXCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJ8LS0tLXxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogdHJ1ZVxuICAgICAgICBhbGlnbm1lbnRzOiBbXCJlbXB0eVwiXVxuICAgICAgICBjb2x1bW5zOiBbXCItLS0tXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzRdfSlcblxuICAgICAgZml4dHVyZSA9IFwiLS18LS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVTZXBhcmF0b3IoZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IHRydWVcbiAgICAgICAgZXh0cmFQaXBlczogZmFsc2VcbiAgICAgICAgYWxpZ25tZW50czogW1wiZW1wdHlcIiwgXCJlbXB0eVwiXVxuICAgICAgICBjb2x1bW5zOiBbXCItLVwiLCBcIi0tXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzIsIDJdfSlcblxuICAgICAgZml4dHVyZSA9IFwiLXwtLXwtLXwgXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImVtcHR5XCIsIFwiZW1wdHlcIiwgXCJlbXB0eVwiLCBcImVtcHR5XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIi1cIiwgXCItLVwiLCBcIi0tXCIsIFwiXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzEsIDIsIDIsIDBdfSlcblxuICAgICAgZml4dHVyZSA9IFwiLS0tLSB8LS0tLS0tIHwgLS0tXCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImVtcHR5XCIsIFwiZW1wdHlcIiwgXCJlbXB0eVwiXVxuICAgICAgICBjb2x1bW5zOiBbXCItLS0tXCIsIFwiLS0tLS0tXCIsIFwiLS0tXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzQsIDYsIDNdfSlcblxuICAgIGl0IFwicGFyc2UgdGFibGUgc2VwYXJhdG9yIHdpdGggZXh0cmEgcGlwZXNcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcInwtLXwtLVwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VUYWJsZVNlcGFyYXRvcihmaXh0dXJlKSkudG9FcXVhbCh7XG4gICAgICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgICAgICBleHRyYVBpcGVzOiB0cnVlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImVtcHR5XCIsIFwiZW1wdHlcIl1cbiAgICAgICAgY29sdW1uczogW1wiLS1cIiwgXCItLVwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFsyLCAyXX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcInwtLS0tIHwtLS0tLS0gfCAtLS18XCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgYWxpZ25tZW50czogW1wiZW1wdHlcIiwgXCJlbXB0eVwiLCBcImVtcHR5XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIi0tLS1cIiwgXCItLS0tLS1cIiwgXCItLS1cIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbNCwgNiwgM119KVxuXG4gICAgaXQgXCJwYXJzZSB0YWJsZSBzZXBhcmF0b3Igd2l0aCBmb3JtYXRcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIjotfC06fDo6XCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImxlZnRcIiwgXCJyaWdodFwiLCBcImNlbnRlclwiXVxuICAgICAgICBjb2x1bW5zOiBbXCI6LVwiLCBcIi06XCIsIFwiOjpcIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbMiwgMiwgMl19KVxuXG4gICAgICBmaXh0dXJlID0gXCI6LS18LS06XCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImxlZnRcIiwgXCJyaWdodFwiXVxuICAgICAgICBjb2x1bW5zOiBbXCI6LS1cIiwgXCItLTpcIl1cbiAgICAgICAgY29sdW1uV2lkdGhzOiBbMywgM119KVxuXG4gICAgICBmaXh0dXJlID0gXCJ8Oi0tLTogfDotLS0tLSB8IC0tOiB8XCJcbiAgICAgIGV4cGVjdCh1dGlscy5wYXJzZVRhYmxlU2VwYXJhdG9yKGZpeHR1cmUpKS50b0VxdWFsKHtcbiAgICAgICAgc2VwYXJhdG9yOiB0cnVlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgYWxpZ25tZW50czogW1wiY2VudGVyXCIsIFwibGVmdFwiLCBcInJpZ2h0XCJdXG4gICAgICAgIGNvbHVtbnM6IFtcIjotLS06XCIsIFwiOi0tLS0tXCIsIFwiLS06XCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzUsIDYsIDNdfSlcblxuICBkZXNjcmliZSBcIi5pc1RhYmxlUm93XCIsIC0+XG4gICAgaXQgXCJjaGVjayB0YWJsZSBzZXBhcmF0b3IgaXMgYSB0YWJsZSByb3dcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcIjotLSAgfDotLS1cIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVSb3coZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICAgIGl0IFwiY2hlY2sgaXMgdGFibGUgcm93XCIsIC0+XG4gICAgICBmaXh0dXJlID0gXCJ8IGVtcHR5IGNvbnRlbnQgfFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVJvdyhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwiYWJjfGZlZ1wiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVJvdyhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwifCAgIGFiYyB8ZWZnIHwgfFwiXG4gICAgICBleHBlY3QodXRpbHMuaXNUYWJsZVJvdyhmaXh0dXJlKSkudG9CZSh0cnVlKVxuICAgICAgZml4dHVyZSA9IFwifCBhYmN8ZWZnIHwgfCBcIlxuICAgICAgZXhwZWN0KHV0aWxzLmlzVGFibGVSb3coZml4dHVyZSkpLnRvQmUodHJ1ZSlcblxuICBkZXNjcmliZSBcIi5wYXJzZVRhYmxlUm93XCIsIC0+XG4gICAgaXQgXCJwYXJzZSB0YWJsZSBzZXBhcmF0b3IgYnkgdGFibGUgcm93IFwiLCAtPlxuICAgICAgZml4dHVyZSA9IFwifDotLS06IHw6LS0tLS0gfCAtLTogfFwiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VUYWJsZVJvdyhmaXh0dXJlKSkudG9FcXVhbCh7XG4gICAgICAgIHNlcGFyYXRvcjogdHJ1ZVxuICAgICAgICBleHRyYVBpcGVzOiB0cnVlXG4gICAgICAgIGFsaWdubWVudHM6IFtcImNlbnRlclwiLCBcImxlZnRcIiwgXCJyaWdodFwiXVxuICAgICAgICBjb2x1bW5zOiBbXCI6LS0tOlwiLCBcIjotLS0tLVwiLCBcIi0tOlwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFs1LCA2LCAzXX0pXG5cbiAgICBpdCBcInBhcnNlIHRhYmxlIHJvdyBcIiwgLT5cbiAgICAgIGZpeHR1cmUgPSBcInwg5Lit5paHIHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IGZhbHNlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgY29sdW1uczogW1wi5Lit5paHXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzRdfSlcblxuICAgICAgZml4dHVyZSA9IFwiYWJjfGZlZ1wiXG4gICAgICBleHBlY3QodXRpbHMucGFyc2VUYWJsZVJvdyhmaXh0dXJlKSkudG9FcXVhbCh7XG4gICAgICAgIHNlcGFyYXRvcjogZmFsc2VcbiAgICAgICAgZXh0cmFQaXBlczogZmFsc2VcbiAgICAgICAgY29sdW1uczogW1wiYWJjXCIsIFwiZmVnXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzMsIDNdfSlcblxuICAgICAgZml4dHVyZSA9IFwiYWJjfCBcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IGZhbHNlXG4gICAgICAgIGV4dHJhUGlwZXM6IGZhbHNlXG4gICAgICAgIGNvbHVtbnM6IFtcImFiY1wiLCBcIlwiXVxuICAgICAgICBjb2x1bW5XaWR0aHM6IFszLCAwXX0pXG5cbiAgICAgIGZpeHR1cmUgPSBcInwgICBhYmMgfGVmZyB8IHxcIlxuICAgICAgZXhwZWN0KHV0aWxzLnBhcnNlVGFibGVSb3coZml4dHVyZSkpLnRvRXF1YWwoe1xuICAgICAgICBzZXBhcmF0b3I6IGZhbHNlXG4gICAgICAgIGV4dHJhUGlwZXM6IHRydWVcbiAgICAgICAgY29sdW1uczogW1wiYWJjXCIsIFwiZWZnXCIsIFwiXCJdXG4gICAgICAgIGNvbHVtbldpZHRoczogWzMsIDMsIDBdfSlcblxuICBpdCBcImNyZWF0ZSB0YWJsZSBzZXBhcmF0b3JcIiwgLT5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihcbiAgICAgIG51bU9mQ29sdW1uczogMywgZXh0cmFQaXBlczogZmFsc2UsIGNvbHVtbldpZHRoOiAxLCBhbGlnbm1lbnQ6IFwiZW1wdHlcIilcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwiLS18LS0tfC0tXCIpXG5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihcbiAgICAgIG51bU9mQ29sdW1uczogMiwgZXh0cmFQaXBlczogdHJ1ZSwgY29sdW1uV2lkdGg6IDEsIGFsaWdubWVudDogXCJlbXB0eVwiKVxuICAgIGV4cGVjdChyb3cpLnRvRXF1YWwoXCJ8LS0tfC0tLXxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKFxuICAgICAgbnVtT2ZDb2x1bW5zOiAxLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aDogMSwgYWxpZ25tZW50OiBcImxlZnRcIilcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwifDotLXxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlU2VwYXJhdG9yKFxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aHM6IFsyLCAzLCAzXSxcbiAgICAgIGFsaWdubWVudDogXCJsZWZ0XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcInw6LS0tfDotLS0tfDotLS0tfFwiKVxuXG4gICAgcm93ID0gdXRpbHMuY3JlYXRlVGFibGVTZXBhcmF0b3IoXG4gICAgICBudW1PZkNvbHVtbnM6IDQsIGV4dHJhUGlwZXM6IGZhbHNlLCBjb2x1bW5XaWR0aDogMyxcbiAgICAgIGFsaWdubWVudDogXCJsZWZ0XCIsIGFsaWdubWVudHM6IFtcImVtcHR5XCIsIFwicmlnaHRcIiwgXCJjZW50ZXJcIl0pXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIi0tLS18LS0tLTp8Oi0tLTp8Oi0tLVwiKVxuXG4gIGl0IFwiY3JlYXRlIGVtcHR5IHRhYmxlIHJvd1wiLCAtPlxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLFxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBjb2x1bW5XaWR0aDogMSwgYWxpZ25tZW50OiBcImVtcHR5XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIiAgfCAgIHwgIFwiKVxuXG4gICAgcm93ID0gdXRpbHMuY3JlYXRlVGFibGVSb3coW10sXG4gICAgICBudW1PZkNvbHVtbnM6IDMsIGV4dHJhUGlwZXM6IHRydWUsIGNvbHVtbldpZHRoczogWzEsIDIsIDNdLFxuICAgICAgYWxpZ25tZW50OiBcImVtcHR5XCIpXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcInwgICB8ICAgIHwgICAgIHxcIilcblxuICBpdCBcImNyZWF0ZSB0YWJsZSByb3dcIiwgLT5cbiAgICByb3cgPSB1dGlscy5jcmVhdGVUYWJsZVJvdyhbXCLkuK3mlodcIiwgXCJFbmdsaXNoXCJdLFxuICAgICAgbnVtT2ZDb2x1bW5zOiAyLCBleHRyYVBpcGVzOiB0cnVlLCBjb2x1bW5XaWR0aHM6IFs0LCA3XSlcbiAgICBleHBlY3Qocm93KS50b0VxdWFsKFwifCDkuK3mlocgfCBFbmdsaXNoIHxcIilcblxuICAgIHJvdyA9IHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtcIuS4reaWh1wiLCBcIkVuZ2xpc2hcIl0sXG4gICAgICBudW1PZkNvbHVtbnM6IDIsIGNvbHVtbldpZHRoczogWzgsIDEwXSwgYWxpZ25tZW50czogW1wicmlnaHRcIiwgXCJjZW50ZXJcIl0pXG4gICAgZXhwZWN0KHJvdykudG9FcXVhbChcIiAgICDkuK3mlocgfCAgRW5nbGlzaCAgXCIpXG5cbiAgaXQgXCJjcmVhdGUgYW4gZW1wdHkgdGFibGVcIiwgLT5cbiAgICByb3dzID0gW11cblxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBjb2x1bW5XaWR0aHM6IFs0LCAxLCA0XSxcbiAgICAgIGFsaWdubWVudHM6IFtcImxlZnRcIiwgXCJjZW50ZXJcIiwgXCJyaWdodFwiXVxuXG4gICAgcm93cy5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSlcbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVTZXBhcmF0b3Iob3B0aW9ucykpXG4gICAgcm93cy5wdXNoKHV0aWxzLmNyZWF0ZVRhYmxlUm93KFtdLCBvcHRpb25zKSlcblxuICAgIGV4cGVjdChyb3dzKS50b0VxdWFsKFtcbiAgICAgIFwiICAgICB8ICAgfCAgICAgXCJcbiAgICAgIFwiOi0tLS18Oi06fC0tLS06XCJcbiAgICAgIFwiICAgICB8ICAgfCAgICAgXCJcbiAgICBdKVxuXG4gIGl0IFwiY3JlYXRlIGFuIGVtcHR5IHRhYmxlIHdpdGggZXh0cmEgcGlwZXNcIiwgLT5cbiAgICByb3dzID0gW11cblxuICAgIG9wdGlvbnMgPVxuICAgICAgbnVtT2ZDb2x1bW5zOiAzLCBleHRyYVBpcGVzOiB0cnVlLFxuICAgICAgY29sdW1uV2lkdGg6IDEsIGFsaWdubWVudDogXCJlbXB0eVwiXG5cbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpKVxuICAgIHJvd3MucHVzaCh1dGlscy5jcmVhdGVUYWJsZVNlcGFyYXRvcihvcHRpb25zKSlcbiAgICByb3dzLnB1c2godXRpbHMuY3JlYXRlVGFibGVSb3coW10sIG9wdGlvbnMpKVxuXG4gICAgZXhwZWN0KHJvd3MpLnRvRXF1YWwoW1xuICAgICAgXCJ8ICAgfCAgIHwgICB8XCJcbiAgICAgIFwifC0tLXwtLS18LS0tfFwiXG4gICAgICBcInwgICB8ICAgfCAgIHxcIlxuICAgIF0pXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgVVJMXG4jXG5cbiAgaXQgXCJjaGVjayBpcyB1cmxcIiwgLT5cbiAgICBmaXh0dXJlID0gXCJodHRwczovL2dpdGh1Yi5jb20vemh1b2NodW4vbWQtd3JpdGVyXCJcbiAgICBleHBlY3QodXRpbHMuaXNVcmwoZml4dHVyZSkpLnRvQmUodHJ1ZSlcbiAgICBmaXh0dXJlID0gXCIvVXNlcnMvemh1b2NodW4vbWQtd3JpdGVyXCJcbiAgICBleHBlY3QodXRpbHMuaXNVcmwoZml4dHVyZSkpLnRvQmUoZmFsc2UpXG5cbiAgaXQgXCJub3JtYWxpemUgZmlsZSBwYXRoXCIsIC0+XG4gICAgZml4dHVyZSA9IFwiaHR0cHM6Ly9naXRodWIuY29tL3podW9jaHVuL21kLXdyaXRlclwiXG4gICAgZXhwZWN0KHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKGZpeHR1cmUpKS50b0VxdWFsKGZpeHR1cmUpXG5cbiAgICBmaXh0dXJlID0gXCJcXFxcZ2l0aHViLmNvbVxcXFx6aHVvY2h1blxcXFxtZC13cml0ZXIuZ2lmXCJcbiAgICBleHBlY3RlZCA9IFwiL2dpdGh1Yi5jb20vemh1b2NodW4vbWQtd3JpdGVyLmdpZlwiXG4gICAgZXhwZWN0KHV0aWxzLm5vcm1hbGl6ZUZpbGVQYXRoKGZpeHR1cmUpKS50b0VxdWFsKGV4cGVjdGVkKVxuICAgIGV4cGVjdCh1dGlscy5ub3JtYWxpemVGaWxlUGF0aChleHBlY3RlZCkpLnRvRXF1YWwoZXhwZWN0ZWQpXG5cbiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgQXRvbSBUZXh0RWRpdG9yXG4jXG4iXX0=
