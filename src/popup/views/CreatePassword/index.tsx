import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { object as YupObject } from "yup";
import { createAccount, publicKeySelector } from "popup/ducks/authServices";
import { Onboarding } from "popup/components/Layout/Fullscreen/Onboarding";
import Form from "popup/components/Form";
import {
  FormError,
  FormRow,
  FormCheckboxField,
  FormCheckboxLabel,
  FormSubmitButton,
  FormTextField,
} from "popup/basics";
import {
  password as passwordValidator,
  confirmPassword as confirmPasswordValidator,
  termsOfUse as termsofUseValidator,
} from "popup/components/Form/validators";
import { EMOJI } from "popup/constants";
import { history } from "popup/App";

const CreatePassword = () => {
  const publicKey = useSelector(publicKeySelector);
  const dispatch = useDispatch();

  interface FormValues {
    password: string;
    confirmPassword: string;
    termsOfUse: boolean;
  }

  const initialValues: FormValues = {
    password: "",
    confirmPassword: "",
    termsOfUse: false,
  };

  const handleSubmit = async (values: FormValues) => {
    await dispatch(createAccount(values.password));
  };

  const CreatePasswordSchema = YupObject().shape({
    password: passwordValidator,
    confirmPassword: confirmPasswordValidator,
    termsOfUse: termsofUseValidator,
  });

  useEffect(() => {
    if (publicKey) {
      history.push("/mnemonic-phrase");
    }
  }, [publicKey]);

  return (
    <Onboarding
      header="Create a password"
      subheader="Min 10 characters"
      icon={EMOJI.see_no_evil}
      goBack={() => window.location.replace("/")}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={CreatePasswordSchema}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <>
              <FormRow>
                <FormTextField
                  autoComplete="off"
                  name="password"
                  placeholder="New password"
                  type="password"
                />
                <FormError name="password" />
              </FormRow>
              <FormRow>
                <FormTextField
                  autoComplete="off"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  type="password"
                />
                <FormError name="confirmPassword" />
              </FormRow>
              <FormRow>
                <FormCheckboxField name="termsOfUse" />
                <FormCheckboxLabel htmlFor="termsOfUse">
                  I have read and agree to <a href="/ac">Terms of Use</a>
                </FormCheckboxLabel>
                <FormError name="termsOfUse" />
              </FormRow>
              <FormRow>
                <FormSubmitButton
                  buttonCTA="Log In"
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                />
              </FormRow>
            </>
          </Form>
        )}
      </Formik>
    </Onboarding>
  );
};

export default CreatePassword;