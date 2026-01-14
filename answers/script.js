
// Helper to render a horizontal bar chart
function renderBarChart(data, containerId, chartTitle) {
    // Remove any previous chart
    d3.select(containerId).selectAll('svg').remove();

    // Chart dimensions
    const svgWidth = 800;
    const barHeight = 28;
    const margin = { top: 40, right: 40, bottom: 80, left: 220 };
    const height = data.length * barHeight;
    const width = svgWidth - margin.left - margin.right;

    // Tooltip div
    let tooltip = d3.select('body').select('.d3-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'd3-tooltip')
            .style('position', 'absolute')
            .style('background', '#fff')
            .style('border', '1px solid #888')
            .style('border-radius', '6px')
            .style('padding', '8px 12px')
            .style('font-size', '1.1em')
            .style('color', '#222')
            .style('pointer-events', 'none')
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.12)')
            .style('z-index', '10')
            .style('display', 'none');
    }

    // Scales
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.reason))
        .range([0, height])
        .padding(0.18);
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Count)])
        .range([0, width]);

    // SVG
    const svg = d3.select(containerId)
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Bars
    svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', d => yScale(d.reason))
        .attr('width', d => xScale(d.Count))
        .attr('height', yScale.bandwidth())
        .attr('fill', 'blue')
        .on('mouseover', function (event, d) {
            d3.select(this).attr('fill', 'orange');
            tooltip.style('display', 'block')
                .html(`<strong>${d.reason}</strong><br>Count: ${d.Count.toLocaleString()}`)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function () {
            d3.select(this).attr('fill', 'blue');
            tooltip.style('display', 'none');
        });

    // Axes
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale));
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    // Attribution
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#888')
}

// Load CSV data and set up button
d3.csv('boston_311_2025_by_reason.csv').then(data => {
    data.forEach(d => {
        d.Count = +d.Count;
    });
    data.sort((a, b) => b.Count - a.Count);

    // Initial chart: top 10 only
    let showingAll = false;
    renderBarChart(data.slice(0, 10), '#chart_311', 'Top 10 Reasons');

    // Button to toggle chart
    d3.select('#show-all-btn').on('click', function() {
        if (!showingAll) {
            renderBarChart(data, '#chart_311', 'All Reasons');
            d3.select(this).text('Show Top 10 Reasons');
        } else {
            renderBarChart(data.slice(0, 10), '#chart_311', 'Top 10 Reasons');
            d3.select(this).text('Show All Reasons');
        }
        showingAll = !showingAll;
    });
});
