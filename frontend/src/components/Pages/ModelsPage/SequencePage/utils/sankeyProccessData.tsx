import { ResponsiveSankey } from '@nivo/sankey';
import { useMemo, useState } from 'react';
import { SequenceAnalysis } from '../../../../../models/sequence.model';

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

        const levels: string[][] = [];
        const assignedPages = new Set<string>();

        const incomingTransitions: Record<string, number> = {};
        Object.keys(transitions).forEach(key => {
            const [, to] = key.split('|');
            incomingTransitions[to] = (incomingTransitions[to] || 0) + 1;
        });

        const firstLevel = Array.from(allPages).filter(page => !incomingTransitions[page]);
        levels.push(firstLevel);
        firstLevel.forEach(page => assignedPages.add(page));

        while (assignedPages.size < allPages.size) {
            const currentLevel: string[] = [];
            const previousLevel = levels[levels.length - 1];

            Object.keys(transitions).forEach(key => {
                const [from, to] = key.split('|');
                if (previousLevel.includes(from) && !assignedPages.has(to)) {
                    if (!currentLevel.includes(to)) {
                        currentLevel.push(to);
                        assignedPages.add(to);
                    }
                }
            });

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

        const nodes = levels.flatMap((level, levelIndex) =>
            level.map(page => ({
                id: `${page}_${levelIndex}`,
                originalId: page,
                label: page
            }))
        );

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
            .slice(0, 50);

        console.log('Final Sankey data:', {
            nodes: nodes.length,
            links: links.length,
            nodesDetails: nodes,
            linksDetails: links,
            levels
        });

        const totalTransitions = Object.values(transitions).reduce((sum, count) => sum + count, 0);

        const topPaths = Object.entries(transitions)
            .map(([key, count]) => {
                const [from, to] = key.split('|');
                return { from, to, count };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const levelStats = levels.map((level, index) => ({
            level: index,
            pages: level,
            percentage: (level.length / allPages.size) * 100
        }));

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

        console.log('Transitions:', transitions);
        console.log('Levels:', levels);
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