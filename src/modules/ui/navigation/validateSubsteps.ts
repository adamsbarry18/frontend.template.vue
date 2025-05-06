import { Substep } from './step-interfaces';

const areSubstepsValid = (substeps: unknown): substeps is Substep[] => {
  if (!Array.isArray(substeps)) {
    return false;
  }

  return substeps.every((substep) => {
    const { id, label, disabled, message, status } = substep;

    const isIdValid = id !== undefined;
    const isLabelValid = typeof label === 'string';
    const isDisabledValid = disabled === undefined || typeof disabled === 'boolean';
    const isMessageValid = message === undefined || typeof message === 'string';
    const isStatusValid = ['EMPTY', 'ERROR', 'SUCCESS', 'TODO', 'WARNING'].includes(status);

    return isIdValid && isLabelValid && isDisabledValid && isMessageValid && isStatusValid;
  });
};

export default areSubstepsValid;
