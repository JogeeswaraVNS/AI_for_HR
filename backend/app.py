import tensorflow as tf
from transformers import AutoTokenizer,TFAutoModelForSequenceClassification,AutoModelForSequenceClassification
from flask import Flask,jsonify,request,Response,send_file
from flask_cors import CORS
import torch
import os
import io
import json
import pandas as pd
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Load pre-trained SBERT model
sbert_model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

app=Flask(__name__)

CORS(app)

tokenizer_path = "C:/Users/jogee/Desktop/Employee Retention/frontend/backend/models/EmployeeRetentionBERTBase100Samples"
model_path = "C:/Users/jogee/Desktop/Employee Retention/frontend/backend/models/EmployeeRetentionBERTBase100Samples"

tokenizer = AutoTokenizer.from_pretrained(tokenizer_path, max_length=512, truncation=True)
model = TFAutoModelForSequenceClassification.from_pretrained(model_path)

sentiment_tokenizer_path = "C:/Users/jogee/Desktop/Employee Retention/frontend/backend/Sentiment Analysis/DistilBERTEmpGivenFeedback_90_10"
sentiment_model_path = "C:/Users/jogee/Desktop/Employee Retention/frontend/backend/Sentiment Analysis/DistilBERTEmpGivenFeedback_90_10"

sentiment_tokenizer = AutoTokenizer.from_pretrained(sentiment_tokenizer_path, max_length=512, truncation=True)
sentiment_model = AutoModelForSequenceClassification.from_pretrained(sentiment_model_path)



app.config['JSON_SORT_KEYS'] = False

UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

df_global = None

df_global_customize=None

prog=0

loop=True

# Function to load the retention strategy data from CSV
def load_retention_data(csv_file):
    df = pd.read_csv(csv_file)
    data = []
    
    for _, row in df.iterrows():
        # Parse the phrases and retention strategy
        phrases = row['Phrases'].split(", ")
        retention_strategy = row['Retention Strategy']
        attrition_indicator = row['Attrition Indicator']
        
        data.append({
            "Attrition Indicator": attrition_indicator,
            "Phrases": phrases,
            "Retention Strategy": retention_strategy
        })
    
    return data

retention_data = load_retention_data("C:/Users/jogee/Desktop/Employee Retention/frontend/backend/RetentionStratergies.csv")


# Function to classify retention strategy based on feedback
def classify_retention_strategy(feedbacks, retention_data):
    # Combine all feedbacks into one text block
    combined_feedback = " ".join(feedbacks)

    # Generate embedding for combined feedback using SBERT
    feedback_embedding = sbert_model.encode([combined_feedback])

    # Initialize variables to track the best match
    best_match_score = -1
    best_match_strategy = None

    # Compare the combined feedback with each attrition indicator's phrases
    for attrition in retention_data:
        for phrase in attrition["Phrases"]:
            # Generate embedding for the current phrase
            phrase_embedding = sbert_model.encode([phrase])

            # Compute cosine similarity between the feedback and the phrase
            score = cosine_similarity(feedback_embedding, phrase_embedding)

            # If the score is higher than the best score, update the best match
            if score > best_match_score:
                best_match_score = score
                best_match_strategy = attrition["Retention Strategy"]
                best_match_attrition = attrition["Attrition Indicator"]
    
    return best_match_attrition, best_match_strategy






