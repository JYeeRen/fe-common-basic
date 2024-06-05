import { Button, ButtonProps, Form, FormInstance } from "antd";
import { FC, PropsWithChildren, useEffect, useState } from "react";

interface SubmitButtonProps extends Omit<ButtonProps, "form"> {
  form: FormInstance;
}

export const SubmitButton: FC<PropsWithChildren<SubmitButtonProps>> = ({
  form,
  children,
  ...restProps
}) => {
  const [submittable, setSubmittable] = useState<boolean>(false);

  // Watch all values
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => {
        setSubmittable(true);
      })
      .catch((err) => {
        setSubmittable(err.errorFields.length === 0);
      });
  }, [form, values]);

  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      {...restProps}
    >
      {children}
    </Button>
  );
};
