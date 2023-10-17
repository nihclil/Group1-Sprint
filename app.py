from flask import *

from api.today_weather import api_today_weather
from api.week_weather import api_week_weather

app = Flask(__name__)

app.register_blueprint(api_today_weather)
app.register_blueprint(api_week_weather)

# 請勿更動此主路由
@app.route("/")
def index():
  return render_template("index.html")

if(__name__ == "__main__"):
  app.run(host = "0.0.0.0", port = 3000)