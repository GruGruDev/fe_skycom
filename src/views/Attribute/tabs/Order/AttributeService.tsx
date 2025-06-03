import { orderApi } from "apis/order";
import { AttributeIncludeFormModalCollapse } from "components/Collapses";
import { TYPE_FORM_FIELD } from "constants/index";
import { LABEL } from "constants/label";
import { ROLE_ATTRIBUTE, ROLE_TAB } from "constants/role";
import useAuth from "hooks/useAuth";
import { TAttribute } from "types/Attribute";
import { checkPermission } from "utils/roleUtils";
import Content from "views/Attribute/components/Content";

type AttributeControllerType = {
  data: { id: string; name: string }[];
  loading: boolean;
  setData: React.Dispatch<
    React.SetStateAction<{ data: { id: string; name: string }[]; loading: boolean }>
  >;
  attributeName: string;
  title: string;
  isActiveSwitch?: boolean;
  endpoint: string;
};

const OrderAttributeService = ({
  data,
  setData,
  loading,
  attributeName,
  title,
  endpoint = "",
  isActiveSwitch,
}: AttributeControllerType) => {
  const { user } = useAuth();

  const handleCreateAttribute = async ({ name }: TAttribute) => {
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.create<{ id: string; name: string }>({
      endpoint: `${endpoint}/`,
      params: { name },
    });
    if (result?.data) {
      setData((prev) => ({ ...prev, data: [result.data, ...prev.data] }));
      return true;
    }
    setData((prev) => ({ ...prev, loading: false }));
    return false;
  };

  const handleUpdateAttribute = async (att: TAttribute) => {
    const { id, name, is_shown } = att;
    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.update<{ id: string; name: string }>({
      endpoint: `${endpoint}/${id}/`,
      params: { name, is_shown: is_shown?.toString() },
    });
    if (result?.data) {
      const newAttributes = [...data];
      const idx = newAttributes.findIndex((item) => item.id === id);
      newAttributes.splice(idx, 1, result.data);
      setData((prev) => ({ ...prev, data: newAttributes }));
      return true;
    }
    setData((prev) => ({ ...prev, loading: false }));
    return false;
  };

  const handleDeleteAttribute = async (att: TAttribute) => {
    const { id } = att;

    const index = data.findIndex((item) => item.id === id);

    setData((prev) => ({ ...prev, loading: true }));
    const result = await orderApi.remove<{ id: string; name: string }>({
      endpoint: `${endpoint}/${id}/`,
    });
    if (result) {
      const newAttributes = [...data];
      newAttributes.splice(index, 1);
      setData((prev) => ({ ...prev, data: newAttributes }));
      return true;
    }
    setData((prev) => ({ ...prev, loading: false }));
    return false;
  };

  const handleSwitchAction = async ({ id, is_shown, type }: TAttribute) => {
    setData((prev) => ({ ...prev, loading: true }));
    await handleUpdateAttribute({ type, is_shown, id });
    setData((prev) => ({ ...prev, loading: false }));
  };

  const isReadAndWriteAttribute = checkPermission(
    user?.role?.data?.[ROLE_TAB.ATTRIBUTE]?.[ROLE_ATTRIBUTE.ORDER],
    user,
  ).isReadAndWrite;

  return (
    <AttributeIncludeFormModalCollapse
      attributeBody={({ row }) => (
        <Content
          handleActiveSwitch={isActiveSwitch ? handleSwitchAction : undefined}
          row={row}
          type={attributeName}
        />
      )}
      funcContentRender={() => [
        {
          type: TYPE_FORM_FIELD.TEXTFIELD,
          name: attributeName,
          label: LABEL.ATTRIBUTE,
          placeholder: LABEL.ATTRIBUTE,
        },
      ]}
      state={{ loading, error: false }}
      formDefaultData={(row) => ({ [attributeName]: row?.name })}
      handleCreateAction={isReadAndWriteAttribute ? handleCreateAttribute : undefined}
      handleDeleteAction={isReadAndWriteAttribute ? handleDeleteAttribute : undefined}
      handleEditAction={isReadAndWriteAttribute ? handleUpdateAttribute : undefined}
      data={data}
      title={title}
      type={attributeName}
    />
  );
};

export default OrderAttributeService;
