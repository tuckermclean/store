import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Articles = new Mongo.Collection('articles');

if (Meteor.isServer) {
  Meteor.publish('articles', function articlesPublication() {
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
    Articles.insert({
      title: data.title,
      authorId: data.authorId,
      createdAt: new Date(),
      tags: data.tags,
      content: data.content
    });
  },
  'articles.remove'(articleId) {
    Articles.remove(articleId);
  },
  'articles.update'(_id, data) {
    Articles.update(_id, { $set: {
        title: data.title,
        content: data.content,
        editedAt: new Date()
      } });
  }
});
