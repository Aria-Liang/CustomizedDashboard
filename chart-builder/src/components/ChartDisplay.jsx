// src/components/ChartDisplay.jsx

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import EditIcon from '@mui/icons-material/Edit';

// Helper function to parse quarter strings into Date objects
const parseQuarterToDate = (quarterString) => {
  const [year, quarter] = quarterString.split('-Q');
  if (year && quarter) {
    const month = (parseInt(quarter, 10) - 1) * 3;
    return new Date(parseInt(year, 10), month, 1);
  }
  return null;
};

const ChartDisplay = ({ chartType, data, groupBy }) => {
  const chartRef = useRef();
  const [chartTitle, setChartTitle] = useState('Cloud Provider Line Chart');
  const [isEditing, setIsEditing] = useState(false);

  const handleIconClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    d3.select(chartRef.current).selectAll('*').remove();

    if (chartType === 'line') {
      renderLineChart(data);
    } else if (chartType === 'bar') {
      renderBarChart(data);
    } else if (chartType === 'pie') {
        renderPieChart(data);
    } else if (chartType === 'treeMap') {
        renderTreemap(data);
    }
  }, [chartType, data, groupBy]);

  const renderLineChart = (aggregatedData) => {
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '400px') // Adjusted height for better visibility
      .attr('viewBox', '0 0 900 400')
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const margin = { top: 20, right: 0, bottom: 50, left: 0 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(
          aggregatedData.flatMap((d) => d.aggregatedValues),
          (d) => {
            const parsedDate =
              parseQuarterToDate(d.timePeriod) || new Date(d.timePeriod);
            return parsedDate;
          }
        )
      )
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(aggregatedData, (d) =>
          d3.max(d.aggregatedValues, (v) => v.totalConsumption)
        ),
      ])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => {
        const parsedDate =
          parseQuarterToDate(d.timePeriod) || new Date(d.timePeriod);
        return x(parsedDate);
      })
      .y((d) => y(d.totalConsumption));

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.9)')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');

    aggregatedData.forEach((providerData, i) => {
      g.append('path')
        .datum(providerData.aggregatedValues)
        .attr('fill', 'none')
        .attr('stroke', d3.schemeCategory10[i % 10])
        .attr('stroke-width', 2)
        .attr('d', line);

      g.selectAll(`.dot-${providerData.provider}`)
        .data(providerData.aggregatedValues)
        .enter()
        .append('circle')
        .attr('cx', (d) => {
          const parsedDate =
            parseQuarterToDate(d.timePeriod) || new Date(d.timePeriod);
          return x(parsedDate);
        })
        .attr('cy', (d) => y(d.totalConsumption))
        .attr('r', 4)
        .attr('fill', d3.schemeCategory10[i % 10])
        .on('mouseover', (event, d) => {
          tooltip
            .style('display', 'block')
            .html(
              `Provider: ${providerData.provider}<br>Consumption: ${d.totalConsumption}<br>Date: ${d.timePeriod}`
            )
            .style('left', `${event.pageX}px`)
            .style('top', `${event.pageY - 200}px`);
        })
        .on('mousemove', (event) => {
          tooltip
            .style('left', `${event.pageX - 500}px`)
            .style('top', `${event.pageY - 190}px`);
        })
        .on('mouseout', () => {
          tooltip.style('display', 'none');
        });
    });

    const formatTime = {
      day: d3.timeFormat('%Y-%m-%d'),
      month: d3.timeFormat('%Y-%m'),
      quarter: d3.timeFormat('%Y-Q%q'),
      year: d3.timeFormat('%Y'),
    }[groupBy] || d3.timeFormat('%Y-%m-%d');

    g.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => {
            if (groupBy === 'month') {
              return d3.timeFormat('%Y-%m')(d); // Format as "2023-01"
            } else if (groupBy === 'day') {
              return d3.timeFormat('%Y-%m-%d')(d); // Format as "2023-01-01"
            } else if (groupBy === 'quarter') {
              const quarter = Math.floor(d.getMonth() / 3) + 1; // Calculate quarter (Q1-Q4)
              return `Q${quarter} ${d.getFullYear()}`; // Format as "Q1 2023"
            } else if (groupBy === 'year') {
              return d3.timeFormat('%Y')(d); // Format as "2023"
            }
            return d3.timeFormat('%Y-%m-%d')(d); // Default to "2023-01-01"
          })
      )
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', '#000')
      .style('text-anchor', 'middle')
      .text('Time');

    g.append('g')
      .call(d3.axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -50)
      .attr('fill', '#000')
      .style('text-anchor', 'middle')
      .text('Total Consumption');

    const legendGroup = svg
      .append('g')
      .attr('transform', `translate(${width + margin.left + 110}, ${margin.top})`);

    legendGroup
      .append('rect')
      .attr('x', -80)
      .attr('y', -10)
      .attr('width', 130)
      .attr('height', aggregatedData.length * 20 + 15)
      .attr('fill', 'rgba(255, 255, 255, 0.5)')
      .attr('stroke', '#ccc');

    const legend = legendGroup
      .selectAll('.legend-item')
      .data(aggregatedData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legend
      .append('line')
      .attr('x1', -70)
      .attr('x2', -50)
      .attr('y1', 10)
      .attr('y2', 10)
      .style('stroke', (d, i) => d3.schemeCategory10[i % 10])
      .style('stroke-width', 2);

    legend
      .append('text')
      .attr('x', -30)
      .attr('y', 10)
      .text((d) => d.provider)
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');
  };

  const renderBarChart = (aggregatedData) => {
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '400px')
      .attr('viewBox', '0 0 900 400')
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
    const margin = { top: 20, right: 0, bottom: 50, left: 50 };
    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    // 将数据展平，以获取所有的数据点
    const allData = aggregatedData.flatMap((d) =>
      d.aggregatedValues.map((v) => ({
        provider: d.provider,
        timePeriod: v.timePeriod,
        totalConsumption: v.totalConsumption,
      }))
    );
  
    // 解析日期
    allData.forEach((d) => {
      d.parsedDate = parseQuarterToDate(d.timePeriod) || new Date(d.timePeriod);
    });
  
    // 获取所有的时间段和供应商
    const timePeriods = [...new Set(allData.map((d) => d.parsedDate))].sort((a, b) => a - b);
    const providers = [...new Set(allData.map((d) => d.provider))];
  
    // 设置比例尺
    const x0 = d3
      .scaleBand()
      .domain(timePeriods)
      .rangeRound([0, width])
      .paddingInner(0.1);
  
    const x1 = d3
      .scaleBand()
      .domain(providers)
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);
  
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(allData, (d) => d.totalConsumption)])
      .nice()
      .range([height, 0]);
  
    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(providers);
  
    // 绘制 X 轴
    g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom(x0)
          .tickFormat((d) => {
            if (groupBy === 'month') {
              return d3.timeFormat('%Y-%m')(d);
            } else if (groupBy === 'day') {
              return d3.timeFormat('%Y-%m-%d')(d);
            } else if (groupBy === 'quarter') {
              const quarter = Math.floor(d.getMonth() / 3) + 1;
              return `Q${quarter} ${d.getFullYear()}`;
            } else if (groupBy === 'year') {
              return d3.timeFormat('%Y')(d);
            }
            return d3.timeFormat('%Y-%m-%d')(d);
          })
      )
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');
  
    // 绘制 Y 轴
    g.append('g').attr('class', 'axis y-axis').call(d3.axisLeft(y));
  
    // 创建柱状图
    const timePeriodGroups = g
      .selectAll('.time-period-group')
      .data(timePeriods)
      .enter()
      .append('g')
      .attr('class', 'time-period-group')
      .attr('transform', (d) => `translate(${x0(d)}, 0)`);
  
    timePeriodGroups
      .selectAll('rect')
      .data((d) => {
        return providers.map((provider) => {
          const record = allData.find(
            (item) => item.parsedDate.getTime() === d.getTime() && item.provider === provider
          );
          return {
            provider,
            timePeriod: d,
            totalConsumption: record ? record.totalConsumption : 0,
          };
        });
      })
      .enter()
      .append('rect')
      .attr('x', (d) => x1(d.provider))
      .attr('y', (d) => y(d.totalConsumption))
      .attr('width', x1.bandwidth())
      .attr('height', (d) => height - y(d.totalConsumption))
      .attr('fill', (d) => color(d.provider))
      .on('mouseover', (event, d) => {
        tooltip
          .style('display', 'block')
          .html(
            `Provider: ${d.provider}<br>Consumption: ${d.totalConsumption}<br>Date: ${
              groupBy === 'quarter'
                ? `Q${Math.floor(d.timePeriod.getMonth() / 3) + 1} ${d.timePeriod.getFullYear()}`
                : d3.timeFormat('%Y-%m-%d')(d.timePeriod)
            }`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 50}px`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 50}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  
    // 添加提示框
    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.9)')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');
  
    // 添加图例
    const legendGroup = svg
      .append('g')
      .attr('transform', `translate(${width + margin.left + 20}, ${margin.top})`);
  
    providers.forEach((provider, i) => {
      const legendRow = legendGroup
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`);
  
      legendRow
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(provider));
  
      legendRow
        .append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(provider)
        .style('font-size', '12px')
        .attr('alignment-baseline', 'middle');
    });
  };

  const renderPieChart = (aggregatedData) => {
    // Sum total consumption for each provider
    const dataForPieChart = aggregatedData.map((providerData) => {
      const totalConsumption = d3.sum(
        providerData.aggregatedValues,
        (d) => d.totalConsumption
      );
      return {
        provider: providerData.provider,
        totalConsumption,
      };
    });
  
    // Set dimensions and radius
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
  
    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '400px')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
    // Create a group to hold the pie chart
    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
    // Define the pie layout
    const pie = d3
      .pie()
      .value((d) => d.totalConsumption)
      .sort(null);
  
    // Define the arc generator
    const path = d3
      .arc()
      .outerRadius(radius - 10)
      .innerRadius(0);
  
    // Define the label positions
    const label = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(radius - 80);
  
    // Append arcs (slices)
    const arcGroup = g
      .selectAll('.arc')
      .data(pie(dataForPieChart))
      .enter()
      .append('g')
      .attr('class', 'arc');
  
    arcGroup
      .append('path')
      .attr('d', path)
      .attr('fill', (d) => color(d.data.provider))
      .on('mouseover', (event, d) => {
        tooltip
          .style('display', 'block')
          .html(
            `Provider: ${d.data.provider}<br>Consumption: ${d.data.totalConsumption}`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX - 500}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  
    // Optionally add labels
    arcGroup
      .append('text')
      .attr('transform', (d) => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text((d) => d.data.provider)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');
  
    // Add tooltip div
    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.9)')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');
  
    // Add legend
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 100}, 20)`)
      .selectAll('.legend-item')
      .data(dataForPieChart)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);
  
    legend
      .append('rect')
      .attr('x', 90)
      .attr('y', 5)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', (d) => color(d.provider));
  
    legend
      .append('text')
      .attr('x', 105)
      .attr('y', 10)
      .text((d) => d.provider)
      .style('font-size', '12px')
      .attr('alignment-baseline', 'middle');
  };
  

  const renderTreemap = (aggregatedData) => {
    const dataForTreemap = aggregatedData.map((providerData) => {
      const totalConsumption = d3.sum(
        providerData.aggregatedValues,
        (d) => d.totalConsumption
      );
      return {
        name: providerData.provider,
        value: totalConsumption,
      };
    });
  
    // Set dimensions
    const width = 400;
    const height = 400;
  
    // Create color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Create the SVG container
    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '400px')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
    // Prepare data hierarchy
    const root = d3
      .hierarchy({ children: dataForTreemap })
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
  
    // Create treemap layout
    d3
      .treemap()
      .size([width, height])
      .padding(1)(root);
  
    // Append nodes
    const nodes = svg
      .selectAll('g')
      .data(root.leaves())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`);
  
    nodes
      .append('rect')
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .attr('fill', (d) => color(d.data.name))
      .on('mouseover', (event, d) => {
        tooltip
          .style('display', 'block')
          .html(
            `Provider: ${d.data.name}<br>Consumption: ${d.data.value}`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', `${event.pageX - 500}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  
    nodes
      .append('text')
      .attr('dx', 4)
      .attr('dy', 14)
      .text((d) => d.data.name)
      .style('font-size', '12px')
      .style('fill', '#fff');
  
    // Add tooltip div
    const tooltip = d3
      .select(chartRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('background-color', 'rgba(255, 255, 255, 0.9)')
      .style('border', '1px solid #ccc')
      .style('padding', '5px')
      .style('border-radius', '5px')
      .style('display', 'none')
      .style('pointer-events', 'none');
  };  


  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Centers the input and icon horizontally
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={chartTitle}
          onChange={(e) => setChartTitle(e.target.value)}
          style={{
            width: '100%',
            fontSize: '20px',
            fontWeight: 'bold',
            padding: '20px',
            marginBottom: '0px',
            backgroundColor: 'transparent',
            border: isEditing ? '1px dashed #ccc' : 'none',
            outline: 'none',
            marginRight: '8px',
            cursor: isEditing ? 'text' : 'pointer',
            textAlign: 'center', // Centers the text inside the input
          }}
          readOnly={!isEditing}
          onBlur={handleBlur}
          onClick={() => setIsEditing(true)} // Allows the user to click to edit
        />
        <EditIcon
          style={{ color: '#720e9e', cursor: 'pointer' }}
          onClick={handleIconClick}
        />
      </div>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '100%' }} // Ensures the chart fills the container
      />
    </div>
  );
  
};

export default ChartDisplay;
