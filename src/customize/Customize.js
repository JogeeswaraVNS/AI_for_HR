import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import { Modal, ModalBody, ModalFooter } from "react-bootstrap";
import RenderFlatTable from "./RenderFlatTable";

function Customize() {
  let [evaluationCount, setEvaluationCount] = useState("");
  let [startYear, setStartYear] = useState("");
  let [endYear, setEndYear] = useState("");
  let [fromYearReviews, setFromYearReviews] = useState([]);
  let [toYearReviews, setToYearReviews] = useState([]);
  let [fromReview, setFromReview] = useState("");
  let [toReview, setToReview] = useState("");
  let [isFormActive, setIsFormActive] = useState(false);
  let [error, setError] = useState(""); // Added error state
  let [uploadStatus, setUploadStatus] = useState("");
  let [file, setFile] = useState(null);
  let [buttonFlag, setbuttonFlag] = useState(false);
  let [processedData, setprocessedData] = useState([]);
  let [frequency, setfrequency] = useState([]);
  let [employee_feedback_frequency, setemployee_feedback_frequency] = useState([]);
  let [reviewfrequency, setreviewfrequency] = useState([]);
  let [Attrition_Risk_Employees, setAttrition_Risk_Employees] = useState([]);
  let [ModalData, setModalData] = useState([]);
  let [filepath, setfilepath] = useState(null);

  let [show, setshow] = useState(false);
  let [showProcessedModal, setshowProcessedModal] = useState(false);

  let [showReviews, setshowReviews] = useState(false);

  let [progress, setProgress] = useState(0);
  let [showReviewsIdx, setshowReviewsIdx] = useState(null);

  let getData = async (e) => {
    setprocessedData([]);
    setshowReviewsIdx(null);
    setshowReviews(false);
    e.preventDefault();
    try {
      setUploadStatus("Uploading and processing...");

      let eventSource = new EventSource("http://localhost:5000/progress");

      eventSource.onmessage = (event) => {
        let newCategory = JSON.parse(event.data);

        if (newCategory.message === "complete") {
          eventSource.close();
          setUploadStatus("All rows processed successfully!");
        } else {
          setProgress(newCategory);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setUploadStatus("Error in streaming data. Please try again.");
      };

      let response = await axios.post(
        "http://localhost:5000/customize_file",
        {
          startYear,
          endYear,
          fromReview,
          toReview,
          evaluationCount,
          filepath,
        } // Send parameters directly in the payload
      );

      if (response.status === 200) {
        setUploadStatus("Employees Evaluation Completed");
        let sanitizedResponse = response.data;

        // If the response data is a string, replace 'NaN' occurrences
        if (typeof sanitizedResponse === "string") {
          // sanitizedResponse = sanitizedResponse.replace(/NaN/g, "null");
          sanitizedResponse = JSON.parse(sanitizedResponse);
        }
        console.log(sanitizedResponse);
        setprocessedData(sanitizedResponse.processedData);
        setfrequency(sanitizedResponse.frequency);
        setemployee_feedback_frequency(sanitizedResponse.employee_feedback_frequency)
        setreviewfrequency(sanitizedResponse.review_frequency);
        setAttrition_Risk_Employees(sanitizedResponse.Attrition_Risk_Employees);
        setshowProcessedModal(false);
        // setFile(null);
      } else {
        setUploadStatus("Error uploading or processing file.");
        setshowProcessedModal(false);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadStatus("Error uploading or processing file.");
      setshowProcessedModal(false);
    }
  };

  let handleProcessedDownload = async () => {
    try {
      let response = await axios.post(
        "http://localhost:5000/download_processed",
        { processedData: processedData }, // Send JSON data directly
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download CSV file");
      }

      let url = window.URL.createObjectURL(new Blob([response.data]));

      let a = document.createElement("a");
      a.href = url;
      a.download = "processed_csv.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }

    try {
      let response = await axios.post(
        "http://localhost:5000/frequency_report",
        { frequency: frequency }, // Send JSON data directly
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download CSV file");
      }

      let url = window.URL.createObjectURL(new Blob([response.data]));

      let a = document.createElement("a");
      a.href = url;
      a.download = "frequency_report.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }

    
    try {
      let response = await axios.post(
        "http://localhost:5000/employee_feedback_frequency_report",
        { frequency: employee_feedback_frequency }, // Send JSON data directly
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download CSV file");
      }

      let url = window.URL.createObjectURL(new Blob([response.data]));

      let a = document.createElement("a");
      a.href = url;
      a.download = "employee_feedback_frequency_report.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }

    try {
      let response = await axios.post(
        "http://localhost:5000/RetentionStratergies",
        { Attrition_Risk_Employees: Attrition_Risk_Employees }, // Send JSON data directly
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download CSV file");
      }

      let url = window.URL.createObjectURL(new Blob([response.data]));

      let a = document.createElement("a");
      a.href = url;
      a.download = "RetentionStratergies.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }

    try {
      let response = await axios.post(
        "http://localhost:5000/download_review_frequency",
        { reviewfrequency: reviewfrequency }, // Send JSON data directly
        {
          responseType: "blob",
          headers: {
            "Content-Type": "application/json", // Explicitly set content type
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to download CSV file");
      }

      let url = window.URL.createObjectURL(new Blob([response.data]));

      let a = document.createElement("a");
      a.href = url;
      a.download = "review_frequency.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  let handleEvaluationChange = (e) => {
    setbuttonFlag(false);
    let count = parseInt(e.target.value);
    if (count >= 1 && count <= 12) {
      setEvaluationCount(count);
      setIsFormActive(true);
      setError(""); // Reset error on valid input
      if (startYear) updateFromYearReviews(startYear, count);
      if (endYear) updateToYearReviews(endYear, count);
    } else {
      setError("Please enter a valid number between 1 and 12.");
    }
  };

  let updateFromYearReviews = (year, count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push(`${year} ${i}${getOrdinalSuffix(i)} review`);
    }
    setFromYearReviews(options);
  };

  let updateToYearReviews = (year, count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push(`${year} ${i}${getOrdinalSuffix(i)} review`);
    }
    setToYearReviews(options);
  };

  let getOrdinalSuffix = (number) => {
    let suffixes = ["th", "st", "nd", "rd"];
    let v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  let handleYearChange = (e, type) => {
    setbuttonFlag(false);
    let year = parseInt(e.target.value);
    if (type === "start") {
      setStartYear(year);
      if (evaluationCount) updateFromYearReviews(year, evaluationCount);
    } else if (type === "end") {
      setEndYear(year);
      if (evaluationCount) updateToYearReviews(year, evaluationCount);
    }
  };
  let handleFileChange = (e) => {
    setbuttonFlag(false);
    setFile(e.target.files[0]);
    setUploadStatus("");
  };

  let handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    let formData = new FormData();
    formData.append("file", file);
    formData.append("startYear", startYear);
    formData.append("endYear", endYear);
    formData.append("fromReview", fromReview);
    formData.append("toReview", toReview);
    formData.append("evaluationCount", evaluationCount);

    try {
      setUploadStatus("Uploading and processing...");

      // Use Axios for the file upload and processing
      let response = await axios.post(
        "http://localhost:5000/customize",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("File uploaded and processed successfully!");
        let sanitizedResponse = response.data;

        // If the response data is a string, replace 'NaN' occurrences
        if (typeof sanitizedResponse === "string") {
          sanitizedResponse = sanitizedResponse.replace(/NaN/g, "null");
          sanitizedResponse = JSON.parse(sanitizedResponse);
        }

        // console.log(sanitizedResponse)
        // Parse the sanitized response
        // let processedData = JSON.parse(sanitizedResponse);
        setModalData(sanitizedResponse || []); // Update processedData if included in the response
        setbuttonFlag(true);
        setfilepath(sanitizedResponse.filepath);
      } else {
        setUploadStatus("Error uploading or processing file.");
        // setshow(true);
      }
    } catch (error) {
      console.error("Error uploading or processing file", error);
      setUploadStatus("Error uploading or processing file. Please try again.");
      // setshow(true);
    }
  };

  let handleDownload = async () => {
    try {
      let response = await fetch("http://localhost:5000/download", {
        method: "POST",
        body: new URLSearchParams({
          evaluationCount: evaluationCount,
          startYear: startYear,
          endYear: endYear,
          fromReview: fromReview,
          toReview: toReview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to download CSV file");
      }

      // Create a Blob from the response
      let blob = await response.blob();
      let url = window.URL.createObjectURL(blob);

      // Create a link element to trigger the download
      let a = document.createElement("a");
      a.href = url;
      a.download = "custom_data.csv";
      document.body.appendChild(a);
      a.click();

      // Clean up
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="px-5 pt-5 text-white">
      <Modal show={show} backdrop="static" centered className="modal-xl">
        <div
          className="px-3 pt-3 pb-2"
          style={{ display: "flex", justifyContent: "space-around" }}
        >
          <div style={{ marginRight: "auto" }}>
            <h5>{uploadStatus}</h5>
          </div>

          <div>
            <button
              className="btn-close"
              type="button"
              onClick={() => setshow(false)}
            ></button>
          </div>
        </div>

        <ModalBody
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          <div>
            {ModalData["flag"] === true ? (
              <div>
                <RenderFlatTable modalData={ModalData} />
              </div>
            ) : (
              <div>
                <h5 className="pb-2">{ModalData["message"]}</h5>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  {ModalData["missingColumns"]?.map((i) => (
                    <h5 className="text-danger" key={i} style={{ margin: 0 }}>
                      {i}
                    </h5>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        {ModalData["flag"] === true && (
          <ModalFooter>
            <div
              style={{ width: "100%" }}
              onClick={(e) => {
                setshow(false);
                getData(e);
                setshowProcessedModal(true);
              }}
              className="btn btn-success"
            >
              <h5>Process Now</h5>
            </div>
          </ModalFooter>
        )}
      </Modal>

      <Modal
        show={showProcessedModal}
        backdrop="static"
        centered
        className="modal-xl"
      >
        <ModalBody
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
          }}
        >
          <div
            style={{ width: `${progress}%` }}
            className="bg-success text-white d-flex align-items-center justify-content-center"
          >
            {progress}%
          </div>
        </ModalBody>
      </Modal>

      <div
        style={{ display: "flex", alignItems: "center",fontSize:'1.5rem' }}
        className="card bg-dark text-light p-4"
      >
        <h3 className="card-title text-center">Performance Evaluation Form</h3>
        <form style={{ width: "80%" }}>
          <div className="mb-3">
            <label className="form-label">
              How many times does your company conducts performance evaluations and collects employee feedbacks
              in a year?
            </label>
            <input
              type="number"
              className="form-control"
              value={evaluationCount}
              min={1}
              max={12}
              onChange={handleEvaluationChange}
              placeholder="Enter a value between 1 and 12"
            />
            {error && <div className="text-danger">{error}</div>}{" "}
            {/* Error message */}
          </div>

          <div className="mb-3">
            <label className="form-label">From Year</label>
            <input
              type="number"
              className="form-control"
              value={startYear}
              min={1900}
              max={2100}
              disabled={!isFormActive}
              onChange={(e) => handleYearChange(e, "start")}
              placeholder="Enter the starting year"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">To Year</label>
            <input
              type="number"
              className="form-control"
              value={endYear}
              min={startYear || 1900}
              max={2100}
              disabled={!isFormActive}
              onChange={(e) => handleYearChange(e, "end")}
              placeholder="Enter the ending year"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">From Review</label>
            <select
              className="form-select"
              disabled={!isFormActive || fromYearReviews.length === 0}
              value={fromYearReviews[fromReview - 1]}
              onChange={(e) => {
                setbuttonFlag(false);
                setFromReview(e.target.selectedIndex);
              }}
            >
              <option value="">Select a starting review</option>
              {fromYearReviews.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">To Review</label>
            <select
              className="form-select"
              disabled={!isFormActive || toYearReviews.length === 0}
              value={toYearReviews[toReview - 1]}
              onChange={(e) => {
                setbuttonFlag(false);
                setToReview(e.target.selectedIndex);
              }}
            >
              <option value="">Select an ending review</option>
              {toYearReviews.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {isFormActive && fromReview && toReview && (
            <div className="row pt-3">
              <div className="col">
                <div style={{ width: "100%" }}>
                  <input
                    // ref={(input) => file = input}
                    className="form-control btn btn-primary"
                    style={{ fontSize: "1.2rem", borderRadius: "0" }}
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {file && (
                <div className="col" style={{ width: "100%" }}>
                  <button
                    style={{
                      fontSize: "1.2rem",
                      borderRadius: "0",
                      width: "100%",
                    }}
                    className="btn btn-success"
                    type="button"
                    onClick={(e) => {
                      setshow(true);

                      if (!buttonFlag) {
                        setModalData([]);
                        handleUpload(e);
                      }
                    }}
                  >
                    {!buttonFlag ? "Upload File" : "Show Processed Data"}
                  </button>
                </div>
              )}
              <div className="col">
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{
                    fontSize: "1.2rem",
                    borderRadius: "0",
                    width: "100%",
                  }}
                  disabled={!isFormActive || !fromReview || !toReview}
                  onClick={handleDownload}
                >
                  Download in this format
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="pb-5">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            onClick={handleProcessedDownload}
            style={{ fontSize: "1.2rem", borderRadius: "0", width: "25%" }}
            className="px-3 btn btn-secondary"
          >
            Download Report
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customize;
