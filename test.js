'use strict'

/*---------------------------
TODO:

-----------------------------*/

const PRESETS={
    takeoff:[{name:'脫',multi:0},{name:'兔兔',multi:0},],
    takeoff2:[{name:'脫',multi:-1},{name:'兔兔',multi:-1},{name:'不脫',multi:10},{name:'再一次',multi:10},],
}
const PRESET_RAND_BASE=10
const PRESET_RAND_VAR=89

let onload=()=>{

    document.getElementById('title_text').addEventListener('change',()=>{
        document.title='就是個轉盤-'+document.getElementById('title_text').value
    })

    let new_row=(e,id='',m0=0,m1=0,m2=0)=>{
        let row=document.createElement('div')
        row.classList.add('row')
        //add del row button
        let del_btn=document.createElement('img')
        del_btn.src='remove.png'
        del_btn.width='32px'
        del_btn.height='32px'
        del_btn.addEventListener('click',delete_row)
        row.appendChild(del_btn)
        //add twitch id field
        let id_input=document.createElement('input')
        id_input.type='text'
        id_input.placeholder='圖奇ID'
        id_input.classList.add('class_id')
        id_input.value=id
        id_input.addEventListener('change',update)
        row.appendChild(id_input)

        let x_char=document.createElement('span')
        x_char.innerText=' x (斗內加成:'
        x_char.classList.add('row_text')
        row.appendChild(x_char)
        //add multipiler field
        let mul_input=document.createElement('input')
        mul_input.type='number'
        mul_input.value=m0
        mul_input.min='0'
        mul_input.classList.add('class_mul')
        mul_input.addEventListener('change',update)
        row.appendChild(mul_input)

        x_char=document.createElement('span')
        x_char.innerText=' + 點數加成:'
        x_char.classList.add('row_text')
        row.appendChild(x_char)
        //add multipiler field
        mul_input=document.createElement('input')
        mul_input.type='number'
        mul_input.value=m1
        mul_input.min='0'
        mul_input.classList.add('class_mul')
        mul_input.addEventListener('change',update)
        row.appendChild(mul_input)

        x_char=document.createElement('span')
        x_char.innerText=' + 特殊加成:'
        x_char.classList.add('row_text')
        row.appendChild(x_char)
        //add multipiler field
        mul_input=document.createElement('input')
        mul_input.type='number'
        mul_input.value=m2
        mul_input.min='0'
        mul_input.classList.add('class_mul')
        mul_input.addEventListener('change',update)
        row.appendChild(mul_input)
        x_char=document.createElement('span')
        x_char.innerText=' ) '
        x_char.classList.add('row_text')
        row.appendChild(x_char)

        document.getElementById('container').appendChild(row)
        update()
    }

    document.getElementById('add_row').addEventListener('click',new_row)
    
    document.getElementById('clear_all').addEventListener('click',()=>{
        let rows=document.getElementsByClassName('row')
        for(let i=rows.length-1;i>=0;i--)
            rows[i].remove()
        new_row()
        update()
    })
    document.getElementById('import').addEventListener('click',()=>{
        //import stuff
        //merge same row if possible
        if(!showipxp){
            document.getElementById('ip_xp').style.display='inline-block'
            showipxp=true
            return
        }
        let id_es=document.getElementsByClassName('class_id')
        let mul_es=document.getElementsByClassName('class_mul')
        let ids=[]
        for(let i=0,l=id_es.length;i<l;i++)
            ids.push(id_es[i].value)
        let imp=document.getElementById('ip_xp').value.split('\n')
        for(let i=0,l=imp.length;i<l;i++){
            let row=imp[i].split(',')
            if(row.length!==4){ //import without multipiler
                new_row(null,row[0],0,0,0)
                continue
            }
            if(ids.indexOf(row[0])!==-1){ //duplicate id
                let idx=ids.indexOf(row[0])
                let r1=isNaN(row[1])?0:row[1]
                mul_es[3*idx].value=parseInt(mul_es[3*idx].value)+parseInt(r1)
                let r2=isNaN(row[2])?0:row[2]
                mul_es[3*idx+1].value=parseInt(mul_es[3*idx+1].value)+parseInt(r2)
                let r3=isNaN(row[3])?0:row[3]
                mul_es[3*idx+2].value=parseInt(mul_es[3*idx+2].value)+parseInt(r3)
                update()
            }
            else{ //new id
                new_row(null,row[0],row[1],row[2],row[3])
            }
        }
        remove_id('')
        update()
    })

    document.getElementById('export').addEventListener('click',()=>{
        //export stuff
        if(!showipxp){
            document.getElementById('ip_xp').style.display='inline-block'
            showipxp=true
        }
        let exp_str=''
        let id_es=document.getElementsByClassName('class_id')
        let mul_es=document.getElementsByClassName('class_mul')
        for(let i=0,l=id_es.length;i<l;i++){
            let id=(id_es[i].value)
            let mul0=parseInt(mul_es[3*i].value)
            mul0=isNaN(mul0)?0:mul0
            let mul1=parseInt(mul_es[3*i+1].value)
            mul1=isNaN(mul1)?0:mul1
            let mul2=parseInt(mul_es[3*i+2].value)
            mul2=isNaN(mul2)?0:mul2
            exp_str+=(id+','+mul0.toString()+','+mul1.toString()+','+mul2.toString()+'\n')
        }
        console.log(exp_str);
        document.getElementById('ip_xp').value=exp_str
        /*
        aaa,1,2,3
        bbb,5,7,8
        */
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
            let mul0=parseInt(mul_es[3*i].value)
            mul0=isNaN(mul0)?0:mul0
            let mul1=parseInt(mul_es[3*i+1].value)
            mul1=isNaN(mul1)?0:mul1
            let mul2=parseInt(mul_es[3*i+2].value)
            mul2=isNaN(mul2)?0:mul2
            let mul=1+mul0+mul1+mul2
            if(mul<1||isNaN(mul))
                mul=1
            for(let j=0;j<mul;j++)
                data.push(id)
        }
        if(data.indexOf('')<0)
            new_row()
        for (let l=data.length-1;l>0;l--) {
            let j=Math.floor(Math.random()*(l+1));
            [data[l], data[j]] = [data[j], data[l]];
        }
        document.getElementById('chart').children[0].remove()
        draw()
    }
    //document.getElementById('random').addEventListener('click',shuffle)

    let remove_id=id=>{
        let ids=document.getElementsByClassName('class_id')
        for(let i=ids.length-1;i>=0;i--) {
            if(ids[i].value===id){
                ids[i].parentElement.remove()
            }
        }
    }
    document.getElementById('remove_pick').addEventListener('click',()=>{
        let pickedid=data[picked]
        remove_id(pickedid)
        update()
    })

    
    document.getElementById('presets').addEventListener('change',()=>{
        let sel_value=document.getElementById('presets').value
        document.getElementById('clear_all').dispatchEvent(new Event('click'))
        document.getElementById('ip_xp').value=''
        if(sel_value.length){
            if(PRESETS[sel_value]===undefined){
                return
            }
            let list=PRESETS[sel_value]
            let result=''
            for(let i=0;i<list.length;i++){
                let multi=list[i].multi
                if(multi===-1) //-1 means random num
                    multi=PRESET_RAND_BASE+Math.floor(Math.random()*PRESET_RAND_VAR)
                result+=(list[i].name+',0,0,'+multi+'\n')
            }
            document.getElementById('ip_xp').value=result
            document.getElementById('import').dispatchEvent(new Event('click'))
        }
    })
}

