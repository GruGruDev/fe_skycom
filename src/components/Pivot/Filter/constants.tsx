import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EmailIcon from "@mui/icons-material/Email";
import EventIcon from "@mui/icons-material/Event";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import GroupIcon from "@mui/icons-material/Group";
import KeyIcon from "@mui/icons-material/Key";
import LinkIcon from "@mui/icons-material/Link";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import NotesIcon from "@mui/icons-material/Notes";
import PercentIcon from "@mui/icons-material/Percent";
import PersonIcon from "@mui/icons-material/Person";
import PinIcon from "@mui/icons-material/Pin";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
import { Conjunction, Mode, Operator } from "./AbstractFilterItem";
import { AirTableColumnTypes } from "./types";
import { LABEL } from "constants/label";

export const MAP_OPERATOR_WITH_COLUMN_TYPE = {
  [Operator.EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.NOT_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.GREATER]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.SMALLER]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.GREATER_OR_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.SMALLER_OR_EQUAL]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.IS_BETWEEN]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.IS_EXCEPT]: [
    AirTableColumnTypes.AUTO_NUMBER,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.DURATION,
  ],
  [Operator.CONTAINS]: [
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.ATTACHMENT,
  ],
  [Operator.DOES_NOT_CONSTAINS]: [
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.PHONE_NUMBER,
  ],
  [Operator.IS]: [
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
  ],
  [Operator.IS_NOT]: [
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
  ],
  [Operator.IS_ANY_OF]: [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER],
  [Operator.IS_NONE_OF]: [AirTableColumnTypes.SINGLE_SELECT, AirTableColumnTypes.SINGLE_USER],
  [Operator.IS_EXACTLY]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_ANY_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_ALL_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.HAS_NONE_OF]: [AirTableColumnTypes.MULTIPLE_SELECT, AirTableColumnTypes.MULTIPLE_USER],
  [Operator.IS_WITHIN]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_BEFORE]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_AFTER]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_ON_OR_BEFORE]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_ON_OR_AFTER]: [AirTableColumnTypes.DATE, AirTableColumnTypes.DATETIME],
  [Operator.IS_EMPTY]: [
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.ATTACHMENT,
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.MULTIPLE_SELECT,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.MULTIPLE_USER,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.DURATION,
    AirTableColumnTypes.PHONE_NUMBER,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.AUTO_NUMBER,
  ],
  [Operator.IS_NOT_EMPTY]: [
    AirTableColumnTypes.SINGLE_LINE_TEXT,
    AirTableColumnTypes.LONG_TEXT,
    AirTableColumnTypes.ATTACHMENT,
    AirTableColumnTypes.CHECKBOX,
    AirTableColumnTypes.MULTIPLE_SELECT,
    AirTableColumnTypes.SINGLE_SELECT,
    AirTableColumnTypes.SINGLE_USER,
    AirTableColumnTypes.MULTIPLE_USER,
    AirTableColumnTypes.DATE,
    AirTableColumnTypes.DATETIME,
    AirTableColumnTypes.DURATION,
    AirTableColumnTypes.PHONE_NUMBER,
    AirTableColumnTypes.EMAIL,
    AirTableColumnTypes.URL,
    AirTableColumnTypes.NUMBER,
    AirTableColumnTypes.CURRENCY,
    AirTableColumnTypes.PERCENT,
    AirTableColumnTypes.AUTO_NUMBER,
  ],
};

export const AirTableColumnIcons = {
  [AirTableColumnTypes.LINK_TO_RECORD]: <ReadMoreIcon />,
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: <TextFormatIcon />,
  [AirTableColumnTypes.LONG_TEXT]: <NotesIcon />,
  [AirTableColumnTypes.ATTACHMENT]: <AttachmentIcon />,
  [AirTableColumnTypes.CHECKBOX]: <CheckBoxIcon />,
  [AirTableColumnTypes.MULTIPLE_SELECT]: <RuleOutlinedIcon />,
  [AirTableColumnTypes.SINGLE_SELECT]: <ExpandCircleDownOutlinedIcon />,
  [AirTableColumnTypes.MULTIPLE_USER]: <GroupIcon />,
  [AirTableColumnTypes.SINGLE_USER]: <PersonIcon />,
  [AirTableColumnTypes.DATE]: <EventIcon />,
  [AirTableColumnTypes.DATETIME]: <WorkHistoryIcon />,
  [AirTableColumnTypes.DURATION]: <AccessTimeIcon />,
  [AirTableColumnTypes.PHONE_NUMBER]: <LocalPhoneIcon />,
  [AirTableColumnTypes.EMAIL]: <EmailIcon />,
  [AirTableColumnTypes.URL]: <LinkIcon />,
  [AirTableColumnTypes.NUMBER]: <PinIcon />,
  [AirTableColumnTypes.CURRENCY]: <AttachMoneyIcon />,
  [AirTableColumnTypes.PERCENT]: <PercentIcon />,
  [AirTableColumnTypes.AUTO_NUMBER]: <KeyIcon />,
};

export const AirTableConjunctionLabel = {
  [Conjunction.AND]: "And",
  [Conjunction.OR]: "Or",
};

