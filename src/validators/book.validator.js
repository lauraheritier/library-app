import * as Yup from 'yup';

export function useBookValidator(isCreate, result, selectedItem1Description, selectedItem2Description, selectedItem3Description) {
    let validationSchema = null;
    if (!isCreate) {
        validationSchema = Yup.object().shape({
            title: Yup.string()
                .min(2, "*Names must have at least 2 characters")
                .max(100, "*Names can't be longer than 100 characters")
                .default(result.title)
                .required("*Name is required"),
            author: Yup.string()
                .max(100, "*Email must be less than 100 characters")
                .default(result.author)
                .required("*Email is required"),
            category: Yup.string()
                .default(selectedItem1Description)
                .required("*Category required"),
            support: Yup.string()
                .default(selectedItem3Description)
                .required("*Support required"),
            publisher: Yup.string()
                .default(selectedItem2Description)
                .required("*Publisher required"),
            sample: Yup.number()
                .required('*Ejemplares es obligatorio')
                .positive("*entry shold be > than 0")
                .default(result.sample)
                .integer("*input integer value")
        });
    }

    if (isCreate) {
        validationSchema = Yup.object().shape({
            title: Yup.string()
                .min(2, "*Names must have at least 2 characters")
                .max(100, "*Names can't be longer than 100 characters")
                .required("*Name is required"),
            author: Yup.string()
                .max(100, "*Email must be less than 100 characters")
                .required("*Email is required"),
            category: Yup.string()
                .required("*Category required"),
            support: Yup.string()
                .required("*Support required"),
            publisher: Yup.string()
                .required("*Publisher required"),
            sample: Yup.number()
                .required('*Ejemplares es obligatorio')
                .positive("*entry shold be > than 0")
                .integer("*input integer value")
        });
    }
}
export default useBookValidator;