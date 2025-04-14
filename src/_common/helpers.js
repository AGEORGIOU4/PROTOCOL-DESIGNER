export const GetLetter = (num) => {
  var letter = String.fromCharCode(num + 65);
  return letter;
};

export const truncateText = (text, maxLength) => {
  try {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.slice(0, maxLength) + "...";
    }
  } catch (e) {
    console.log(e);
  }
};

import { CListGroupItem } from "@coreui/react-pro";

export const TitleBar = ({ title }) => {
  return (
    <CListGroupItem
      style={{ padding: "6px", marginBottom: "6px" }}
      className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small"
    >
      <strong>{title}</strong>
    </CListGroupItem>
  );
};

export const GetRandomColor = () => {
  let list = [
    "D0021B",
    "F5A623",
    "F8E71C",
    "8B572A",
    "7ED321",
    "417505",
    "BD10E0",
    "9013FE",
    "4A90E2",
  ];

  return "#" + list[Math.floor(Math.random() * 9)];
};
