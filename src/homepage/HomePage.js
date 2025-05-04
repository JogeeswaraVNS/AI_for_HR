import React from "react";
import InitialCounts from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/Initial Counts.svg";
import BalancedCounts from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/Balanced Counts.svg";
import TransformerAccuracy from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/Transformer Models Employee Retention Accuracy.svg";
import TransformerLoss from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/Transformer Models Employee Retention Loss.svg";
import BERTBaseAccuracy from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/BERT Base Accuracy.svg";
import BERTBaseLoss from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/BERT Base Loss.svg";
import BERTLargeAccuracy from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/BERT Large Accuracy.svg";
import BERTLargeLoss from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/BERT Large Loss.svg";
import DistilBERTAccuracy from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/DistilBERT Accuracy.svg";
import DistilBERTLoss from "C:/Users/jogee/Desktop/Employee Retention/frontend/src/Plots/DistilBERT Loss.svg";

function HomePage() {
  return (
    <div className="bg-white px-5 pt-4">
      <div className="row">
        <h2 className="text-center pb-4 pt-1">Initial Counts</h2>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={InitialCounts}
            alt="InitialCounts"
          />
        </div>
        <div style={{ width: "100%" }} className="col">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Employee Category</th>
                <th className="text-center" scope="col">
                  Value Count
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Risk (Low performance, Low potential)</td>
                <td className="text-center">139</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Average performer (Moderate performance, Low potential)</td>
                <td className="text-center">110</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Solid Performer (High performance, Low potential)</td>
                <td className="text-center">107</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>
                  Inconsistent Player (Low performance, Moderate potential)
                </td>
                <td className="text-center">119</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Core Player (Moderate performance, Moderate potential)</td>
                <td className="text-center">129</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>High Performer (High performance, Moderate potential)</td>
                <td className="text-center">103</td>
              </tr>
              <tr>
                <th scope="row">7</th>
                <td>Potential Gem (Low performance, High potential)</td>
                <td className="text-center">61</td>
              </tr>
              <tr>
                <th scope="row">8</th>
                <td>High Potential (Moderate performance, High potential)</td>
                <td className="text-center">101</td>
              </tr>
              <tr>
                <th scope="row">9</th>
                <td>Star (High performance, High potential)</td>
                <td className="text-center">128</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr></hr>

      <div className="row">
        <h2 className="text-center pb-4 pt-1">
          Balanced Counts (100 samples per category)
        </h2>

        <div style={{ width: "100%" }} className="col">
          <table class="table table-borderless">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Employee Category</th>
                <th className="text-center" scope="col">
                  Value Count
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Risk (Low performance, Low potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Average performer (Moderate performance, Low potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Solid Performer (High performance, Low potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">4</th>
                <td>
                  Inconsistent Player (Low performance, Moderate potential)
                </td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">5</th>
                <td>Core Player (Moderate performance, Moderate potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">6</th>
                <td>High Performer (High performance, Moderate potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">7</th>
                <td>Potential Gem (Low performance, High potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">8</th>
                <td>High Potential (Moderate performance, High potential)</td>
                <td className="text-center">100</td>
              </tr>
              <tr>
                <th scope="row">9</th>
                <td>Star (High performance, High potential)</td>
                <td className="text-center">100</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={BalancedCounts}
            alt="BalancedCounts"
          />
        </div>
      </div>

      <hr></hr>

      <div className="row">
        <h2 className="text-center py-3">
          Transformer Models Comparison on 90 vs 10
        </h2>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={TransformerAccuracy}
            alt="TransformerAccuracy"
          />
        </div>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={TransformerLoss}
            alt="TransformerLoss"
          />
        </div>
      </div>

      <div>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th scope="col">
                <h5>#</h5>
              </th>
              <th scope="col">
                <h5>Model</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Loss</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Loss</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <h5>1</h5>
              </th>
              <td>
                <h5>ALBERT Base</h5>
              </td>
              <td className="text-center">
                <h5>99.7</h5>
              </td>
              <td className="text-center">
                <h5>89.11</h5>
              </td>
              <td className="text-center">
                <h5>0.0777</h5>
              </td>
              <td className="text-center">
                <h5>0.3496</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>2</h5>
              </th>
              <td>
                <h5>ALBERT Large</h5>
              </td>
              <td className="text-center">
                <h5>81.1</h5>
              </td>
              <td className="text-center">
                <h5>72.22</h5>
              </td>
              <td className="text-center">
                <h5>0.7294</h5>
              </td>
              <td className="text-center">
                <h5>0.9417</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>3</h5>
              </th>
              <td>
                <h5>BERT Base</h5>
              </td>
              <td className="text-center">
                <h5>99.98</h5>
              </td>
              <td className="text-center">
                <h5>98.44</h5>
              </td>
              <td className="text-center">
                <h5>0.0413</h5>
              </td>
              <td className="text-center">
                <h5>0.0927</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>4</h5>
              </th>
              <td>
                <h5>BERT Large</h5>
              </td>
              <td className="text-center">
                <h5>100</h5>
              </td>
              <td className="text-center">
                <h5>98.22</h5>
              </td>
              <td className="text-center">
                <h5>0.016</h5>
              </td>
              <td className="text-center">
                <h5>0.0801</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>5</h5>
              </th>
              <td>
                <h5>DistilBERT Base</h5>
              </td>
              <td className="text-center">
                <h5>99.98</h5>
              </td>
              <td className="text-center">
                <h5>98.22</h5>
              </td>
              <td className="text-center">
                <h5>0.0419</h5>
              </td>
              <td className="text-center">
                <h5>0.0852</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>6</h5>
              </th>
              <td>
                <h5>ELECTRA Base</h5>
              </td>
              <td className="text-center">
                <h5>49.98</h5>
              </td>
              <td className="text-center">
                <h5>48</h5>
              </td>
              <td className="text-center">
                <h5>1.5618</h5>
              </td>
              <td className="text-center">
                <h5>1.5804</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>7</h5>
              </th>
              <td>
                <h5>ELECTRA Large</h5>
              </td>
              <td className="text-center">
                <h5>62.38</h5>
              </td>
              <td className="text-center">
                <h5>63.11</h5>
              </td>
              <td className="text-center">
                <h5>1.5187</h5>
              </td>
              <td className="text-center">
                <h5>1.5369</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr></hr>

      <h2 className="text-center">BERT Base Model from 90 vs 10 to 10 vs 90</h2>
      <div className="row">
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={BERTBaseAccuracy}
            alt="BERTBaseAccuracy"
          />
        </div>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={BERTBaseLoss}
            alt="BERTBaseLoss"
          />
        </div>
      </div>
      <div>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th scope="col">
                <h5>#</h5>
              </th>
              <th scope="col">
                <h5>Splits</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Loss</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Loss</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <h5>1</h5>
              </th>
              <td>
                <h5>90 vs 10</h5>
              </td>
              <td className="text-center">
                <h5>99.98</h5>
              </td>
              <td className="text-center">
                <h5>98.44</h5>
              </td>
              <td className="text-center">
                <h5>0.0413</h5>
              </td>
              <td className="text-center">
                <h5>0.0927</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>2</h5>
              </th>
              <td>
                <h5>80 vs 20</h5>
              </td>
              <td className="text-center">
                <h5>99.72</h5>
              </td>
              <td className="text-center">
                <h5>95.89</h5>
              </td>
              <td className="text-center">
                <h5>0.0766</h5>
              </td>
              <td className="text-center">
                <h5>0.1573</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>3</h5>
              </th>
              <td>
                <h5>70 vs 30</h5>
              </td>
              <td className="text-center">
                <h5>99.71</h5>
              </td>
              <td className="text-center">
                <h5>97.04</h5>
              </td>
              <td className="text-center">
                <h5>0.1065</h5>
              </td>
              <td className="text-center">
                <h5>0.1804</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>4</h5>
              </th>
              <td>
                <h5>60 vs 40</h5>
              </td>
              <td className="text-center">
                <h5>99.81</h5>
              </td>
              <td className="text-center">
                <h5>95.50</h5>
              </td>
              <td className="text-center">
                <h5>0.1178</h5>
              </td>
              <td className="text-center">
                <h5>0.2166</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>5</h5>
              </th>
              <td>
                <h5>50 vs 50</h5>
              </td>
              <td className="text-center">
                <h5>97.23</h5>
              </td>
              <td className="text-center">
                <h5>89.91</h5>
              </td>
              <td className="text-center">
                <h5>0.3537</h5>
              </td>
              <td className="text-center">
                <h5>0.4848</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>6</h5>
              </th>
              <td>
                <h5>40 vs 60</h5>
              </td>
              <td className="text-center">
                <h5>97.77</h5>
              </td>
              <td className="text-center">
                <h5>87.19</h5>
              </td>
              <td className="text-center">
                <h5>0.3294</h5>
              </td>
              <td className="text-center">
                <h5>0.5414</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>7</h5>
              </th>
              <td>
                <h5>30 vs 70</h5>
              </td>
              <td className="text-center">
                <h5>85.49</h5>
              </td>
              <td className="text-center">
                <h5>69.05</h5>
              </td>
              <td className="text-center">
                <h5>0.8512</h5>
              </td>
              <td className="text-center">
                <h5>1.0727</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>8</h5>
              </th>
              <td>
                <h5>20 vs 80</h5>
              </td>
              <td className="text-center">
                <h5>67.97</h5>
              </td>
              <td className="text-center">
                <h5>52.75</h5>
              </td>
              <td className="text-center">
                <h5>1.2861</h5>
              </td>
              <td className="text-center">
                <h5>1.4968</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>9</h5>
              </th>
              <td>
                <h5>10 vs 90</h5>
              </td>
              <td className="text-center">
                <h5>37.28</h5>
              </td>
              <td className="text-center">
                <h5>27.14</h5>
              </td>
              <td className="text-center">
                <h5>1.8409</h5>
              </td>
              <td className="text-center">
                <h5>1.9653</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr></hr>

      <h2 className="text-center">
        BERT Large Model from 90 vs 10 to 10 vs 90
      </h2>
      <div className="row">
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={BERTLargeAccuracy}
            alt="BERTLargeAccuracy"
          />
        </div>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={BERTLargeLoss}
            alt="BERTLargeLoss"
          />
        </div>
      </div>
      <div>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th scope="col">
                <h5>#</h5>
              </th>
              <th scope="col">
                <h5>Splits</h5>
              </th>
              <th class="text-center" scope="col">
                <h5>Training Accuracy</h5>
              </th>
              <th class="text-center" scope="col">
                <h5>Testing Accuracy</h5>
              </th>
              <th class="text-center" scope="col">
                <h5>Training Loss</h5>
              </th>
              <th class="text-center" scope="col">
                <h5>Testing Loss</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <h5>1</h5>
              </th>
              <td>
                <h5>90 vs 10</h5>
              </td>
              <td class="text-center">
                <h5>100.00</h5>
              </td>
              <td class="text-center">
                <h5>98.22</h5>
              </td>
              <td class="text-center">
                <h5>0.0160</h5>
              </td>
              <td class="text-center">
                <h5>0.0801</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>2</h5>
              </th>
              <td>
                <h5>80 vs 20</h5>
              </td>
              <td class="text-center">
                <h5>99.83</h5>
              </td>
              <td class="text-center">
                <h5>96.56</h5>
              </td>
              <td class="text-center">
                <h5>0.0216</h5>
              </td>
              <td class="text-center">
                <h5>0.1322</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>3</h5>
              </th>
              <td>
                <h5>70 vs 30</h5>
              </td>
              <td class="text-center">
                <h5>95.92</h5>
              </td>
              <td class="text-center">
                <h5>87.19</h5>
              </td>
              <td class="text-center">
                <h5>0.2252</h5>
              </td>
              <td class="text-center">
                <h5>0.4357</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>4</h5>
              </th>
              <td>
                <h5>60 vs 40</h5>
              </td>
              <td class="text-center">
                <h5>99.18</h5>
              </td>
              <td class="text-center">
                <h5>92.72</h5>
              </td>
              <td class="text-center">
                <h5>0.0783</h5>
              </td>
              <td class="text-center">
                <h5>0.2414</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>5</h5>
              </th>
              <td>
                <h5>50 vs 50</h5>
              </td>
              <td class="text-center">
                <h5>98.84</h5>
              </td>
              <td class="text-center">
                <h5>87.51</h5>
              </td>
              <td class="text-center">
                <h5>0.1434</h5>
              </td>
              <td class="text-center">
                <h5>0.4171</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>6</h5>
              </th>
              <td>
                <h5>40 vs 60</h5>
              </td>
              <td class="text-center">
                <h5>94.98</h5>
              </td>
              <td class="text-center">
                <h5>84.37</h5>
              </td>
              <td class="text-center">
                <h5>0.3312</h5>
              </td>
              <td class="text-center">
                <h5>0.5638</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>7</h5>
              </th>
              <td>
                <h5>30 vs 70</h5>
              </td>
              <td class="text-center">
                <h5>93.38</h5>
              </td>
              <td class="text-center">
                <h5>77.37</h5>
              </td>
              <td class="text-center">
                <h5>0.4525</h5>
              </td>
              <td class="text-center">
                <h5>0.7685</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>8</h5>
              </th>
              <td>
                <h5>20 vs 80</h5>
              </td>
              <td class="text-center">
                <h5>64.73</h5>
              </td>
              <td class="text-center">
                <h5>52.33</h5>
              </td>
              <td class="text-center">
                <h5>1.2650</h5>
              </td>
              <td class="text-center">
                <h5>1.4375</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>9</h5>
              </th>
              <td>
                <h5>10 vs 90</h5>
              </td>
              <td class="text-center">
                <h5>59.38</h5>
              </td>
              <td class="text-center">
                <h5>37.58</h5>
              </td>
              <td class="text-center">
                <h5>1.4812</h5>
              </td>
              <td class="text-center">
                <h5>1.8094</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr></hr>

      <h2 className="text-center">
        DistilBERT Base Model from 90 vs 10 to 10 vs 90
      </h2>
      <div className="row">
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={DistilBERTAccuracy}
            alt="DistilBERTAccuracy"
          />
        </div>
        <div className="col">
          <img
            style={{ width: "100%" }}
            src={DistilBERTLoss}
            alt="DistilBERTLoss"
          />
        </div>
      </div>
      <div>
        <table class="table table-borderless">
          <thead>
            <tr>
              <th scope="col">
                <h5>#</h5>
              </th>
              <th scope="col">
                <h5>Splits</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Accuracy</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Training Loss</h5>
              </th>
              <th className="text-center" scope="col">
                <h5>Testing Loss</h5>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <h5>1</h5>
              </th>
              <td>
                <h5>90 vs 10</h5>
              </td>
              <td className="text-center">
                <h5>99.98</h5>
              </td>
              <td className="text-center">
                <h5>98.22</h5>
              </td>
              <td className="text-center">
                <h5>0.0419</h5>
              </td>
              <td className="text-center">
                <h5>0.0852</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>2</h5>
              </th>
              <td>
                <h5>80 vs 20</h5>
              </td>
              <td className="text-center">
                <h5>99.81</h5>
              </td>
              <td className="text-center">
                <h5>96.00</h5>
              </td>
              <td className="text-center">
                <h5>0.0635</h5>
              </td>
              <td className="text-center">
                <h5>0.1510</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>3</h5>
              </th>
              <td>
                <h5>70 vs 30</h5>
              </td>
              <td className="text-center">
                <h5>99.71</h5>
              </td>
              <td className="text-center">
                <h5>95.56</h5>
              </td>
              <td className="text-center">
                <h5>0.0877</h5>
              </td>
              <td className="text-center">
                <h5>0.1881</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>4</h5>
              </th>
              <td>
                <h5>60 vs 40</h5>
              </td>
              <td className="text-center">
                <h5>98.51</h5>
              </td>
              <td className="text-center">
                <h5>91.39</h5>
              </td>
              <td className="text-center">
                <h5>0.2191</h5>
              </td>
              <td className="text-center">
                <h5>0.3578</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>5</h5>
              </th>
              <td>
                <h5>50 vs 50</h5>
              </td>
              <td className="text-center">
                <h5>98.39</h5>
              </td>
              <td className="text-center">
                <h5>89.91</h5>
              </td>
              <td className="text-center">
                <h5>0.2888</h5>
              </td>
              <td className="text-center">
                <h5>0.4594</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>6</h5>
              </th>
              <td>
                <h5>40 vs 60</h5>
              </td>
              <td className="text-center">
                <h5>96.48</h5>
              </td>
              <td className="text-center">
                <h5>83.48</h5>
              </td>
              <td className="text-center">
                <h5>0.4801</h5>
              </td>
              <td className="text-center">
                <h5>0.7031</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>7</h5>
              </th>
              <td>
                <h5>30 vs 70</h5>
              </td>
              <td className="text-center">
                <h5>90.55</h5>
              </td>
              <td className="text-center">
                <h5>75.75</h5>
              </td>
              <td className="text-center">
                <h5>0.8021</h5>
              </td>
              <td className="text-center">
                <h5>1.0007</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>8</h5>
              </th>
              <td>
                <h5>20 vs 80</h5>
              </td>
              <td className="text-center">
                <h5>73.77</h5>
              </td>
              <td className="text-center">
                <h5>56.58</h5>
              </td>
              <td className="text-center">
                <h5>1.2154</h5>
              </td>
              <td className="text-center">
                <h5>1.4238</h5>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <h5>9</h5>
              </th>
              <td>
                <h5>10 vs 90</h5>
              </td>
              <td className="text-center">
                <h5>52.23</h5>
              </td>
              <td className="text-center">
                <h5>34.22</h5>
              </td>
              <td className="text-center">
                <h5>1.7277</h5>
              </td>
              <td className="text-center">
                <h5>1.8723</h5>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomePage;
