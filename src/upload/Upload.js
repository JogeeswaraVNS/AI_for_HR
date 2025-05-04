import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function Upload() {
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCategories([]);
    setUploadStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStatus("Uploading and processing...");

      const uploadResponse = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        setUploadStatus("File uploaded successfully. Processing...");

        const eventSource = new EventSource("http://localhost:5000/stream");

        eventSource.onmessage = (event) => {
          const newCategory = JSON.parse(event.data);

          if (newCategory.message === "complete") {
            eventSource.close();
            setUploadStatus("All rows processed successfully!");
          } else {
            // console.log(newCategory)
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

  return (
    <div className="text-white pt-3 text-center container">
      <div>
        <h5>Upload your CSV file here</h5>
        <div
          style={{ display: "flex", justifyContent: "center" }}
          className="pt-2 pb-2"
        >
          <form style={{ width: "50%" }} onSubmit={handleSubmit}>
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
                  >
                    <h5>Upload File</h5>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {uploadStatus && <p className="pt-2">{uploadStatus}</p>}

        {categories.length > 0 && (
          <div
            style={{ maxHeight: "35rem", overflowY: "auto" }}
            className="mt-3 px-3"
          >
            {categories.map((item, index) => (
              <div className="py-3" key={index}>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h5
                      className={`${
                        item.classindex % 3 === 0 ||
                        item.classindex === 7 ||
                        item.classindex === 8
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {item.person_name}
                    </h5>
                    <h5 className="text-primary">{item.category}</h5>
                  </div>
                  <h5 style={{ textAlign: "justify" }}>{item.feedback}</h5>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className="">
                      {Array.from({ length: item.classindex }, (_, i) => (
                        <StarIcon key={i} style={{ color: "white" }} />
                      ))}
                      {Array.from({ length: 9 - item.classindex }, (_, i) => (
                        <StarBorderIcon key={i} style={{ color: "white" }} />
                      ))}
                    </div>
                    <div>
                      <h5 className="text-white py-1 ps-1">
                        {item.classindex}/9
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* {uploadStatus === "All rows processed successfully!" && (
          <div>
            <h5>categories.uniqueclasses {categories.uniqueclasses}</h5>
          </div>
        )} */}
      </div>
    </div>
  );
}

export default Upload;
