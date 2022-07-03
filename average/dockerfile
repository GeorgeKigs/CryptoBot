FROM python:3.10.4-alpine
WORKDIR /app
COPY . /app/
RUN cd /app/
RUN pip install -r requirements.txt
CMD ["python3","app.py"]
