import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';

import './users.js';

export const Comments = new Mongo.Collection('comments', {
  transform: function(comment) {
    Meteor.subscribe('userData');
    const author = Meteor.users.findOne({_id: comment.authorId});
    if (author && author._id === comment.authorId) {
      comment.authorName = author.profile.name;
    } else {
      comment.authorName = 'Nobody';
    }
    return comment;
  }
});

Comments.getThread = function(parentId) {
  return Comments.find({parentId});
};

if (Meteor.isServer) {
  Meteor.publish('comments', Comments.getThread);
}

Comments.schema = new SimpleSchema({
  discussionId: {type: String},
  parentId: {type: String, defaultValue: null},
  slug: {type: String},
  fullSlug: {type: String},
  authorId: {type: String},
  createdAt: {type: Date},
  editedAt: {type: Date, optional: true},
  content: {type: String}
});

Comments.attachSchema(Comments.schema);

Meteor.methods({
  'comments.insert'(data) {
    const userId = Meteor.userId();
    if (userId) {
      const slug = Random.id(4);
      let fullSlug = `${Date.now().toString()}:${slug}`;

      if (data.parentFullSlug) {
        fullSlug = `${data.parentFullSlug}/${fullSlug}`;
      }

      return Comments.insert({
        discussionId: data.discussionId,
        parentId: data.parentId,
        slug,
        fullSlug,
        authorId: userId,
        createdAt: new Date(),
        content: data.content
      });
    } else {
      throw new Meteor.Error('logged-out', "You're logged out. Log in and try again.");
    }
  },
  'comments.remove'(commentId) {
    const userId = Meteor.userId();
    if (userId) {
      const comment = comments.findOne({_id: commentId});
      if (comment && comment.authorId === userId) {
        Comments.remove(commentId);
      } else {
        throw new Meteor.Error('not-owner', "You didn't write this comment. You can't delete it.");
      }
    } else {
      throw new Meteor.Error('logged-out', "You're logged out. Log in and try again.");
    }
  },
  'comments.edit'(commentId, content) {
    const userId = Meteor.userId();
    if (userId) {
      const comment = comments.findOne({_id: commentId});
      if (comment.authorId === userId) {
          Comments.update(commentId, { $set: {
            content,
            editedAt: new Date()
          } });
      } else {
        throw new Meteor.Error('not-owner', "You didn't write this comment. You can't delete it.");
      }
    } else {
      throw new Meteor.Error('logged-out', "You're logged out. Log in and try again.");
    }
  }
});
