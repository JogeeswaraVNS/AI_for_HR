import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const questions = {
  Depression: [
    "I couldn’t seem to experience any positive feeling at all",
    "I found it difficult to work up the initiative to do things",
    "I felt that I had nothing to look forward to",
    "I felt down-hearted and blue",
    "I was unable to become enthusiastic about anything",
    "I felt I wasn’t worth much as a person",
    "I felt that life was meaningless"
  ],
  Anxiety: [
    "I was aware of dryness of my mouth",
    "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
    "I experienced trembling (e.g. in the hands)",
    "I was worried about situations in which I might panic and make a fool of myself",
    "I felt I was close to panic",
    "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)",
    "I felt scared without any good reason"
  ],
  Stress: [
    "I found it hard to wind down",
    "I tended to over-react to situations",
    "I felt that I was using a lot of nervous energy",
    "I found myself getting agitated",
    "I found it difficult to relax",
    "I was intolerant of anything that kept me from getting on with what I was doing",
    "I felt that I was rather touchy"
  ]
};

const responseScale = [
  "0 - Did not apply to me at all",
  "1 - Applied to me to some degree, or some of the time",
  "2 - Applied to me to a considerable degree or a good part of time",
  "3 - Applied to me very much or most of the time"
];

const DASS_Assessment = () => {
  const categories = Object.keys(questions);
  let backendapi = "http://localhost:5000";
  const [pageIndex, setPageIndex] = useState(0);
  const [DepressionLevel, setDepressionLevel] = useState(null);
  const [AnxietyLevel, setAnxietyLevel] = useState(null);
  const [StressLevel, setStressLevel] = useState(null);
  const [responses, setResponses] = useState({
    Depression: Array(7).fill(null),
    Anxiety: Array(7).fill(null),
    Stress: Array(7).fill(null)
  });


  const handleDropdownChange = (category, questionIndex, value) => {
    const updatedResponses = { ...responses };
    updatedResponses[category][questionIndex] = parseInt(value);
    setResponses(updatedResponses);
  };

  const isPageComplete = () => {
    const category = categories[pageIndex];
    return responses[category].every((response) => response !== null);
  };

  const isAllComplete = () => {
    return categories.every(category =>
      responses[category].every(response => response !== null)
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        Depression: responses.Depression,
        Anxiety: responses.Anxiety,
        Stress: responses.Stress
      };
      console.log(payload)
      const res = await axios.post(`${backendapi}/dass`, payload);
      setDepressionLevel(res.data.Depression_Level)
      setAnxietyLevel(res.data.Anxiety_Level)
      setStressLevel(res.data.Stress_Level)
      setPageIndex(3); // Move to result page
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  return (
    <div style={{fontSize:'1.7rem'}} className="container text-white py-5">
      {pageIndex < 3 && (
        <>
          <h2 className="mb-4 text-center">{categories[pageIndex]} Assesment</h2>
          {questions[categories[pageIndex]].map((question, index) => (
            <div key={index} className="mb-3">
              <label className="form-label">{question}</label>
              <select
                className="form-select"
                value={responses[categories[pageIndex]][index] ?? ""}
                onChange={(e) =>
                  handleDropdownChange(
                    categories[pageIndex],
                    index,
                    e.target.value
                  )
                }
              >
                <option value="" disabled>
                  Select your response
                </option>
                {responseScale.map((label, idx) => (
                  <option key={idx} value={idx}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-4">
            {pageIndex > 0 && (
              <button
                className="btn btn-secondary"
                onClick={() => setPageIndex(pageIndex - 1)}
              >
                Previous
              </button>
            )}
            {pageIndex < 2 ? (
              <button
                className="btn btn-primary"
                onClick={() => setPageIndex(pageIndex + 1)}
                disabled={!isPageComplete()}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={!isAllComplete()}
              >
                Submit
              </button>
            )}
          </div>
        </>
      )}

{pageIndex === 3 && DepressionLevel && AnxietyLevel && StressLevel && (
  <div className="container mb-5 p-4 bg-black text-light rounded-4 shadow-lg border border-secondary">

{/* Final Evaluation */}
<div className="p-4 mb-5 rounded-4 bg-gradient border border-info shadow">
  <h2 className="text-center text-uppercase fw-bold text-light mb-4" style={{ letterSpacing: '1px'}}>
    DASS-21 Final Evaluation
  </h2>

  <div className="row text-center">
    <div className="col-md-4 mb-4">
      <h5 className="text-secondary">Depression</h5>
      <span className={`badge fs-5 py-2 px-4 rounded-pill shadow-sm text-uppercase bg-${DepressionLevel === 'Low' ? 'success' : DepressionLevel === 'Medium' ? 'warning text-dark' : 'danger'}`}>
        {DepressionLevel}
      </span>
    </div>
    <div className="col-md-4 mb-4">
      <h5 className="text-secondary">Anxiety</h5>
      <span className={`badge fs-5 py-2 px-4 rounded-pill shadow-sm text-uppercase bg-${AnxietyLevel === 'Low' ? 'success' : AnxietyLevel === 'Medium' ? 'warning text-dark' : 'danger'}`}>
        {AnxietyLevel}
      </span>
    </div>
    <div className="col-md-4 mb-4">
      <h5 className="text-secondary">Stress</h5>
      <span className={`badge fs-5 py-2 px-4 rounded-pill shadow-sm text-uppercase bg-${StressLevel === 'Low' ? 'success' : StressLevel === 'Medium' ? 'warning text-dark' : 'danger'}`}>
        {StressLevel}
      </span>
    </div>
  </div>
</div>

{/* Responses Section */}
{Object.keys(questions).map((category) => (
  <div key={category} className="mb-5">
    <h4 className="text-info fw-semibold border-bottom border-info pb-2 mb-3" style={{ textShadow: '0 0 5px #00f2ff' }}>
      {category} Responses:
    </h4>
    <ul className="list-group bg-transparent">
      {questions[category].map((q, idx) => (
        <li key={idx} className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-info mb-2 rounded-3 shadow-sm">
          <span className="fw-light">{q}</span>
          <span className="badge rounded-pill bg-info text-dark px-3 py-2 shadow-sm">
            {responseScale[responses[category][idx]]}
          </span>
        </li>
      ))}
    </ul>
  </div>
))}

{/* Retake Button */}
<div className="text-center mt-5">
  <button
    className="btn btn-outline-info btn-lg px-5 py-2 fw-bold rounded-pill shadow"
    // style={{ textShadow: '0 0 4px #00f2ff' }}
    onClick={() => window.location.reload()} // Or use your actual reset function
  >
    Retake Assessment
  </button>
</div>
</div>


      )}
    </div>
  );
};

export default DASS_Assessment;
