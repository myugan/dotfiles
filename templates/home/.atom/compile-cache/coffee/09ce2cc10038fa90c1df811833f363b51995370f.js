(function() {
  module.exports = {
    name: "PHP",
    namespace: "php",

    /*
    Supported Grammars
     */
    grammars: ["PHP"],

    /*
    Supported extensions
     */
    extensions: ["php", "module", "inc"],
    defaultBeautifier: "PHP-CS-Fixer",
    options: {
      cs_fixer_path: {
        title: "PHP-CS-Fixer Path",
        type: 'string',
        "default": "",
        description: "Absolute path to the `php-cs-fixer` CLI executable"
      },
      cs_fixer_version: {
        title: "PHP-CS-Fixer Version",
        type: 'integer',
        "default": 2,
        "enum": [1, 2]
      },
      cs_fixer_config_file: {
        title: "PHP-CS-Fixer Config File",
        type: 'string',
        "default": "",
        description: "Path to php-cs-fixer config file. Will use local `.php_cs` or `.php_cs.dist` if found in the working directory or project root."
      },
      fixers: {
        type: 'string',
        "default": "",
        description: "Add fixer(s). i.e. linefeed,-short_tag,indentation (PHP-CS-Fixer 1 only)"
      },
      level: {
        type: 'string',
        "default": "",
        description: "By default, all PSR-2 fixers and some additional ones are run. (PHP-CS-Fixer 1 only)"
      },
      rules: {
        type: 'string',
        "default": "",
        description: "Add rule(s). i.e. line_ending,-full_opening_tag,@PSR2 (PHP-CS-Fixer 2 only)"
      },
      allow_risky: {
        title: "Allow risky rules",
        type: 'string',
        "default": "no",
        "enum": ["no", "yes"],
        description: "Allow risky rules to be applied (PHP-CS-Fixer 2 only)"
      },
      phpcbf_path: {
        title: "PHPCBF Path",
        type: 'string',
        "default": "",
        description: "Path to the `phpcbf` CLI executable"
      },
      phpcbf_version: {
        title: "PHPCBF Version",
        type: 'integer',
        "default": 2,
        "enum": [1, 2, 3]
      },
      standard: {
        title: "PHPCBF Standard",
        type: 'string',
        "default": "PEAR",
        description: "Standard name Squiz, PSR2, PSR1, PHPCS, PEAR, Zend, MySource... or path to CS rules. Will use local `phpcs.xml`, `phpcs.xml.dist`, `phpcs.ruleset.xml` or `ruleset.xml` if found in the project root."
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbXl1Z2EvLmF0b20vcGFja2FnZXMvYXRvbS1iZWF1dGlmeS9zcmMvbGFuZ3VhZ2VzL3BocC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxLQUZTO0lBR2YsU0FBQSxFQUFXLEtBSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLEtBRFEsQ0FSSzs7QUFZZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsS0FEVSxFQUVWLFFBRlUsRUFHVixLQUhVLENBZkc7SUFxQmYsaUJBQUEsRUFBbUIsY0FyQko7SUF1QmYsT0FBQSxFQUNFO01BQUEsYUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLG1CQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsb0RBSGI7T0FERjtNQUtBLGdCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sc0JBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FGVDtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixDQUhOO09BTkY7TUFVQSxvQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLDBCQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxXQUFBLEVBQWEsaUlBSGI7T0FYRjtNQWVBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLDBFQUZiO09BaEJGO01BbUJBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLHNGQUZiO09BcEJGO01BdUJBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQURUO1FBRUEsV0FBQSxFQUFhLDZFQUZiO09BeEJGO01BMkJBLFdBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxtQkFBUDtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUZUO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLElBQUQsRUFBTyxLQUFQLENBSE47UUFJQSxXQUFBLEVBQWEsdURBSmI7T0E1QkY7TUFpQ0EsV0FBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGFBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFGVDtRQUdBLFdBQUEsRUFBYSxxQ0FIYjtPQWxDRjtNQXNDQSxjQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sZ0JBQVA7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FGVDtRQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsQ0FITjtPQXZDRjtNQTJDQSxRQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8saUJBQVA7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFGVDtRQUdBLFdBQUEsRUFBYSx1TUFIYjtPQTVDRjtLQXhCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIlBIUFwiXG4gIG5hbWVzcGFjZTogXCJwaHBcIlxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJQSFBcIlxuICBdXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJwaHBcIlxuICAgIFwibW9kdWxlXCJcbiAgICBcImluY1wiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJQSFAtQ1MtRml4ZXJcIlxuXG4gIG9wdGlvbnM6XG4gICAgY3NfZml4ZXJfcGF0aDpcbiAgICAgIHRpdGxlOiBcIlBIUC1DUy1GaXhlciBQYXRoXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJBYnNvbHV0ZSBwYXRoIHRvIHRoZSBgcGhwLWNzLWZpeGVyYCBDTEkgZXhlY3V0YWJsZVwiXG4gICAgY3NfZml4ZXJfdmVyc2lvbjpcbiAgICAgIHRpdGxlOiBcIlBIUC1DUy1GaXhlciBWZXJzaW9uXCJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMlxuICAgICAgZW51bTogWzEsIDJdXG4gICAgY3NfZml4ZXJfY29uZmlnX2ZpbGU6XG4gICAgICB0aXRsZTogXCJQSFAtQ1MtRml4ZXIgQ29uZmlnIEZpbGVcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIlBhdGggdG8gcGhwLWNzLWZpeGVyIGNvbmZpZyBmaWxlLiBXaWxsIHVzZSBsb2NhbCBgLnBocF9jc2Agb3IgYC5waHBfY3MuZGlzdGAgaWYgZm91bmQgaW4gdGhlIHdvcmtpbmcgZGlyZWN0b3J5IG9yIHByb2plY3Qgcm9vdC5cIlxuICAgIGZpeGVyczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIlwiXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGQgZml4ZXIocykuIGkuZS4gbGluZWZlZWQsLXNob3J0X3RhZyxpbmRlbnRhdGlvbiAoUEhQLUNTLUZpeGVyIDEgb25seSlcIlxuICAgIGxldmVsOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiXCJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkJ5IGRlZmF1bHQsIGFsbCBQU1ItMiBmaXhlcnMgYW5kIHNvbWUgYWRkaXRpb25hbCBvbmVzIGFyZSBydW4uIChQSFAtQ1MtRml4ZXIgMSBvbmx5KVwiXG4gICAgcnVsZXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkIHJ1bGUocykuIGkuZS4gbGluZV9lbmRpbmcsLWZ1bGxfb3BlbmluZ190YWcsQFBTUjIgKFBIUC1DUy1GaXhlciAyIG9ubHkpXCJcbiAgICBhbGxvd19yaXNreTpcbiAgICAgIHRpdGxlOiBcIkFsbG93IHJpc2t5IHJ1bGVzXCJcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcIm5vXCJcbiAgICAgIGVudW06IFtcIm5vXCIsIFwieWVzXCJdXG4gICAgICBkZXNjcmlwdGlvbjogXCJBbGxvdyByaXNreSBydWxlcyB0byBiZSBhcHBsaWVkIChQSFAtQ1MtRml4ZXIgMiBvbmx5KVwiXG4gICAgcGhwY2JmX3BhdGg6XG4gICAgICB0aXRsZTogXCJQSFBDQkYgUGF0aFwiXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byB0aGUgYHBocGNiZmAgQ0xJIGV4ZWN1dGFibGVcIixcbiAgICBwaHBjYmZfdmVyc2lvbjpcbiAgICAgIHRpdGxlOiBcIlBIUENCRiBWZXJzaW9uXCJcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMlxuICAgICAgZW51bTogWzEsIDIsIDNdXG4gICAgc3RhbmRhcmQ6XG4gICAgICB0aXRsZTogXCJQSFBDQkYgU3RhbmRhcmRcIlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiUEVBUlwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiU3RhbmRhcmQgbmFtZSBTcXVpeiwgUFNSMiwgUFNSMSwgUEhQQ1MsIFBFQVIsIFplbmQsIE15U291cmNlLi4uIG9yIHBhdGggdG8gQ1MgcnVsZXMuIFdpbGwgdXNlIGxvY2FsIGBwaHBjcy54bWxgLCBgcGhwY3MueG1sLmRpc3RgLCBgcGhwY3MucnVsZXNldC54bWxgIG9yIGBydWxlc2V0LnhtbGAgaWYgZm91bmQgaW4gdGhlIHByb2plY3Qgcm9vdC5cIlxuXG59XG4iXX0=
