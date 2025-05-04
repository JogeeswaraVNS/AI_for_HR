import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function Customize_Stream() {
  const [evaluationCount, setEvaluationCount] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [fromYearReviews, setFromYearReviews] = useState([]);
  const [toYearReviews, setToYearReviews] = useState([]);
  const [fromReview, setFromReview] = useState("");
  const [toReview, setToReview] = useState("");
  const [isFormActive, setIsFormActive] = useState(false);
  const [error, setError] = useState(""); // Added error state
  const [uploadStatus, setUploadStatus] = useState("");
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const handleEvaluationChange = (e) => {
    const count = parseInt(e.target.value);
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

  const updateFromYearReviews = (year, count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push(`${year} ${i}${getOrdinalSuffix(i)} review`);
    }
    setFromYearReviews(options);
  };

  const updateToYearReviews = (year, count) => {
    let options = [];
    for (let i = 1; i <= count; i++) {
      options.push(`${year} ${i}${getOrdinalSuffix(i)} review`);
    }
    setToYearReviews(options);
  };

  const getOrdinalSuffix = (number) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  };

  const handleYearChange = (e, type) => {
    const year = parseInt(e.target.value);
    if (type === "start") {
      setStartYear(year);
      if (evaluationCount) updateFromYearReviews(year, evaluationCount);
    } else if (type === "end") {
      setEndYear(year);
      if (evaluationCount) updateToYearReviews(year, evaluationCount);
    }
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // setCategories([]);
    setUploadStatus("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading and processing...");

      const uploadResponse = await fetch(
        "http://localhost:5000/upload_customize",
        {
          method: "POST",
          body: formData,
        }
      );

      if (uploadResponse.ok) {
        setUploadStatus("File uploaded successfully. Processing...");

        const eventSource = new EventSource(
          "http://localhost:5000/stream_customize"
        );

        eventSource.onmessage = (event) => {
          const newCategory = JSON.parse(event.data);

          if (newCategory.message === "complete") {
            eventSource.close();
            setUploadStatus("All rows processed successfully!");
          } else {
            console.log(newCategory);
            setCategories((prevCategories) => [...prevCategories, newCategory]);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
          setUploadStatus("Error in streaming data. Please try again.");
        };
      } else {
        setUploadStatus("Error uploading file.");
      }
    } catch (error) {
      console.error("Error uploading file", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  const handleDownload = () => {
    alert(`Downloading files for ${fromReview} to ${toReview}`);
  };

  return (
    <div className="px-5 pt-5 text-white">
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="card bg-dark text-light p-4"
      >
        <h3 className="card-title text-center">Performance Evaluation Form</h3>
        <form style={{ width: "50%" }}>
          <div className="mb-3">
            <label className="form-label">
              How many times does your company conduct performance evaluations
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
              value={fromReview}
              onChange={(e) => setFromReview(e.target.value)}
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
              value={toReview}
              onChange={(e) => setToReview(e.target.value)}
            >
              <option value="">Select an ending review</option>
              {toYearReviews.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <div>
              {/* <form style={{ width: "50%" }} onSubmit={handleUpload}> */}
              <div style={{ display: "flex" }}>
                <div style={{ width: "100%" }}>
                  <input
                    className="form-control btn btn-primary"
                    style={{ fontSize: "1.42rem", borderRadius: "0" }}
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                {file && (
                  <div style={{ width: "100%" }}>
                    <button
                      style={{ borderRadius: "0", width: "100%" }}
                      className="pt-2 btn btn-success"
                      type="submit"
                      onClick={handleUpload}
                    >
                      <h5>Upload File</h5>
                    </button>
                  </div>
                )}
              </div>
              {/* </form> */}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={!isFormActive || !fromReview || !toReview}
              onClick={handleDownload}
            >
              Download in this format
            </button>
          </div>
        </form>
      </div>


      <div>
        {uploadStatus && <p className="pt-2">{uploadStatus}</p>}

        {categories.length > 0 && (
  <div
    style={{ maxHeight: "35rem", overflowY: "auto" }}
    className="mt-3 px-3"
  >
    {categories.map((item, index) => (
      <div className="py-3" key={index}>
        <div style={{ textAlign: "left" }}>
          {/* Iterate over the arrays within the item */}
          {item.category.map((category, i) => {
            // Check if values are not empty or blank
            const feedback = item.feedback[i];
            const classIndex = item.classindex[i];

            if (
              category &&
              category.trim() !== "" &&
              feedback &&
              feedback.trim() !== "" &&
              classIndex
            ) {
              return (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h5
                      className={`${
                        classIndex % 3 === 0 ||
                        classIndex === 7 ||
                        classIndex === 8
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {item.person_name}
                    </h5>
                    <h5 className="text-primary">{category}</h5>
                  </div>
                  <h5 style={{ textAlign: "justify" }}>{feedback}</h5>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="">
                      {Array.from({ length: classIndex }, (_, j) => (
                        <StarIcon key={j} style={{ color: "white" }} />
                      ))}
                      {Array.from({ length: 9 - classIndex }, (_, j) => (
                        <StarBorderIcon key={j} style={{ color: "white" }} />
                      ))}
                    </div>
                    <div>
                      <h5 className="text-white py-1 ps-1">
                        {classIndex}/9
                      </h5>
                    </div>
                  </div>
                </div>
              );
            }
            return null; // Skip rendering for empty values
          })}
        </div>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
}

export default Customize_Stream;
