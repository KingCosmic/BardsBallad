import React, { useEffect } from 'react'

import { Frame, Element, useEditor } from '@craftjs/core'

import Container from '@designer/components/Container/Editor'
import Text from '@designer/components/Text/Editor'

import { PageData } from '@storage/schemas/system'
import { editorState } from '@state/editor'

import lz from 'lzutf8'
import { VersionedResource } from '@storage/schemas/versionedResource'

const defaultLexical = 'eyJST09UIjp7InR5cGXECHJlc29sdmVkTmFtZSI6IkNvbnRhaW5lciJ9LCJpc0NhbnZhcyI6dHJ1ZSwicHJvcHPENXNob3dQbGFjZWhvbGRlcsggZHluYW1pY1Zpc2liaWxpdHkiOmZhbHNlLCJ2yRNCbHVlcHJpbnTESG5vZGVzIjpbeyJpZCI6IjEiLOcAmCJlbnRyeSIsImRhdGHEKnBhcmFtxCtdfSwicG9zaXRpb27EGXgiOjEwMCwiecUIfX0sx0wyykxvdXRwdXTQTcQJbuYA9Wlz5QCzbGXKNGJvb2xlYW4i5AEFQXJyYegAy33SfzI1y39dLCJlZGflANXkAKrKWucBI2lzTGlzdMdN5gCS5wF6bGlzdEl0ZW0iLCJi/wEk/wEk/wEk/wEk9wEk6wCfxzNhbsR96QEf5ADg/wEe8AEebG9jYWzEDMRHSW50ZXJhY3RpdmXpAR9vblByZXPlAnP/AQf/AQf1AQfvAI5kaXNwbOQAyiJmbGV4Isw8InN0YXRpY8R0b3AiOiIwcMQgcmlnaHTJDmJvdHRvbckPbGVmyhzEUURpcmVjx09jb2x1beQCXWFsaWdu5AFXcyI6Im5vcm1hbCIsImp1c3RpZnnkA4xl5AIFImluaXRpxRtnYeUAgMR+b3dzIjowLMdNxgxtYXJnaW5U5gClIsgQUugAqckSQukArckTTOcAseQA+WFkZGluZ8ZHNMoRyEjLE8lJyxTHSsQSaGXHM2F1dG8iLCJ3aWR0aMoPbWF4SMgibm9u5AOAbWF4V8clyBJpbtElaW7PJWJhY2tncm91buQCHW5vIHN0eeUDz2JvcuUEocwUaG92zhPqAf3xBQYsImN1c+UA4nt9LCJoaWRkZW7pAp/oApQiNnk0Si1UMzV1diJdLCJsaW5rZWROxh175AMUTmR2cFBQMVVzMvsFe1RleHTuBXbHZ+kFd3VzZekFP1ZhbHXqAyn/BDL/Ayv/Ayv/BDL4BDLJIccxc3RyaW5n/wVS/wQ0LCJ05AEm5AEtc3RpbmcgdGhlIHdvcmxk5AGqb2xv5AHYYmFz5AHnZm9udFNpesR7xxLEPEHkA3LkBNDkAqXGE0RlY29yYecDm+cCUMQYVHJhbnNmb3LkAt/HF/8DYP8DYPUDYMsRzEjwA2DLFMlK8QK45QJD7gKzcGFy5gRE5Qf5+QLD9QK36wLX/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3/wK3fQ=='

type CreatorProps = {
  versionedResource: VersionedResource
}

const Creator: React.FC<CreatorProps> = ({ versionedResource }) => {
  const editor = editorState.useValue()

  const { actions } = useEditor()

  useEffect(() => {
    let lexical = versionedResource.data.creator.find((p: PageData) => p.name === editor.creatorPage)?.lexical

    if (!lexical) lexical = defaultLexical

    actions.deserialize(lz.decompress(lz.decodeBase64(lexical)))
  }, [editor.creatorPage])

  return (
    <div className='mt-3 border-2 border-neutral-200 border-dashed rounded-lg dark:border-neutral-700'>
      <Frame>
        <Element is={Container} canvas>
          <Text text='Testing the world' />
        </Element>
      </Frame>
    </div>
  )
}

export default Creator
