'use client';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as cloud from 'd3-cloud';

export default function WordCloud({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 初始化布局（参考网页1的配置[^1]）
    const layout = cloud()
      .size([800, 600])
      .words(data)
      .padding(5)
      .rotate(() => Math.random() * 90 - 45)
      .fontSize(d => d.size)
      .on("end", draw);

    layout.start();

    // 绘制词云（适配 React DOM 操作）
    function draw(words) {
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      svg.append("g")
        .attr("transform", "translate(400,300)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("fill", (_, i) => d3.schemeCategory10[i % 10]) // 简化颜色配置[^1]
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [data]);

  return <svg ref={svgRef} width="100%" height="600" />;
}