/*
  NGINX Beautify

  Originally written in Python by Michał Słomkowski
  (https://github.com/1connect/nginx-config-formatter , nginxfmt.py)

  Ported by Yosef (https://github.com/vasilevich/nginxbeautifier/)
  NPM Package by @denvit : https://github.com/denysvitali/
*/
(() => {
    'use strict'
    var extend = require('extend');
    class Beautifier {

        constructor(customOptions) {
            this.INDENTATION = '\t';
            this.NEWLINEAFTERBRACET = true;
            this.options = {
                spaces: 0,
                tabs: 0,
                dontJoinCurlyBracet: true
            };
            extend(this.options, customOptions);
            if (this.options.tabs > 0) {
                this.INDENTATION = "\t".repeat(this.options.tabs);
            }
            if (this.options.spaces > 0) {
                this.INDENTATION = " ".repeat(this.options.spaces);
            }
        }

        parse(string) {
            let fileContents = string
            var cleanLines = this.clean_lines(fileContents);
            if (!this.options.dontJoinCurlyBracet) {
                cleanLines = this.join_opening_bracket(cleanLines);
            }
            cleanLines = this.perform_indentation(cleanLines);
            return cleanLines.join("\n");
        }

        /**
         * Grabs text in between two seperators seperator1 thetextIwant seperator2
         * @param {string} input String to seperate
         * @param {string} seperator1 The first seperator to use
         * @param {string} seperator2 The second seperator to use
         * @return {string}
         */
        extractTextBySeperator(input, seperator1, seperator2) {
            if (seperator2 == undefined)
                seperator2 = seperator1;
            var ret = "";
            var seperator1Regex = new RegExp(seperator1);
            var seperator2Regex = new RegExp(seperator2);
            var catchRegex = new RegExp(seperator1 + "(.*?)" + seperator2);
            if (seperator1Regex.test(input) && seperator2Regex.test(input)) {
                return input.match(catchRegex)[1];
            } else {
                return "";
            }
        }

        /**
         * Grabs text in between two seperators seperator1 thetextIwant seperator2
         * @param {string} input String to seperate
         * @param {string} seperator1 The first seperator to use
         * @param {string} seperator2 The second seperator to use
         * @return {object}
         */
        extractAllPossibleText(input, seperator1, seperator2) {
            if (seperator2 == undefined)
                seperator2 = seperator1;
            var extracted = {};
            var textInBetween = "";
            var cnt = 0;
            while ((textInBetween = this.extractTextBySeperator(input, seperator1, seperator2)) != "") {
                var placeHolder = "#$#%#$#placeholder" + cnt + "#$#%#$#";
                extracted[placeHolder] = seperator1 + textInBetween + seperator2;
                input = input.replace(extracted[placeHolder], placeHolder);
                cnt++;
            }
            return {
                inputHidden: input,
                extracted: extracted,
                getRestored: function() {
                    var textToFix = this.inputHidden;
                    for (var key in extracted) {
                        textToFix = textToFix.replace(key, extracted[key]);
                    }
                    return textToFix;
                }
            };
        }

        /**
         * @param {string} single_line the whole nginx config
         * @return {string} stripped out string without multi spaces
         */
        strip_line(single_line) {
            //"""Strips the line and replaces neighbouring whitespaces with single space (except when within quotation marks)."""
            //trim the line before and after
            var trimmed = single_line.trim();
            //get text without any quatation marks(text foudn with quatation marks is replaced with a placeholder)
            var removedQuatations = this.extractAllPossibleText(trimmed, '"', '"');
            //replace multi spaces with single spaces
            removedQuatations.inputHidden = removedQuatations.inputHidden.replace(/\s\s+/g, ' ');
            //restore anything of quatation marks
            return removedQuatations.getRestored();
        }

        /**
         * @param {string} configContents the whole nginx config
         */
        clean_lines(configContents) {
            var splittedByLines = configContents.split(/\r\n|\r|\n/g);
            //put {  } on their own seperate lines
            //trim the spaces before and after each line
            //trim multi spaces into single spaces
            //trim multi lines into two

            for (var index = 0, newline = 0; index < splittedByLines.length; index++) {
                splittedByLines[index] = splittedByLines[index].trim();
                if (!splittedByLines[index].startsWith("#") && splittedByLines[index] != "") {
                    newline = 0;
                    var line = splittedByLines[index] = this.strip_line(splittedByLines[index]);
                    if (line != "}" && line != "{") {
                        var i = line.indexOf("}")
                        if (i >= 0) {
                            splittedByLines[index] = this.strip_line(line.slice(0, i - 1));
                            splittedByLines.insert(index + 1, "}");
                            var l2 = this.strip_line(line.slice(i + 1));
                            if (l2 != "")
                                splittedByLines.insert(index + 2, l2);
                            line = splittedByLines[index];
                        }
                        var i = line.indexOf("{")
                        if (i >= 0) {
                            splittedByLines[index] = this.strip_line(line.slice(0, i));
                            splittedByLines.insert(index + 1, "{");
                            var l2 = this.strip_line(line.slice(i + 1));
                            if (l2 != "")
                                splittedByLines.insert(index + 2, l2);

                        }
                    }
                }
                //remove more than two newlines
                else if (splittedByLines[index] == "") {
                    if (newline++ >= 2) {
                        //while(splittedByLines[index]=="")
                        splittedByLines.splice(index, 1);
                        index--;

                    }
                }

            }
            return splittedByLines;
        }

        join_opening_bracket(lines) {
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (line == "{") {
                    //just make sure we don't put anything before 0
                    if (i >= 1) {
                        lines[i] = lines[i - 1] + " {";
                        if (this.NEWLINEAFTERBRACET && lines.length > (i + 1) && lines[i + 1].length > 0)
                            lines.insert(i + 1, "");
                        lines.remove(i - 1);
                    }
                }
            }
            return lines;
        }

        perform_indentation(lines) {
            var indented_lines, current_indent, line;
            "Indents the lines according to their nesting level determined by curly brackets.";
            indented_lines = [];
            current_indent = 0;
            var iterator1 = lines;
            for (var index1 = 0; index1 < iterator1.length; index1++) {
                line = iterator1[index1];
                if (!line.startsWith("#") && line.endsWith("}") && current_indent > 0) {
                    current_indent -= 1;
                }
                if (line !== "") {
                    indented_lines.push(this.INDENTATION.repeat(current_indent) + line);
                } else {
                    indented_lines.push("");
                }
                if (!line.startsWith("#") && line.endsWith("{")) {
                    current_indent += 1;
                }
            }
            return indented_lines;
        }
    }


    //////// POLYFILLS /////////
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position) {
            position = position || 0;
            return this.substr(position, searchString.length) === searchString;
        };
    }
    if (!String.prototype.endsWith) {
        String.prototype.endsWith = function(searchString, position) {
            var subjectString = this.toString();
            if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
                position = subjectString.length;
            }
            position -= searchString.length;
            var lastIndex = subjectString.indexOf(searchString, position);
            return lastIndex !== -1 && lastIndex === position;
        };
    }
    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            'use strict';
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }

    if (!String.prototype.repeat) {
        String.prototype.repeat = function(count) {
            'use strict';
            if (this == null) {
                throw new TypeError('can\'t convert ' + this + ' to object');
            }
            var str = '' + this;
            count = +count;
            if (count != count) {
                count = 0;
            }
            if (count < 0) {
                throw new RangeError('repeat count must be non-negative');
            }
            if (count == Infinity) {
                throw new RangeError('repeat count must be less than infinity');
            }
            count = Math.floor(count);
            if (str.length == 0 || count == 0) {
                return '';
            }
            // Ensuring count is a 31-bit integer allows us to heavily optimize the
            // main part. But anyway, most current (August 2014) browsers can't handle
            // strings 1 << 28 chars or longer, so:
            if (str.length * count >= 1 << 28) {
                throw new RangeError('repeat count must not overflow maximum string size');
            }
            var rpt = '';
            for (;;) {
                if ((count & 1) == 1) {
                    rpt += str;
                }
                count >>>= 1;
                if (count == 0) {
                    break;
                }
                str += str;
            }
            // Could we try:
            // return Array(count + 1).join(this);
            return rpt;
        }
    }


    if (!Array.prototype.remove) {
        Array.prototype.remove = function(index, item) {
            this.splice(index, 1);
        };

    }

    if (!String.prototype.contains) {
        String.prototype.contains = String.prototype.includes;
    }

    if (!Array.prototype.insert) {
        Array.prototype.insert = function(index, item) {
            this.splice(index, 0, item);
        };
    }
    ///////// END POLYFILLS //////////

    module.exports = Beautifier;
})();
