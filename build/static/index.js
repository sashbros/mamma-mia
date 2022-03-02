// D3 graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;



fullData = [
    {
        "symbol":"ABC",
        "prices":[{
            "price":1250,
            "time":"2022-02-25T20:57:58.080Z"
        },
        {
            "price":1258,
            "time":"2022-02-25T20:58:00.649Z"
        }]
    }
]

setInterval(() => {
    $.getJSON({
        url: "/getPrices",
        success: function(data){
            let today = new Date()
            data.forEach(element => {
                $(".price." + element.symbol).text(element.price)
                // element.time = today
                let found = false;
                for (let index = 0; index < fullData.length; index++) {
                    if (fullData[index].symbol==element.symbol) {
                        found = true;
                        newObj = {
                                    "price":element.price,
                                    "time":today
                                }
                        fullData[index].prices.push(newObj)
                        break
                    }
                }
                if (found===false) {
                    newObj = {
                                "symbol":element.symbol,
                                "prices":[{
                                    "price":element.price,
                                    "time":today
                                }]
                            }
                    fullData.push(newObj)

                    // append the svg object to the body of the page
                    const svg = d3.select("#" + element.symbol)
                        .append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform",
                                "translate(" + margin.left + "," + margin.top + ")");
                    // console.log(svg)
                }

                btcData = []
                fullData.every(ele => {
                    if (ele.symbol===element.symbol) {
                        btcData = ele.prices;
                        return false;
                    }
                    return true;
                })
                svg = d3.select("#" + element.symbol + " svg")
                // console.log(svg)
                render(btcData, svg)                

            });
            



        }
    });
}, 3000);

function render(btcData, svg) {
    // Addins scales
    let xScale = d3.scaleLinear()
        .domain(d3.extent(btcData, function(d) { return d.time; }))
        .range([0, width])
    let yScale = d3.scaleLinear()
        .domain([d3.min(btcData, function(d) { return +d.price; }), d3.max(btcData, function(d) { return +d.price; })])
        .range([height, 0]);
    
    // Adding axes
    svg.append("g")
        .attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(xScale));
    svg.append("g")
        .attr("class", "myYaxis")
        // .call(d3.axisLeft(yScale));

    // transition axes
    svg.selectAll(".myXaxis")
        .transition()
        .duration(100)
        // .call(d3.axisBottom(xScale));
    svg.selectAll(".myYaxis")
        .transition()
        .duration(100)
        // .call(d3.axisLeft(yScale));
    
    // transition line
    const u = svg.selectAll(".lineTest")
        .data([btcData], function(d){ return d.time });


    // Add the line
    u.join("path")
        .attr("class", "lineTest")
        .datum(btcData)
        // .transition()
        // .duration(100)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { 
                return xScale(d.time)
            })
            .y(function(d) { 
                return yScale(d.price)
            })
            .curve(d3.curveMonotoneX)
        )


        // adding a dashed horizontal line
        var horLine = d3.line()
            .x(function(d) {
                return xScale(d.time);
            })
            .y(function(d) {
                let mid = (d3.min(btcData, function(d) { return +d.price; }) + d3.max(btcData, function(d) { return +d.price; }))/2
                return yScale(mid);
            });

        const hu = svg.selectAll(".refline")
            .data([btcData], function(d){ return d.time });
        
        /* Horizontal line */
        hu.join("path")
            .datum(btcData)
            .attr("class", "refline")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style('fill', 'none')
            .style("stroke-dasharray", "5, 15")
            .attr("d", horLine)
}