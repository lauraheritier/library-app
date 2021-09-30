import * as Yup from 'yup';

export function usersValidator(isCreate) {
    let validationSchema = null;
    validationSchema = Yup.object().shape({
        first_name: Yup.string()
            .min(2, "*El nombre debe incluir al menos 2 caracteres.")
            .max(100, "*El nombre no debe superar los 100 caracteres.")
            .required("*El nombre es obligatorio."),
        last_name: Yup.string()
            .min(2, "*El apellido debe incluir al menos 2 caracteres.")
            .max(100, "*El apellido no debe superar los 100 caracteres.")
            .required("*El apellido es obligatorio."),
        telephone: Yup.number()
            .positive("Ingrese un teléfono válido.")
            .integer("Ingrese un teléfono válido")
            .min(8, "Ingrese un teléfono válido"),
        email: Yup.string()
            .email('Ingrese una dirección de email válida.')
            .required()
            .max(100, "*El nombre no debe superar los 100 caracteres."),
        dni: Yup.number()
            .positive("Ingrese un dni válido.")
            .integer("Ingrese un dni válido")
            .min(7, "Mín 7")
            .required("El dni es obligatorio."),
        address: Yup.string()
            .max(100, "*La dirección no debe superar los 100 caracteres.")
    });

    return validationSchema;
}
const exportedValidator = {
    usersValidator
}
export default exportedValidator;