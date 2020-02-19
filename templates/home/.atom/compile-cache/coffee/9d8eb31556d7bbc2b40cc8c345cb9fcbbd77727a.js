
/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {
      null;
    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvYmVhdXRpZmllcnMvdW5jcnVzdGlmeS9jZmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBOztFQUlBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUE7O0VBQ1AsZUFBQSxHQUFrQixPQUFBLENBQVEseUJBQVI7O0VBQ2xCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsT0FBRCxFQUFVLEVBQVY7QUFDZixRQUFBO0lBQUEsSUFBQSxHQUFPO0lBR1AsT0FBTyxDQUFDLGVBQVIsR0FBMEIsT0FBTyxDQUFDLGVBQVIsSUFBMkIsT0FBTyxDQUFDO0lBQzdELE9BQU8sQ0FBQyxjQUFSLEdBQXlCLE9BQU8sQ0FBQyxjQUFSLElBQTBCLE9BQU8sQ0FBQztJQUMzRCxPQUFPLE9BQU8sQ0FBQztJQVFmLEVBQUEsR0FBSyxPQUFPLENBQUM7SUFDYixJQUFHLE9BQU8sQ0FBQyxnQkFBUixLQUE0QixDQUE1QixJQUFpQyxPQUFPLENBQUMsZ0JBQVIsS0FBNEIsQ0FBN0QsSUFBa0UsT0FBTyxDQUFDLGdCQUFSLEtBQTRCLENBQWpHO01BQ0UsS0FERjtLQUFBLE1BRUssSUFBRyxFQUFBLEtBQU0sR0FBVDtNQUNILE9BQU8sQ0FBQyxnQkFBUixHQUEyQixFQUR4QjtLQUFBLE1BRUEsSUFBRyxFQUFBLEtBQU0sSUFBVDtNQUNILE9BQU8sQ0FBQyxnQkFBUixHQUEyQixFQUR4QjtLQUFBLE1BQUE7TUFHSCxPQUFPLENBQUMsZ0JBQVIsR0FBMkIsRUFIeEI7O0lBSUwsT0FBTyxPQUFPLENBQUM7SUFLZixPQUFPLE9BQU8sQ0FBQztJQUNmLE9BQU8sT0FBTyxDQUFDO0FBR2YsU0FBQSxZQUFBO01BRUUsVUFBQSxHQUFhLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixDQUF4QixDQUFBLEtBQWdDLENBQUM7TUFDOUMsSUFBRyxVQUFIO1FBQ0UsQ0FBQSxHQUFJLE9BQVEsQ0FBQSxDQUFBO1FBQ1osRUFBQSxHQUFLO1FBQ0wsSUFBRyxPQUFPLEVBQVAsS0FBYSxTQUFoQjtVQUNFLElBQUcsRUFBQSxLQUFNLElBQVQ7WUFDRSxFQUFBLEdBQUssT0FEUDtXQUFBLE1BQUE7WUFHRSxFQUFBLEdBQUssUUFIUDtXQURGOztRQUtBLElBQUEsSUFBUSxDQUFBLEdBQUksS0FBSixHQUFZLEVBQVosR0FBaUIsS0FSM0I7T0FBQSxNQUFBO1FBV0UsT0FBTyxPQUFRLENBQUEsQ0FBQSxFQVhqQjs7QUFIRjtXQWlCQSxJQUFJLENBQUMsSUFBTCxDQUNFO01BQUEsTUFBQSxFQUFRLE1BQVI7S0FERixFQUVFLFNBQUMsR0FBRCxFQUFNLElBQU47TUFDQSxJQUFBLENBQU8sR0FBUDtlQUdFLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBSSxDQUFDLEVBQWQsRUFBa0IsSUFBQSxJQUFRLEVBQTFCLEVBQThCLFNBQUMsR0FBRDtVQUc1QixJQUFrQixHQUFsQjtBQUFBLG1CQUFPLEVBQUEsQ0FBRyxHQUFILEVBQVA7O2lCQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsSUFBSSxDQUFDLEVBQWQsRUFBa0IsU0FBQyxHQUFEO1lBR2hCLElBQWtCLEdBQWxCO0FBQUEscUJBQU8sRUFBQSxDQUFHLEdBQUgsRUFBUDs7bUJBQ0EsRUFBQSxDQUFHLElBQUgsRUFBUyxJQUFJLENBQUMsSUFBZDtVQUpnQixDQUFsQjtRQUo0QixDQUE5QixFQUhGO09BQUEsTUFBQTtlQWVFLEVBQUEsQ0FBRyxHQUFILEVBZkY7O0lBREEsQ0FGRjtFQWpEZTtBQVBqQiIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cDovL3BlYXIucGhwLm5ldC9wYWNrYWdlL1BIUF9CZWF1dGlmaWVyXG4jIyNcblwidXNlIHN0cmljdFwiXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxudGVtcCA9IHJlcXVpcmUoXCJ0ZW1wXCIpLnRyYWNrKClcbnBvc3NpYmxlT3B0aW9ucyA9IHJlcXVpcmUgXCIuL3Bvc3NpYmxlLW9wdGlvbnMuanNvblwiXG5tb2R1bGUuZXhwb3J0cyA9IChvcHRpb25zLCBjYikgLT5cbiAgdGV4dCA9IFwiXCJcblxuICAjIEFwcGx5IGluZGVudF9zaXplIHRvIG91dHB1dF90YWJfc2l6ZVxuICBvcHRpb25zLm91dHB1dF90YWJfc2l6ZSA9IG9wdGlvbnMub3V0cHV0X3RhYl9zaXplIG9yIG9wdGlvbnMuaW5kZW50X3NpemUgIyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gIG9wdGlvbnMuaW5wdXRfdGFiX3NpemUgPSBvcHRpb25zLmlucHV0X3RhYl9zaXplIG9yIG9wdGlvbnMuaW5kZW50X3NpemUgIyBqc2hpbnQgaWdub3JlOiBsaW5lXG4gIGRlbGV0ZSBvcHRpb25zLmluZGVudF9zaXplICMganNoaW50IGlnbm9yZTogbGluZVxuXG4gICMgSW5kZW50IHdpdGggVGFicz9cbiAgIyBIb3cgdG8gdXNlIHRhYnMgd2hlbiBpbmRlbnRpbmcgY29kZVxuICAjIDA9c3BhY2VzIG9ubHlcbiAgIyAxPWluZGVudCB3aXRoIHRhYnMgdG8gYnJhY2UgbGV2ZWwsIGFsaWduIHdpdGggc3BhY2VzXG4gICMgMj1pbmRlbnQgYW5kIGFsaWduIHdpdGggdGFicywgdXNpbmcgc3BhY2VzIHdoZW4gbm90IG9uIGEgdGFic3RvcFxuICAjIGpzaGludCBpZ25vcmU6IHN0YXJ0XG4gIGljID0gb3B0aW9ucy5pbmRlbnRfY2hhclxuICBpZiBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgaXMgMCBvciBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgaXMgMSBvciBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgaXMgMlxuICAgIG51bGwgIyBJZ25vcmUgaW5kZW50X2NoYXIgb3B0aW9uXG4gIGVsc2UgaWYgaWMgaXMgXCIgXCJcbiAgICBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgPSAwICMgU3BhY2VzIG9ubHlcbiAgZWxzZSBpZiBpYyBpcyBcIlxcdFwiXG4gICAgb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzID0gMiAjIGluZGVudCBhbmQgYWxpZ24gd2l0aCB0YWJzLCB1c2luZyBzcGFjZXMgd2hlbiBub3Qgb24gYSB0YWJzdG9wXG4gIGVsc2VcbiAgICBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgPSAxICMgaW5kZW50IHdpdGggdGFicyB0byBicmFjZSBsZXZlbCwgYWxpZ24gd2l0aCBzcGFjZXNcbiAgZGVsZXRlIG9wdGlvbnMuaW5kZW50X2NoYXJcblxuXG4gICMganNoaW50IGlnbm9yZTogZW5kXG4gICMgUmVtb3ZlIG1pc2NcbiAgZGVsZXRlIG9wdGlvbnMubGFuZ3VhZ2VPdmVycmlkZVxuICBkZWxldGUgb3B0aW9ucy5jb25maWdQYXRoXG5cbiAgIyBJdGVyYXRlIG92ZXIgZWFjaCBwcm9wZXJ0eSBhbmQgd3JpdGUgdG8gY29uZmlndXJhdGlvbiBmaWxlXG4gIGZvciBrIG9mIG9wdGlvbnNcbiAgICAjIFJlbW92ZSBhbGwgbm9uLXBvc3NpYmxlIG9wdGlvbnNcbiAgICBpc1Bvc3NpYmxlID0gcG9zc2libGVPcHRpb25zLmluZGV4T2YoaykgaXNudCAtMVxuICAgIGlmIGlzUG9zc2libGVcbiAgICAgIHYgPSBvcHRpb25zW2tdXG4gICAgICB2cyA9IHZcbiAgICAgIGlmIHR5cGVvZiB2cyBpcyBcImJvb2xlYW5cIlxuICAgICAgICBpZiB2cyBpcyB0cnVlXG4gICAgICAgICAgdnMgPSBcIlRydWVcIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgdnMgPSBcIkZhbHNlXCJcbiAgICAgIHRleHQgKz0gayArIFwiID0gXCIgKyB2cyArIFwiXFxuXCJcbiAgICBlbHNlXG4gICAgICAjIGNvbnNvbGUubG9nKFwicmVtb3ZpbmcgI3trfSBvcHRpb25cIilcbiAgICAgIGRlbGV0ZSBvcHRpb25zW2tdXG5cbiAgIyBDcmVhdGUgdGVtcCBpbnB1dCBmaWxlXG4gIHRlbXAub3BlblxuICAgIHN1ZmZpeDogXCIuY2ZnXCJcbiAgLCAoZXJyLCBpbmZvKSAtPlxuICAgIHVubGVzcyBlcnJcblxuICAgICAgIyBTYXZlIGN1cnJlbnQgdGV4dCB0byBpbnB1dCBmaWxlXG4gICAgICBmcy53cml0ZSBpbmZvLmZkLCB0ZXh0IG9yIFwiXCIsIChlcnIpIC0+XG5cbiAgICAgICAgIyBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICAgICAgZnMuY2xvc2UgaW5mby5mZCwgKGVycikgLT5cblxuICAgICAgICAgICMgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICAgICAgICBjYiBudWxsLCBpbmZvLnBhdGhcblxuXG4gICAgZWxzZVxuICAgICAgY2IgZXJyXG4iXX0=
