from flask import *

app = Flask(__name__)

# 請勿更動此主路由
@app.route("/")
def index():
  return render_template("index.html")

if(__name__ == "__main__"):
  app.run(port = 3000)