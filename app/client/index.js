Meteor.subscribe("activities");

Template.body.helpers({
  actis: function () {
    if (Session.get("hideCompleted")) {
      // If hide completed is checked, filter tasks
      return Activities.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
    }
    else {
      // Otherwise, return all of the tasks
      return Activities.find({}, {sort: {createdAt: -1}});
    }
  },

  hideCompleted: function () {
    return Session.get("hideCompleted");
  },

  incompleteCount: function () {
    return Activities.find({checked: {$ne: true}}).count();
  }
});

Template.body.events({
  "submit .new-task": function (event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    var text = event.target.text.value;

    // Insert a task into the collection
    Meteor.call("addActivity", text);

    // Clear form
    event.target.text.value = "";
  },
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  }
});

Template.activity.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, ! this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteActivity", this._id);
  },
  "click .toggle-private": function () {
    Meteor.call("setPrivate", this._id, ! this.private);
  }
});

Template.activity.helpers({
  isOwner: function () {
    return this.owner === Meteor.userId();
  }
});

Accounts.ui.config({
  passwordSignupFields: "USERNAME_ONLY"
});
