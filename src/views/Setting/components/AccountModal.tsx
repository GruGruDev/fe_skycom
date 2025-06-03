import { FormPopup, PropsContentRender } from "components/Popups";
import { BUTTON } from "constants/button";
import { TYPE_FORM_FIELD } from "constants/index";
import { USER_LABEL } from "constants/user/label";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import { memo, useState } from "react";
import { createUser, updateUser } from "store/redux/users/action";
import { TAttribute } from "types/Attribute";
import { TSelectOption } from "types/SelectOption";
import { TUser } from "types/User";
import { filterIsShowOptions } from "utils/option";
import { userSchema } from "validations/user";

export const account = (option: {
  roleOptions: TSelectOption[];
  activeDepartments: TAttribute[];
}): PropsContentRender[] => {
  return [
    {
      name: "name",
      label: USER_LABEL.name,
      placeholder: USER_LABEL.enter_name,
      type: TYPE_FORM_FIELD.TEXTFIELD,
      required: true,
    },
    {
      name: "email",
      label: "Email",
      placeholder: USER_LABEL.enter_email,
      type: TYPE_FORM_FIELD.TEXTFIELD,
      required: true,
    },
    {
      name: "phone",
      label: USER_LABEL.phone,
      placeholder: USER_LABEL.enter_phone,
      type: TYPE_FORM_FIELD.TEXTFIELD,
      required: true,
    },
    {
      name: "password",
      label: USER_LABEL.password,
      placeholder: USER_LABEL.enter_password,
      type: TYPE_FORM_FIELD.PASSWORD,
      required: true,
    },
    {
      name: "role",
      label: USER_LABEL.role,
      placeholder: USER_LABEL.select_role,
      type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
      options: option.roleOptions,
      required: true,
    },
    {
      name: "department",
      label: USER_LABEL.department,
      placeholder: USER_LABEL.select_department,
      type: TYPE_FORM_FIELD.MULTIPLE_SELECT,
      options: filterIsShowOptions(option.activeDepartments),
    },
  ];
};

type Props = {
  row?: Partial<TUser>;
  open: boolean;
  onClose: () => void;
  onRefresh?: () => void;
};

const AccountModal = ({ row, open, onClose, onRefresh }: Props) => {
  const roleOptions = useAppSelector(getDraftSafeSelector("roles")).roleSelectOptions;
  const { departments } = useAppSelector(getDraftSafeSelector("settings"));

  const [formState, setFormState] = useState({ loading: false, error: false });

  const handleCreateAccount = async (form: TUser) => {
    setFormState((prev) => ({ ...prev, loading: true }));
    const res = await createUser(form);
    if (res) {
      setFormState({ error: false, loading: false });

      onClose();
      onRefresh?.();
    } else {
      setFormState({ error: true, loading: false });
    }
  };

  const handleUpdateAccount = async (form: TUser) => {
    setFormState((prev) => ({ ...prev, loading: true }));
    const res = await updateUser({ ...form, id: row?.id });
    if (res) {
      setFormState({ error: false, loading: false });
      onClose();
      onRefresh?.();
    } else {
      setFormState({ error: true, loading: false });
    }
  };

  const title = row?.id ? BUTTON.UPDATE : BUTTON.ADD;
  const buttonText = row?.id ? BUTTON.UPDATE : BUTTON.ADD;
  const isCreate = !row?.id;

  const activeDepartments = departments.filter((item) => item.is_shown);

  return (
    <FormPopup
      loading={formState.loading}
      open={open}
      title={`${title} ${USER_LABEL.user}`}
      handleClose={onClose}
      handleSubmitPopup={row?.id ? handleUpdateAccount : handleCreateAccount}
      funcContentSchema={(yup) => userSchema(yup, isCreate)}
      buttonText={buttonText}
      funcContentRender={() => {
        return account({
          roleOptions,
          activeDepartments,
        });
      }}
      defaultData={row}
    />
  );
};

export default memo(AccountModal);
