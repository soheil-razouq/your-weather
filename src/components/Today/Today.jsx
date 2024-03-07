import Navbar from "../Navbar/Navbar";
import React, { useEffect } from 'react';
import { useState } from 'react';
import "./Today.css";
import { Navigate } from "react-router";


export default function Today() {
    // consts
    const [dataByLocation, setDataByLocation] = useState();
    const [airPollutionData, setAirPollutionData] = useState("");
    const [cityInput, setCityInput] = useState("");
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const [error, setError] = useState(null)
    const DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const FullDateToday = new Date();
    const TodayName = DaysOfWeek[FullDateToday.getDay()];
    const dayOfMonth = FullDateToday.getDate();

    //get the day with suffix th,st,nd,rd
    const getDayWithSuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1:
                return `${day}st`;
            case 2:
                return `${day}nd`;
            case 3:
                return `${day}rd`;
            default:
                return `${day}th`;
        }
    };
    const formattedDateString = `${monthNames[FullDateToday.getMonth()]} ${getDayWithSuffix(dayOfMonth)}`;
    //fetch data by a city input
    const getWeatherDataByLocation = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=f2e41bbf55c69a846243962a4b951b76`);
            const data = await response.json();
            setDataByLocation(data);
            // setLongitude(data.city.coord.lon);
            // setLatitude(data.city.coord.lat);

            // const responseAir = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=f2e41bbf55c69a846243962a4b951b76`);
            // const AirData = await responseAir.json();
            // setAirPollutionData(AirData);
        } catch (error) {
            setError("error here in fetch data")
            console.error('Error fetching initial weather data:', error);
        }
    };
    //show images by wather status
    const getWeatherImage = () => {
        const weatherStatus = dataByLocation.list[0].weather[0].main;
        const imageMap = {
            'Sun': './sunny.jpg',
            'Clear': './sunny.jpg',
            'Clouds': './cloudy.jpg',
            'Rain': './rainy.jpg',
            'Snow': './snowy.jpg',
            'Wind': './windy.jpg',
        };
        const imageSource = imageMap[weatherStatus];
        return imageSource;
    };
    //Increament forecast day
    const getNext4Days = () => {
        // 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDayIndex = FullDateToday.getDay();

        const next4Days = [];
        for (let i = 1; i <= 4; i++) {
            const nextDayIndex = (currentDayIndex + i) % 7;
            next4Days.push(days[nextDayIndex]);
        }
        return next4Days;
    };

    return (
        <>
            <div class="container h-100">

                <Navbar />
                <div className="row p-5">
                    <div className="col-2">
                        Dark Mode<input className="form-check-input" type="checkbox" />Light Mode
                    </div>
                    <div className="col-6">
                        <form className="form-inline" onSubmit={getWeatherDataByLocation}>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text"><i className="bi bi-search"></i></div>
                                </div>
                                <input className="form-control mr-sm-2 justify-content-center" type="search" placeholder="Search" aria-label="Search" onChange={(e) => setCityInput(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="col-3">
                        {/* <button type="button" class="btn btn-success" onClick={getLocation()}>Current Location</button> */}
                    </div>
                </div>

                {dataByLocation
                    ? (
                        <>

                            <div className="row justify-content-center p-5">
                                <div className="col-5">
                                    <div className="card bg-dark text-white" >
                                        <img
                                            src={getWeatherImage()}
                                            className="card-img"
                                            alt="weather"
                                            style={{ opacity: "0.8" }}
                                        />
                                        <div
                                            className="card-img-overlay text-dark p-5"
                                            style={{ border: "5px", backgroundColor: "rgba(190, 216, 232, .5)" }}
                                        >
                                            <h4 className="mb-0">{dataByLocation.city.name},{dataByLocation.city.country}</h4>
                                            <p className="display-2 my-3">{(dataByLocation.list[0].main.temp - 273.15).toFixed(2)} °C</p>
                                            <p className="mb-2">
                                                Feels Like: <strong>{(dataByLocation.list[0].main.feels_like - 273.15).toFixed(2)} °C</strong>
                                            </p>
                                            <h5 className="mb-2">{dataByLocation.list[0].weather[0].description} <span className="text-bleu">right</span></h5>
                                            <h4 className="text-end">{TodayName}</h4>
                                            <p className="text-end">{formattedDateString}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-7">
                                    <div className="row text-center" style={{ backgroundColor: "gray" }}>
                                        <h4>today highlights</h4>
                                    </div>

                                    <div className="row" style={{ backgroundColor: "rgb(255, 183, 183)" }}>
                                        <div className="col">
                                            <div className="row">
                                                <div className="col flex-column">
                                                    <p className="small">
                                                        <strong>CO :</strong>
                                                    </p>
                                                    <p className="mb-0">
                                                        {/* {airPollutionData.list[1].components.co} */}
                                                    </p>
                                                </div>
                                                <div className="col flex-column">
                                                    <p className="small">
                                                        <strong>NO2 :</strong>
                                                    </p>
                                                    <p className="mb-0">
                                                        {/* {airPollutionData.list[1].components.no2} */}
                                                    </p>
                                                </div>
                                                <div className="col flex-column">
                                                    <p className="small">
                                                        <strong>O3 :</strong>
                                                    </p>
                                                    <p className="mb-0">
                                                        {/* {airPollutionData.list[1].components.o3} */}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col text-center">
                                            <p className="small">
                                                <strong>Sunrise :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {(new Date(dataByLocation.city.sunrise * 1000)).getHours() + 'H'}
                                                &nbsp;
                                                {(new Date(dataByLocation.city.sunrise * 1000)).getMinutes() + 'Min'}
                                            </p>
                                        </div>
                                        <div className="col text-center">
                                            <p className="small">
                                                <strong>Sunset :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {(new Date(dataByLocation.city.sunset * 1000)).getHours() + 'H'}
                                                &nbsp;
                                                {(new Date(dataByLocation.city.sunset * 1000)).getMinutes() + 'Min'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row" style={{ backgroundColor: "rgb(153, 183, 134)" }}>
                                        <div className="col flex-column">
                                            <p className="small">
                                                <strong>Max Tem :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {(dataByLocation.list[0].main.temp_max - 273.15).toFixed(2)} °C
                                            </p>
                                        </div>
                                        <div className="col flex-column">
                                            <p className="small">
                                                <strong>Min Tem :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {(dataByLocation.list[0].main.temp_min - 273.15).toFixed(2)} °C
                                            </p>
                                        </div>
                                        <div className="col flex-column">
                                            <p className="small">
                                                <strong> Humidity :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {dataByLocation.list[0].main.humidity}
                                            </p>
                                        </div>
                                        <div className="col flex-column">
                                            <p className="small">
                                                <strong>Wind Speed :</strong>
                                            </p>
                                            <p className="mb-0">
                                                {dataByLocation.list[0].wind.speed}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row justify-content-center">
                                <div className="card mb-4" style={{ borderRadius: "25px" }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-around text-center pb-3 pt-2">
                                            <div className="flex-column">
                                                <p className="small">
                                                    <strong>{getNext4Days()[0].substring(0, 3)}</strong>
                                                </p>
                                                <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                                <p className="mb-0">
                                                    <strong>{(dataByLocation.list[1].main.temp - 273.15).toFixed(2)} °C</strong>
                                                </p>
                                            </div>

                                            <div className="flex-column">
                                                <p className="small">
                                                    <strong>{getNext4Days()[1].substring(0, 3)}</strong>
                                                </p>
                                                <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                                <p className="mb-0">
                                                    <strong>{(dataByLocation.list[2].main.temp - 273.15).toFixed(2)} °C</strong>

                                                </p>
                                            </div>

                                            <div className="flex-column">
                                                <p className="small">
                                                    <strong>{getNext4Days()[2].substring(0, 3)}</strong>
                                                </p>
                                                <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                                <p className="mb-0">
                                                    <strong>{(dataByLocation.list[3].main.temp - 273.15).toFixed(2)} °C</strong>
                                                </p>
                                            </div>

                                            <div className="flex-column">
                                                <p className="small">
                                                    <strong>{getNext4Days()[3].substring(0, 3)}</strong>
                                                </p>
                                                <i className="fas fa-sun fa-2x mb-3" style={{ color: "#ddd" }}></i>
                                                <p className="mb-0">
                                                    <strong>{(dataByLocation.list[4].main.temp - 273.15).toFixed(2)} °C</strong>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    :
                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-8 col-xl-6 p-5">
                            <div className="card bg-danger text-white " >
                                No data input your city ...
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}