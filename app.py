# Import necessary modules from Flask for web application and rendering templates.
# Import the requests module for making HTTP requests.
# Import the API_KEY
from flask import Flask, jsonify, render_template, request
import requests
from config.creds import API_KEY

# Create a Flask web application instance and defining routes with GET method.
app = Flask(__name__)
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html') # When a GET request is made to '/', render the 'index.html' template.

# Define a route for API requests to fetch train and ferry information, url and headers.
@app.route('/api/train_ferry_info', methods=['GET'])
def fetch_train_and_ferry_info():
    url = "https://api.trafikinfo.trafikverket.se/v2/data.json"
    # Define headers for the HTTP request, specifying 'Content-Type' as JSON.
    headers = {
        'Content-Type': 'application/json'
    }
    # Define the data to be sent in the request body.
    data_train_anouncement = {
        "REQUEST": {
            "LOGIN": {
                "authenticationkey": API_KEY
            },
            "QUERY": [
                {
                    "objecttype": "TrainAnnouncement",
                    "schemaversion": "1.8",
                    "limit": "6",
                    "FILTER": {},
                    "INCLUDE": [
                        "TrainOwner","TrackAtLocation","AdvertisedTrainIdent", "Advertised", "Canceled", "LocationSignature",
                        "ScheduledDepartureDateTime", "EstimatedTimeAtLocation"
                    ]
                },
                {
                    "objecttype": "FerryAnnouncement",
                    "schemaversion": "1.2",
                    "limit": "6",
                    "FILTER": {},
                    "INCLUDE": ["DepartureTime", "FromHarbor.Id","FromHarbor.Name","ToHarbor.Name","Route.Description","Route.Name"]
                }
            ]
        }
    }

    # Make a POST request to the Trafikverket API with the defined URL, headers, and data.
    response = requests.post(url, headers=headers, json=data_train_anouncement)

    # Check the status code of the API response and If the status code is 200 (OK), return the JSON response.
    # If there is an error, return an error JSON response with status code and details.
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({
            "status": "error",
            "message": f"Request failed with status code: {response.status_code}",
            "details": response.text
        }), response.status_code
# Start the Flask web application if this script is run as the main program.
if __name__ == "__main__":
    app.run(debug=True)
