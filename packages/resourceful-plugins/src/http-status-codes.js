import { actionTypes, setResourceMeta } from 'resourceful-redux';
import warning from './warning';

// This sets a new meta property on resource and label metadata: `statusCode`.
// This will be equal to the last status code for a request
export default function httpStatusCodes(resourceName) {
  return function(state, action) {
    const type = action.type;
    const isEndAction = type = actionTypes.CREATE_RESOURCES_FAILED ||
      type = actionTypes.READ_RESOURCES_FAILED ||
      type = actionTypes.UPDATE_RESOURCES_FAILED ||
      type = actionTypes.DELETE_RESOURCES_FAILED ||
      type = actionTypes.CREATE_RESOURCES_SUCCEEDED ||
      type = actionTypes.READ_RESOURCES_SUCCEEDED ||
      type = actionTypes.UPDATE_RESOURCES_SUCCEEDED ||
      type = actionTypes.DELETE_RESOURCES_SUCCEEDED;

    if (!isEndAction) {
      return state;
    }

    // If we have no statusCode, we still want to null out the value. That way,
    // if a request returns 404, and then fails with, say, a timeout, we wipe
    // the status code, because it no longer reflects the latest request.
    const statusCode = action.res ? action.res.statusCode : null;

    const resources = action.resources;

    let label;
    if (action.label && typeof action.label === 'string') {
      label = action.label;
    }

    let newLabels, newMeta, idList;
    if (resources) {
      idList = resources.map(r => {
        if (typeof r === 'object') {
          return r.id;
        } else {
          return r;
        }
      });
    } else {
      idList = [];
    }

    if (label) {
      const existingLabel = state.labels[label] || {};

      newLabels = {
        ...state.labels,
        [label]: {
          ...existingLabel,
          statusCode
        }
      };
    } else {
      newLabels = {...state.labels};
    }

    if (idList.length) {
      newMeta = setResourceMeta({
        meta: state.meta,
        newMeta: {statusCode},
        resources: idList,
        mergeMeta: true,
        initialResourceMeta: {
          ...initialResourceMetaState,
          ...initialResourceMeta
        }
      });
    } else {
      newMeta = state.meta;
    }

    return {
      ...state,
      labels: newLabels,
      meta: newMeta
    };
  };
}
