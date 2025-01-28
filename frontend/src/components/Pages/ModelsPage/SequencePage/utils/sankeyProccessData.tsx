// import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
// import { PathDetails, SequenceAnalysis } from "../../../../../models/sequence.model";
// import { useMemo } from "react";

// interface TreeNode {
//     id: string | number;
//     targetNodes: (string | number)[];
//     depth?: number;
// }

// interface SankeyNode {
//     name: string;
// }

// interface SankeyLink {
//     source: number;
//     target: number;
//     value: number;
// }

// // interface SequenceAnalysis {
// //     clusters: {
// //         commonTransitions: {
// //             from: string;
// //             to: string;
// //             count: number;
// //         }[];
// //     }[];
// // }

// const updateNodeDepths = (tree: Record<string | number, TreeNode>) => {
//     const visited = new Set<TreeNode>();
//     const depths: Record<string | number, number> = {};

//     const getIncomingEdges = (node: TreeNode) => {
//         let count = 0;
//         for (const n of Object.values(tree)) {
//             if (n.targetNodes?.includes(node.id)) {
//                 count++;
//             }
//         }
//         return count;
//     };

//     const sources = Object.values(tree).filter(node => getIncomingEdges(node) === 0);
//     const queue = sources.map(node => ({
//         node,
//         depth: 0
//     }));

//     while (queue.length > 0) {
//         const current = queue.shift();
//         if (!current) continue;

//         const { node, depth } = current;

//         if (visited.has(node)) {
//             continue;
//         }

//         visited.add(node);
//         depths[node.id] = depth;

//         const targetNodes = node.targetNodes || [];
//         for (const targetId of targetNodes) {
//             const target = tree[targetId];
//             if (target && !visited.has(target)) {
//                 queue.push({
//                     node: target,
//                     depth: depth + 1
//                 });
//             }
//         }
//     }

//     // Обновляем глубины в дереве
//     Object.entries(depths).forEach(([id, depth]) => {
//         if (tree[id]) {
//             tree[id].depth = depth;
//         }
//     });

//     return tree;
// };

// export const TransitionsVisualization: React.FC<{ data: SequenceAnalysis }> = ({ data }) => {
//     const sankeyData = useMemo(() => {
//         try {
//             // Собираем переходы и создаем узлы
//             const pages = new Set<string>();
//             const transitions = new Map<string, number>();

//             data.clusters.forEach(cluster => {
//                 cluster.commonTransitions.forEach(t => {
//                     if (t.from && t.to && t.from !== t.to) {
//                         pages.add(t.from);
//                         pages.add(t.to);
//                         const key = `${t.from}|${t.to}`;
//                         transitions.set(key, (transitions.get(key) || 0) + t.count);
//                     }
//                 });
//             });

//             // Создаем дерево для обработки глубин
//             const tree: Record<string, TreeNode> = {};
//             Array.from(pages).forEach(page => {
//                 tree[page] = {
//                     id: page,
//                     targetNodes: []
//                 };
//             });

//             // Заполняем целевые узлы
//             transitions.forEach((value, key) => {
//                 const [from, to] = key.split('|');
//                 if (!tree[from].targetNodes) {
//                     tree[from].targetNodes = [];
//                 }
//                 tree[from].targetNodes.push(to);
//             });

//             // Обновляем глубины узлов
//             updateNodeDepths(tree);

//             // Создаем данные для Sankey
//             const nodes: SankeyNode[] = Array.from(pages).map(page => ({
//                 name: page
//             }));

//             const pageIndex = new Map(nodes.map((node, index) => [node.name, index]));

//             const links: SankeyLink[] = Array.from(transitions.entries())
//                 .map(([key, value]) => {
//                     const [from, to] = key.split('|');
//                     const sourceIndex = pageIndex.get(from);
//                     const targetIndex = pageIndex.get(to);

//                     if (sourceIndex === undefined || targetIndex === undefined) {
//                         return null;
//                     }

//                     return {
//                         source: sourceIndex,
//                         target: targetIndex,
//                         value
//                     };
//                 })
//                 .filter((link): link is SankeyLink => link !== null)
//                 .sort((a, b) => b.value - a.value)
//                 .slice(0, 10);

//             return { nodes, links };
//         } catch (error) {
//             console.error('Error processing Sankey data:', error);
//             return { nodes: [], links: [] };
//         }
//     }, [data]);