@app.route('/download_review_frequency', methods=['POST'])
def download_review_frequency():
    try:
        # Extract JSON payload
        data = request.get_json()
        reviewfrequency = data.get('reviewfrequency')
        
        # Extract columns (review names) from one of the categories
        columns = list(next(iter(reviewfrequency.values())).keys())

        # Initialize the formatted output
        formatted_output = {
            "Reviews": columns  # Add the columns as a separate entry
        }

        # Process each category in reviewfrequency
        for category, reviews in reviewfrequency.items():
            # Append the values for each review in the current category
            formatted_output[category] = [reviews.get(review, 0) for review in columns]
        
                
                # Convert to DataFrame
        df = pd.DataFrame(formatted_output)

        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='review_frequency.csv'
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/RetentionStratergies', methods=['POST'])
def RetentionStratergies_csv():
    try:
        # Extract JSON payload
        data = request.get_json()
        Attrition_Risk_Employees = data.get('Attrition_Risk_Employees')
        
        if not Attrition_Risk_Employees:
            return jsonify({"error": "No processed data provided"}), 400
       
        # Convert to DataFrame
        unsorted_frequency={
            "EmployeeID":[],
            "EmployeeName":[],
            'AttritionIndicator':[],
            'RetentionStratergy':[],
        }
        
        for i in Attrition_Risk_Employees:
            unsorted_frequency['EmployeeID'].append(i)
            unsorted_frequency['EmployeeName'].append(Attrition_Risk_Employees[i]['EmployeeName'])
            unsorted_frequency['AttritionIndicator'].append(Attrition_Risk_Employees[i]['AttritionIndicator'])
            unsorted_frequency['RetentionStratergy'].append(Attrition_Risk_Employees[i]['RetentionStratergy'])

            
        df = pd.DataFrame(unsorted_frequency)
        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='RetentionStratergies.csv'
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500





@app.route('/frequency_report', methods=['POST'])
def frequency_report_csv():
    try:
        # Extract JSON payload
        data = request.get_json()
        frequency = data.get('frequency')
        
        if not frequency:
            return jsonify({"error": "No processed data provided"}), 400
       
        # Convert to DataFrame
        unsorted_frequency={
            "EmployeeID":[],
            "EmployeeName":[],
            'Risk (Low performance, Low potential)':[],
            'Average performer (Moderate performance, Low potential)':[],
            'Solid Performer (High performance, Low potential)':[],
            'Inconsistent Player (Low performance, Moderate potential)':[],
            'Core Player (Moderate performance, Moderate potential)':[],
            'High Performer (High performance, Moderate potential)':[],
            'Potential Gem (Low performance, High potential)':[],
            'High Potential (Moderate performance, High potential)':[],
            'Star (High performance, High potential)':[],
            'Most Repeated Category':[]
        }
        categories=['Risk (Low performance, Low potential)',
            'Average performer (Moderate performance, Low potential)',
            'Solid Performer (High performance, Low potential)',
            'Inconsistent Player (Low performance, Moderate potential)',
            'Core Player (Moderate performance, Moderate potential)',
            'High Performer (High performance, Moderate potential)',
            'Potential Gem (Low performance, High potential)',
            'High Potential (Moderate performance, High potential)',
            'Star (High performance, High potential)',
            'Most Repeated Category']
        for i in unsorted_frequency:
            if i in frequency:
                unsorted_frequency[i]=frequency[i]
            
        for idx in range(len(frequency['Star (High performance, High potential)'])):
            highest_category='0'
            highest_frequency=0
            for column in categories:
                if column in frequency:
                    if int(frequency[column][idx])>=highest_frequency:
                        highest_frequency=int(frequency[column][idx])
                        highest_category=column
            unsorted_frequency['Most Repeated Category'].append(highest_category)
            
            

            
            
        df = pd.DataFrame(unsorted_frequency)
        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='frequency_report.csv'
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/employee_feedback_frequency_report', methods=['POST'])
def employee_feedback_frequency_report_csv():
    try:
        # Extract JSON payload
        data = request.get_json()
        frequency = data.get('frequency')
        if not frequency:
            return jsonify({"error": "No processed data provided"}), 400
       
        # Convert to DataFrame
        unsorted_frequency={
            "EmployeeID":[],
            "EmployeeName":[],
            'negative':[],
            'positive':[],
            'Most Repeated Category':[]
        }
        categories=[
            'negative',
            'positive',
            'Solid Performer (High performance, Low potential)',
            'Most Repeated Category']
        for i in unsorted_frequency:
            if i in frequency:
                unsorted_frequency[i]=frequency[i]
            
        for idx in range(len(frequency['positive'])):
            highest_category='0'
            highest_frequency=0
            for column in categories:
                if column in frequency:
                    if int(frequency[column][idx])>=highest_frequency:
                        highest_frequency=int(frequency[column][idx])
                        highest_category=column
            unsorted_frequency['Most Repeated Category'].append(highest_category)
            
            

            
            
        df = pd.DataFrame(unsorted_frequency)
        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='employee_feedback_frequency_report.csv'
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500




