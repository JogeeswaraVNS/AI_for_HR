import React, { useState } from "react";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function EmployeeCategory() {
  let [FeedbackOnEmployee, setFeedbackOnEmployee] = useState("");

  let [EmployeeCategory, setEmployeeCategory] = useState("");

  let [EmployeeCategoryIndex, setEmployeeCategoryIndex] = useState(null);

  let [loading, setloading] = useState(false);

  let backendapi = "http://localhost:5000";

  let handleSubmit = async () => {
    if (FeedbackOnEmployee.length > 0) {
      setloading(true);
      let response = await axios.post(`${backendapi}/predict`, {
        FeedbackOnEmployee,
      });
      setEmployeeCategory(response.data.EmployeeCategory);
      setEmployeeCategoryIndex(response.data.EmployeeCategoryIndex);
      setloading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }} className="pt-4">
      <h4 className="pb-3 text-white">Enter Feedback On Employee</h4>

      <textarea
        style={{ border: "1px solid white" }}
        className="mb-4 bg-dark text-white"
        onChange={(event) => {
          setFeedbackOnEmployee(event.target.value);
        }}
        rows={12}
        cols={120}
        placeholder="Enter the Feedback On Employee here"
      ></textarea>
      <br></br>

      <div className="col">
        <div
          onClick={() => {
            handleSubmit();
            setEmployeeCategory("");
          }}
          className="btn btn-primary"
        >
          <h5 className="px-3 pt-1">Predict</h5>
        </div>
      </div>

      {loading === true ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          className="ps-1 text-white mt-4"
        >
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="ms-2 mt-2">
            <h6>Getting Category of the Employee</h6>
          </div>
        </div>
      ) : null}

      {EmployeeCategory.length === 0 ? null : (
        <div className="mt-4">
          <div className="text-white">
            <h4>The Employee is a</h4>
            <h4 className="text-primary">{EmployeeCategory}</h4>
          </div>

          <div>
            {Array.from({ length: EmployeeCategoryIndex }, (_, i) => (
              <StarIcon key={i} style={{ color: "white" }} />
            ))}
            {Array.from({ length: 9 - EmployeeCategoryIndex }, (_, i) => (
              <StarBorderIcon key={i} style={{ color: "white" }} />
            ))}
            <h5 className="text-white pt-2">{EmployeeCategoryIndex}/9</h5>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeCategory;
