// Interval graph-based collision layout algorithm
// Handles overlapping classes with mathematically correct positioning

import type { ClassEntry, TimetablePosition, Day } from "@/types"
import { 
  calculateTopOffset, 
  calculateHeight, 
  calculateColumn, 
  intervalsOverlap,
  groupByDay 
} from "./timetable-engine"

interface IntervalNode {
  entry: ClassEntry
  start: number
  end: number
  neighbors: Set<string>
}

// Build interval graph from entries
function buildIntervalGraph(entries: ClassEntry[]): Map<string, IntervalNode> {
  const graph = new Map<string, IntervalNode>()
  
  // Create nodes
  for (const entry of entries) {
    graph.set(entry.id, {
      entry,
      start: entry.startMinutes,
      end: entry.endMinutes,
      neighbors: new Set(),
    })
  }
  
  // Add edges for overlapping intervals
  const entryList = Array.from(entries)
  for (let i = 0; i < entryList.length; i++) {
    for (let j = i + 1; j < entryList.length; j++) {
      if (intervalsOverlap(entryList[i], entryList[j])) {
        graph.get(entryList[i].id)!.neighbors.add(entryList[j].id)
        graph.get(entryList[j].id)!.neighbors.add(entryList[i].id)
      }
    }
  }
  
  return graph
}

// Greedy graph coloring algorithm for interval graphs
function colorIntervalGraph(graph: Map<string, IntervalNode>): Map<string, number> {
  const colors = new Map<string, number>()
  
  // Sort by start time for optimal coloring
  const sorted = [...graph.values()].sort((a, b) => a.start - b.start)
  
  for (const node of sorted) {
    // Find minimum available color
    const usedColors = new Set<number>()
    
    for (const neighborId of node.neighbors) {
      const neighborColor = colors.get(neighborId)
      if (neighborColor !== undefined) {
        usedColors.add(neighborColor)
      }
    }
    
    let color = 0
    while (usedColors.has(color)) color++
    colors.set(node.entry.id, color)
  }
  
  return colors
}

// Find connected components (overlapping groups)
function findOverlapGroups(entries: ClassEntry[]): ClassEntry[][] {
  const visited = new Set<string>()
  const groups: ClassEntry[][] = []
  
  // Build adjacency for quick lookup
  const adjacency = new Map<string, Set<string>>()
  for (const entry of entries) {
    adjacency.set(entry.id, new Set())
  }
  
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      if (intervalsOverlap(entries[i], entries[j])) {
        adjacency.get(entries[i].id)!.add(entries[j].id)
        adjacency.get(entries[j].id)!.add(entries[i].id)
      }
    }
  }
  
  // DFS to find connected components
  function dfs(entryId: string, group: ClassEntry[]) {
    if (visited.has(entryId)) return
    visited.add(entryId)
    
    const entry = entries.find(e => e.id === entryId)
    if (entry) group.push(entry)
    
    const neighbors = adjacency.get(entryId) || new Set()
    for (const neighborId of neighbors) {
      dfs(neighborId, group)
    }
  }
  
  for (const entry of entries) {
    if (!visited.has(entry.id)) {
      const group: ClassEntry[] = []
      dfs(entry.id, group)
      if (group.length > 0) {
        groups.push(group)
      }
    }
  }
  
  return groups
}

// Resolve visual conflicts and calculate positions
export function resolveVisualConflicts(
  entries: ClassEntry[]
): Map<string, TimetablePosition> {
  const positions = new Map<string, TimetablePosition>()
  const byDay = groupByDay(entries)
  
  for (const [day, dayEntries] of byDay) {
    if (dayEntries.length === 0) continue
    
    // Find overlap groups
    const groups = findOverlapGroups(dayEntries)
    
    for (const group of groups) {
      if (group.length === 1) {
        // Single entry, full width
        const entry = group[0]
        positions.set(entry.id, {
          top: calculateTopOffset(entry.startMinutes),
          height: calculateHeight(entry.startMinutes, entry.endMinutes),
          column: calculateColumn(entry.day),
          width: 100,
          leftOffset: 0,
          zIndex: 1,
        })
      } else {
        // Multiple overlapping entries
        const graph = buildIntervalGraph(group)
        const coloring = colorIntervalGraph(graph)
        
        // Find max color to determine width
        const maxColor = Math.max(...coloring.values(), 0)
        const columnCount = maxColor + 1
        const width = 100 / columnCount
        
        for (const entry of group) {
          const color = coloring.get(entry.id) || 0
          positions.set(entry.id, {
            top: calculateTopOffset(entry.startMinutes),
            height: calculateHeight(entry.startMinutes, entry.endMinutes),
            column: calculateColumn(entry.day),
            width,
            leftOffset: color * width,
            zIndex: color + 1,
          })
        }
      }
    }
  }
  
  return positions
}

// Calculate positions for all entries (export for use in components)
export function calculateAllPositions(entries: ClassEntry[]): Map<string, TimetablePosition> {
  return resolveVisualConflicts(entries)
}
