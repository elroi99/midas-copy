import localforage from 'localforage';
import { Node, Edge } from '@xyflow/react';

// Initialize the store
const store = localforage.createInstance({
  name: 'ConfiguratorDB',
  storeName: 'workspaces',
});

interface WorkspaceData {
  nodes: Node[];
  edges: Edge[];
}

export async function saveWorkspace(id: string, nodes: Node[], edges: Edge[]): Promise<void> {
  try {
    await store.setItem(id, { nodes, edges });
  } catch (err) {
    console.error('Error saving workspace to IndexedDB:', err);
  }
}

export async function loadWorkspace(id: string): Promise<WorkspaceData | null> {
  try {
    const data = await store.getItem<WorkspaceData>(id);
    return data;
  } catch (err) {
    console.error('Error loading workspace from IndexedDB:', err);
    return null;
  }
}
