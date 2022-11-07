'use strict'
let onload=()=>{
    document.getElementById('add_row').addEventListener('click',()=>{
        let row=document.createElement('div')
        row.classList.add('row')
        let del_btn=document.createElement('img')
        del_btn.src='remove.png'
        del_btn.width='32px'
        del_btn.height='32px'
        del_btn.addEventListener('click',delete_row)
        row.appendChild(del_btn)
        let id_input=document.createElement('input')
        id_input.type='text'
        id_input.classList.add('class_id')
        id_input.addEventListener('change',update)
        row.appendChild(id_input)
        let x_char=document.createElement('span')
        x_char.innerText=' X '
        row.appendChild(x_char)
        let mul_input=document.createElement('input')
        mul_input.type='number'
        mul_input.value=1
        mul_input.min='1'
        mul_input.classList.add('class_mul')
        mul_input.addEventListener('change',update)
        row.appendChild(mul_input)
        document.getElementById('container').appendChild(row)
        update()
    })
    
    document.getElementById('clear_all').addEventListener('click',()=>{
        let rows=document.getElementsByClassName('row')
        for(let i=rows.length-1;i>=0;i--)
            rows[i].remove()
        let click=new Event('click')
        document.getElementById('add_row').dispatchEvent(click)
    })

    let delete_row=e=>{
        e.target.parentElement.remove()
        update()
    }
    let update=()=>{
        //run on id change
        //run on multipiler change
        //run on row number change
        data=[]
        let id_es=document.getElementsByClassName('class_id')
        let mul_es=document.getElementsByClassName('class_mul')
        for(let i=0,l=id_es.length;i<l;i++){
            let id=(id_es[i].value)
            let mul=parseInt(mul_es[i].value)
            if(mul<1)
                mul=1
            for(let j=0;j<mul;j++)
                data.push(id)
        }
        document.getElementById('chart').children[0].remove()
        draw()
    }
}


//----------------------------------------------------SPINNING PART----------------------------------------------------//
const MAX_ROT=15
const MIN_ROT=8


var padding = {top:20, right:40, bottom:0, left:0},
            w = 500 - padding.left - padding.right,
            h = 500 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            color = d3.scaleOrdinal(d3.schemeSet3) //category20c()
            //randomNumbers = getRandomNumbers();
            //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
var data = [''];
var svg
var container
var vis
var arcs
var pie = d3.pie().sort(null).value(function(d){return 1;});
// declare an arc generator function
var arc = d3.arc().outerRadius(r);
// select paths, use arc generator to draw
let draw=()=>{
    svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom)

    container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")")
                
    vis = container
        .append("g");

    arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice")
                
    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { 
        d.innerRadius=0;
        d.outerRadius=r;
        return arc(d); 
    });
            // add the text
    arcs.append("text")
        .attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
        return data[i];
    });

    svg.append("g") //make arrow
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style("fill","black");
    container.append("circle") //draw spin circle
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style("cursor","pointer")
    container.append("text") //spin text
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("SPIN")
        .attr('style',"font-weight:bold; font-size:30px;fill:white;");
    container.on("click", spin);   
}
window.addEventListener('DOMContentLoaded',()=>{
    draw()
    onload()
    let click=new Event('click')
    document.getElementById('add_row').dispatchEvent(click)
})
function spin(d){            
    container.on("click", null);
            //all slices have been seen, all done
            //console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            /*if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }*/
    var ps = 360/data.length,
    //pieslice = Math.round(1800/data.length),
    rng = (getRandomNumbers())[Math.floor(Math.random()*10)]%(Math.abs(MAX_ROT-MIN_ROT)*360)+MIN_ROT*360//Math.floor((Math.random() * 1440) + 360);
    rotation = (Math.round(rng / ps) * ps);
    //console.log(rng);
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
            
    rotation += 90 - Math.round(ps/2);
    vis.transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .on("end",()=>{
                    //mark question as seen
                    /*d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");*/
                    //populate question
                    
        oldrotation = rotation;
              
                    // Get the result value from object "data" 
        //console.log(data[picked])
              
                    // Comment the below line for restrict spin to sngle time 
        container.on("click", spin);
    });
}
        
function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}
        
        
function getRandomNumbers(){
    var array = new Uint16Array(10);
    //var scale = d3.scaleLinear().range([MIN_ROT*360, MAX_ROT*360]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        //console.log("works");
    } else {
                //no support for crypto, get crappy random numbers
        for(var i=0; i < 10; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}