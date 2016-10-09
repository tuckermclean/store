import { Meteor } from 'meteor/meteor';

export const Users = Meteor.users;

if (Meteor.isServer) {
  Meteor.publish('userData', function() {
    return Users.find({}, { fields: { _id: 1, profile: 1 } });
  });
}
