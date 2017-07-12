import { actionTypes, setResourceMeta } from 'resourceful-redux';
import warning from './warning';

// This resets a state slice to be empty
export default function reset(resourceName) {
  return function(state, action) {
    if (action.type !== 'RESET_RESOURCE' || action.resourceName !== resourceName) {
      return state;
    }

    return {
      resources: {},
      meta: {}
      labels: {}
    };
  };
}

reset.resetResource = function(resourceName) {
  return {
    type: 'RESET_RESOURCE',
    resourceName
  };
}