@app.route('/download_processed', methods=['POST'])
def download_processed_csv():
    try:
        # Extract JSON payload
        data = request.get_json()
        processed_data = data.get('processedData')
        
        if not processed_data:
            return jsonify({"error": "No processed data provided"}), 400


        flattened_data = {
            "EmployeeID":[],
            "EmployeeName":[],
            "CategoryID":[],
            "PredictedCategory":[],
            "ReviewColumn":[],
            "review_text":[],
           'FeedbackColumn':[],'employee_feedback_CategoryID':[],
           'employee_feedback_PredictedCategory':[],'employee_feedback':[]
        }
        for item in processed_data:
            employee_id = item.get('EmployeeID')
            employee_name = item.get('EmployeeName')
            details = item.get('details', {})
            keys=details.keys()
            for i in keys:
                for j in details[i]:
                    flattened_data[i].append(j)
            for x in range(len(details[i])):
                flattened_data['EmployeeID'].append(employee_id)
                flattened_data['EmployeeName'].append(employee_name)
        
        # Convert to DataFrame
        df = pd.DataFrame(flattened_data)

        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='processed_csv.csv'
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500



@app.route('/download', methods=['POST'])
def download_csv():
    try:
        # Extract parameters from the request
        yearly = request.form.get('evaluationCount')  # Number of reviews per year
        startYear = request.form.get('startYear')  # Earliest year
        endYear = request.form.get('endYear')  # Latest year
        fromReview = request.form.get('fromReview')  # Starting review for the earliest year
        toReview = request.form.get('toReview')  # Ending review for the latest year

        # Validate parameters
        try:
            yearly = int(yearly)
            startYear = int(startYear)
            endYear = int(endYear)
            fromReview = int(fromReview)
            toReview = int(toReview)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid parameters. Ensure all are integers."}), 400

        if startYear > endYear or fromReview > yearly or toReview > yearly or fromReview < 1 or toReview < 1:
            return jsonify({"error": "Invalid range of years or reviews."}), 400

        # Generate the column names
        sequence_columns = []
        for year in range(endYear, startYear - 1, -1):  # Process years in descending order
            if year == endYear:
                # For the latest year, start from `toReview` down to `1`
                sequence_columns.extend([f"{year} Review {review}_ef" for review in range(toReview, 0, -1)])
                sequence_columns.extend([f"{year} Review {review}_mr" for review in range(toReview, 0, -1)])
            elif year == startYear:
                # For the earliest year, start from `yearly` down to `fromReview`
                sequence_columns.extend([f"{year} Review {review}_ef" for review in range(toReview, 0, -1)])
                sequence_columns.extend([f"{year} Review {review}_mr" for review in range(yearly, fromReview - 1, -1)])
            else:
                # For intermediate years, start from `yearly` down to `1`
                sequence_columns.extend([f"{year} Review {review}_ef" for review in range(toReview, 0, -1)])
                sequence_columns.extend([f"{year} Review {review}_mr" for review in range(yearly, 0, -1)])

        # Create a sample DataFrame (Replace this with actual data in production)
        df = pd.DataFrame(columns=["Employee ID", "Employee Name"] + sequence_columns)


        # Save the DataFrame to a CSV in memory
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Serve the file as an attachment
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name='custom_data.csv'
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/customize', methods=['POST'])
def customize():
    # Check if the file is in the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    # Check if a file was selected
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Retrieve additional parameters
    startYear = request.form.get('startYear')
    endYear = request.form.get('endYear')
    fromReview = request.form.get('fromReview')
    toReview = request.form.get('toReview')
    evaluationCount = request.form.get('evaluationCount')

    # Validate parameters
    try:
        startYear = int(startYear)
        endYear = int(endYear)
        fromReview = int(fromReview)
        toReview = int(toReview)
        evaluationCount = int(evaluationCount)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid parameters. Ensure all are integers."}), 400

    if not (1 <= fromReview <= evaluationCount) or not (1 <= toReview <= evaluationCount):
        return jsonify({"error": "Review numbers are out of range"}), 400

    # Process the file if it is a CSV
    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        try:
            df = pd.read_csv(filepath)
            df = df.map(lambda x: x.strip() if isinstance(x, str) else x)

            # Generate the column sequence
            sequence_columns = []
            for year in range(startYear, endYear + 1):
                for review in range(1, evaluationCount + 1):
                    if (year == startYear and review < fromReview) or (year == endYear and review > toReview):
                        continue
                    sequence_columns.append(f"{year} Review {review}_ef")
                    sequence_columns.append(f"{year} Review {review}_mr")

            # Add Employee ID and Employee Name columns
            mandatory_columns = ['Employee ID', 'Employee Name']
            all_columns = mandatory_columns + sequence_columns

            # Check if required columns exist in the CSV
            missing_columns = [col for col in all_columns if col not in df.columns]
            valid_columns = [col for col in all_columns if col in df.columns]

            # Clean up the uploaded file
            # os.remove(filepath)

            # Check if there are missing columns
            if len(missing_columns) > 0:
                return jsonify({
                    "flag": False,
                    "message": "Missing columns detected",
                    "missingColumns": missing_columns,
                    "validColumns": valid_columns
                }), 200
            else:
                # Convert the filtered data to JSON
                sorted_columns = sorted(valid_columns, reverse=True)
                # print(sorted_columns)
                processed_data = df[sorted_columns].to_dict(orient='records')
                # for i in processed_data:
                #     print(i.keys())



                return jsonify({
                    "flag": True,
                    "message": "File processed successfully",
                    "processedData": processed_data,
                    "filepath":filepath
                }), 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({"error": "Processing error", "message": str(e)}), 500

    return jsonify({"error": "Invalid file type. Only CSV files are allowed."}), 400



