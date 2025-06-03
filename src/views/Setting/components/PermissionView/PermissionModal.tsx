import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormDialog } from "components/Dialogs";
import { IOSSwitch } from "components/Switchs";
import { BUTTON } from "constants/button";
import { ROLE_OPTIONS } from "constants/role/roleOptions";
import { DIRECTION_ROUTE_OPTIONS } from "constants/role/routerDirection";
import { PERMISSION_VALUE, ROLE_TYPE, TGroupPermission } from "constants/role";
import { getDraftSafeSelector, useAppSelector } from "hooks/reduxHook";
import useAuth from "hooks/useAuth";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { createRoleAction, updateRoleAction } from "store/redux/roles/slice";
import { TRole } from "types/Permission";
import { TSelectOption } from "types/SelectOption";
import { TSx } from "types/Styles";
import { showWarning } from "utils/toast";
import { ROLE_LABEL } from "constants/role/label";
import { USER_LABEL } from "constants/user/label";
import { isMatchRoles } from "utils/roleUtils";
import { permissionSchema } from "validations/permission";
import { SETTING_LABEL } from "constants/setting/label";
import { findOption } from "utils/option";

interface PermissionDTO {
  name: string;
  data: TRole["data"];
  default_router: string;
  id?: string;
}

interface Props {
  open: boolean;
  title?: string;
  isShowInputEmail?: boolean;
  onClose: () => void;
  row?: TRole;
  roles?: TRole[];
}

const defaultExpande = ROLE_OPTIONS.reduce(
  (prev, current) => ({ ...prev, [current.name]: false }),
  {},
);

