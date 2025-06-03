import { useState } from "react";
// @mui
import {
  Avatar,
  Dialog,
  InputAdornment,
  ListItem,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Scrollbar from "components/Scrollbar";

import SearchIcon from "@mui/icons-material/Search";
// components

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64;

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
};

export default function KanbanContactsDialog({ open, onClose }: Props) {
  const [filterName, setFilterName] = useState("");

  const contacts: any[] = [];

  const handleSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
  };

  const dataFiltered: any = applySortFilter({
    listData: contacts,
    filterName,
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack spacing={2} sx={{ p: 2.5, pb: 1 }}>
        <Typography variant="h6">
          Contacts <Typography component="span">({contacts.length})</Typography>
        </Typography>

        <TextField
          fullWidth
          value={filterName}
          onChange={handleSearchQuery}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.disabled", width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Scrollbar
        sx={{
          height: ITEM_HEIGHT * 6,
          p: 1,
          "& .MuiMenuItem-root": {
            px: 1.5,
            height: ITEM_HEIGHT,
            borderRadius: 0.75,
          },
        }}
      >
        {dataFiltered.map((contact: any) => (
          <MenuItem key={contact.id} onClick={onClose}>
            <ListItem sx={{ position: "relative" }}>
              <Avatar src={contact.avatar} />
            </ListItem>

            <ListItemText
              primaryTypographyProps={{ typography: "subtitle2", mb: 0.25 }}
              secondaryTypographyProps={{ typography: "caption" }}
              primary={contact.name}
              secondary={contact.email}
            />
          </MenuItem>
        ))}
      </Scrollbar>
    </Dialog>
  );
}

// ----------------------------------------------------------------------

function applySortFilter<T = Record<string, any>[]>({
  listData,
  filterName,
}: {
  listData: T[];
  filterName: string;
}) {
  if (filterName) {
    listData = listData.filter(
      (item: any) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.email.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    );
  }

  return listData;
}
