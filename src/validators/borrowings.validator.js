import * as Yup from 'yup';

export function borrowingsValidator(isCreate) {
    let validationSchema = null;
    if (!isCreate) {
        validationSchema = Yup.object().shape({
            fromDate: Yup.date()
                .notRequired(),
            toDate: Yup.date()
                .required()
                .min(new Date(), '*La fecha debe ser posterior a la fecha inicial del préstamo.')
        });
    } else {
        validationSchema = Yup.object().shape({
            book: Yup.string()
                .required("*El recurso es obligatorio."),
            member: Yup.string()
                .required("*El socio es obligatorio."),
            fromDate: Yup.date()
                .notRequired(),
            toDate: Yup.date()
                .required()
                .min(new Date(), '*La fecha debe ser posterior a la fecha inicial del préstamo.')
        });
    }

    return validationSchema;
}
const exportedValidator = {
    borrowingsValidator
}
export default exportedValidator;