const PermissionModal = (props: Props) => {
  const { title, open, onClose, row, roles = [] } = props;
  const {
    setValue,
    clearErrors,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PermissionDTO>({
    resolver: yupResolver(permissionSchema) as Resolver<any, any>,
  });

  const theme = useTheme();
  const { user } = useAuth();

  const roleSelectOptions = useAppSelector(getDraftSafeSelector("roles")).roleSelectOptions;

  const roleItem = watch();
  const { data, name = "", default_router = "", id = "" } = roleItem;

  const [formState, setFormState] = useState({ loading: false, error: false });
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>(defaultExpande);

  const handleSubmitPopup = useCallback(
    async (form: PermissionDTO) => {
      if (!form.data) {
        showWarning(ROLE_LABEL.select_role_please);
        return;
      }
      setFormState((prev) => ({ ...prev, loading: true }));
      const result = row?.id
        ? await updateRoleAction({ ...form, id: row.id })
        : await createRoleAction(form);
      if (result) {
        setFormState((prev) => ({ ...prev, loading: false, error: false }));
        onClose();
      } else {
        setFormState((prev) => ({ ...prev, loading: false, error: true }));
      }
    },
    [onClose, row?.id],
  );

  const findLengthPermissonGroupByRoleType = useCallback(
    (permission: TGroupPermission, rolItemData: TRole["data"], roleType: ROLE_TYPE) => {
      return permission.roles.reduce((prev: number, current) => {
        prev += rolItemData?.[permission.name]?.[current.name] === roleType ? 1 : 0;
        return prev;
      }, 0);
    },
    [],
  );

  const handleChangePermission = useCallback(
    (permission: TGroupPermission, roleName: string, roleType: ROLE_TYPE) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRoleItem = {
          ...roleItem,
          data: {
            ...data,
            [permission.name]:
              permission?.roles?.reduce((prev, current) => {
                return {
                  ...prev,
                  [current.name]:
                    data?.[permission.name]?.[current.name] || PERMISSION_VALUE.NO_PERMISSION,
                };
              }, {}) || {},
          },
        };

        newRoleItem.data[permission.name][roleName] = e.target.checked
          ? roleType
          : PERMISSION_VALUE.NO_PERMISSION;

        reset(newRoleItem);
      },
    [data, reset, roleItem],
  );

  const handleChangePermissionGroup = useCallback(
    (permission: TGroupPermission, roleType: ROLE_TYPE) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newRoleItem: Partial<TRole> = {
          ...roleItem,
          data: {
            ...data,
            [permission.name]:
              permission?.roles?.reduce((prev, current) => {
                return {
                  ...prev,
                  [current.name]: e.target.checked
                    ? (roleType === PERMISSION_VALUE.READ_AND_WRITE &&
                        current.isShowRadioReadWrite === false) ||
                      (roleType === PERMISSION_VALUE.READ && current.isShowRadioRead === false)
                      ? current.name
                      : roleType
                    : PERMISSION_VALUE.NO_PERMISSION,
                };
              }, {}) || {},
          },
        };

        reset(newRoleItem);
        !expanded[permission.name] &&
          setExpanded({
            ...expanded,
            [permission.name]: true,
          });
      },
    [data, expanded, reset, roleItem],
  );

  const handleChangeTemplateRole = (option: Partial<TSelectOption> | null) => {
    const { label, value } = option || {};
    const roleData = findOption(roles, value);

    reset({ ...roleData, name: label });
  };

  useEffect(() => {
    if (open) {
      // nếu có row => đang xem 1 quyền trong bảng
      // nếu không có row => nhấn nút thêm => lấy quyền của user hiện tại show lên làm quyền mặc định để thêm
      if (row) {
        reset(row);
      } else {
        reset({ ...user?.role });
      }
    }
    clearErrors();
  }, [open, user?.role, reset, row, clearErrors]);

  const groupPermission = useMemo(() => groupBy(ROLE_OPTIONS, "group"), []);
  // chỉ show khi thêm mới
  const isShowRoleTemplate = !!roles.length && !row;

  const router = findOption(DIRECTION_ROUTE_OPTIONS, default_router, "value") || null;

  const roleName = id ? { value: id, label: name } : null;

  return (
    <FormDialog
      title={title}
      sizeTitle="h5"
      buttonText={row?.id ? BUTTON.UPDATE : BUTTON.ADD}
      maxWidth="lg"
      onClose={onClose}
      onSubmit={handleSubmit(handleSubmitPopup)}
      loading={formState.loading}
      open={open}
    >
      <FormGroup>
        <Box p={2}>
          <Box sx={{ mb: 3 }}>
            <Stack direction={"row"} spacing={2}>
              <TextField
                label={ROLE_LABEL.role_name}
                value={name}
                onChange={(e) => setValue("name", e.target.value, { shouldDirty: true })}
                placeholder={ROLE_LABEL.typing_role_name_please}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <Autocomplete
                disablePortal
                id="route-autocomplete"
                options={DIRECTION_ROUTE_OPTIONS}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={ROLE_LABEL.default_router}
                    error={!!errors.default_router}
                    helperText={errors.default_router?.message}
                  />
                )}
                value={router}
                onChange={(_e, default_router) => {
                  setValue("default_router", default_router?.value?.toString() || "", {
                    shouldDirty: true,
                  });
                }}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                fullWidth
              />
            </Stack>
          </Box>

          {isShowRoleTemplate && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ ...styled.titleSection, mb: 2 }}>
                {SETTING_LABEL.role_template}
              </Typography>
              <Autocomplete
                disablePortal
                id="roles-autocomplete"
                options={roleSelectOptions}
                renderInput={(params) => <TextField {...params} label={USER_LABEL.role} />}
                value={roleName}
                onChange={(_e, role) => handleChangeTemplateRole(role)}
                isOptionEqualToValue={(option, value) => option.value === value.value}
              />
            </Box>
          )}

          <Stack
            display="flex"
            alignItems="center"
            justifyContent={"space-between"}
            direction="row"
          >
            <Typography sx={styled.titleSection}>{ROLE_LABEL.role_detail}</Typography>
            <Typography
              component={"span"}
              onMouseDown={() => {
                const checkAll = mapValues(
                  expanded,
                  () => !Object.values(expanded).every((item: boolean) => item),
                );
                setExpanded(checkAll);
              }}
              sx={{
                ...styled.linkSection,
                color: theme.palette.primary.main,
                ...(Object.values(expanded).every((item: boolean) => item) && {
                  opacity: 1,
                }),
              }}
            >
              <span>{ROLE_LABEL.role_tab_toggle}</span>
              <ExpandMoreIcon
                sx={{
                  transform: "rotate(0deg)",
                  transition: "transform 0.15s linear",
                  ...(Object.values(expanded).every((item: boolean) => item) && {
                    transform: "rotate(180deg)",
                  }),
                }}
              />
            </Typography>
          </Stack>

          {Object.keys(groupPermission).map((group) => {
            return (
              <React.Fragment key={group}>
                {/* <Typography sx={styled.groupName}>{group}</Typography> */}
                <Box height={50} />
                {groupPermission[group].map((permission: TGroupPermission) => {
                  const groupPermissionOfUser = user?.role?.data?.[permission.name];

                  let permissionCount = user?.is_superuser
                    ? permission.roles.length
                    : groupPermissionOfUser
                      ? Object.values(groupPermissionOfUser).filter((item) => {
                          return isMatchRoles(item, user?.is_superuser);
                        }).length
                      : 0;

                  if (!isMatchRoles(groupPermissionOfUser, user?.is_superuser)) {
                    return null;
                  }
                  const permissionReadAndWriteLength = findLengthPermissonGroupByRoleType(
                    permission,
                    data,
                    PERMISSION_VALUE.READ_AND_WRITE,
                  );

                  const permissionReadOnlyLength = findLengthPermissonGroupByRoleType(
                    permission,
                    data,
                    PERMISSION_VALUE.READ,
                  );

                  const isHiddenTotalReadAndWriteRole = permission.roles.reduce((prev, cur) => {
                    const isHidden = cur.isShowRadioReadWrite === false ? 1 : 0;
                    return (prev += isHidden);
                  }, 0);

                  const isHiddenTotalReadRole = permission.roles.reduce((prev, cur) => {
                    const isHidden = cur.isShowRadioRead === false ? 1 : 0;
                    return (prev += isHidden);
                  }, 0);

                  return (
                    <Box key={permission.name} sx={styled.groupItem}>
                      <Grid
                        container
                        sx={{
                          ...styled.roleHeader,
                          backgroundColor: theme.palette.background.neutral,
                        }}
                        spacing={1}
                      >
                        <Grid item xs={4}>
                          <Stack direction="column" spacing={1}>
                            <Typography sx={styled.titleGroupPermission}>
                              {permission.label}
                            </Typography>
                            <Typography
                              component={"span"}
                              onMouseDown={() => {
                                setExpanded({
                                  ...expanded,
                                  [permission.name]: !expanded[permission.name],
                                });
                              }}
                              sx={{
                                ...styled.linkSection,
                                color: theme.palette.primary.main,
                                ...(expanded[permission.name] && {
                                  opacity: 1,
                                }),
                              }}
                            >
                              <span>{`${permissionCount} ${SETTING_LABEL.role}`}</span>
                              <ExpandMoreIcon
                                sx={{
                                  transform: "rotate(0deg)",
                                  transition: "transform 0.15s linear",
                                  ...(expanded[permission.name] && {
                                    transform: "rotate(180deg)",
                                  }),
                                }}
                              />
                            </Typography>
                          </Stack>
                        </Grid>
                        <Grid item xs={4}>
                          {isHiddenTotalReadAndWriteRole !== permissionCount && (
                            <Stack direction="column" spacing={1}>
                              <Typography>{`${ROLE_LABEL.read_and_write}${
                                permissionReadAndWriteLength > 0
                                  ? ` (${permissionReadAndWriteLength})`
                                  : ""
                              }`}</Typography>
                              <IOSSwitch
                                sx={{ mt: 1 }}
                                checked={permissionReadAndWriteLength > 0}
                                onChange={handleChangePermissionGroup(
                                  permission,
                                  PERMISSION_VALUE.READ_AND_WRITE,
                                )}
                              />
                            </Stack>
                          )}
                        </Grid>
                        <Grid item xs={4}>
                          {isHiddenTotalReadRole !== permissionCount && (
                            <Stack direction="column" spacing={1}>
                              <Typography>{`${ROLE_LABEL.read_only}${
                                permissionReadOnlyLength > 0 ? ` (${permissionReadOnlyLength})` : ""
                              }`}</Typography>
                              <IOSSwitch
                                sx={{ mt: 1 }}
                                checked={permissionReadOnlyLength > 0}
                                onChange={handleChangePermissionGroup(
                                  permission,
                                  PERMISSION_VALUE.READ,
                                )}
                              />
                            </Stack>
                          )}
                        </Grid>
                      </Grid>
                      {expanded[permission.name] && (
                        <Grow in={expanded[permission.name]}>
                          <Grid container sx={{ p: 2 }} display="flex" alignItems="center">
                            {permission.roles.map((role) => {
                              return isMatchRoles(
                                groupPermissionOfUser?.[role.name],
                                user?.is_superuser,
                              ) ? (
                                <Grid
                                  container
                                  item
                                  xs={12}
                                  key={role.name}
                                  sx={{ borderBottom: "1px solid #eee" }}
                                >
                                  <Grid item xs={4} sx={{ ...styled.permissionItem, pr: 2 }}>
                                    <Typography fontSize={"0.82rem"} fontWeight={"600"}>
                                      {role.label}
                                    </Typography>
                                    {role.description && (
                                      <Typography fontSize={"0.7rem"}>
                                        {role.description}
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item xs={4} sx={styled.permissionItem}>
                                    {role.isShowRadioReadWrite !== false && (
                                      <IOSSwitch
                                        checked={
                                          data?.[permission.name]?.[role.name] ===
                                          PERMISSION_VALUE.READ_AND_WRITE
                                        }
                                        onChange={handleChangePermission(
                                          permission,
                                          role.name,
                                          PERMISSION_VALUE.READ_AND_WRITE,
                                        )}
                                      />
                                    )}
                                  </Grid>
                                  <Grid item xs={4} sx={styled.permissionItem}>
                                    {role.isShowRadioRead !== false && (
                                      <IOSSwitch
                                        checked={
                                          data?.[permission.name]?.[role.name] ===
                                          PERMISSION_VALUE.READ
                                        }
                                        onChange={handleChangePermission(
                                          permission,
                                          role.name,
                                          PERMISSION_VALUE.READ,
                                        )}
                                      />
                                    )}
                                  </Grid>
                                </Grid>
                              ) : null;
                            })}
                          </Grid>
                        </Grow>
                      )}
                    </Box>
                  );
                })}
              </React.Fragment>
            );
          })}
        </Box>
      </FormGroup>
    </FormDialog>
  );
};

export default PermissionModal;

const styled: TSx<
  | "titleSection"
  | "linkSection"
  | "groupName"
  | "groupItem"
  | "roleHeader"
  | "titleGroupPermission"
  | "permissionItem"
> = {
  titleSection: {
    fontWeight: 700,
    mb: 1,
  },
  linkSection: {
    cursor: "pointer",
    opacity: 0.7,
    transition: "all .2s ease-in-out",
    fontWeight: 600,
    fontSize: "0.82rem",
    display: "flex",
    alignItems: "center",
    "&: hover": {
      opacity: 1,
    },
  },

  roleHeader: {
    borderRadius: "8px",
    p: 2,
    border: "2px solid #eee",
  },
  permissionItem: {
    py: 2,
  },
  titleGroupPermission: {
    fontWeight: 600,
  },
  groupName: {
    fontWeight: 600,
    fontSize: "0.82rem",
    pt: 1,
    pb: 2,
  },
  groupItem: {
    "&:not(:last-child)": {
      mb: 2,
    },
  },
};