@app.route('/progress', methods=['GET'])
def progress():
    global loop
    loop = True
    def generate():
        while loop:
            # Format prog to two decimal places
            formatted_prog = f"{prog:.2f}"
            yield f"data: {formatted_prog}\n\n"  # Send progress percentage

    return Response(generate(), content_type="text/event-stream")



@app.route('/customize_file', methods=['POST'])
def customize_file():
    global prog
    prog=0
    try:
        # Ensure request context is active and retrieve JSON data
        data = request.get_json()
        startYear = int(data.get('startYear'))
        endYear = int(data.get('endYear'))
        fromReview = int(data.get('fromReview'))
        toReview = int(data.get('toReview'))
        evaluationCount = int(data.get('evaluationCount'))
        filepath = data.get('filepath')

        # Validate and process inputs
        if not filepath:
            return jsonify({"error": "Filepath is required."}), 400

        if not (1 <= fromReview <= evaluationCount) or not (1 <= toReview <= evaluationCount):
            return jsonify({"error": "Review numbers are out of range."}), 400

        df = pd.read_csv(filepath)
        df = df.map(lambda x: x.strip() if isinstance(x, str) else x)

        # Generate sequence columns
        sequence_columns = []
        employee_feedback_sequence_columns = []
        review_columns = []
        for year in range(startYear, endYear + 1):
            for review in range(1, evaluationCount + 1):
                if (year == startYear and review < fromReview) or (year == endYear and review > toReview):
                    continue
                employee_feedback_sequence_columns.append(f"{year} Review {review}_ef")
                sequence_columns.append(f"{year} Review {review}_mr")
                review_columns.append(f"{year} Review {review}")

        # Ensure columns exist
        mandatory_columns = ['Employee ID', 'Employee Name']
        missing_columns = [col for col in mandatory_columns + sequence_columns + employee_feedback_sequence_columns if col not in df.columns]
        if missing_columns:
            os.remove(filepath)
            return jsonify({
                "flag": False,
                "message": "Missing columns detected",
                "missingColumns": missing_columns
            }), 400
            
        # Process rows
        processed_rows = []
        review_frequency={
            'Risk (Low performance, Low potential)':{key:0 for key in review_columns},
            'Average performer (Moderate performance, Low potential)':{key:0 for key in review_columns},
            'Solid Performer (High performance, Low potential)':{key:0 for key in review_columns},
            'Inconsistent Player (Low performance, Moderate potential)':{key:0 for key in review_columns},
            'Core Player (Moderate performance, Moderate potential)':{key:0 for key in review_columns},
            'High Performer (High performance, Moderate potential)':{key:0 for key in review_columns},
            'Potential Gem (Low performance, High potential)':{key:0 for key in review_columns},
            'High Potential (Moderate performance, High potential)':{key:0 for key in review_columns},
            'Star (High performance, High potential)':{key:0 for key in review_columns},
            'negative':{key:0 for key in review_columns},
            'positive':{key:0 for key in review_columns},
        }
        r=0
        for _, row in df.iterrows():
            d={'ReviewColumn':[],'CategoryID':[],'PredictedCategory':[],'review_text':[],'FeedbackColumn':[],'employee_feedback_CategoryID':[],'employee_feedback_PredictedCategory':[],'employee_feedback':[]}
            for column in sequence_columns:
                review_text = row.get(column, "")
                if pd.isna(review_text) or not review_text.strip():
                    continue
                # Simulated tokenizing and predicting
                inputs = tokenizer(review_text, max_length=512, truncation=True, return_tensors="tf")
                logits = model(**inputs).logits
                predicted_class_id = int(tf.math.argmax(logits, axis=-1)[0])
                category = model.config.id2label[predicted_class_id]
                review_frequency[category][column.replace('_mr','')]+=1
                d['ReviewColumn'].append(column)
                d['CategoryID'].append(predicted_class_id+1)
                d['PredictedCategory'].append(category)
                d['review_text'].append(review_text)
            for column in employee_feedback_sequence_columns:
                employee_feedback = row.get(column, "")
                if pd.isna(employee_feedback) or not employee_feedback.strip():
                    continue
                # Simulated tokenizing and predicting
                # Tokenize and predict
                inputs = sentiment_tokenizer(employee_feedback, max_length=512, truncation=True, return_tensors="pt")
                with torch.no_grad():
                    logits = sentiment_model(**inputs).logits
                predicted_class_id = int(torch.argmax(logits, dim=-1)[0])
                category = sentiment_model.config.id2label[predicted_class_id]
                review_frequency[category][column.replace('_ef','')]+=1
                d['FeedbackColumn'].append(column)
                d['employee_feedback_CategoryID'].append(predicted_class_id+1)
                d['employee_feedback_PredictedCategory'].append(category)
                d['employee_feedback'].append(employee_feedback)
            if len(d['CategoryID'])>0:
                processed_rows.append({
                    "EmployeeID": row["Employee ID"],
                    "EmployeeName": row["Employee Name"],
                    # "ReviewText": review_text,
                    "details":d
                })
            r+=1
            
            prog=(r/len(df))*100
        frequency={
            "EmployeeID":[],
            "EmployeeName":[],
            'Risk (Low performance, Low potential)':[0 for _ in range(len(processed_rows))],
            'Average performer (Moderate performance, Low potential)':[0 for _ in range(len(processed_rows))],
            'Solid Performer (High performance, Low potential)':[0 for _ in range(len(processed_rows))],
            'Inconsistent Player (Low performance, Moderate potential)':[0 for _ in range(len(processed_rows))],
            'Core Player (Moderate performance, Moderate potential)':[0 for _ in range(len(processed_rows))],
            'High Performer (High performance, Moderate potential)':[0 for _ in range(len(processed_rows))],
            'Potential Gem (Low performance, High potential)':[0 for _ in range(len(processed_rows))],
            'High Potential (Moderate performance, High potential)':[0 for _ in range(len(processed_rows))],
            'Star (High performance, High potential)':[0 for _ in range(len(processed_rows))],
        }
        employee_feedback_frequency={
            "EmployeeID":[],
            "EmployeeName":[],
            'negative':[0 for _ in range(len(processed_rows))],
            'positive':[0 for _ in range(len(processed_rows))],
        }
        
        Attrition_Risk_Employees={}
        r=0
        for i in range(len(processed_rows)):
            frequency['EmployeeID'].append(processed_rows[i]['EmployeeID'])
            frequency['EmployeeName'].append(processed_rows[i]['EmployeeName'])
            employee_feedback_frequency['EmployeeID'].append(processed_rows[i]['EmployeeID'])
            employee_feedback_frequency['EmployeeName'].append(processed_rows[i]['EmployeeName'])
            for j in processed_rows[i]['details']['PredictedCategory']:
                frequency[str(j)][i]+=1
            for j in processed_rows[i]['details']['employee_feedback_PredictedCategory']:
                employee_feedback_frequency[str(j)][i]+=1
            Employee_MR_ID=processed_rows[i]['details']['CategoryID'][0]
            Employee_EF_ID=processed_rows[i]['details']['employee_feedback_CategoryID'][0]
            if Employee_MR_ID==6 or Employee_MR_ID==8 or Employee_MR_ID==9:
                if Employee_EF_ID==1:
                    EmployeeID=processed_rows[i]['EmployeeID']
                    if EmployeeID in Attrition_Risk_Employees:
                        Attrition_Risk_Employees[EmployeeID]['Feedbacks'].append(processed_rows[i]['details']['employee_feedback'][0])
                    else:
                        Attrition_Risk_Employees[EmployeeID]={
                            'EmployeeName':processed_rows[i]['EmployeeName'],
                            'Feedbacks':[processed_rows[i]['details']['employee_feedback'][0]],
                            'RetentionStratergy':'',
                            'AttritionIndicator':''
                        }
            r+=1
            prog=(r/len(processed_rows))*100
        r=0
        for i in Attrition_Risk_Employees:
            best_match_attrition, best_match_strategy=classify_retention_strategy(Attrition_Risk_Employees[i]['Feedbacks'],retention_data)
            Attrition_Risk_Employees[i]['RetentionStratergy']=best_match_strategy
            Attrition_Risk_Employees[i]['AttritionIndicator']=best_match_attrition
            r+=1
            prog=(r/len(Attrition_Risk_Employees))*100


        os.remove(filepath)
        global loop
        loop=False
        return jsonify({"flag": True,"frequency":frequency, "processedData": processed_rows,"review_frequency":review_frequency,"employee_feedback_frequency":employee_feedback_frequency,"Attrition_Risk_Employees":Attrition_Risk_Employees}), 200


    except Exception as e:
        print(f"Error processing file: {e}")
        return jsonify({"error": "Error processing file. Ensure the file format is correct."}), 500




