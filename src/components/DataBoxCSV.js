import React, { useCallback } from 'react'
import { usePipeline } from "../state";
import { Panel, Divider, Message } from "rsuite";
import AceEditor from "react-ace";


export default function DataBoxCSV({ title, footerMessage, mode = "text", onChange }) {
  const pipeline = usePipeline();

  const setDsvLoader = useCallback(
    (separator) => {
      return pipeline.setLoaders([{ type: "dsv", separator }]);
    },
    [pipeline]
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
            value={pipeline.state.loaders[0].separator}
            onChange={(e) => setDsvLoader(e.target.value)}
          />
      </div>
      <AceEditor
        mode={mode}
        theme="github"
        width="100%"
        height="300px"
        value={pipeline.state.data || ""}
        onChange={pipeline.setData}
        editorProps={{ $blockScrolling: true }}
      />
      <Divider></Divider>
      <Message type="info" description={footerMessage} />
    </Panel>
  );
}