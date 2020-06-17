

document.addEventListener("DOMContentLoaded",show_data);
document.getElementById("submit-btn")!.addEventListener("click",job);
document.addEventListener("click",function(e){
    let Target = e.target as HTMLElement;
    if(Target.className==="delete"){
        let delete_element:string=Target.parentElement!.parentElement!.id;
        let name=Target.parentElement!.parentElement!.tagName;
        console.log("index",delete_element,name);
        let inc_ex=delete_from_database(delete_element);
    
        let output2:HTMLElement=document.getElementById("list")!;
        let totalincome=parseInt((((document.getElementById("list")!.firstChild)!.textContent as string).split("="))[1]);
        let totalexpense=parseInt((((document.getElementById("list")!.firstChild)!.nextSibling!.nextSibling!.textContent as string).split("="))[1]);
        totalincome-=inc_ex[0];
        totalexpense-=inc_ex[1];
        output2.innerHTML=`<li>Total income=${totalincome}</li>
        <li>Total expenses=${totalexpense}</li>`;
    
        Target.parentElement!.parentElement!.remove();
     }
})
//////////////////////////////////////////////////remove data from database

function delete_from_database(index:string):Array<number>{
  
    let retrived_data:string[][]=JSON.parse(localStorage.getItem("mydata1")!);
    //console.log("del",retrived_data);

    let db=retrived_data.length;
    let inc=0,ex=0;
    for(var i=0;i<db;i++){
      //  console.log(retrived_data[i][4],index);
        if(retrived_data[i][4]===index){
            if(retrived_data[i][0]==="I")inc=parseInt(retrived_data[i][3]);
            else ex=parseInt(retrived_data[i][3]);
            retrived_data.splice(i,1);
            break;
        }
    }
    localStorage.setItem("mydata1",JSON.stringify(retrived_data));
    console.log(inc,ex);
    return [inc,ex];
}

//////////////////////////////////////////////////show data from the database when page loads


function show_data():void{
    let color="";
    let retrived_data=localStorage.getItem("mydata1");
    let db:number;
    let database:string[][]=[];

    if(retrived_data===null) {
        let output2: HTMLElement=document.createElement("ul")!;
    output2.id="list";
    output2.innerHTML=`<li>Total income=0</li>
             <li>Total expenses=0</li>`;/*
             <li>Average income=0</li>
             <li>Average expenses=0</li>`;*/
    document.getElementById("output-card")!.appendChild(output2);
    return;
    }
    else{ 
        database=JSON.parse(retrived_data); 
        db=database.length;
    }
    let totalincome=0;
    let totalexpense=0;
    let avg_income=0,avg_expense=0,ic=0,ec=0;
    for(var i=0;i<db;i++){
         if(database[i][0]==="I" ){ic++;totalincome+=parseInt(database[i][3]);color="rgb(150,250,150,0.5)";}
         else {ec++;totalexpense+=parseInt(database[i][3]);color="rgb(250,150,150,0.5)";}  
         let output:HTMLElement=document.createElement("tr")!;
         output.style.backgroundColor=color;
         output.id=database[i][4];
            output.innerHTML= `<td >${database[i][0]}</td>
                <td>${database[i][1]}</td>
                <td>${database[i][2]}</td>
                <td>${database[i][3]}</td>
                <td ><a href="#" class="delete">&times<a></td>`;

                document.getElementById("table")!.appendChild(output);

    }
    avg_income=totalincome/ic;
    avg_expense=totalexpense/ec;
   
    let output2: HTMLElement=document.createElement("ul")!;
    output2.id="list";
    output2.innerHTML=`<li>Total income=${totalincome}</li>
             <li>Total expenses=${totalexpense}</li>`;/*
             <li>Average income=${avg_income}</li>
             <li>Average expenses=${avg_expense}</li>`;*/
    document.getElementById("output-card")!.appendChild(output2);

}


function job(){
    let retrived_data=localStorage.getItem("mydata1");
    let max_id=0;
    if(retrived_data==null)max_id=0;
    else max_id=find_max();
    let data:string[][];
    [data,max_id]=get_data(max_id);
    console.log(max_id);
    displaydata(data,max_id);
}

/////////////////////////////////////////////////////////get data from input and store it after validation

