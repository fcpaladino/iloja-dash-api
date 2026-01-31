import * as Yup from "yup";

export const yupValidate = (
  schemaFactory: (id?: string) => Yup.ObjectSchema<any>,
  location: string = 'body',
  paramName: string = "id"
) => {
  return async (req, res, next) => {
    try {
      const id = req.params?.[paramName];
      const data = req[location];
      const schema = schemaFactory(id);
      req[location] = await schema.validate(data, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err) {
      const errors = {};
      err.inner.forEach((e) => {
        if (!errors[e.path]) {
          errors[e.path] = e.message;
        }
      });
      return res.status(400).json({ errors });
    }
  };
};
