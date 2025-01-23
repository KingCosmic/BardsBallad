import { PropsWithChildren } from 'react'

type AccordionGroupProps = {}

const AccordionGroup: React.FC<PropsWithChildren<AccordionGroupProps>> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default AccordionGroup