function get_data(max_id:number):any{
    let data = (<HTMLTextAreaElement>document.getElementById("text-input")).value;
    if(data===""){
        alert("Please enter some data");
         return null;
    }
    let refined_data:string[][]=refine_data(data);            
    let val=validatedata(refined_data);

    if(val===1)       { alert("Invalid Header");return null ; }
    else if(val===2)  { alert("Invalid data");return null; }
    else {
    (<HTMLTextAreaElement>document.getElementById("text-input")).value="";
   
    let retrived_data=localStorage.getItem("mydata1");
    let database:string[][]=[];
    if(retrived_data!=null){
        database=JSON.parse(retrived_data);
    }
    refined_data.shift();

    [refined_data,max_id]=add_id(max_id,refined_data);
    
    console.log(refined_data,max_id);
    database.push(...refined_data);
    localStorage.setItem("mydata1",JSON.stringify(database));
    }
    return [refined_data,max_id];
}
//////////////////////////////////////////////////////////  display the table


function displaydata(data:string[][]|null,max_id:number){
    if(data===null)return;
    let len=data.length;
    let color="";
    let totalincome=parseInt((((document.getElementById("list")!.firstChild)!.textContent as string).split("="))[1]);
    let totalexpense=parseInt((((document.getElementById("list")!.firstChild)!.nextSibling!.nextSibling!.textContent as string).split("="))[1]);
    //console.log(totalexpense,totalincome);
  //  let avg_income=parseFloat((((document.getElementById("list")!.lastChild)!.previousSibling!.previousSibling!.textContent as string).split("="))[1]);
    //let avg_expense=parseFloat((((document.getElementById("list")!.lastChild)!.textContent as string).split("="))[1]);
    //let ic,ex;
    // if(avg_income==0)ic=0;
    // else ic=Math.round(totalincome/avg_income);
    // if(avg_expense==0)ex=0;
    // else ex=Math.round(totalexpense/avg_expense);
    
    // console.log("avg",avg_expense,avg_income);
    
    
    for(var i=0;i<len;i++){
     
        if(data[i][0]=="I" ){totalincome+=parseInt(data[i][3]);color="rgb(150,250,150,0.5)";}
        else {totalexpense+=parseInt(data[i][3]);color="rgb(250,150,150,0.5)";}  
       // console.log(totalexpense,totalincome);
        let output:HTMLElement=document.createElement("tr")!;
        output.style.backgroundColor=color;
        output.id=(max_id-len+i).toString();
        output.innerHTML= `<td>${data[i][0]}</td>
               <td>${data[i][1]}</td>
               <td>${data[i][2]}</td>
               <td>${data[i][3]}</td>
               <td><a href="#" class="delete">&times<a></td>`;
       document.getElementById("table")!.appendChild(output);
    }
    //console.log(totalexpense,totalincome);
    let output2:HTMLElement=document.getElementById("list")!
    output2.innerHTML=`<li>Total income=${totalincome}</li>
    <li>Total expenses=${totalexpense}</li>`;
    
    

}


 /////////////////////////////////////////////////////////////////// validate the data 

 function validatedata(data:string[][]):number{
    let len=data.length;
   // for(var i=0;i<4;i++)data[0][i].toUpperCase();

  //  console.log(data);
    if(data[0].length!=4)return 1;
    if(data[0][0]!="I/E")return 1;
    if(data[0][2]!="Name")return 1;
    if(data[0][1]!="Date")return 1;
    if(data[0][3]!="Amount")return 1;
    for(var i=1;i<len;i++){
        if(data[i].length!==4)return 2;
        //console.log(data[i]);
        data[i][0]=data[i][0].trim();
        data[i][1]=data[i][1].trim();
        data[i][2]=data[i][2].trim();
        data[i][3]=data[i][3].trim();
       // console.log(data[i]);
        if(data[i][0]==="I"||data[i][0]==="E"){
              if(isNaN(parseInt(data[i][3]))) return 2;
        }else{
            return 2;
        }
    }
    return 0;
}
////////////////////////////////////////////////adding ids
function add_id(max_id:number,data:string[][]):any{
      
      let len=data.length;
      console.log(len);
      console.log(data,max_id,"both");
      for(var i=0;i<len;i++){
          data[i].push(max_id.toString());
          max_id++;   
      }
      return [data,max_id];
}

//////////////////////////////////////////////////////////////////////preprocessing of  input

function refine_data(data:string):string[][]{
  let data1=data.split("\n");
  //console.log("data1",data1);
   let len=data1.length;
   let data2:string[][]=[];
   //console.log("data2",data2);
   for(var i=0;i<len;i++){
      data2[i]=data1[i].split(",");
   }
   return data2;

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function find_max():number{
    let retrived_data:string[][]=JSON.parse(localStorage.getItem("mydata1")!);
    let db=retrived_data.length;
    let ans=0;
    for(var i=0;i<db;i++){
        ans=Math.max(ans,parseInt(retrived_data[i][4]));
    }
    return ans+1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////


