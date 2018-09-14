const moment = require('moment');

module.exports = {
  truncate: function(str, len) {
    if (str.length > len && str.length > 0) {
      let newStr = `${str} `;
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(' '));
      newStr = (newStr.length > 0) ? newStr : str.substr(0, len);
      return `${newStr}...`;
    }
    return str;
  },
  formatDate: function(date, format) {
    return moment(date).format(format);
  },
  relativeTime: function(date, startOf, fromNow) {
    return moment(date).startOf(startOf).fromNow();
  },
  formatCap: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  formatUnderscrore: function(str) {
    return str.replace(/_/g, ' ');
  },
  select: function(selected, options) {
    /* eslint-disable */
    return options.fn(this).replace(
      new RegExp(' value=\"' + selected + '\"'),
      '$& selected="selected"');
    /* eslint-enable */
  },
  selectMultiple: function(selected, options) {
    /* eslint-disable */
    let selLength = selected.length;
    let newOptions = options.fn(this);
    let i;

    for (i = 0; i < selLength; i++) {
      newOptions = newOptions.replace(new RegExp(' value=\"' + selected[i] + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected[i] + '</option>'), ' selected="selected"$&');
    }

    return newOptions;
    /* eslint-enable */
  },
  addTrait: function(key, value, returnTo) {
    localStorage.setItem(key, value);
    const ref = `/${returnTo}`;
    return ref;
  },
};
