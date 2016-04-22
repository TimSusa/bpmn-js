'use strict';

require('../../TestHelper');

/* global bootstrapModeler, inject */

var coreModule = require('../../../lib/core'),
    bendpointsModule = require('diagram-js/lib/features/bendpoints'),
    modelingModule = require('../../../lib/features/modeling'),
    labelEditingModule = require('../../../lib/features/label-editing');

var LabelUtil = require('../../../lib/util/LabelUtil');

var EventBus = require('diagram-js/lib/core/EventBus');
var connectionSegmentMove = require('diagram-js/lib/features/bendpoints/ConnectionSegmentMove');
var dragging = require('diagram-js/lib/features/dragging');


describe('LabelUtil', function() {

  var diagramXML = require('./LabelUtil.bpmn');

  beforeEach(bootstrapModeler(diagramXML, {
    modules: [ coreModule, modelingModule, labelEditingModule, bendpointsModule ]
  }));


  describe('initial label position', function() {

    it('should correctly place horizontal label', inject(function(modeling, elementRegistry) {

      // given
      var element1 = elementRegistry.get('StartEvent_1'),
          element2 = elementRegistry.get('ExclusiveGateway_2');

      // when
      var connection = modeling.connect(element1, element2);

      // then
      expect(connection.label.x).to.be.equal(427);
      expect(connection.label.y).to.be.equal(332);
    }));

    it('should correctly place vertical label', inject(function(modeling, elementRegistry) {

      // given
      var element1 = elementRegistry.get('StartEvent_1'),
          element2 = elementRegistry.get('ExclusiveGateway_1');

      // when
      var connection = modeling.connect(element1, element2);

      // then
      expect(connection.label.x).to.be.equal(292);
      expect(connection.label.y).to.be.equal(219.5);
    }));
  });


  describe('dynamic label position', function() {

    var createEvent = require('../../util/MockEvents').createEvent;

    it('should move on vertical segment move', inject(function(modeling, elementRegistry, canvas, dragging, connectionSegmentMove) {

      // given
      var element1 = elementRegistry.get('StartEvent_1'),
          element2 = elementRegistry.get('ExclusiveGateway_2');

      // when
      var connection = modeling.connect(element1, element2),
          gfx = canvas.getGraphics(connection);

      var labelPositionY = connection.label.y,
          deltaY = 100;

      connection.label.businessObject.name = 'Hello World';
      connection.label.hidden = false;

      var pos = {
        x: ( connection.waypoints[0].x - connection.waypoints[1].x ) / 2,
        y: connection.waypoints[0].y
      };

      console.log(pos.x, pos.y);
      console.log(createEvent(gfx, pos));

      connectionSegmentMove.start(createEvent(gfx, pos), connection, 1);

      pos.y += deltaY;
      dragging.move(createEvent(gfx, pos));
      dragging.end();

      // then
      // expect(connection.label.y).to.be.eql(labelPositionY + deltaY);

    }));

    it('should move on horizontal segment move', inject(function(modeling, elementRegistry, canvas, dragging, connectionSegmentMove) {

      // given
      var element1 = elementRegistry.get('StartEvent_1'),
          element2 = elementRegistry.get('ExclusiveGateway_1');

      // when
      var connection = modeling.connect(element1, element2),
          gfx = canvas.getGraphics(connection);

      var labelPositionX = connection.label.x,
          deltaX = 100;

      connection.label.businessObject.name = 'Hello World';
      connection.label.hidden = false;

      var pos = {
        x: connection.waypoints[0].x,
        y: ( connection.waypoints[0].y - connection.waypoints[1].y ) / 2,
      };

      connectionSegmentMove.start(createEvent(gfx, pos), connection, 1);

      pos.x += deltaX;
      dragging.move(createEvent(gfx, pos));
      dragging.end();

      // then
      expect(connection.label.x).to.be.eql(labelPositionX + deltaX);

    }));

  });

  describe('label position on connection move', function() {

    it('remove/add single waypoint', function() {});

    it('factor 0: waypoints length is the same', function() {

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
        var newIndex = LabelUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

        // then
        expect(newIndex).to.be.equal(testIndexes[i].new);
      }
    });

    it('factor +1: add a waypoint with segment Move', function() {

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
        var newIndex = LabelUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

        // then
        expect(newIndex).to.be.equal(testIndexes[i].new);
      }
    });

    it('factor +2: add two waypoints with segment Move', function() {

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
        var newIndex = LabelUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

        // then
        expect(newIndex).to.be.equal(testIndexes[i].new);
      }
    });

    it('factor -1: remove waypoint with segment move', function() {

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
        var newIndex = LabelUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

        // then
        expect(newIndex).to.be.equal(testIndexes[i].new);
      }
    });

    it('factor -4: ', function() {

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
        { old: 0, new: null },
        { old: 1, new: null },
        { old: 2, new: null }, // not implemented yet
        { old: 3, new: 1 },
        { old: 4, new: 0 }, // fail
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
        var newIndex = LabelUtil.findNewLabelLineStartIndex(oldWaypoints, newWaypoints, testIndexes[i].old, hints);

        // then
        expect(newIndex).to.be.equal(testIndexes[i].new);
      }
    });

  });

});
