import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { EditAndDeletePopover } from "components/Popovers";
import { FormPopup, PropsContentRender } from "components/Popups";
import { BUTTON } from "constants/button";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TAttribute } from "types/Attribute";
import * as Yup from "yup";

export interface AttributeProps {
  row: TAttribute;
  title: string;
  index?: number;
  handleDeleteAction?: (row: TAttribute) => Promise<boolean>;
  handleEditAction?: (row: TAttribute) => Promise<boolean>;
  handleSwitchAction?: (row: TAttribute) => Promise<boolean>;
  type: string;
  state: { loading: boolean; error?: boolean };
  funcContentRender: (
    methods: UseFormReturn<TAttribute, object>,
    optional: unknown,
  ) => JSX.Element | PropsContentRender[];
  formSchema?: (yup: typeof Yup) => unknown;
  formDefaultData?: (row?: TAttribute) => unknown;
  attributeBody: (row: { row: TAttribute }) => JSX.Element;
  switchKey?: string;
  switchTooltip?: string;
}

export const CollapseAttributeItem = ({
  formDefaultData,
  row,
  handleDeleteAction,
  title,
  handleEditAction,
  handleSwitchAction,
  state,
  index = -1,
  type,
  formSchema,
  switchKey = "is_shown",
  switchTooltip,
  funcContentRender = () => [],
  attributeBody,
}: AttributeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSubmitAttribute = async (form: { [key: string]: string }) => {
    const res = await handleEditAction?.({
      ...form,
      type,
      name: form[type]?.trim(),
      id: row.id,
      index,
    });
    if (res) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <FormPopup
        transition
        open={isOpen}
        loading={state.loading}
        title={title}
        funcContentSchema={formSchema}
        funcContentRender={funcContentRender}
        buttonText={BUTTON.UPDATE}
        defaultData={formDefaultData ? formDefaultData(row) : undefined}
        handleClose={() => setIsOpen(false)}
        handleSubmitPopup={onSubmitAttribute}
      />

      <Stack direction="row" alignItems="center" display="flex" flex={1} p={1} pl={1}>
        <Stack display="flex" direction="row" alignItems="center" flex={1}>
          <Box width="100%">{attributeBody({ row: { index, ...row } })}</Box>
          {handleSwitchAction && (
            <Tooltip title={switchTooltip}>
              <Switch
                size="small"
                checked={Boolean(row[switchKey as keyof TAttribute])}
                onChange={(e) =>
                  handleSwitchAction({ ...row, type, [switchKey]: e.target.checked })
                }
              />
            </Tooltip>
          )}
        </Stack>
        {(handleEditAction || handleDeleteAction) && (
          <Stack
            style={iconColumnStyle}
            direction="row"
            alignItems={"center"}
            justifyContent={"space-around"}
          >
            <EditAndDeletePopover
              handleDelete={
                handleDeleteAction
                  ? async () =>
                      await handleDeleteAction({ id: row.id, name: row.name, type, index })
                  : undefined
              }
              handleEdit={handleEditAction ? () => setIsOpen(true) : undefined}
              attribute={row}
              status={state}
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

const iconColumnStyle = { minWidth: 80 };
