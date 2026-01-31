import * as Yup from "yup";
import responseValidate from "../responses/responseValidate";

export const schemaValidate = (
  schemaFactory: (id?: string) => Yup.ObjectSchema<any>,
  location: string = 'body',
  paramName: string = "id"
) => {
  return async (req, res, next) => {
    try {
      const id = req.params?.[paramName];
      const data = req[location];
      const schema = schemaFactory(id);
      req[location] = await schema.validate(data, { abortEarly: false, stripUnknown: false });
      next();
    } catch (error) {
      const errors = {};
      let errortxt = 'Erro de validação';
      if(error.inner && Array.isArray(error.inner) && error.inner.length > 0) {
        errortxt = `${error.inner[0].path}: ${error.inner[0].message}`;
      }
      error.inner.forEach((e) => {
        if (!errors[e.path]) {
          errors[e.path] = e.message;
        }
      });
      return responseValidate(res, errortxt, { fields: errors });
    }
  };
};