//     if (!sankeyData.nodes.length || !sankeyData.links.length) {
//         return <div>Нет данных для визуализации</div>;
//     }

//     return (
//         <section className="transitions-visualization">
//             <h3>Граф переходов</h3>
//             <div style={{ width: '100%', height: 600 }}>
//                 <ResponsiveContainer>
//                     <Sankey
//                         data={sankeyData}
//                         node={{
//                             width: 10,
//                             // padding: 100
//                         }}
//                         margin={{
//                             top: 20,
//                             right: 200,
//                             bottom: 20,
//                             left: 200
//                         }}
//                     >
//                         <Tooltip
//                             content={({ payload }) => {
//                                 if (!payload || !payload.length) return null;
//                                 const data = payload[0];
//                                 return (
//                                     <div style={{
//                                         backgroundColor: '#fff',
//                                         padding: '10px',
//                                         border: '1px solid #ccc'
//                                     }}>
//                                         <p>{`${data.payload.source.name} → ${data.payload.target.name}`}</p>
//                                         <p>Количество переходов: {data.value}</p>
//                                     </div>
//                                 );
//                             }}
//                         />
//                     </Sankey>
//                 </ResponsiveContainer>
//             </div>
//         </section>
//     );
// };

// export default TransitionsVisualization;




import { ResponsiveSankey } from '@nivo/sankey';
import { useMemo, useState } from 'react';
import { SequenceAnalysis } from '../../../../../models/sequence.model';

interface SessionData {
    session_id: string;
    page_url: string;
    timestamp: string;
    duration: number;
}

interface SankeyData {
    nodes: { id: string }[];
    links: { source: string; target: string; value: number }[];
}
interface SankeyNode {
    id: string;
}

interface SankeyLink {
    source: string;
    target: string;
    value: number;
}

