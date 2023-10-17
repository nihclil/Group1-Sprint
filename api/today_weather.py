from flask import *
import requests
import json

api_today_weather = Blueprint('api_today_weather', __name__)

# 各縣市當下天氣資料
@api_today_weather.route("/api/today_weather",methods=["GET"])
def today_weather():
    info = getdata()
    search_value=request.args.get("search")
    for index, item in enumerate(info):
        if item["location_name"] == search_value:
            response = info[index]
            break
    return jsonify(response)


# 資料整理
def getdata():
    dataid="F-C0032-001"
    apikey="CWA-1EC15711-09ED-43F0-8F98-C828E4B8A079"
    url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/"+dataid+"?Authorization="+apikey+"&format=JSON"

    response = requests.get(url)
    result = response.json()
    data = [item for item in result["records"]["location"]]

    info=[]
    for item in data:

        location_name = item["locationName"]
        weather = item["weatherElement"][0]["time"][0]["parameter"]["parameterName"]
        mini_temperature = item["weatherElement"][2]["time"][0]["parameter"]["parameterName"]
        max_temperature = item["weatherElement"][4]["time"][0]["parameter"]["parameterName"]
        chance_of_rain = item["weatherElement"][1]["time"][0]["parameter"]["parameterName"]
        comfort_index = item["weatherElement"][3]["time"][0]["parameter"]["parameterName"]

        info.append({
        "location_name": location_name,
        "weather": weather,
        "mini_temperature": mini_temperature,
        "max_temperature": max_temperature,
        "chance_of_rain": chance_of_rain,
        "comfort_index": comfort_index
        })
    
    return info
