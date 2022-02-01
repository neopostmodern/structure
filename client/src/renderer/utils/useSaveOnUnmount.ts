import { isEqual } from 'lodash';
import { useEffect } from 'react';

const useSaveOnUnmount = <FormDataType>(
  {
    onSubmit,
    defaultValues,
  }: {
    onSubmit: (formData: FormDataType) => void;
    defaultValues: FormDataType;
  },
  { getValues }: { getValues: () => FormDataType }
) => {
  useEffect(() => {
    return () => {
      const formValues = getValues();
      if (isEqual(formValues, defaultValues)) {
        return;
      }
      // todo: validate here too
      onSubmit(formValues as FormDataType);
    };
  }, [getValues]);
};

export default useSaveOnUnmount;