/*let shuffle=()=>{
    //shuffle list
    if(data.length<=2)
        return
    for (let l=data.length-1;l>0;l--) {
        let j=Math.floor(Math.random()*(l+1));
        [data[l], data[j]] = [data[j], data[l]];
    }
    document.getElementById('chart').children[0].remove()
    draw()
}*/


//----------------------------------------------------SPINNING PART----------------------------------------------------//
const MAX_ROT=18
const MIN_ROT=8
const RAND_ARRSIZE=64
const DURATION_BASE_MS=5000
const DURATION_VAR_MS=3500
let showipxp=true

var padding = {top:20, right:40, bottom:0, left:0},
    w = 600 - padding.left - padding.right,
    h = 600 - padding.top  - padding.bottom,
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
        .style("fill","white");
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
    document.getElementById('add_row').dispatchEvent(new Event('click'))
    document.getElementById('overlay').addEventListener('click',()=>{
        document.getElementById('remove_pick').style.display='none'
        document.getElementById('overlay').classList.add('hidden')
        setTimeout(() => {
            let e=document.getElementById('overlay')
            e.style.display='none'
            e.classList.remove('hidden')
        }, 1010);
    })
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
    var ps = 360/data.length
    //pieslice = Math.round(1800/data.length),
    var index=null
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function")
        index=Math.floor(window.crypto.getRandomValues(new Uint16Array(1))[0]/0xffff*RAND_ARRSIZE)
    else
        index=Math.floor(Math.random()*RAND_ARRSIZE)
    var rng = (getRandomNumbers())[index]%(Math.abs(MAX_ROT-MIN_ROT)*360)+MIN_ROT*360//Math.floor((Math.random() * 1440) + 360);
    //console.log(rng);
    rotation = (Math.round(rng / ps) * ps);
    //console.log(rng);
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;
            
    rotation += 90 - Math.round(ps/2);

    let easeAnim=[d3.easeBackOut.overshoot(.4),d3.easeExpOut,d3.easeCircleOut,d3.easeElasticOut]
    let anim=Math.floor(Math.random()*easeAnim.length)

    vis.transition()
        .ease(easeAnim[anim])
        .duration(DURATION_BASE_MS+Math.random()*DURATION_VAR_MS)
        .attrTween("transform", rotTween)
        .on("end",()=>{
                    //mark question as seen
                    /*d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");*/
                    //populate question
                    
        oldrotation = rotation;
              
                    // Get the result value from object "data" 
        //console.log(data[picked])
        if(data.length>1){
            if(data[picked].length===0)
                document.getElementById('overlay_text').innerText='再轉一次'
            else {
                document.getElementById('remove_pick').style.display='inline';
                document.getElementById('overlay_text').innerText=data[picked]
                
            }
            document.getElementById('overlay').style.display='block'
        }
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
    var array = new Uint16Array(RAND_ARRSIZE);
    //var scale = d3.scaleLinear().range([MIN_ROT*360, MAX_ROT*360]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        //console.log("works");
    } else {
                //no support for crypto, get crappy random numbers
        for(var i=0; i < RAND_ARRSIZE; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}
