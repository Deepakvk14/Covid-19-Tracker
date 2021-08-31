import React, {useState, useEffect} from "react";
import {MenuItem, FormControl, Select, Card, CardContent} from "@material-ui/core";
import './App.css';
import InfoBox from "./InfoBox";
import Map from './Map';
import Table from './Table'
import { sortData } from "./Util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries,setCountries]=useState([])
  const [country, setCountry] = useState("worldwide")
  const [countryInfo,setCountryInfo]= useState({})
  const [tableData,setTableData] = useState([])
  const [mapCenter,setMapCenter]=useState({lat:34.80746,lng:-40.4796});
  const [ mapZoom,setMapZoom]=useState([3])
  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data)
      console.log(data);
    });

  },[]);
  useEffect(()=>{
  const getCountriesData = async ()=> {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response)=> response.json())
    .then((data) => {
      const countries = data.map((country)=>({
        name: country.country,
        value:country.countryInfo.iso2,
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
  });
};
getCountriesData();
},[]);
const onCountryChange= async(event)=> {
  const countryCode= event.target.value;
  const url=countryCode==="worldwide"
  ? "https://disease.sh/v3/covid-19/all"
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`
  await fetch(url)
  .then(responce=>responce.json())
  .then(data=>{
    setCountry(countryCode);
    setCountryInfo(data)

    setMapCenter([data.countryInfo.lat,data.countryInfo.lng]);
    setMapZoom(4);
  })
  // console.log(countryCode);
  // setCountry(countryCode);
}
console.log("countryInfo",countryInfo)
  return (
    <div className="App">
    <div className="app__left">
    <div className="app__header">
    <h3> COVID-19-TRACKER </h3>
    <FormControl class="app__dropdown">
      <Select varient="outlined" onChange={onCountryChange} value={country}>
      <MenuItem value="worldwide">worldwide</MenuItem>
      
        {
          countries.map((country)=>
          <MenuItem value={country.value}>{country.name}</MenuItem>)
        }
      </Select>
    </FormControl>
      
    </div>
    <div className="app__stats">
      <InfoBox className="cases" title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
      <InfoBox className="recover"  title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
      
      <InfoBox className="death"  title="Death" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
    </div>
    <Map
      center={mapCenter}
      zoom={mapZoom}
    />
    </div>
    <Card className="app__right">
        <CardContent>
          <h3> Live Cases by Country </h3>
          <Table countries={tableData}/>
          <h3> Worldwide new cases </h3>
          <LineGraph/>
        </CardContent>
        
    </Card>
    </div>
   
  );
  
}

export default App;
