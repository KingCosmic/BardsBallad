import React from "react";
import * as automerge from '@automerge/automerge'
import { SystemData } from '@/db/system/schema';

interface Props {
  editsId: string
  doc: automerge.next.Doc<SystemData>
}

const Functions: React.FC<Props> = ({ }) => {
  return (
    <>
      <p>TODO</p>
    </>
  )
}

export default Functions