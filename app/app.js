// Global
Courses = new Mongo.Collection('courses');
Scores  = new Mongo.Collection('scores');

if (Meteor.isClient) {
  // default state
  Session.set('s_isViewingMenu', true);
  Session.set('totalScore', 0);
  // counter starts at 0
  // Session.setDefault('counter', 0);

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });

  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set('counter', Session.get('counter') + 1);
  //   }
  // });
  ////////////////////////////////////////////////////////////////////////
  Template.enterScore.helpers({
    courses: function(){
      return Courses.find();
    }
  });

  ////////////////////////////////////////////////////////////////////////
  Template.createCourse.helpers({
    courseName: function(){
      return Session.get('courseName') || "New Course";
    }
  });

  Template.createCourse.events({
    'keyup .courseName': function(e){
      Session.set('courseName', e.target.value);
    },
    'click .addCourse':function(e,t){
      var elems = t.findAll('.par'),
          pars = [];
      for (var i in elems)
        pars.push(elems[i].value*1);
      var newCourse = {name: Session.get('courseName'), holes: pars};
      console.log(newCourse);
      Courses.insert(newCourse);
      // console.log(pars);
    }
  });
  
  ////////////////////////////////////////////////////////////////////////
  //  MENU
  ////////////////////////////////////////////////////////////////////////
  Template.menu.helpers({
    s_isViewingMenu:function(){
      return Session.get('s_isViewingMenu');
    }
  });
  Template.menu.events({
    'click .enterScore':function(){
      Session.set('s_isViewingMenu', false);
      Session.set('s_isPickingCourse', true);
    }
  })
  
  ////////////////////////////////////////////////////////////////////////
  //  PICK COURSE
  ////////////////////////////////////////////////////////////////////////
  Template.pickCourse.helpers({
    courses: function(){
      return Courses.find();
    },
    s_isPickingCourse: function(){
      return (Session.get('s_isPickingCourse'));
    }
  })
  Template.pickCourse.events({
    'click .pickCourse-go': function(e,t){
      Session.set('s_isPickingCourse', false);
      var thisCourse = Courses.findOne({_id: t.find('select').value})
      Session.set('courseName', thisCourse.name);
      Session.set('courseId', thisCourse._id);
      Session.set('s_isEnteringScore', true);
    }
  });

  ////////////////////////////////////////////////////////////////////////
  //  ENTER SCORE
  ////////////////////////////////////////////////////////////////////////
  Template.enterScore.helpers({
    s_isEnteringScore: function(){
      return Session.get('s_isEnteringScore');
    },
    courseName: function(){
      return Session.get('courseName');
    }
  });
  Template.enterScore.events({
    'click button':function(e,t){
      Session.set('s_isEnteringScore', false);
      var elems = t.findAll('.score'),
          scores = [];
      for (var i in elems)
        scores.push(elems[i].value*1);
      var newScore = {
        course: Courses.findOne({_id:Session.get('courseId')}),
        scores: scores, 
        date: new Date()
      };
      console.log(newScore);
      Scores.insert(newScore);
      Session.set('s_isViewingMenu', true); 
    }
  });
  ////////////////////////////////////////////////////////////////////////
  //  SCORECARD
  ////////////////////////////////////////////////////////////////////////
  Template.scorecard.helpers({
    course: function(){
      return Courses.findOne({_id:Session.get('courseId')});
    },
    outScore: function(){
      return Session.get('outScore');
    },
    inScore: function(){
      return Session.get('inScore');
    },
    totalScore:function(){
      return Session.get('outScore')+Session.get('inScore');
    }
  });
  Template.scorecard.events({
    'blur .score':function(e,t){
      var elems = t.findAll('.score'),
          front = 0,
          back  = 0;
      for (var i in elems){
        if ( i < 9 )//front 9
          front += elems[i].value*1;
        else
          back += elems[i].value*1;
      }
      Session.set( 'outScore', front );
      Session.set( 'inScore', back );
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
