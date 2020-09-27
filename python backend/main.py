import os.path
import numpy as np
import cv2
import json
from flask import Flask, request, Response
import uuid

# Make flask basic app 
app = Flask(__name__)


@app.route("/")
# functions definition
def upload():
    img = cv2.imdecode(np.fromstring(request.files['image'].read(), np.uint8), cv2.IMREAD_UNCHANGED)
    img_processed = RecScan(img)
    return Response(response=img_processed, status=200, mimetype="application/json")


# @app.route("/api/upload",methods=['POST'])
def RecScan(image):
    # path to save image after processed
    pathfile = ('static/%s.jpg' % uuid.uuid4().hex)
    image = cv2.resize(image, (1300, 800))
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # save image to the path file
    cv2.imwrite(pathfile, gray)
    return json.dumps(pathfile)


app.run(host="0.0.0.0", port=5000)

# main loop
if __name__ == "__main__":
    app.run()
