
import React,{useState,useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral";
import './index.css';

    const options={
        Legend:{
            display:false,
        },
        elements :{
            point: {
                radius:0,
            },
        },
        maintainAspectRatio:false,
        tooltips: {
            mode:"index",
            intersect:false,
            callbacks:{
                lable: function(tooltipItem,data) {
                    return numeral(tooltipItem.value).format("+0,0");
                },
            },
        },
        scales: {
            xAxes:[
                {
                    type:"time",
                    time:{
                    format:"MM/DD/YY",
                    tolltipFormat:"ll",
                },
            },
            ],
            yAxes: [
                {
                gridLines:{
                    diisplay:false,
                },
                ticks: {
                    callback: function (value,index,values) {
                        return numeral(value).format("0a");
                    },
                },
            },
            ],
        },
    };

    const buildChartData = (data, casesType)=> {
        let chartData=[];
        let lastDataPoint;

        for(let date in data.cases){
            if(lastDataPoint) {
                let newDataPoint ={
                    x:date,
                    y:data[casesType][date]-lastDataPoint
                };
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[casesType][date]
        };
        return chartData;
    };
    
function LineGraph({casesType}) {
    const [data, setData] = useState({});

    useEffect(()=>{
        const fetchData = async()=> {
            await  fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response)=> {
            return response.json();
            })
            .then((data)=>{
                let chartData = buildChartData(data, 'cases');
                setData(chartData);
                console.log("hello",chartData);
            });
        };
       fetchData();
    } ,[]);
      

    return (
        <div className="chart">
        {data?.length > 0 && (
            <Line 
            data={{
                datasets:[{
                    borderColor:"red",
                    backgroundColor:'blue',
                    data:data,
                    },
                 ],
            }}
            options={options}
          />
         )}
        </div>
    )
}

export default LineGraph;
