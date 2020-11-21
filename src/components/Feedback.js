/*
This allows flexibility to change user feedback style or even just to
log errors.
*/

import Snackbar from 'react-native-snackbar';

export const feedback = (fieldName, error = '') => {
  if (!error) {
    Snackbar.show({
      text: 'Saved successfully',
      duration: Snackbar.LENGTH_SHORT,
    });
  } else if (fieldName) {
    Snackbar.show({
      text: `Error updating ${fieldName}: ${error}`,
      duration: Snackbar.LENGTH_LONG,
    });
  } else {
    Snackbar.show({
      text: `Error: ${error}`,
      duration: Snackbar.LENGTH_LONG,
    });
  }
};
