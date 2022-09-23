FROM python:3.10.4-alpine
RUN apk add librdkafka-dev gcc librdkafka musl-dev linux-headers
WORKDIR  /app
COPY requirements.txt ./
RUN python3 -m pip install --upgrade pip | pip install -r requirements.txt
COPY . ./
CMD [ "python3 app.py" ]