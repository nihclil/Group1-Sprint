from flask import *
import requests
import json

api_week_weather = Blueprint('api_week_weather', __name__)

# 各縣市一週天氣資料
@api_week_weather.route("/api/week_weather",methods=["GET"])
def week_weather():
    try:
        info = getdata()
        search_value=request.args.get("search")
        for index, item in enumerate(info):
            if item["location_name"] == search_value:
                response = info[index]
                break
        return jsonify(response)
    except Exception as e :  
        error_message=str(e)
        response={
            "error":True,
            "message": error_message
            }
        return jsonify(response)


# 資料整理
def getdata():
    dataid="F-D0047-091"
    apikey="CWA-1EC15711-09ED-43F0-8F98-C828E4B8A079"
    url = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/"+dataid+"?Authorization="+apikey+"&format=JSON"

    response = requests.get(url)
    result = response.json()

    data = [item for item in result["records"]["locations"][0]["location"]]
    info=[]
    for item in data:

        location_name = item["locationName"]
        week_weather = [day["elementValue"][0]["value"] for day in item["weatherElement"][6]["time"]]
        week_mini_temperature = [day["elementValue"][0]["value"] for day in item["weatherElement"][8]["time"]]
        week_max_temperature = [day["elementValue"][0]["value"] for day in item["weatherElement"][12]["time"]]

        info.append({
        "location_name": location_name,
        "week_weather": week_weather[::2][:7],
        "mini_temperature": week_mini_temperature[::2][:7],
        "max_temperature": week_max_temperature[::2][:7],
        })

    return info



