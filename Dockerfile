FROM python:alpine as first-stage
WORKDIR /python-app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

FROM first-stage AS final-stage

COPY --from=first-stage /python-app ./
CMD ["python", "server.py"]