@app.route('/upload_customize', methods=['POST'])
def upload_file_customize():
    global df_global_customize
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        try:
            df = pd.read_csv(filepath)
            df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
            df_global_customize = df

            os.remove(filepath)
            return jsonify({"message": "File uploaded successfully"}), 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({"error": "Processing error", "message": str(e)}), 500

    return jsonify({"error": "Invalid file type. Only CSV files are allowed."}), 400



@app.route('/stream_customize', methods=['GET'])
def stream_results_customize():
    global df_global_customize
    if df_global_customize is None:
        return jsonify({"error": "No file processed"}), 400
    
    uniqueclasses = []

    # Exclude specific columns
    c = [col for col in df_global_customize.columns if col not in ["Employee ID", "Employee Name"]]

    def generate():
        for index, row in df_global_customize.iterrows():
            EmployeeCategoryArray = []  # Reset for each row
            FeedbacksArray = []  # Reset for each row
            RatingArray=[]

            for col in c:
                if pd.notnull(row[col]) and isinstance(row[col], str) and row[col].strip():
                    text = row[col].strip()  # Clean whitespace
                    inputs = tokenizer(text, max_length=512, truncation=True, return_tensors="tf")
                    logits = model(**inputs).logits
                    predicted_class_id = int(tf.math.argmax(logits, axis=-1)[0])
                    EmployeeCategory = model.config.id2label[predicted_class_id]

                    EmployeeCategoryArray.append(EmployeeCategory)
                    FeedbacksArray.append(row[col])
                    RatingArray.append(predicted_class_id+1)
                else:
                    # Handle empty or invalid entries
                    FeedbacksArray.append(" ")
                    EmployeeCategoryArray.append(" ")
                    RatingArray.append(" ")


            result = {
                "classindex": RatingArray,
                "person_name": row['Employee Name'] if 'Employee Name' in row else "Unknown",
                "category": EmployeeCategoryArray,
                "feedback": FeedbacksArray,
            }
            yield f"data: {json.dumps(result)}\n\n"

        yield f"data: {json.dumps({'message': 'complete'})}\n\n"

    return Response(generate(), content_type='text/event-stream')



