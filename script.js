// chart initialization
let margin = {top:25, right:25,left:40,bottom:25};
let outHeight = 500;
let outWidth = 960;
let width = outWidth - margin.left - margin.right,
	height = outHeight - margin.top - margin.bottom;
let type = d3.select('#group-by').node().value;
let sortStatus = 0;

const svg = d3.select('.chart').append('svg')
	.attr("width", outWidth)
	.attr("height", outHeight)
    .attr("role", "graphics-document")
    .attr("aria-roledescription","bar chart")
    .attr("tabindex",0);

const g = svg.append("g")
   	.attr("transform", `translate(${margin.left}, ${margin.right})`);

let companyScale = d3.scaleBand()
	.rangeRound([0,width])
    .paddingInner(0.1);
let yScale = d3.scaleLinear()
	.range([height,0]);


function update(data,type){
	console.log(type);
	
	svg.selectAll("text").remove();
	g.selectAll(".axis.x-axis").remove();
	g.selectAll(".axis.y-axis").remove();

	ymax = d3.max(data,d=>d[type])
    companyScale.domain(data.map(d=>d.company));
    yScale.domain([0, ymax+(ymax/10)]);

    const bars=g.selectAll("rect")
        .data(data,d=>d.company);
	
	bars.enter()
		.append("rect")
		.merge(bars)
		.attr("y",d=>yScale(d[type]))
		.attr("width",companyScale.bandwidth())
		.attr("height",d=>height-yScale(d[type]))
        .attr("role","graphics-symbol")
        .attr("aria-roledescription","bar element")
        .attr("aria-label",d=>d.company+": "+ d[type]+" "+type)
        .attr("tabindex",0)
		.transition()
		.duration(1000)
		.attr('fill',"steelblue")
		.attr("x",d=>companyScale(d.company));

	bars.exit()
		.transition()
		.duration(1000)
		.attr("fill","cyan")
		.attr("opacity",0)
		.attr("x",0)
		.remove();
	
	const xAxis = d3.axisBottom()
    	.scale(companyScale);
	const yAxis = d3.axisLeft()
		.scale(yScale);

	g.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`)
        .attr("aria-hidden",true)
		.transition()
		.duration(1000)
		.call(xAxis);
	
	g.append("g")
		.attr("class", "axis y-axis")
        .attr("aria-hidden","true")
		.transition()
		.duration(1000)
		.call(yAxis);
	
	if(type=="stores"){
		let word = "Stores";
		svg.append("text")
		.transition()
		.duration(1000)
		.attr('x', 20)
		.attr('y', 20)
		.text(word);
        svg.attr("aria-label","bar chart showing the number of stores worldwide by company name. Starbucks leads in first with Dunkin and Tim Hortons trailing in second and third respectively. Cafe Nero is in last.")

	}
	if(type=="revenue"){
		let word = "Billion USD";
		svg.append("text")
		.transition()
		.duration(1000)
		.attr('x', 20)
		.attr('y', 20)
		.text(word);
        svg.attr("aria-label","bar chart showing the revenue in billions of US dollars by company name. Starbucks is in first with Time Hortons an Panera Bread following. Cafe Nero is in last.")

	}

		
}

let coffeeData;
d3.csv(
	'coffee-house-chains.csv', d3.autoType).then(data=>{
		coffeeData = data;
		update(coffeeData,type);
        console.log("coffeeData", coffeeData);

});

d3.select("#group-by")
	.on("change", function change(){
		type = d3.select('#group-by').node().value;
		d3.csv(
			'coffee-house-chains.csv', d3.autoType).then(data=>{
				sortStatus=1;
				data.sort((a,b)=>b[type]-a[type]);
				update(data,type);
			
		});
});

d3.select(".sort_button")
	.on("click", function changeSort(){
				console.log(coffeeData);
				if (sortStatus == 1){
					console.log("reg",sortStatus)
					coffeeData.sort((a,b)=>d3.ascending(a[type],b[type]))
					update(coffeeData,type)
					sortStatus=0;
				}
				else{
					console.log("revers",sortStatus)
					coffeeData.sort((a,b)=>d3.descending(a[type],b[type]))
					update(coffeeData,type)
					sortStatus=1;
				}
	});