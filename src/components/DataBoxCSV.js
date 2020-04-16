import React, { useCallback, useMemo } from 'react'
import { usePipelineActions, usePipelineState } from "../state";
import { Panel, Divider, Message } from "rsuite";
import AceEditor from "react-ace";
import get from 'lodash/get'


export default function DataBoxCSV({ title, footerMessage, mode = "text", onChange }) {
  const {setLoaders, setData} = usePipelineActions()
  const {loaders, data} = usePipelineState()

  const setDsvLoader = useCallback(
    (separator) => {
      return setLoaders([{ type: "dsv", separator }]);
    },
    [setLoaders]
  );

  const loader = useMemo(() => {
    return get(loaders, '[0]')
  }, [loaders])

  return (
    <Panel
      header={title}
      shaded
      collapsible defaultExpanded
    >
      <div className="box-toolbar">
        <input
            className="form-control input-sm"
            type="text"
            placeholder="separator"
            aria-label="separator"
            value={loader ? loader.separator : ''}
            onChange={(e) => setDsvLoader(e.target.value)}
          />
      </div>
      <AceEditor
        mode={mode}
        theme="github"
        width="100%"
        height="300px"
        value={data || ""}
        onChange={setData}
        editorProps={{ $blockScrolling: true }}
      />
      <Divider></Divider>
      <div className="message-toolbar"></div>
      <Message type="info" description={footerMessage} />
    </Panel>
  );
}