@app.route('/upload', methods=['POST'])
def upload_file():
    global df_global
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith('.csv'):
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        try:
            df = pd.read_csv(filepath)
            # print(df.columns)

            if 'feedback' not in df.columns or 'person_name' not in df.columns:
                return jsonify({"error": "Required columns ('feedback', 'person_name') missing"}), 400

            # Preprocess feedback
            # df['feedback'] = df['feedback'].str.lower()
            # df['feedback'] = df['feedback'].apply(lambda x: re.sub('[^a-zA-Z0-9\s]', '', x))

            df_global = df

            os.remove(filepath)
            return jsonify({"message": "File uploaded successfully"}), 200

        except Exception as e:
            print(f"Error occurred: {e}")
            return jsonify({"error": "Processing error", "message": str(e)}), 500

    return jsonify({"error": "Invalid file type. Only CSV files are allowed."}), 400


@app.route('/stream', methods=['GET'])
def stream_results():
    global df_global
    if df_global is None:
        return jsonify({"error": "No file processed"}), 400
    
    uniqueclasses=[]

    def generate():
        for index, row in df_global.iterrows():
            inputs = tokenizer(row['feedback'], max_length=512, truncation=True, return_tensors="tf")
            logits = model(**inputs).logits
            predicted_class_id = int(tf.math.argmax(logits, axis=-1)[0])
            EmployeeCategory = model.config.id2label[predicted_class_id]
            
            if predicted_class_id+1 not in uniqueclasses:
                uniqueclasses.append(predicted_class_id+1)

            result = {
                "classindex": predicted_class_id+1,
                "person_name": row['person_name'],
                "category": EmployeeCategory,
                "feedback": row['feedback'],
                "uniqueclasses": uniqueclasses
                
            }
            yield f"data: {json.dumps(result)}\n\n"


        yield f"data: {json.dumps({'message': 'complete'})}\n\n"

    return Response(generate(), content_type='text/event-stream')




