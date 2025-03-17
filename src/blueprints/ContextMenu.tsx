import { useCallback, useState } from 'react'
import { useReactFlow } from '@xyflow/react'
import { getDefaultDataForType } from './utils'

type MenuProps = {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  rawX: number;
  rawY: number;
}

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
 
export default function ContextMenu({
  top,
  left,
  right,
  bottom,
  rawX,
  rawY,
  ...props
}: MenuProps) {
  const { addNodes, getNodes, screenToFlowPosition } = useReactFlow()

  const createNode = useCallback((type: string) => {
    const nodes = getNodes()

    const { x, y } = screenToFlowPosition({
      x: rawX,
      y: rawY,
    })

    let id = ''+getRndInteger(1, 2000)
    while (nodes.find(node => node.id === id)) {
      id = ''+getRndInteger(1, 2000)
    }

    const data = getDefaultDataForType(type)

    if (!data) return

    addNodes({
      id,
      type,
      data,
      position: { x: x, y: y },
      selected: false,
      dragging: false,
    })
  }, [addNodes, getNodes, screenToFlowPosition])

  const [submenuVisible, setSubmenuVisible] = useState(-1);
 
  return (
    <div
      className='absolute bg-black shadow-lg rounded-md p-2 text-sm context-menu'
      style={{ top: top - 50, left, right, bottom, zIndex: 9999 }}
      {...props}
    >
      <ul>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(1)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Character
          {(submenuVisible === 1) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('get_character_data')}>
                Get Character Data
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('set_character_data')}>
                Set Character Data
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(2)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Page
          {(submenuVisible === 2) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('get_page_data')}>
                Get Page Data
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('set_page_data')}>
                Set Page Data
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(3)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          System
          {(submenuVisible === 3) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('get_system_data')}>
                Get System Data
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('set_system_data')}>
                Set System Data
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(4)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Array
          {(submenuVisible === 4) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('array_get')}>
                Get Item
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('add_to_array')}>
                Add Item
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('array_remove')}>
                Remove Item
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('array_update')}>
                Update Item
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('filter')}>
                Filter
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('map')}>
                Map
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(5)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Object
          {(submenuVisible === 5) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('spread_object')}>
                Spread Object
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('create_data_from_type')}>
                Create Object From Type
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(6)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          String
          {(submenuVisible === 6) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('string_new')}>
                New String
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('string_includes')}>
                Includes
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('string_compare')}>
                Compare
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('string_concat')}>
                Concat
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(7)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Numbers
          {(submenuVisible === 7) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('new_number')}>
                New Number
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('divide')}>
                Divide
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('add')}>
                Add
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('subtract')}>
                Subtract
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('multiply')}>
                Multiply
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('floor')}>
                Floor
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('number_to_string')}>
                Number To String
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(8)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Enums
          {(submenuVisible === 8) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('new_enum')}>
                New Enum
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('enum_compare')}>
                Compare Enum
              </li>
            </ul>
          )}
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onMouseEnter={() => setSubmenuVisible(9)}
          onMouseLeave={() => setSubmenuVisible(-1)}
        >
          Booleans
          {(submenuVisible === 9) && (
            <ul className='absolute left-full top-0 bg-black shadow-lg rounded-md p-2'>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('boolean_new')}>
                New Boolean
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('boolean_branch')}>
                Branch
              </li>
              <li className='hover:bg-gray-700 p-2 cursor-pointer' onClick={() => createNode('boolean_inverse')}>
                Inverse
              </li>
            </ul>
          )}
        </li>

        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onClick={() => createNode('open_modal')}
        >
          Open Modal
        </li>
        <li
          className='hover:bg-gray-700 p-2 cursor-pointer relative'
          onClick={() => createNode('blueprint_run')}
        >
          Run Blueprint
        </li>
      </ul>
    </div>
  );
}