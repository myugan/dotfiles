'use babel';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = toCamelCase;

function toCamelCase(str) {
    return str.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
    });
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2hlbHBlci90by1jYW1lbC1jYXNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRVksV0FBVzs7QUFBcEIsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFO0FBQ3JDLFdBQU8sR0FBRyxDQUNMLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQ2xCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQ2xCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsVUFBQSxFQUFFO2VBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtLQUFBLENBQUMsQ0FDekMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FDbEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFBLEVBQUU7ZUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO0tBQUEsQ0FBQyxDQUFDO0NBQ2hEIiwiZmlsZSI6Ii9ob21lL215dWdhLy5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2hlbHBlci90by1jYW1lbC1jYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLy0vZywgJyAnKVxuICAgICAgICAucmVwbGFjZSgvXy9nLCAnICcpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMoLikvZywgJDEgPT4gJDEudG9VcHBlckNhc2UoKSlcbiAgICAgICAgLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgICAgLnJlcGxhY2UoL14oLikvLCAkMSA9PiAkMS50b0xvd2VyQ2FzZSgpKTtcbn1cbiJdfQ==