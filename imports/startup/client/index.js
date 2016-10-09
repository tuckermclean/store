import { Accounts } from 'meteor/accounts-base';

import '../../ui/comments.js';
import '../../ui/articles.js';
import '../../ui/body.js';

Accounts.ui.config({
  requestPermissions: {},
  extraSignupFields: [{
    fieldName: 'name',
    fieldLabel: 'Full name',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your full name.");
        return false;
      } else {
        return true;
      }
    }
  }]
});
