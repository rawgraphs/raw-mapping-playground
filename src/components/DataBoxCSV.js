import React, { useCallback } from 'react'
import { usePipelineActions, usePipelineState } from "../state";
import { Panel, Divider, Message } from "rsuite";
import AceEditor from "react-ace";


export default function DataBoxCSV({ title, footerMessage, mode = "text", onChange }) {
  const {setLoaders, setData} = usePipelineActions()
  const {loaders, data} = usePipelineState()

  const setDsvLoader = useCallback(
    (separator) => {
      return setLoaders([{ type: "dsv", separator }]);
    },
    [setLoaders]
  );

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
            value={loaders[0].separator}
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
      <Message type="info" description={footerMessage} />
    </Panel>
  );
}