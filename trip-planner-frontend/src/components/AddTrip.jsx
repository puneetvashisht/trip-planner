import { useState } from "react";

const AddTrip = () => {

    const [tripData, setTripData] = useState({
        name: "Test",
        description: "Test Description",
        startDate: "2025-01-01",
        endDate: "2025-01-01"
    });
    const addTrip = () => {
        console.log("Trip added");
        console.log(tripData);
        tripData.owner = {
            id: "1"
        }
        fetch("http://localhost:9090/api/trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tripData)
        })
    }


    // write common handleChange function for all input fields
    const handleChange = (e) => {
        console.log(e.target.name);
        console.log(e.target.value);
        // setTripData({ ...tripData, [e.target.name]: e.target.value });
        
        let newTripData = { ...tripData };
        newTripData[e.target.name] = e.target.value;
        console.log(newTripData);
        setTripData(newTripData);
    }


    return (
        <div className="content-section">
            <h1>Add Trip</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="title">Trip Name</label>
                    <input type="text" id="title" name="title" value={tripData.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Trip Description</label>
                    <textarea id="description" name="description" value={tripData.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Trip Start Date</label>
                    <input type="date" id="startDate" name="startDate" value={tripData.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">Trip End Date</label>
                    <input type="date" id="endDate" name="endDate" value={tripData.endDate} onChange={handleChange} />
                </div>
              
                <button type="button" onClick={addTrip}>Add Trip</button>
            </form>
        </div>
    )
}

export default AddTrip;