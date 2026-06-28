"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { graphNodes, graphEdges } from "@/lib/mock-data";

export function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="h-full w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="dark"
        colorMode="dark"
      >
        <Controls className="bg-background border-border fill-foreground" />
        <MiniMap className="bg-background border-border" maskColor="var(--background)" nodeColor="var(--primary)" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
