import * as Yup from 'yup';

export function categoriesValidator() {
    let validationSchema = null;
    validationSchema = Yup.object().shape({
        description: Yup.string()
            .min(2, "*El título debe incluir al menos 2 caracteres.")
            .max(100, "*El título no debe superar los 100 caracteres.")
            .required("*El título es obligatorio.")
    });

    return validationSchema;
}
const exportedValidator = {
    categoriesValidator
}
export default exportedValidator;