import * as Yup from 'yup';

export function bookValidator() {
    let validationSchema = null;
    validationSchema = Yup.object().shape({
        title: Yup.string()
            .min(2, "*El título debe incluir al menos 2 caracteres.")
            .max(100, "*El título no debe superar los 100 caracteres.")
            .required("*El título es obligatorio."),
        author: Yup.string()
            .max(100, "*El autor no debe superar los 100 caracteres.")
            .required("*El autor es obligatorio."),
        category: Yup.string()
            .required("*La categoría es obligatoria."),
        support: Yup.string()
            .required("*El soporte es obligatorio."),
        publisher: Yup.string()
            .required("*La editorial es obligatoria."),

        sample: Yup.number()
            .required('*Ejemplares es obligatorio.')
            .positive("*La cantidad de ejemplares debe ser igual o mayor que 1.")
            .integer("*El campo no admite decimales.")
    });

    return validationSchema;
}
const exportedValidator = {
    bookValidator
}
export default exportedValidator;