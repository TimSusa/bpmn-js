'use strict';

var LabelLayoutUtil = require('lib/features/modeling/behavior/util/LabelLayoutUtil');


describe('modeling/behavior/util - LabelLayoutUtilSpec', function() {

  it('remove/add single waypoint', function() {});


  it('offset 0 - segmentMove down', function() {

    // given
    var oldWaypoints = [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 }
    ];

    var newWaypoints = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ];

    var testIndexes = [
      { old: 0, new: 1 },
      { old: 1, new: 1 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 0,
        newSegmentStartIndex: 1
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });


  it('offset +1 - segmentMove left, adds new waypoint', function() {

    // given
    var oldWaypoints = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ];

    var newWaypoints = [
      { x: 0, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    var testIndexes = [
      { old: 0, new: 1 },
      { old: 1, new: 2 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 0,
        newSegmentStartIndex: 1
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });


  it('offset +2 - segmentMove down, adds two waypoints', function() {

    // given
    var oldWaypoints = [
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];

    var newWaypoints = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ];

    var testIndexes = [
      { old: 0, new: 1 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 0,
        newSegmentStartIndex: 1
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });


  it('offset -1 - segmentMove right, removes one waypoint', function() {

    // given
    var oldWaypoints = [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 0 }
    ];

    var newWaypoints = [
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 2, y: 0 }
    ];

    var testIndexes = [
      { old: 0, new: 0 }, // not implemented yet
      { old: 1, new: 0 },
      { old: 2, new: 1 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 1,
        newSegmentStartIndex: 0
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });


  it('offset -4 - segmentMove up (intersection), removes 3 segments (4 waypoints)', function() {

    // given
    var oldWaypoints = [
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 1 },
      { x: 3, y: 2 }
    ];

    var newWaypoints = [
      { x: 0, y: 2 },
      { x: 0, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 2 }
    ];

    var testIndexes = [
      { old: 0, new: 0 },
      { old: 1, new: 1 },
      { old: 2, new: 1 }, // not implemented yet
      { old: 3, new: 1 },
      { old: 4, new: 1 }, // fail
      { old: 5, new: 1 },
      { old: 6, new: 2 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 3,
        newSegmentStartIndex: 1
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });


  it('offset -2 - segmentMove up, removes two waypoints', function() {

    // given
    var oldWaypoints = [
      { x: 0, y: 1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ];

    var newWaypoints = [
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];

    var testIndexes = [
      { old: 0, new: 0 },
      { old: 1, new: 0 },
      { old: 2, new: 0 }
    ];

    var hints = {
      segmentMove: {
        segmentStartIndex: 1,
        newSegmentStartIndex: 0
      }
    };

    for (var i=0; i<testIndexes.length; i++) {

      // when
      var newIndex = LabelLayoutUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

      // then
      expect(newIndex).to.be.equal(testIndexes[i].new);
    }
  });

});
