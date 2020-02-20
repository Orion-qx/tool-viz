"use strict";
(function() {
    const svgSize = {
        width : 1000,
        height: 600,
    }
    const margin = 30;

    let currData;
    let xScale;
    let yScale;
    let svg

    window.addEventListener("load", init);

    function init() {
        d3.select("#graph")
            .append("svg")
                .attr("width", svgSize.width + 2*margin)
                .attr("height", svgSize.height + 2*margin)
            .append("g")
                .attr("translate", "transform(" + margin + "," + margin + ")");
        d3.csv("gapminder.csv")
            .then((resp) => makeScatterPlot(resp));
    }

    function makeScatterPlot(resp) {
        let population = resp.map((row) => parseInt(row["population"]));
        let popScale = d3.scaleLinear()
                        .domain([d3.min(population), d3.max(population)])
                        .range([0, 30]);
        drawAxis(resp);
        let div = d3.select("#graph")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0)

        //let pop_max = d3.max(currData.map((row) => parseInt(row["population"])));
        svg.selectAll("circle")
            .data(currData)
            .enter()
            .append("circle")
                .attr("cx", function(d) {
                    return xScale(d["fertility"]) + margin*2;
                })
                .attr("cy", function(d) {
                    return yScale(d["life_expectancy"]);
                })
                .attr("r", function(d) {
                    //console.log(popScale(d["population"]));
                    return popScale(d["population"]);
                })
                .style("stroke", "steelblue")
                .style("stroke-width", 2)
                .attr("fill", "white")
                .on("mouseover", (d) => {
                    div.transition()
                        .duration(200)
                        .style("opacity", 0.9);
                    //div.append
                    let prompt = d["country"];
                    //console.log(prompt);
                    div.html(prompt)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                })
                .on("mouseout", (d) => {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0)
                });

        svg.selectAll("text")
            .data(currData)
            .enter()
            .append("text")
                .attr("x", function(d){return xScale(d["fertility"]) + margin*2;})
                .attr("y", function(d) {return yScale(d["life_expectancy"]) + margin/4;})
                .style("font", "20px")
                .text(function(d) {
                    if (d["population"] > 10000000) {
                        return d["country"];
                    }
                });
            // .on("mouseover", (d) => {
            //     div.transition()
            //         .duration(200)
            //         .style("opacity", 0.9);
            //     //div.append
            //     let prompt = d["country"];
            //     div.html(prompt)
            //         .style("left", "2px")
            //         .style("top", "2px");
            // })
            // .on("mouseout", (d) => {
            //     div.transition()
            //         .duration(500)
            //         .style("opacity", 0)
            // });
    }

    function drawAxis(resp) {
        currData = resp.filter(function(d) {
            return d["year"] == 1980;
        })
        let exp = currData.map((row) => parseInt(row["life_expectancy"]));
        let fert = currData.map((row) => parseInt(row["fertility"]));
        xScale = d3.scaleLinear()
                            .domain([d3.min(fert),d3.max(fert)])
                            .range([0,svgSize.width - margin]);
        svg = d3.select("svg");
        
        svg.append("g")
            .attr("transform","translate(" + margin * 2 + "," + (svgSize.height - margin) + ")")
            .call(d3.axisBottom(xScale));
        svg.append("text")
            .attr("transform","translate(" + (svgSize.width/2) + "," + (margin + svgSize.height) + ")")
            .text("Fertility");

        yScale = d3.scaleLinear()
                        .domain([d3.min(exp) - 5, d3.max(exp) + 5])
                        .range([svgSize.height - margin, margin]);
        svg.append("g")
            .attr("transform","translate(" + margin * 2 + "," + 0 + ")")
            .call(d3.axisLeft(yScale));
        
        svg.append("text")
            .attr("transform","translate(" + margin/2 + "," + (svgSize.height/2) + ") rotate(-90)")
            .text("Life Expectancy");
    }

    


    /* --- HELPER FUNCTIONS --- */

    /**
     * Returns the element that has the ID attribute with the specified value.
     * @param {string} name - element ID.
     * @returns {object} - DOM object associated with id.
     */
    function id(name) {
        return document.getElementById(name);
    }

    function qs(query) {
        return document.querySelector(query);
    }

    /**
     * Returns an array of elements matching the given query.
     * @param {string} query - CSS query selector.
     * @returns {array} - Array of DOM objects matching the given query.
     */
    function qsa(query) {
        return document.querySelectorAll(query);
    }

    /**
     * Create new element with the given type.
     * @param {string} elType - The name of html tag.
     * @returns {DOM} - A new DOM object with the given type.
     */
    function gen(elType) {
        return document.createElement(elType);
    }
})();