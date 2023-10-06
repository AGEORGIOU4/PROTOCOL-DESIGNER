import { CListGroupItem } from "@coreui/react-pro"

export const Title = ({ title }) => {
  return (
    <CListGroupItem style={{ padding: '6px', marginBottom: '6px' }} className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
      <strong>{title}</strong>
    </CListGroupItem>
  )
}