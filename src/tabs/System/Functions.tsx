import { type System } from '../../storage/schemas/system'
import { VersionedResource } from '../../storage/schemas/versionedResource'

type FunctionsProps = {
  system: System
  versionedResource: VersionedResource
}

const Functions: React.FC<FunctionsProps> = ({ system }) => {
  return (
    <>
      <p>TODO</p>
    </>
  )
}

export default Functions