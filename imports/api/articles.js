import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import './users.js';

export const Articles = new Mongo.Collection('articles', {
  transform: function(article) {
    if (Meteor.isClient) {
      Meteor.subscribe('userData');
    }
    const author = Meteor.users.findOne({_id: article.authorId});

    if (author && author._id === article.authorId) {
      article.authorName = author.profile.name;
    } else {
      article.authorName = 'Nobody';
    }
    return article;
  }
});

if (Meteor.isServer) {
  Meteor.publish('articles', function() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  });
}

Articles.schema = new SimpleSchema({
  title: {type: String},
  authorId: {type: String},
  createdAt: {type: Date},
  editedAt: {type: Date, optional: true},
  tags: {type: [String], optional: true},
  content: {type: String}
});

Articles.attachSchema(Articles.schema);

Meteor.methods({
  'articles.insert'(data) {
    const userId = Meteor.userId();
    if (userId) {
      Articles.insert({
        title: data.title,
        authorId: userId,
        createdAt: new Date(),
        tags: data.tags,
        content: data.content
      });
    } else {
      throw new Meteor.Error('logged-out', "You're logged out. Log in and try again.");
    }
  },
  'articles.remove'(articleId) {
    const userId = Meteor.userId();
    if (userId) {
      const article = Articles.findOne({_id: articleId});
      if (article && article.authorId === userId) {
        Articles.remove(articleId);
      } else {
        throw new Meteor.Error('not-owner', "You didn't write this article. You can't delete it.");
      }
    } else {
      throw new Meteor.Error('logged-out', "You're logged out. Log in and try again.");
    }
  },
  'articles.update'(articleId, data) {
    const userId = Meteor.userId();
    if (userId) {
      const article = Articles.findOne({_id: articleId});
      if (article && article.authorId === userId) {
        Articles.update(articleId, { $set: {
          title: data.title,
          content: data.content,
          editedAt: new Date() }
        });
      } else {
        throw new Meteor.Error('not-owner', "You didn't write this article. You can't edit it.");
      }
    } else {
      throw new Meteor.Error('logged-out', 'User is logged out. Log in and try again.');
    }
  }
});
