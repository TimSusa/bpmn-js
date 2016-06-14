'use strict';

var GeometricUtil = require('./GeometricUtil');

function getMinDistanceLineIndex(label, waypoints) {

  var minimum = null,
      newMinimum = null,
      minimumIndex = null;

  for (var i = 0; i < waypoints.length - 1; i++) {

    var p1 = waypoints[i],
        p2 = waypoints[i+1];

    var distance = GeometricUtil.getDistancePointLine(label, [ p1, p2 ]);

    if (!minimum) {
      minimum = distance;
      minimumIndex = i;
    }

    newMinimum = distance;

    if (newMinimum < minimum) {
      minimum = newMinimum;
      minimumIndex = i;
    }
  }

  return minimumIndex;
}

function findNewLabelLineStartIndex(oldWaypoints, newWaypoints, index, hints) {

  var offset = newWaypoints.length - oldWaypoints.length;

  // segmentMove happend
  if (hints.segmentMove) {

    var oldSegmentStartIndex = hints.segmentMove.segmentStartIndex,
        newSegmentStartIndex = hints.segmentMove.newSegmentStartIndex;

    // if label was on moved segment return new segment index
    if (index === oldSegmentStartIndex)
      return newSegmentStartIndex;

    // label is after new segment index
    if (index >= newSegmentStartIndex)
      return (index+offset < newSegmentStartIndex) ? newSegmentStartIndex : index+offset;

    // if label is before new segment index
    else
      return index;
  }

  // bendpointMove happend
  if (hints.bendpointMove) {

    var insert = hints.bendpointMove.insert,
        bendpointIndex = hints.bendpointMove.bendpointIndex;

    // waypoints length didnt change
    if (offset === 0) return index;

    else {

      // label before new/removed bendpoint
      if (index < bendpointIndex) return index;

      // label behind new/removed bendpoint
      else return insert ? index + 1 : index - 1;
    }
  }

  // start/end changed
  if (offset === 0) return index;

  if (hints.startChanged) {
    return (index === 0) ? 0 : null;
  }

  if (hints.endChanged) {
    return (index === oldWaypoints.length - 2) ? newWaypoints.length - 2 : null;
  }

  return null;
}

module.exports.findNewLabelLineStartIndex = findNewLabelLineStartIndex;

function getOptiomalLabelPosition(label, newWaypoints, oldWaypoints, hints) {

  var labelPosition = {
    x: label.x + label.width / 2,
    y: label.y + label.height / 2
  };

  var oldLabelLineIndex = getMinDistanceLineIndex(labelPosition, oldWaypoints),
      oldLabelLine = [ oldWaypoints[oldLabelLineIndex], oldWaypoints[oldLabelLineIndex+1] ],
      oldFoot = GeometricUtil.perpendicularFoot(labelPosition, oldLabelLine);

  var newLabelLineIndex = findNewLabelLineStartIndex(oldWaypoints, newWaypoints, oldLabelLineIndex, hints);

  var x = 0, y = 0;

  if (newLabelLineIndex < 0 || newLabelLineIndex > newWaypoints.length-2) {
    newLabelLineIndex = null;
  }

  if (newLabelLineIndex !== null) {

    var newLabelLine = [ newWaypoints[newLabelLineIndex], newWaypoints[newLabelLineIndex+1] ];

    var newFoot = GeometricUtil.perpendicularFoot(labelPosition, newLabelLine);

    x = newFoot.x - oldFoot.x;
    y = newFoot.y - oldFoot.y;
  }

  return { x: x, y: y };
}

module.exports.getOptiomalLabelPosition = getOptiomalLabelPosition;