export const AirTableModeLabels = {
  [Mode.TODAY]: LABEL.TODAY,
  // [Mode.TOMORROW]:LABEL.TOMORROW,
  [Mode.YESTERDAY]: LABEL.YESTERDAY,
  [Mode.ONE_WEEK_AGO]: LABEL.ONE_WEEK_AGO,
  [Mode.ONE_WEEK_FROM_NOW]: LABEL.ONE_WEEK_FROM_NOW,
  [Mode.ONE_MONTH_AGO]: LABEL.ONE_MONTH_AGO,
  [Mode.ONE_MONTH_FROM_NOW]: LABEL.ONE_MONTH_FROM_NOW,
  [Mode.NUMBER_OF_DAYS_AGO]: LABEL.NUMBER_OF_DAYS_AGO,
  //[Mode.NUMBER_OF_DAYS_FROM_NOW]:LABEL.NUMBER_OF_DAYS_FROM_NOW,
  [Mode.EXACT_DATE]: LABEL.EXACT_DATE,
  [Mode.THE_PAST_WEEK]: LABEL.THE_PAST_WEEK,
  [Mode.THE_PAST_MONTH]: LABEL.THE_PAST_MONTH,
  [Mode.THE_PAST_YEAR]: LABEL.THE_PAST_YEAR,
  // [Mode.THE_NEXT_WEEK]:LABEL.THE_NEXT_WEEK,
  // [Mode.THE_NEXT_MONTH]:LABEL.THE_NEXT_MONTH,
  // [Mode.THE_NEXT_YEAR]:LABEL.THE_NEXT_YEAR,
  // [Mode.THE_NEXT_NUMBER_OF_DAYS]:LABEL.THE_NEXT_NUMBER_OF_DAYS,
  [Mode.THE_PAST_NUMBER_OF_DAYS]: LABEL.THE_PAST_NUMBER_OF_DAYS,
};

export const AirTableOperatorLabels = {
  [Operator.EQUAL]: "=",
  [Operator.NOT_EQUAL]: "!=",
  [Operator.GREATER]: ">",
  [Operator.SMALLER]: "<",
  [Operator.GREATER_OR_EQUAL]: ">=",
  [Operator.SMALLER_OR_EQUAL]: "<=",
  [Operator.IS_BETWEEN]: LABEL.IS_BETWEEN,
  [Operator.IS_EXCEPT]: LABEL.IS_EXCEPT,
  [Operator.IS_EMPTY]: LABEL.IS_EMPTY,
  [Operator.IS_NOT_EMPTY]: LABEL.IS_NOT_EMPTY,
  [Operator.CONTAINS]: LABEL.CONTAINS,
  [Operator.DOES_NOT_CONSTAINS]: LABEL.DOES_NOT_CONSTAINS,
  [Operator.IS]: LABEL.IS,
  [Operator.IS_NOT]: LABEL.IS_NOT,
  [Operator.IS_ANY_OF]: LABEL.IS_ANY_OF,
  [Operator.IS_NONE_OF]: LABEL.IS_NONE_OF,
  [Operator.IS_EXACTLY]: LABEL.IS_EXACTLY,
  [Operator.HAS_ANY_OF]: LABEL.HAS_ANY_OF,
  [Operator.HAS_ALL_OF]: LABEL.HAS_ALL_OF,
  [Operator.HAS_NONE_OF]: LABEL.HAS_NONE_OF,
  [Operator.IS_BEFORE]: LABEL.IS_BEFORE,
  [Operator.IS_AFTER]: LABEL.IS_AFTER,
  [Operator.IS_ON_OR_BEFORE]: LABEL.IS_ON_OR_BEFORE,
  [Operator.IS_ON_OR_AFTER]: LABEL.IS_ON_OR_AFTER,
  [Operator.IS_WITHIN]: LABEL.IS_WITHIN,
};

export const BEFieldType = {
  [AirTableColumnTypes.LINK_TO_RECORD]: "link_to_record",
  [AirTableColumnTypes.SINGLE_LINE_TEXT]: "text",
  [AirTableColumnTypes.LONG_TEXT]: "text",
  [AirTableColumnTypes.ATTACHMENT]: "attachment",
  [AirTableColumnTypes.CHECKBOX]: "text",
  [AirTableColumnTypes.MULTIPLE_SELECT]: "multiple_select",
  [AirTableColumnTypes.SINGLE_SELECT]: "single_select",
  [AirTableColumnTypes.SINGLE_USER]: "single_user",
  [AirTableColumnTypes.MULTIPLE_USER]: "multiple_user",
  [AirTableColumnTypes.DATE]: "date",
  [AirTableColumnTypes.DATETIME]: "datetime",
  [AirTableColumnTypes.DURATION]: "duration",
  [AirTableColumnTypes.PHONE_NUMBER]: "text",
  [AirTableColumnTypes.EMAIL]: "text",
  [AirTableColumnTypes.URL]: "url",
  [AirTableColumnTypes.NUMBER]: "number",
  [AirTableColumnTypes.CURRENCY]: "currency",
  [AirTableColumnTypes.PERCENT]: "percent",
  [AirTableColumnTypes.AUTO_NUMBER]: "auto_number",
};
