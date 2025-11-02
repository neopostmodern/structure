import { useEffect } from 'react'
import { UseFormReset } from 'react-hook-form'

const useSyncForm = <FormType, EntityType extends FormType>(
  reset: UseFormReset<FormType>,
  defaultValues: FormType,
  entityProp: EntityType,
) => {
  // observe changes of prop entity (because it stays identity-stable), but use picked value of defaultValues
  useEffect(() => {
    reset(defaultValues)
  }, [reset, entityProp])
}

export default useSyncForm