export const TransitionsVisualization: React.FC<{ data: SequenceAnalysis }> = ({ data }) => {
    const [graphDescription, setGraphDescription] = useState<{
        totalTransitions: number;
        topPaths: { from: string; to: string; count: number }[];
        levels: { level: number; pages: string[]; percentage: number }[];
        mostVisited: { page: string; visits: number }[];
    }>();

    const sankeyData = useMemo(() => {
        if (!data?.clusters) {
            console.log('No clusters data');
            return { nodes: [], links: [] };
        }

        // Собираем все переходы
        const transitions: Record<string, number> = {};
        const allPages = new Set<string>();

        data.clusters.forEach((cluster, clusterIndex) => {
            console.log(`Processing cluster ${clusterIndex}`);
            if (cluster.commonTransitions) {
                cluster.commonTransitions.forEach(transition => {
                    if (transition.from && transition.to) {
                        const key = `${transition.from}|${transition.to}`;
                        transitions[key] = (transitions[key] || 0) + transition.count;
                        allPages.add(transition.from);
                        allPages.add(transition.to);
                    }
                });
            }
        });

        // Создаем структуру уровней
        const levels: string[][] = [];
        const assignedPages = new Set<string>();

        // Находим начальные страницы (те, в которые нет входящих переходов)
        const incomingTransitions: Record<string, number> = {};
        Object.keys(transitions).forEach(key => {
            const [, to] = key.split('|');
            incomingTransitions[to] = (incomingTransitions[to] || 0) + 1;
        });

        // Первый уровень - страницы без входящих переходов
        const firstLevel = Array.from(allPages).filter(page => !incomingTransitions[page]);
        levels.push(firstLevel);
        firstLevel.forEach(page => assignedPages.add(page));

        // Распределяем остальные страницы по уровням
        while (assignedPages.size < allPages.size) {
            const currentLevel: string[] = [];
            const previousLevel = levels[levels.length - 1];

            // Находим все страницы, в которые есть переходы из предыдущего уровня
            Object.keys(transitions).forEach(key => {
                const [from, to] = key.split('|');
                if (previousLevel.includes(from) && !assignedPages.has(to)) {
                    if (!currentLevel.includes(to)) {
                        currentLevel.push(to);
                        assignedPages.add(to);
                    }
                }
            });

            // Если не нашли новых страниц, добавляем оставшиеся
            if (currentLevel.length === 0) {
                Array.from(allPages)
                    .filter(page => !assignedPages.has(page))
                    .forEach(page => {
                        currentLevel.push(page);
                        assignedPages.add(page);
                    });
            }

            if (currentLevel.length > 0) {
                levels.push(currentLevel);
            }
        }

        // Создаем узлы с учетом уровней
        const nodes = levels.flatMap((level, levelIndex) =>
            level.map(page => ({
                id: `${page}_${levelIndex}`,
                originalId: page,
                label: page
            }))
        );

        // Создаем связи между уровнями
        const links = Object.entries(transitions)
            .map(([key, value]) => {
                const [from, to] = key.split('|');
                const fromLevel = levels.findIndex(level => level.includes(from));
                const toLevel = levels.findIndex(level => level.includes(to));

                if (fromLevel !== -1 && toLevel !== -1 && toLevel > fromLevel) {
                    return {
                        source: `${from}_${fromLevel}`,
                        target: `${to}_${toLevel}`,
                        value
                    };
                }
                return null;
            })
            .filter((link): link is { source: string; target: string; value: number } => link !== null)
            .sort((a, b) => b.value - a.value)
            .slice(0, 50); // Увеличим количество отображаемых связей

        console.log('Final Sankey data:', {
            nodes: nodes.length,
            links: links.length,
            nodesDetails: nodes,
            linksDetails: links,
            levels
        });

        const totalTransitions = Object.values(transitions).reduce((sum, count) => sum + count, 0);

        // Топ переходов
        const topPaths = Object.entries(transitions)
            .map(([key, count]) => {
                const [from, to] = key.split('|');
                return { from, to, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Анализ уровней
        const levelStats = levels.map((level, index) => ({
            level: index,
            pages: level,
            percentage: (level.length / allPages.size) * 100
        }));

        // Наиболее посещаемые страницы
        const pageVisits: Record<string, number> = {};
        Object.entries(transitions).forEach(([key, count]) => {
            const [from, to] = key.split('|');
            pageVisits[from] = (pageVisits[from] || 0) + count;
            pageVisits[to] = (pageVisits[to] || 0) + count;
        });

        const mostVisited = Object.entries(pageVisits)
            .map(([page, visits]) => ({ page, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5);

        setGraphDescription({
            totalTransitions,
            topPaths,
            levels: levelStats,
            mostVisited
        });

        return { nodes, links };
    }, [data]);

    if (!sankeyData.nodes.length || !sankeyData.links.length) {
        return <div>Нет данных для визуализации</div>;
    }

    return (
        <div style={{ height: 600 }}>
            <ResponsiveSankey
                data={sankeyData}
                margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
                align="justify"
                colors={{ scheme: 'category10' }}
                nodeOpacity={1}
                nodeThickness={18}
                nodeInnerPadding={3}
                nodeSpacing={24}
                nodeBorderWidth={0}
                nodeBorderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.8]]
                }}
                linkOpacity={0.5}
                linkHoverOpacity={0.8}
                linkContract={3}
                enableLinkGradient={true}
                labelPosition="outside"
                labelOrientation="horizontal"
                labelPadding={16}
                animate={false}
            />

            {graphDescription && (
                <div className="graph-description">
                    <h3>Анализ переходов между страницами</h3>
                    <div className="description-content">
                        <div className="summary">
                            <p><strong>Всего переходов:</strong> {graphDescription.totalTransitions}</p>
                            <p><strong>Количество уровней:</strong> {graphDescription.levels.length}</p>
                        </div>

                        <div className="top-paths">
                            <h4>Популярные переходы:</h4>
                            <ul>
                                {graphDescription.topPaths.map((path, index) => (
                                    <li key={index}>
                                        {path.from} → {path.to}: {path.count} переходов
                                        ({((path.count / graphDescription.totalTransitions) * 100).toFixed(1)}%)
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="level-analysis">
                            <h4>Структура уровней:</h4>
                            <ul>
                                {graphDescription.levels.map((level, index) => (
                                    <li key={index}>
                                        Уровень {level.level + 1}: {level.pages.length} страниц
                                        ({level.percentage.toFixed(1)}%)
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="most-visited">
                            <h4>Наиболее посещаемые страницы:</h4>
                            <ul>
                                {graphDescription.mostVisited.map((page, index) => (
                                    <li key={index}>
                                        {page.page}: {page.visits} посещений
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};