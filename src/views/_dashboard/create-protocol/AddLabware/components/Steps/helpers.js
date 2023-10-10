import { cilAperture, cilArrowRight, cilAvTimer, cilColorFill, cilMediaPause, cilMove, cilPencil, cilTrash } from '@coreui/icons'
import { cil3dRotate, cilLink, cilSwapVertical, cilTemperature } from '@coreui/icons-pro'

export const generateStepID = () => {
  let length = 4;

  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }

  let result = "";
  while (result.length < length) {
    result += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
  }
  return result
}

export const getColor = (action) => {
  switch (action) {
    case 'Delay':
      return 'warning';
    case 'Trash':
      return 'danger';
    default:
      return 'success'
  }
}

export const getIcons = (action) => {
  switch (action) {
    case 'Transfer':
      return cilArrowRight;
    case 'Mix':
      return cilColorFill;
    case 'Delay':
      return cilMediaPause;
    case 'Thermoblock':
      return cilTemperature;
    case 'Magnet':
      return cilLink;
    case 'Heater Shaker':
      return cilSwapVertical;
    case 'PCR':
      return cil3dRotate;
    case 'Centrifuge':
      return cilAperture;
    case 'Trash':
      return cilTrash;
  }
}

export const getDuration = (action) => {
  switch (action) {
    case 'Transfer':
      return '30';
    case 'Mix':
      return '15';
    case 'Delay':
      return '22';
    case 'Heater Shaker':
      return '10';
    case 'Magnet':
      return '45';
    case 'Thermoblock':
      return '60';
    case 'PCR':
      return '75';
    case 'Centrifuge':
      return '65';
    case 'Trash':
      return '5';
  }
}