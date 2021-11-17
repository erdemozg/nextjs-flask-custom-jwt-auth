FROM python:3.8-slim-buster

WORKDIR /backend

RUN pip install --upgrade pip

COPY requirements.txt requirements.txt

RUN pip install -r requirements.txt

CMD ["python", "server.py"]