@app.route('/predict',methods=['POST'])    
def predict_employee_category():
    FeedbackOnEmployee=request.json['FeedbackOnEmployee']
    inputs = tokenizer(FeedbackOnEmployee, max_length=512, truncation=True, return_tensors="tf")
    logits = model(**inputs).logits
    predicted_class_id = int(tf.math.argmax(logits, axis=-1)[0])
    EmployeeCategory=model.config.id2label[predicted_class_id]
    d={}
    d['EmployeeCategory']=EmployeeCategory
    d['EmployeeCategoryIndex']=predicted_class_id+1
    print(d)
    return jsonify(d)



@app.route('/dass', methods=['POST'])
def dass_assigment():
    payload = request.get_json()

    depression = payload.get("Depression", [])
    anxiety = payload.get("Anxiety", [])
    stress = payload.get("Stress", [])

    # Score computation (sum * 2)
    depression_score = sum(depression) * 2
    anxiety_score = sum(anxiety) * 2
    stress_score = sum(stress) * 2

    # Classification function
    def classify_depression(score):
        if score <= 9:
            return "Low"
        elif score <= 20:
            return "Medium"
        else:
            return "High"

    def classify_anxiety(score):
        if score <= 7:
            return "Low"
        elif score <= 14:
            return "Medium"
        else:
            return "High"

    def classify_stress(score):
        if score <= 14:
            return "Low"
        elif score <= 25:
            return "Medium"
        else:
            return "High"

    # Apply classification
    result = {
        "Depression_Level": classify_depression(depression_score),
        "Anxiety_Level": classify_anxiety(anxiety_score),
        "Stress_Level": classify_stress(stress_score)
    }

    return jsonify(result), 200





if __name__ == '__main__':
    app.run(debug=True)