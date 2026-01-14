d3.csv('boston_311_2025_raw.csv').then(data => {
        // dashboard.js: Visualize Boston 311 complaints by month
        // Uses 'open_dt' column in YYYY-MM-DD HH:MM:SS format

        const parseDate = d3.timeParse('%Y-%m-%d');
        const monthFormat = d3.timeFormat('%b');
        const monthCounts = {};

        data.forEach(d => {
            let date = d.open_dt ? parseDate(d.open_dt.slice(0, 10)) : null;
            if (date) {
                let month = monthFormat(date);
                monthCounts[month] = (monthCounts[month] || 0) + 1;
            }
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = months.map(m => ({ month: m, count: monthCounts[m] || 0 }));

        const svgWidth = 900;
        const svgHeight = 420;
        const margin = { top: 40, right: 40, bottom: 60, left: 80 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const tooltip = d3.select('body').append('div').attr('class', 'd3-tooltip');

        const svg = d3.select('#chart_time')
            .append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
            .domain(months)
            .range([0, width])
            .padding(0.18);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.count)])
            .range([height, 0]);

        svg.selectAll('rect')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.month))
            .attr('y', d => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.count))
            .attr('fill', '#1976d2')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#ff9800');
                    tooltip.style('display', 'block')
                        .html(`<strong>${d.month}</strong><br>Complaints: ${d.count.toLocaleString()}`)
                        .style('left', (event.pageX + 15) + 'px')
                        .style('top', (event.pageY - 28) + 'px');
            })
            .on('mousemove', function(event) {
                tooltip.style('left', (event.pageX + 15) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#1976d2');
                tooltip.style('display', 'none');
            });

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale));
        svg.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale));
        });
    const parseDate = d3.timeParse('%Y-%m-%d');
    const monthFormat = d3.timeFormat('%b');
    const monthCounts = {};

    data.forEach(d => {
        let date = d.open_dt ? parseDate(d.open_dt.slice(0, 10)) : null;
        if (date) {
            let month = monthFormat(date);
            monthCounts[month] = (monthCounts[month] || 0) + 1;
        }
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map(m => ({ month: m, count: monthCounts[m] || 0 }));

    const svgWidth = 900;
    const svgHeight = 420;
    const margin = { top: 40, right: 40, bottom: 60, left: 80 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const tooltip = d3.select('body').append('div').attr('class', 'd3-tooltip');

    const svg = d3.select('#chart_time')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .padding(0.18);
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.count)])
        .range([height, 0]);

    svg.selectAll('rect')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.month))
        .attr('y', d => yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(d.count))
        .attr('fill', '#1976d2')
        .on('mouseover', function(event, d) {
            d3.select(this).attr('fill', '#ff9800');
            tooltip.style('display', 'block')
                .html(`<strong>${d.month}</strong><br>Complaints: ${d.count}`)
                .style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 15) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            d3.select(this).attr('fill', '#1976d2');
            tooltip.style('display', 'none');
        });

    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));
        svg.append('g')
            .attr('class', 'axis')
            .call(d3.axisLeft(yScale).tickFormat(d3.format(",d")));
});
