export const GetLetter = (num) => {
  var letter = String.fromCharCode(num + 65);
  return letter;
}

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength) + '...';
  }
}


import { CListGroupItem } from "@coreui/react-pro"

export const TitleBar = ({ title }) => {
  return (
    <CListGroupItem style={{ padding: '6px', marginBottom: '6px' }} className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
      <strong>{title}</strong>
    </CListGroupItem>
  )
}

