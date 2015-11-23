Trackers = new Meteor.Collection('trackers');
Activities = new Meteor.Collection('activities');

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', {
  template: 'home',
  name: 'home'
});

Router.route('/trackers', {
  template: 'trackers',
  name: 'trackers'
});

Router.route('/tracker/:_id', {
  template: 'tracker',
  name: 'tracker',
  data: function(){
        return {
          one: Trackers.findOne({_id: this.params._id}),
          two: Activities.find({trackerId: this.params._id}),
          three: Activities.findOne({trackerId: this.params._id, active: true})
        }
      }
});

function getToday(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd='0'+dd
  }

  if(mm<10) {
      mm='0'+mm
  }

  today = dd+mm+yyyy;

  return today;
}

if (Meteor.isClient){

  Template.addTracker.events({
    'submit form': function(event){
      event.preventDefault();

      var today = getToday();
      var name = $('[name=trackerName]').val();

      var trackerData = {
        name: name
      };

      var trackerId = Trackers.insert(trackerData);
      $('[name=trackerName]').val('');

      console.log('lel' + trackerId);

      var activityData = {
        name: 'first',
        active: true,
        trackerId: trackerId
      };

      Activities.insert(activityData);
    }
  });

  Template.addActivity.events({
    'submit form': function(event){
      event.preventDefault();
      var name =$('[name=activityName]').val();
      var trackerId = Router.current().params._id;

      var data = {
        name: name,
        active: false,
        trackerId: trackerId
      }

      Activities.insert(data);
    }
  });

  Template.trackers.helpers({
    'tracker': function(){
      return Trackers.find({});
    }
  });

  Template.trackerItem.events({
    'click': function(){
      console.log(this._id);
      Router.go('tracker', {_id: this._id});
    }
  });

  Template.tracker.events({
    'click .set': function(event){
      event.preventDefault();
      var newId = this._id;
      var oldId = Activities.findOne({trackerId: this.trackerId, active: true})._id;
      //console.log('New: ' + newId + '\nOld: ' + oldId);
      Activities.update({_id: oldId}, {$set: {active: false}});
      Activities.update({_id: newId}, {$set: {active: true}});
    },

    'click #pressButt': function(event){
      event.preventDefault();
      console.log('lul');
    }
  });

}

if (Meteor.isServer){

}
