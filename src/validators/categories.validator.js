import * as Yup from 'yup';

export function categoriesValidator() {
    let validationSchema = null;
    validationSchema = Yup.object().shape({
        description: Yup.string()
            .min(2, "*La descripción debe incluir al menos 2 caracteres.")
            .max(100, "*La descripción no debe superar los 100 caracteres.")
            .required("*La descripción es obligatoria.")
    });

    return validationSchema;
}
const exportedValidator = {
    categoriesValidator
}
export default exportedValidator;